begin;

-- These versioned RPCs already exist in some deployments with older OUT
-- columns/signatures. PostgreSQL requires dropping them before their return
-- contracts can be replaced.
drop function if exists public.create_public_reservation_v4(
  bigint, date, date, integer, integer, text, text, text, text
);
drop function if exists public.create_admin_reservation_v4(
  bigint, date, date, integer, integer, text, text, text, text,
  bigint, text, text, text, text, numeric
);
drop function if exists public.create_admin_reservation_v4(
  bigint, date, date, integer, integer, text, text, text, text,
  bigint, text, text, text
);
drop function if exists public.get_public_reservation_status_v3(text, text);
drop function if exists public.verify_admin_reservation_payment(bigint, numeric);
drop function if exists public.reject_admin_reservation_payment(bigint, text);
drop function if exists public.submit_reservation_receipt_payment_internal(bigint, text, text);

alter table public.reservation_payments
  add column if not exists requested_amount numeric;

update public.reservation_payments
set requested_amount = amount
where requested_amount is null;

alter table public.reservation_payments
  alter column requested_amount set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.reservation_payments'::regclass
      and conname = 'reservation_payments_requested_amount_check'
  ) then
    alter table public.reservation_payments
      add constraint reservation_payments_requested_amount_check
      check (requested_amount > 0);
  end if;
end;
$$;

create index if not exists reservation_payments_pending_reservation_idx
  on public.reservation_payments (reservation_id, created_at desc)
  where status = 'pending';

create or replace function public.sync_reservation_receipt_payment()
returns trigger
language plpgsql
security definer
set search_path = 'pg_catalog', 'public', 'auth'
as $$
declare
  v_confirmed_amount numeric;
  v_target_amount numeric;
  v_due_amount numeric;
  v_payment_type text;
begin
  if new.receipt_storage_path is null
     or new.status <> 'pending_approval'
     or new.receipt_storage_path is not distinct from old.receipt_storage_path then
    return new;
  end if;

  if exists (
    select 1
    from public.reservation_payments rp
    where rp.receipt_storage_path = new.receipt_storage_path
  ) then
    return new;
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
  where rp.reservation_id = new.id;

  v_target_amount := case
    when new.payment_plan = 'full' then new.total_price
    else new.deposit_target_amount
  end;

  v_due_amount := greatest(v_target_amount - v_confirmed_amount, 0);
  v_payment_type := case when new.payment_plan = 'full' then 'full' else 'deposit' end;

  if v_due_amount > 0 then
    insert into public.reservation_payments (
      reservation_id,
      amount,
      requested_amount,
      payment_type,
      payment_method,
      status,
      receipt_storage_path
    ) values (
      new.id,
      v_due_amount,
      v_due_amount,
      v_payment_type,
      'bank_transfer',
      'pending',
      new.receipt_storage_path
    );

    new.payment_status := case
      when v_confirmed_amount > 0 then 'partial'
      else 'pending'
    end;
  end if;

  return new;
end;
$$;

create or replace function public.record_admin_reservation_payment(
  p_reservation_id bigint,
  p_amount numeric,
  p_payment_method text,
  p_admin_note text default null
)
returns bigint
language plpgsql
security definer
set search_path = 'pg_catalog', 'public', 'auth'
as $$
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

  if v_reservation.status in ('pending_payment', 'pending_approval')
     and v_confirmed_amount + p_amount >= v_reservation.deposit_target_amount then
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
$$;

update public.reservations
set
  deposit_target_amount = case
    when night_count = 1 then round(total_price / 2, 2)
    else least(nightly_price, total_price)
  end,
  deposit_percentage = case
    when total_price > 0 then round(
      (
        case
          when night_count = 1 then round(total_price / 2, 2)
          else least(nightly_price, total_price)
        end
        / total_price
      ) * 100,
      2
    )
    else 0
  end
where payment_plan = 'deposit'
  and deposit_target_amount = 0;

create or replace function public.create_public_reservation_v4(
  p_accommodation_id bigint,
  p_check_in date,
  p_check_out date,
  p_adult_count integer,
  p_child_count integer,
  p_guest_name text,
  p_guest_identity_number text,
  p_guest_phone text,
  p_guest_email text
)
returns table (
  reservation_id bigint,
  reservation_code text,
  accommodation_title text,
  night_count integer,
  total_price numeric,
  deposit_target_amount numeric,
  amount_due_now numeric,
  remaining_payment_amount numeric
)
language plpgsql
security definer
set search_path = 'pg_catalog', 'public', 'auth'
set timezone = 'Europe/Istanbul'
as $$
declare
  v_created record;
  v_deposit_target numeric;
