begin;

create or replace function public.record_admin_reservation_refund(
  p_reservation_id bigint,
  p_amount numeric,
  p_payment_method text,
  p_reason text
)
returns bigint
language plpgsql
security definer
set search_path = 'pg_catalog', 'public', 'auth'
as $$
declare
  v_reservation public.reservations%rowtype;
  v_collected_amount numeric;
  v_refunded_amount numeric;
  v_refundable_amount numeric;
  v_refund_amount numeric;
  v_reason text;
  v_refund_id bigint;
begin
  if not public.is_admin() then
    raise exception 'Bu işlem için yönetici yetkisi gereklidir.';
  end if;

  v_refund_amount := round(coalesce(p_amount, 0), 2);
  v_reason := trim(coalesce(p_reason, ''));

  if v_refund_amount <= 0 then
    raise exception 'İade tutarı sıfırdan büyük olmalıdır.';
  end if;

  if p_payment_method not in ('bank_transfer', 'cash', 'card', 'other') then
    raise exception 'Geçersiz iade yöntemi.';
  end if;

  if length(v_reason) < 3 or length(v_reason) > 500 then
    raise exception 'İade sebebi 3-500 karakter arasında olmalıdır.';
  end if;

  select *
  into v_reservation
  from public.reservations
  where id = p_reservation_id
  for update;

  if not found then
    raise exception 'Rezervasyon bulunamadı.';
  end if;

  select
    coalesce(
      sum(rp.amount) filter (
        where rp.status = 'confirmed'
          and rp.payment_type <> 'refund'
      ),
      0
    ),
    coalesce(
      sum(rp.amount) filter (
        where rp.status = 'confirmed'
          and rp.payment_type = 'refund'
      ),
      0
    )
  into v_collected_amount, v_refunded_amount
  from public.reservation_payments rp
  where rp.reservation_id = p_reservation_id;

  v_refundable_amount := greatest(v_collected_amount - v_refunded_amount, 0);

  if v_refundable_amount <= 0 then
    raise exception 'Bu rezervasyonda iade edilebilir tahsilat bulunmuyor.';
  end if;

  if v_refund_amount > v_refundable_amount then
    raise exception 'İade tutarı iade edilebilir tutardan fazla olamaz.';
  end if;

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
    v_refund_amount,
    v_refund_amount,
    'refund',
    p_payment_method,
    'confirmed',
    v_reason,
    now(),
    auth.uid()
  )
  returning id into v_refund_id;

  perform public.refresh_reservation_payment_status(p_reservation_id);

  return v_refund_id;
end;
$$;

revoke all on function public.record_admin_reservation_refund(bigint, numeric, text, text)
  from public, anon;
grant execute on function public.record_admin_reservation_refund(bigint, numeric, text, text)
  to authenticated;

commit;
