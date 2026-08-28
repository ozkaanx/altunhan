begin;

CREATE OR REPLACE FUNCTION public.record_admin_reservation_payment(p_reservation_id bigint, p_amount numeric, p_payment_method text, p_admin_note text DEFAULT NULL::text)
 RETURNS bigint
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public', 'auth'
AS $function$
declare
  v_reservation public.reservations%rowtype;
  v_confirmed_amount numeric;
  v_remaining_amount numeric;
  v_payment_type text;
  v_payment_id bigint;
begin
  if not public.is_admin() then
    raise exception 'Bu işlem için yönetici yetkisi gereklidir.';
  end if;

  if p_amount is null or p_amount <= 0 then
    raise exception 'Ödeme tutarı sıfırdan büyük olmalıdır.';
  end if;

  if p_payment_method not in ('bank_transfer', 'cash', 'card', 'other') then
    raise exception 'Geçersiz ödeme yöntemi.';
  end if;

  select *
  into v_reservation
  from public.reservations
  where id = p_reservation_id
  for update;

  if not found then
    raise exception 'Rezervasyon bulunamadı.';
  end if;

  if v_reservation.status in ('rejected', 'cancelled') then
    raise exception 'Reddedilmiş veya iptal edilmiş rezervasyona ödeme eklenemez.';
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
  where rp.reservation_id = p_reservation_id;

  v_remaining_amount := greatest(v_reservation.total_price - v_confirmed_amount, 0);

  if p_amount > v_remaining_amount then
    raise exception 'Ödeme tutarı kalan tutardan fazla olamaz.';
  end if;

  v_payment_type := case
    when v_confirmed_amount = 0 and p_amount >= v_reservation.total_price then 'full'
    when v_confirmed_amount = 0 then 'deposit'
    else 'balance'
  end;

  insert into public.reservation_payments (
    reservation_id,
    amount,
    requested_amount,
    payment_type,
    payment_method,
    status,
    admin_note,
    paid_at,
    created_by
  ) values (
    p_reservation_id,
    round(p_amount, 2),
    round(p_amount, 2),
    v_payment_type,
    p_payment_method,
    'confirmed',
    nullif(trim(p_admin_note), ''),
    now(),
    auth.uid()
  )
  returning id into v_payment_id;

  perform public.refresh_reservation_payment_status(p_reservation_id);

  if v_reservation.status in ('pending_payment', 'pending_approval') then
    update public.reservations
    set
      status = 'confirmed',
      rejection_reason = null,
      cancellation_reason = null,
      updated_at = now()
    where id = p_reservation_id;
  end if;

  return v_payment_id;
end;
$function$;

CREATE OR REPLACE FUNCTION public.verify_admin_reservation_payment(p_payment_id bigint, p_received_amount numeric)
 RETURNS TABLE(reservation_id bigint, reservation_confirmed boolean, confirmed_payment_amount numeric, deposit_remaining_amount numeric, total_remaining_amount numeric)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public', 'auth'
AS $function$
declare
  v_payment public.reservation_payments%rowtype;
  v_reservation public.reservations%rowtype;
  v_confirmed_before numeric;
  v_confirmed_after numeric;
  v_remaining_before numeric;
begin
  if not public.is_admin() then
    raise exception 'Bu işlem için yönetici yetkisi gereklidir.';
  end if;

  if p_received_amount is null or p_received_amount <= 0 then
    raise exception 'Bankaya gelen tutar sıfırdan büyük olmalıdır.';
  end if;

  select *
  into v_payment
  from public.reservation_payments
  where id = p_payment_id
  for update;

  if not found or v_payment.status <> 'pending' then
    raise exception 'Kontrol bekleyen ödeme kaydı bulunamadı.';
  end if;

  select *
  into v_reservation
  from public.reservations
  where id = v_payment.reservation_id
  for update;

  if not found then
    raise exception 'Rezervasyon bulunamadı.';
  end if;

  if v_reservation.status in ('rejected', 'cancelled') then
    raise exception 'Reddedilmiş veya iptal edilmiş rezervasyonun ödemesi doğrulanamaz.';
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
  into v_confirmed_before
  from public.reservation_payments rp
  where rp.reservation_id = v_reservation.id;

  v_remaining_before := greatest(v_reservation.total_price - v_confirmed_before, 0);

  if p_received_amount > v_remaining_before then
    raise exception 'Bankaya gelen tutar rezervasyonun kalan toplam tutarından fazla olamaz.';
  end if;

  update public.reservation_payments
  set
    amount = round(p_received_amount, 2),
    status = 'confirmed',
    paid_at = now(),
    created_by = auth.uid(),
    updated_at = now()
  where id = v_payment.id;

  perform public.refresh_reservation_payment_status(v_reservation.id);

  select coalesce(
    sum(
      case
        when rp.payment_type = 'refund' then -rp.amount
        else rp.amount
      end
    ) filter (where rp.status = 'confirmed'),
    0
  )
  into v_confirmed_after
  from public.reservation_payments rp
  where rp.reservation_id = v_reservation.id;

  update public.reservations
  set
    status = 'confirmed',
    rejection_reason = null,
    cancellation_reason = null,
    updated_at = now()
  where id = v_reservation.id;

  return query
  select
    v_reservation.id,
    true,
    v_confirmed_after,
    greatest(v_reservation.deposit_target_amount - v_confirmed_after, 0),
    greatest(v_reservation.total_price - v_confirmed_after, 0);
end;
$function$;

revoke all on function public.record_admin_reservation_payment(bigint, numeric, text, text) from public, anon;
grant execute on function public.record_admin_reservation_payment(bigint, numeric, text, text) to authenticated, service_role;

revoke all on function public.verify_admin_reservation_payment(bigint, numeric) from public, anon;
grant execute on function public.verify_admin_reservation_payment(bigint, numeric) to authenticated, service_role;

commit;