begin
  select *
  into v_created
  from public.create_public_reservation_v3(
    p_accommodation_id,
    p_check_in,
    p_check_out,
    p_adult_count,
    p_child_count,
    p_guest_name,
    p_guest_identity_number,
    p_guest_phone,
    p_guest_email
  );

  if v_created.reservation_id is null then
    raise exception 'Rezervasyon oluşturulamadı.';
  end if;

  select case
    when r.night_count = 1 then round(r.total_price / 2, 2)
    else least(r.nightly_price, r.total_price)
  end
  into v_deposit_target
  from public.reservations r
  where r.id = v_created.reservation_id
  for update;

  update public.reservations r
  set
    payment_plan = 'deposit',
    deposit_target_amount = v_deposit_target,
    deposit_percentage = case
      when r.total_price > 0 then round((v_deposit_target / r.total_price) * 100, 2)
      else 0
    end,
    payment_status = 'unpaid',
    updated_at = now()
  where r.id = v_created.reservation_id;

  return query
  select
    r.id,
    r.reservation_code,
    a.title,
    r.night_count,
    r.total_price,
    r.deposit_target_amount,
    r.deposit_target_amount,
    greatest(r.total_price - r.deposit_target_amount, 0)
  from public.reservations r
  join public.accommodations a on a.id = r.accommodation_id
  where r.id = v_created.reservation_id;
end;
$$;

create or replace function public.submit_reservation_receipt_payment_internal(
  p_reservation_id bigint,
  p_reservation_code text,
  p_storage_path text
)
returns boolean
language plpgsql
security definer
set search_path = 'pg_catalog', 'public', 'storage'
as $$
declare
  v_reservation public.reservations%rowtype;
  v_room_available boolean;
  v_new_room_id bigint;
  v_storage_path text;
  v_confirmed_amount numeric;
  v_deposit_target numeric;
  v_requested_amount numeric;
  v_payment_type text;
begin
  select *
  into v_reservation
  from public.reservations
  where id = p_reservation_id
    and reservation_code = p_reservation_code
  for update;

  if not found then
    raise exception 'Rezervasyon bulunamadı.';
  end if;

  if v_reservation.status <> 'pending_payment' then
    raise exception 'Bu rezervasyon için şu anda dekont yüklenemez.';
  end if;

  if exists (
    select 1
    from public.reservation_payments rp
    where rp.reservation_id = v_reservation.id
      and rp.status = 'pending'
  ) then
    raise exception 'Bu rezervasyon için zaten kontrol bekleyen bir dekont bulunuyor.';
  end if;

  v_storage_path := trim(coalesce(p_storage_path, ''));

  if v_storage_path = '' then
    raise exception 'Dekont dosyası bulunamadı.';
  end if;

  if upper(split_part(v_storage_path, '/', 1)) <> upper(v_reservation.reservation_code) then
    raise exception 'Dekont yolu rezervasyon numarasıyla eşleşmiyor.';
  end if;

  if not exists (
    select 1
    from storage.objects o
    where o.bucket_id = 'reservation-receipts'
      and o.name = v_storage_path
  ) then
    raise exception 'Yüklenen dekont dosyası bulunamadı.';
  end if;

  if v_reservation.created_at < now() - interval '1 hour' then
    select not exists (
      select 1
      from public.reservations r
      where r.room_id = v_reservation.room_id
        and r.id <> v_reservation.id
        and (
          r.status in ('pending_approval', 'confirmed')
          or (
            r.status = 'pending_payment'
            and r.created_at >= now() - interval '1 hour'
          )
        )
        and r.check_in < v_reservation.check_out
        and r.check_out > v_reservation.check_in
    )
    into v_room_available;

    if not v_room_available then
      select rm.id
      into v_new_room_id
      from public.rooms rm
      where rm.accommodation_id = v_reservation.accommodation_id
        and rm.is_active = true
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
            and r.check_in < v_reservation.check_out
            and r.check_out > v_reservation.check_in
        )
      order by rm.id
      for update skip locked
      limit 1;

      if v_new_room_id is null then
        raise exception 'Ödeme süresi dolduğu için oda rezervasyonunuz serbest bırakıldı ve seçtiğiniz tarihlerde artık müsait oda kalmadı.';
      end if;

      update public.reservations
      set room_id = v_new_room_id
      where id = v_reservation.id;
    end if;
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
  where rp.reservation_id = v_reservation.id;

  v_deposit_target := v_reservation.deposit_target_amount;

  if v_deposit_target <= 0 then
    v_deposit_target := case
      when v_reservation.night_count = 1 then round(v_reservation.total_price / 2, 2)
      else least(v_reservation.nightly_price, v_reservation.total_price)
    end;

    update public.reservations
    set
      payment_plan = 'deposit',
      deposit_target_amount = v_deposit_target,
      deposit_percentage = case
        when total_price > 0 then round((v_deposit_target / total_price) * 100, 2)
        else 0
      end
    where id = v_reservation.id;
  end if;

  v_requested_amount := least(
    greatest(v_reservation.total_price - v_confirmed_amount, 0),
    greatest(v_deposit_target - v_confirmed_amount, 0)
  );

  if v_requested_amount <= 0 then
    raise exception 'Bu rezervasyon için gerekli kapora zaten tamamlanmış.';
  end if;

  v_payment_type := case
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
    receipt_storage_path
  ) values (
    v_reservation.id,
    v_requested_amount,
    v_requested_amount,
    v_payment_type,
    'bank_transfer',
    'pending',
    v_storage_path
  );

  update public.reservations
  set
    receipt_storage_path = v_storage_path,
    status = 'pending_approval',
    updated_at = now()
  where id = v_reservation.id;

  perform public.refresh_reservation_payment_status(v_reservation.id);

  return true;
