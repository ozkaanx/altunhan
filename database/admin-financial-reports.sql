begin;

CREATE OR REPLACE FUNCTION public.get_admin_financial_report(p_start_date date, p_end_date date)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public', 'auth'
 SET "TimeZone" TO 'Europe/Istanbul'
AS $function$
declare
  v_day_count integer;
  v_active_room_count integer;
  v_result jsonb;
begin
  if not public.is_admin() then
    raise exception 'Bu işlem için yönetici yetkisi gereklidir.';
  end if;

  if p_start_date is null or p_end_date is null or p_end_date < p_start_date then
    raise exception 'Rapor tarih aralığı geçersiz.';
  end if;

  v_day_count := p_end_date - p_start_date + 1;

  if v_day_count > 366 then
    raise exception 'Rapor aralığı en fazla 366 gün olabilir.';
  end if;

  select count(*)::integer
  into v_active_room_count
  from public.rooms r
  where r.is_active = true;

  with
  report_dates as (
    select generate_series(p_start_date, p_end_date, interval '1 day')::date as report_date
  ),
  payment_events as (
    select
      coalesce(rp.paid_at, rp.created_at) as paid_at,
      case when rp.payment_type = 'refund' then -rp.amount else rp.amount end as net_amount,
      rp.payment_method,
      rp.id as payment_id,
      r.accommodation_id,
      r.reservation_code as code,
      r.guest_name
    from public.reservation_payments rp
    join public.reservations r on r.id = rp.reservation_id
    where rp.status = 'confirmed'
      and (coalesce(rp.paid_at, rp.created_at) at time zone 'Europe/Istanbul')::date
        between p_start_date and p_end_date
  ),
  confirmed_stays as (
    select
      r.id,
      r.accommodation_id,
      r.check_in,
      r.check_out
    from public.reservations r
    where r.status = 'confirmed'
      and r.check_in <= p_end_date
      and r.check_out > p_start_date
  ),
  payments_by_day as (
    select
      (pe.paid_at at time zone 'Europe/Istanbul')::date as report_date,
      coalesce(sum(pe.net_amount), 0) as revenue,
      count(*) filter (where pe.net_amount > 0)::integer as payment_count
    from payment_events pe
    group by (pe.paid_at at time zone 'Europe/Istanbul')::date
  ),
  rooms_by_day as (
    select
      d.report_date,
      count(cs.id)::integer as occupied_rooms
    from report_dates d
    left join confirmed_stays cs
      on cs.check_in <= d.report_date
      and cs.check_out > d.report_date
    group by d.report_date
  ),
  movements_by_day as (
    select
      d.report_date,
      count(r.id) filter (where r.check_in = d.report_date and r.status = 'confirmed')::integer
        as check_ins,
      count(r.id) filter (where r.check_out = d.report_date and r.status = 'confirmed')::integer
        as check_outs
    from report_dates d
    left join public.reservations r
      on (r.check_in = d.report_date or r.check_out = d.report_date)
    group by d.report_date
  ),
  daily_metrics as (
    select
      d.report_date,
      coalesce(pbd.revenue, 0) as revenue,
      coalesce(pbd.payment_count, 0) as payment_count,
      coalesce(rbd.occupied_rooms, 0) as occupied_rooms,
      coalesce(mbd.check_ins, 0) as check_ins,
      coalesce(mbd.check_outs, 0) as check_outs,
      case
        when v_active_room_count > 0
          then round((coalesce(rbd.occupied_rooms, 0)::numeric / v_active_room_count) * 100, 1)
        else 0
      end as occupancy_rate
    from report_dates d
    left join payments_by_day pbd on pbd.report_date = d.report_date
    left join rooms_by_day rbd on rbd.report_date = d.report_date
    left join movements_by_day mbd on mbd.report_date = d.report_date
  ),
  active_rooms_by_accommodation as (
    select
      r.accommodation_id,
      count(*)::integer as active_room_count
    from public.rooms r
    where r.is_active = true
    group by r.accommodation_id
  ),
  accommodation_stays as (
    select
      cs.accommodation_id,
      coalesce(
        sum(
          greatest(
            least(cs.check_out, p_end_date + 1) - greatest(cs.check_in, p_start_date),
            0
          )
        ),
        0
      )::integer as sold_room_nights
    from confirmed_stays cs
    group by cs.accommodation_id
  ),
  accommodation_revenue as (
    select
      pe.accommodation_id,
      coalesce(sum(pe.net_amount), 0) as revenue
    from payment_events pe
    group by pe.accommodation_id
  ),
  accommodation_metrics as (
    select
      a.id as accommodation_id,
      a.title,
      coalesce(ara.active_room_count, 0) as active_room_count,
      coalesce(ast.sold_room_nights, 0) as sold_room_nights,
      coalesce(ar.revenue, 0) as revenue,
      case
        when coalesce(ara.active_room_count, 0) * v_day_count > 0
          then round(
            (
              coalesce(ast.sold_room_nights, 0)::numeric
              / (ara.active_room_count * v_day_count)
            ) * 100,
            1
          )
        else 0
      end as occupancy_rate
    from public.accommodations a
    left join active_rooms_by_accommodation ara on ara.accommodation_id = a.id
    left join accommodation_stays ast on ast.accommodation_id = a.id
    left join accommodation_revenue ar on ar.accommodation_id = a.id
    where a.is_active = true
       or coalesce(ast.sold_room_nights, 0) > 0
       or coalesce(ar.revenue, 0) <> 0
  ),
  booking_balances as (
    select
      r.id,
      r.total_price,
      greatest(
        r.total_price - coalesce(
          sum(
            case
              when rp.payment_type = 'refund' then -rp.amount
              else rp.amount
            end
          ) filter (where rp.status = 'confirmed'),
          0
        ),
        0
      ) as remaining_amount
    from public.reservations r
    left join public.reservation_payments rp on rp.reservation_id = r.id
    where r.status = 'confirmed'
      and r.check_in <= p_end_date
      and r.check_out > p_start_date
    group by r.id
  ),
  arriving_bookings as (
    select
      r.id,
      r.total_price
    from public.reservations r
    where r.status = 'confirmed'
      and r.check_in between p_start_date and p_end_date
  ),
  payment_method_metrics as (
    select
      pe.payment_method,
      coalesce(sum(pe.net_amount), 0) as amount,
      count(*)::integer as payment_count
    from payment_events pe
    group by pe.payment_method
  ),
  recent_payments as (
    select *
    from payment_events
    order by paid_at desc, payment_id desc
    limit 12
  )
  select jsonb_build_object(
    'startDate', p_start_date,
    'endDate', p_end_date,
    'summary', jsonb_build_object(
      'collectedRevenue', coalesce((select sum(net_amount) from payment_events), 0),
      'refundTotal', coalesce((select sum(abs(net_amount)) from payment_events where net_amount < 0), 0),
      'paymentCount', coalesce((select count(*) from payment_events where net_amount > 0), 0),
      'reservationCount', coalesce((select count(*) from arriving_bookings), 0),
      'bookingValue', coalesce((select sum(total_price) from arriving_bookings), 0),
      'outstandingBalance', coalesce((select sum(remaining_amount) from booking_balances), 0),
      'soldRoomNights', coalesce((select sum(occupied_rooms) from daily_metrics), 0),
      'availableRoomNights', v_active_room_count * v_day_count,
      'occupancyRate', case
        when v_active_room_count * v_day_count > 0
          then round(
            (
              coalesce((select sum(occupied_rooms) from daily_metrics), 0)::numeric
              / (v_active_room_count * v_day_count)
            ) * 100,
            1
          )
        else 0
      end
    ),
    'daily', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'date', dm.report_date,
            'revenue', dm.revenue,
            'paymentCount', dm.payment_count,
            'occupiedRooms', dm.occupied_rooms,
            'checkIns', dm.check_ins,
            'checkOuts', dm.check_outs,
            'occupancyRate', dm.occupancy_rate
          ) order by dm.report_date
        )
        from daily_metrics dm
      ),
      '[]'::jsonb
    ),
    'accommodations', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'accommodationId', am.accommodation_id,
            'title', am.title,
            'activeRoomCount', am.active_room_count,
            'soldRoomNights', am.sold_room_nights,
            'revenue', am.revenue,
            'occupancyRate', am.occupancy_rate
          ) order by am.revenue desc, am.title
        )
        from accommodation_metrics am
      ),
      '[]'::jsonb
    ),
    'paymentMethods', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'method', pmm.payment_method,
            'amount', pmm.amount,
            'paymentCount', pmm.payment_count
          ) order by pmm.amount desc
        )
        from payment_method_metrics pmm
      ),
      '[]'::jsonb
    ),
    'recentPayments', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'paymentId', rp.payment_id,
            'code', rp.code,
            'guestName', rp.guest_name,
            'amount', rp.net_amount,
            'method', rp.payment_method,
            'paidAt', rp.paid_at
          ) order by rp.paid_at desc, rp.payment_id desc
        )
        from recent_payments rp
      ),
      '[]'::jsonb
    )
  ) into v_result;

  return v_result;
