begin;

create or replace function public.cancel_admin_reservation(
  p_reservation_id bigint,
  p_reason text,
  p_expected_status text
)
returns bigint
language plpgsql
security definer
set search_path = 'pg_catalog', 'public', 'auth'
as $$
declare
  v_reservation public.reservations%rowtype;
  v_reason text;
  v_confirmed_net_amount numeric;
begin
  if not public.is_admin() then
    raise exception 'Bu işlem için yönetici yetkisi gereklidir.';
  end if;

  v_reason := trim(coalesce(p_reason, ''));

  if p_reservation_id is null or p_reservation_id <= 0 then
    raise exception 'Geçersiz rezervasyon.';
  end if;

  if p_expected_status not in ('pending_payment', 'confirmed') then
    raise exception 'Bu rezervasyon durumu panelden iptal edilemez.';
  end if;

  if length(v_reason) < 5 or length(v_reason) > 500 then
    raise exception 'İptal sebebi 5-500 karakter arasında olmalıdır.';
  end if;

  -- Ödeme doğrulama işlemi de önce ödeme kaydını kilitlediği için aynı kilit
  -- sırasını kullanırız. Böylece eşzamanlı onay ve iptal birbirini ezemez.
  perform 1
  from public.reservation_payments rp
  where rp.reservation_id = p_reservation_id
  order by rp.id
  for update;

  select *
  into v_reservation
  from public.reservations
  where id = p_reservation_id
  for update;

  if not found then
    raise exception 'Rezervasyon bulunamadı.';
  end if;

  if v_reservation.status <> p_expected_status then
    raise exception 'Rezervasyonun durumu değişti. Detayı yenileyip tekrar kontrol edin.';
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
  into v_confirmed_net_amount
  from public.reservation_payments rp
  where rp.reservation_id = p_reservation_id;

  if p_expected_status = 'pending_payment' and v_confirmed_net_amount > 0 then
    raise exception 'Bu rezervasyonda onaylanmış tahsilat var. İptalden önce ödeme ve iade kayıtlarını kontrol edin.';
  end if;

  update public.reservation_payments
  set
    status = 'rejected',
    admin_note = case
      when nullif(trim(admin_note), '') is null then 'Rezervasyon iptal edildi: ' || v_reason
      else admin_note || E'\nRezervasyon iptal edildi: ' || v_reason
    end,
    updated_at = now()
  where reservation_id = p_reservation_id
    and status = 'pending';

  perform public.refresh_reservation_payment_status(p_reservation_id);

  update public.reservations
  set
    status = 'cancelled',
    rejection_reason = null,
    cancellation_reason = v_reason,
    updated_at = now()
  where id = p_reservation_id;

  return p_reservation_id;
end;
$$;

revoke all on function public.cancel_admin_reservation(bigint, text, text)
  from public, anon;
grant execute on function public.cancel_admin_reservation(bigint, text, text)
  to authenticated, service_role;

commit;
