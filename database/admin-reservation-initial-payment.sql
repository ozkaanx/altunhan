begin;

drop function if exists public.create_admin_reservation_v5(
  bigint, date, date, integer, integer, text, text, text, text,
  bigint, text, text, numeric, text, text
);

create function public.create_admin_reservation_v5(
  p_accommodation_id bigint,
  p_check_in date,
  p_check_out date,
  p_adult_count integer,
  p_child_count integer,
  p_guest_name text,
  p_guest_identity_number text,
  p_guest_phone text,
  p_guest_email text,
  p_room_id bigint,
  p_source text,
  p_admin_note text,
  p_initial_payment_amount numeric,
  p_initial_payment_method text,
  p_initial_payment_note text
)
returns table (
  reservation_id bigint,
  reservation_code text,
  room_id bigint,
  room_name text,
  room_number text,
  total_price numeric,
  deposit_target_amount numeric,
  confirmed_payment_amount numeric,
  remaining_payment_amount numeric,
  status text
)
language plpgsql
security definer
set search_path = 'pg_catalog', 'public', 'auth'
set timezone = 'Europe/Istanbul'
as $$
declare
  v_created record;
  v_reservation public.reservations%rowtype;
  v_reservation_id bigint;
  v_deposit_target numeric;
  v_initial_payment numeric;
  v_confirmed_amount numeric;
begin
  if not public.is_admin() then
    raise exception 'Bu işlem için yönetici yetkisi gereklidir.';
  end if;

  v_initial_payment := round(coalesce(p_initial_payment_amount, 0), 2);

  if v_initial_payment < 0 then
    raise exception 'Alınan ödeme tutarı negatif olamaz.';
  end if;

  if v_initial_payment > 0
     and p_initial_payment_method not in ('bank_transfer', 'cash', 'card', 'other') then
    raise exception 'Geçerli bir ödeme yöntemi seçilmelidir.';
  end if;

  if length(trim(coalesce(p_initial_payment_note, ''))) > 500 then
    raise exception 'Ödeme notu en fazla 500 karakter olabilir.';
  end if;

  select *
  into v_created
  from public.create_admin_reservation_v3(
    p_accommodation_id,
    p_check_in,
    p_check_out,
    p_adult_count,
    p_child_count,
    p_guest_name,
    p_guest_identity_number,
    p_guest_phone,
    p_guest_email,
    p_room_id,
    'pending_payment',
    p_source,
    p_admin_note
  );

  if v_created.reservation_id is null then
    raise exception 'Rezervasyon oluşturulamadı.';
  end if;

  v_reservation_id := v_created.reservation_id;

  select *
  into v_reservation
  from public.reservations r
  where r.id = v_reservation_id
  for update;

  v_deposit_target := case
    when v_reservation.night_count = 1 then round(v_reservation.total_price / 2, 2)
    else least(v_reservation.nightly_price, v_reservation.total_price)
  end;

  if v_initial_payment > v_reservation.total_price then
    raise exception 'Alınan ödeme rezervasyonun toplam tutarından fazla olamaz.';
  end if;

  update public.reservations r
  set
    payment_plan = 'deposit',
    deposit_target_amount = v_deposit_target,
    deposit_percentage = case
      when r.total_price > 0 then round((v_deposit_target / r.total_price) * 100, 2)
      else 0
    end,
    payment_status = 'unpaid',
    status = 'pending_payment',
    updated_at = now()
  where r.id = v_reservation.id;

  if v_initial_payment > 0 then
    perform public.record_admin_reservation_payment(
      v_reservation.id,
      v_initial_payment,
      p_initial_payment_method,
      nullif(trim(coalesce(p_initial_payment_note, '')), '')
    );
  end if;

  select coalesce(
    sum(
      case
        when rp.payment_type = 'refund' then -rp.amount
        else rp.amount
      end
    ) filter (where rp.status = 'confirmed'),
    0
  )
  into v_confirmed_amount
  from public.reservation_payments rp
  where rp.reservation_id = v_reservation_id;

  select *
  into v_reservation
  from public.reservations r
  where r.id = v_reservation_id;

  return query
  select
    v_reservation.id,
    v_reservation.reservation_code,
    v_created.room_id::bigint,
    v_created.room_name::text,
    v_created.room_number::text,
    v_reservation.total_price,
    v_reservation.deposit_target_amount,
    v_confirmed_amount,
    greatest(v_reservation.total_price - v_confirmed_amount, 0),
    v_reservation.status::text;
end;
$$;

revoke execute on function public.create_admin_reservation_v5(
  bigint, date, date, integer, integer, text, text, text, text,
  bigint, text, text, numeric, text, text
) from public, anon;
grant execute on function public.create_admin_reservation_v5(
  bigint, date, date, integer, integer, text, text, text, text,
  bigint, text, text, numeric, text, text
) to authenticated, service_role;

commit;