end;
$function$;

CREATE OR REPLACE FUNCTION public.get_admin_financial_payment_breakdown(p_start_date date, p_end_date date)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public', 'auth'
 SET "TimeZone" TO 'Europe/Istanbul'
AS $function$
declare
  v_result jsonb;
begin
  if not public.is_admin() then
    raise exception 'Bu işlem için yönetici yetkisi gereklidir.';
  end if;

  if p_start_date is null or p_end_date is null or p_end_date < p_start_date then
    raise exception 'Rapor tarih aralığı geçersiz.';
  end if;

  if (p_end_date - p_start_date + 1) > 366 then
    raise exception 'Rapor aralığı en fazla 366 gün olabilir.';
  end if;

  with payment_events as (
    select
      rp.payment_type,
      rp.amount,
      coalesce(rp.paid_at, rp.created_at) as event_at
    from public.reservation_payments rp
    where rp.status = 'confirmed'
      and (coalesce(rp.paid_at, rp.created_at) at time zone 'Europe/Istanbul')::date
        between p_start_date and p_end_date
  )
  select jsonb_build_object(
    'grossCollected', coalesce(sum(amount) filter (where payment_type <> 'refund'), 0),
    'depositCollected', coalesce(sum(amount) filter (where payment_type = 'deposit'), 0),
    'balanceCollected', coalesce(sum(amount) filter (where payment_type = 'balance'), 0),
    'fullCollected', coalesce(sum(amount) filter (where payment_type = 'full'), 0),
    'refundTotal', coalesce(sum(amount) filter (where payment_type = 'refund'), 0),
    'netCollected',
      coalesce(sum(amount) filter (where payment_type <> 'refund'), 0)
      - coalesce(sum(amount) filter (where payment_type = 'refund'), 0),
    'collectionCount', coalesce(count(*) filter (where payment_type <> 'refund'), 0),
    'refundCount', coalesce(count(*) filter (where payment_type = 'refund'), 0)
  )
  into v_result
  from payment_events;

  return v_result;