end;
$$;

create or replace function public.create_admin_reservation_v4(
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
  p_status text,
  p_source text,
  p_admin_note text
)
returns table (
  reservation_id bigint,
  reservation_code text,
  room_id bigint,
  room_name text,
  room_number text,
  total_price numeric
)
language plpgsql
security definer
set search_path = 'pg_catalog', 'public', 'auth'
set timezone = 'Europe/Istanbul'
as $$
declare
  v_created record;
  v_deposit_target numeric;
begin
  if not public.is_admin() then
    raise exception 'Bu işlem için yönetici yetkisi gereklidir.';
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
    p_status,
    p_source,
    p_admin_note
  );

  select case
    when r.night_count = 1 then round(r.total_price / 2, 2)
    else least(r.nightly_price, r.total_price)
  end
  into v_deposit_target
  from public.reservations r
  where r.id = v_created.reservation_id
  for update;

  update public.reservations r
  set
    payment_plan = 'deposit',
    deposit_target_amount = v_deposit_target,
    deposit_percentage = case
      when r.total_price > 0 then round((v_deposit_target / r.total_price) * 100, 2)
      else 0
    end,
    updated_at = now()
  where r.id = v_created.reservation_id;

  return query
  select
    v_created.reservation_id::bigint,
    v_created.reservation_code::text,
    v_created.room_id::bigint,
    v_created.room_name::text,
    v_created.room_number::text,
    v_created.total_price::numeric;
end;
$$;

create or replace function public.submit_reservation_receipt(
  p_reservation_id bigint,
  p_reservation_code text,
  p_storage_path text
)
returns boolean
language plpgsql
security definer
set search_path = 'pg_catalog', 'public'
as $$
begin
  return public.submit_reservation_receipt_payment_internal(
    p_reservation_id,
    p_reservation_code,
    p_storage_path
  );
end;
$$;

create or replace function public.submit_tracked_reservation_receipt(
  p_reservation_code text,
  p_guest_phone text,
  p_storage_path text
)
returns boolean
language plpgsql
security definer
set search_path = 'pg_catalog', 'public'
as $$
declare
  v_reservation_id bigint;
  v_reservation_code text;
begin
  if public.normalize_phone(p_guest_phone) is null then
    raise exception 'Geçerli bir telefon numarası gereklidir.';
  end if;

  select r.id, r.reservation_code
  into v_reservation_id, v_reservation_code
  from public.reservations r
  where upper(btrim(r.reservation_code)) = upper(btrim(p_reservation_code))
    and public.normalize_phone(r.guest_phone) = public.normalize_phone(p_guest_phone)
  limit 1;

  if v_reservation_id is null then
    raise exception 'Rezervasyon bulunamadı.';
  end if;

  return public.submit_reservation_receipt_payment_internal(
    v_reservation_id,
    v_reservation_code,
    p_storage_path
  );
