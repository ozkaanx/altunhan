begin;

CREATE OR REPLACE FUNCTION public.get_available_rooms_for_reservation_dates(p_reservation_id bigint, p_check_in date, p_check_out date)
 RETURNS TABLE(room_id bigint, room_name text, room_number text, is_current boolean, is_available boolean)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public', 'auth'
 SET "TimeZone" TO 'Europe/Istanbul'
AS $function$
declare
  v_reservation public.reservations%rowtype;
begin
  if not public.is_admin() then
    raise exception 'Bu işlem için yönetici yetkisi gereklidir.';
  end if;

  if p_check_in is null or p_check_out is null or p_check_out <= p_check_in then
    raise exception 'Çıkış tarihi giriş tarihinden sonra olmalıdır.';
  end if;

  select * into v_reservation
  from public.reservations
  where id = p_reservation_id;

  if not found then
    raise exception 'Rezervasyon bulunamadı.';
  end if;

  return query
  select
    rm.id,
    rm.room_name,
    rm.room_number,
    rm.id = v_reservation.room_id,
    (
      rm.is_active
      and (rm.max_guests is null or rm.max_guests >= v_reservation.guest_count)
      and not exists (
        select 1
        from public.reservations r
        where r.room_id = rm.id
          and r.id <> v_reservation.id
          and (
            r.status in ('pending_approval', 'confirmed')
            or (
              r.status = 'pending_payment'
              and r.created_at >= now() - interval '1 hour'
            )
          )
          and r.check_in < p_check_out
          and r.check_out > p_check_in
      )
    )
  from public.rooms rm
  where rm.accommodation_id = v_reservation.accommodation_id
  order by rm.room_number, rm.id;
end;
$function$;

CREATE OR REPLACE FUNCTION public.update_admin_reservation_dates(p_reservation_id bigint, p_check_in date, p_check_out date, p_room_id bigint)
 RETURNS TABLE(updated_check_in date, updated_check_out date, updated_night_count integer, updated_total_price numeric, updated_room_id bigint, updated_room_name text, updated_room_number text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public', 'auth'
 SET "TimeZone" TO 'Europe/Istanbul'
AS $function$
declare
  v_reservation public.reservations%rowtype;
  v_room public.rooms%rowtype;
  v_night_count integer;
  v_total_price numeric;
  v_deposit_target numeric;
  v_conflict_exists boolean;
begin
  if not public.is_admin() then
    raise exception 'Bu işlem için yönetici yetkisi gereklidir.';
  end if;

  if p_check_in is null or p_check_out is null then
    raise exception 'Giriş ve çıkış tarihleri zorunludur.';
  end if;

  if p_check_out <= p_check_in then
    raise exception 'Çıkış tarihi giriş tarihinden sonra olmalıdır.';
  end if;

  select * into v_reservation
  from public.reservations
  where id = p_reservation_id
  for update;

  if not found then
    raise exception 'Rezervasyon bulunamadı.';
  end if;

  if v_reservation.status in ('rejected', 'cancelled') then
    raise exception 'Reddedilmiş veya iptal edilmiş rezervasyonların tarihleri değiştirilemez.';
  end if;

  if (
    v_reservation.status = 'pending_payment'
    and v_reservation.created_at < now() - interval '1 hour'
  ) then
    raise exception 'Ödeme süresi dolmuş rezervasyonun tarihleri değiştirilemez.';
  end if;

  select * into v_room
  from public.rooms
  where id = p_room_id
    and accommodation_id = v_reservation.accommodation_id
    and is_active = true
  for update;

  if not found then
    raise exception 'Seçilen oda bulunamadı, farklı oda tipinde veya kullanım dışı.';
  end if;

  if v_room.max_guests is not null and v_reservation.guest_count > v_room.max_guests then
    raise exception 'Seçilen fiziksel odanın maksimum kapasitesi % kişidir.', v_room.max_guests;
  end if;

  select exists (
    select 1
    from public.reservations r
    where r.room_id = p_room_id
      and r.id <> p_reservation_id
      and (
        r.status in ('pending_approval', 'confirmed')
        or (
          r.status = 'pending_payment'
          and r.created_at >= now() - interval '1 hour'
        )
      )
      and r.check_in < p_check_out
      and r.check_out > p_check_in
  ) into v_conflict_exists;

  if v_conflict_exists then
    raise exception 'Seçilen fiziksel oda bu tarihler için müsait değil.';
  end if;

  v_night_count := p_check_out - p_check_in;
  v_total_price := v_reservation.nightly_price * v_night_count;
  v_deposit_target := case
    when v_reservation.payment_plan = 'full' then v_total_price
    else round(v_total_price * v_reservation.deposit_percentage / 100, 2)
  end;

  update public.reservations
  set
    check_in = p_check_in,
    check_out = p_check_out,
    room_id = p_room_id,
    night_count = v_night_count,
    total_price = v_total_price,
    deposit_target_amount = v_deposit_target,
    updated_at = now()
  where id = p_reservation_id;

  perform public.refresh_reservation_payment_status(p_reservation_id);

  updated_check_in := p_check_in;
  updated_check_out := p_check_out;
  updated_night_count := v_night_count;
  updated_total_price := v_total_price;
  updated_room_id := v_room.id;
  updated_room_name := v_room.room_name;
  updated_room_number := v_room.room_number;

  return next;
end;
$function$;

revoke all on function public.get_available_rooms_for_reservation_dates(bigint, date, date) from public, anon;
grant execute on function public.get_available_rooms_for_reservation_dates(bigint, date, date) to authenticated, service_role;

revoke all on function public.update_admin_reservation_dates(bigint, date, date, bigint) from public, anon;
grant execute on function public.update_admin_reservation_dates(bigint, date, date, bigint) to authenticated, service_role;

commit;