end;
$function$;

CREATE OR REPLACE FUNCTION public.get_admin_recent_financial_movements(p_start_date date, p_end_date date)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public', 'auth'
 SET "TimeZone" TO 'Europe/Istanbul'
AS $function$
begin
  if not public.is_admin() then
    raise exception 'Bu işlem için yönetici yetkisi gereklidir.';
  end if;

  if p_start_date is null or p_end_date is null or p_end_date < p_start_date then
    raise exception 'Rapor tarih aralığı geçersiz.';
  end if;

  if (p_end_date - p_start_date + 1) > 366 then
    raise exception 'Rapor aralığı en fazla 366 gün olabilir.';
  end if;

  return coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'paymentId', x.payment_id,
          'code', x.reservation_code,
          'guestName', x.guest_name,
          'amount', x.signed_amount,
          'method', x.payment_method,
          'paymentType', x.payment_type,
          'paidAt', x.paid_at
        )
        order by x.paid_at desc, x.payment_id desc
      )
      from (
        select
          rp.id as payment_id,
          r.reservation_code,
          r.guest_name,
          case when rp.payment_type = 'refund' then -rp.amount else rp.amount end as signed_amount,
          rp.payment_method,
          rp.payment_type,
          coalesce(rp.paid_at, rp.created_at) as paid_at
        from public.reservation_payments rp
        join public.reservations r on r.id = rp.reservation_id
        where rp.status = 'confirmed'
          and (coalesce(rp.paid_at, rp.created_at) at time zone 'Europe/Istanbul')::date
            between p_start_date and p_end_date
        order by coalesce(rp.paid_at, rp.created_at) desc, rp.id desc
        limit 12
      ) x
    ),
    '[]'::jsonb
  );
end;
$function$;

revoke all on function public.get_admin_financial_report(date, date) from public, anon;
grant execute on function public.get_admin_financial_report(date, date) to authenticated, service_role;

revoke all on function public.get_admin_financial_payment_breakdown(date, date) from public, anon;
grant execute on function public.get_admin_financial_payment_breakdown(date, date) to authenticated, service_role;

revoke all on function public.get_admin_recent_financial_movements(date, date) from public, anon;
grant execute on function public.get_admin_recent_financial_movements(date, date) to authenticated, service_role;

commit;