end;
$$;

create or replace function public.get_public_reservation_status_v3(
  p_reservation_code text,
  p_guest_phone text
)
returns table (
  reservation_code text,
  guest_name text,
  accommodation_title text,
  check_in date,
  check_out date,
  guest_count integer,
  adult_count integer,
  child_count integer,
  night_count integer,
  total_price numeric,
  payment_plan text,
  deposit_target_amount numeric,
  confirmed_payment_amount numeric,
  amount_due_now numeric,
  remaining_payment_amount numeric,
  payment_status text,
  status text,
  has_receipt boolean,
  has_pending_receipt boolean,
  last_payment_note text,
  rejection_reason text,
  cancellation_reason text
)
language plpgsql
security definer
set search_path = 'pg_catalog', 'public'
as $$
begin
  if p_reservation_code is null or btrim(p_reservation_code) = '' then
    raise exception 'Rezervasyon numarası gereklidir.';
  end if;

  if public.normalize_phone(p_guest_phone) is null then
    raise exception 'Geçerli bir telefon numarası gereklidir.';
  end if;

  return query
  with payment_totals as (
    select
      rp.reservation_id,
      coalesce(
        sum(
          case
            when rp.payment_type = 'refund' then -rp.amount
            else rp.amount
          end
        ) filter (where rp.status = 'confirmed'),
        0
      ) as confirmed_amount,
      coalesce(bool_or(rp.status = 'pending'), false) as has_pending,
      coalesce(bool_or(rp.receipt_storage_path is not null), false) as has_any_receipt
    from public.reservation_payments rp
    group by rp.reservation_id
  )
  select
    r.reservation_code::text,
    r.guest_name::text,
    a.title::text,
    r.check_in,
    r.check_out,
    r.guest_count::integer,
    r.adult_count::integer,
    r.child_count::integer,
    r.night_count::integer,
    r.total_price,
    r.payment_plan::text,
    r.deposit_target_amount,
    coalesce(pt.confirmed_amount, 0),
    greatest(r.deposit_target_amount - coalesce(pt.confirmed_amount, 0), 0),
    greatest(r.total_price - coalesce(pt.confirmed_amount, 0), 0),
    r.payment_status::text,
    r.status::text,
    (coalesce(pt.has_any_receipt, false) or r.receipt_storage_path is not null),
    coalesce(pt.has_pending, false),
    (
      select rp.admin_note
      from public.reservation_payments rp
      where rp.reservation_id = r.id
        and rp.status = 'rejected'
        and rp.admin_note is not null
      order by rp.updated_at desc
      limit 1
    )::text,
    case when r.status = 'rejected' then r.rejection_reason else null end::text,
    case when r.status = 'cancelled' then r.cancellation_reason else null end::text
  from public.reservations r
  join public.accommodations a on a.id = r.accommodation_id
  left join payment_totals pt on pt.reservation_id = r.id
  where upper(btrim(r.reservation_code)) = upper(btrim(p_reservation_code))
    and public.normalize_phone(r.guest_phone) = public.normalize_phone(p_guest_phone)
  limit 1;
end;
$$;

create or replace function public.verify_admin_reservation_payment(
  p_payment_id bigint,
  p_received_amount numeric
)
returns table (
  reservation_id bigint,
  reservation_confirmed boolean,
  confirmed_payment_amount numeric,
  deposit_remaining_amount numeric,
  total_remaining_amount numeric
)
language plpgsql
security definer
set search_path = 'pg_catalog', 'public', 'auth'
as $$
declare
  v_payment public.reservation_payments%rowtype;
  v_reservation public.reservations%rowtype;
  v_confirmed_before numeric;
  v_confirmed_after numeric;
  v_remaining_before numeric;
  v_is_confirmed boolean;
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

  v_is_confirmed := v_confirmed_after >= v_reservation.deposit_target_amount;

  update public.reservations
  set
    status = case when v_is_confirmed then 'confirmed' else 'pending_payment' end,
    rejection_reason = case when v_is_confirmed then null else rejection_reason end,
    cancellation_reason = case when v_is_confirmed then null else cancellation_reason end,
    updated_at = now()
  where id = v_reservation.id;

  return query
  select
    v_reservation.id,
    v_is_confirmed,
    v_confirmed_after,
    greatest(v_reservation.deposit_target_amount - v_confirmed_after, 0),
    greatest(v_reservation.total_price - v_confirmed_after, 0);
end;
$$;

create or replace function public.reject_admin_reservation_payment(
  p_payment_id bigint,
  p_reason text
)
returns boolean
language plpgsql
security definer
set search_path = 'pg_catalog', 'public', 'auth'
as $$
declare
  v_payment public.reservation_payments%rowtype;
  v_reason text;
begin
  if not public.is_admin() then
    raise exception 'Bu işlem için yönetici yetkisi gereklidir.';
  end if;

  v_reason := trim(coalesce(p_reason, ''));

  if length(v_reason) < 3 or length(v_reason) > 500 then
    raise exception 'Dekont red açıklaması 3-500 karakter arasında olmalıdır.';
  end if;

  select *
  into v_payment
  from public.reservation_payments
  where id = p_payment_id
  for update;

  if not found or v_payment.status <> 'pending' then
    raise exception 'Kontrol bekleyen ödeme kaydı bulunamadı.';
  end if;

  update public.reservation_payments
  set
    status = 'rejected',
    admin_note = v_reason,
    created_by = auth.uid(),
    updated_at = now()
  where id = v_payment.id;

  update public.reservations
  set
    status = case
      when status = 'pending_approval' then 'pending_payment'
      else status
    end,
    updated_at = now()
  where id = v_payment.reservation_id;

  perform public.refresh_reservation_payment_status(v_payment.reservation_id);

  return true;
end;
$$;

revoke execute on function public.create_public_reservation_v4(
  bigint, date, date, integer, integer, text, text, text, text
) from public;
grant execute on function public.create_public_reservation_v4(
  bigint, date, date, integer, integer, text, text, text, text
) to anon, authenticated, service_role;

revoke execute on function public.create_admin_reservation_v4(
  bigint, date, date, integer, integer, text, text, text, text, bigint, text, text, text
) from public, anon;
grant execute on function public.create_admin_reservation_v4(
  bigint, date, date, integer, integer, text, text, text, text, bigint, text, text, text
) to authenticated, service_role;

revoke execute on function public.submit_reservation_receipt_payment_internal(
  bigint, text, text
) from public, anon, authenticated;

revoke execute on function public.submit_reservation_receipt(
  bigint, text, text
) from public;
grant execute on function public.submit_reservation_receipt(
  bigint, text, text
) to anon, authenticated, service_role;

revoke execute on function public.submit_tracked_reservation_receipt(
  text, text, text
) from public;
grant execute on function public.submit_tracked_reservation_receipt(
  text, text, text
) to anon, authenticated, service_role;

revoke execute on function public.get_public_reservation_status_v3(
  text, text
) from public;
grant execute on function public.get_public_reservation_status_v3(
  text, text
) to anon, authenticated, service_role;

revoke execute on function public.verify_admin_reservation_payment(
  bigint, numeric
) from public, anon;
grant execute on function public.verify_admin_reservation_payment(
  bigint, numeric
) to authenticated, service_role;

revoke execute on function public.reject_admin_reservation_payment(
  bigint, text
) from public, anon;
grant execute on function public.reject_admin_reservation_payment(
  bigint, text
) to authenticated, service_role;

-- The legacy one-click approval trusted the expected receipt amount. Keep it
-- unavailable so every receipt passes through explicit bank amount verification.
revoke execute on function public.approve_admin_reservation_with_payment(bigint)
from public, anon, authenticated;
grant execute on function public.approve_admin_reservation_with_payment(bigint)
to service_role;

-- Retire the directly exposed legacy public reservation contracts. The v4
-- functions can still call v3 internally as their function owner.
revoke execute on function public.create_public_reservation_v2(
  bigint, date, date, integer, integer, text, text, text
) from public, anon, authenticated;
revoke execute on function public.create_public_reservation_v3(
  bigint, date, date, integer, integer, text, text, text, text
) from public, anon, authenticated;
revoke execute on function public.get_public_reservation_status(text, text)
from public, anon, authenticated;
revoke execute on function public.get_public_reservation_status_v2(text, text)
from public, anon, authenticated;

commit;
