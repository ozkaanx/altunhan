begin;

create or replace function public.calculate_september_2026_reservation_pricing(
  p_nightly_price numeric,
  p_check_in date,
  p_check_out date
)
returns table (
  night_count integer,
  regular_total numeric,
  discounted_night_count integer,
  discount_percentage numeric,
  discount_amount numeric,
  total_price numeric,
  first_night_price numeric
)
language sql
immutable
parallel safe
set search_path = ''
as $$
  with pricing as (
    select
      greatest(coalesce(p_check_out - p_check_in, 0), 0)::integer as calculated_night_count,
      greatest(
        least(coalesce(p_check_out, date '2026-09-01'), date '2026-10-01')
        - greatest(coalesce(p_check_in, date '2026-10-01'), date '2026-09-01'),
        0
      )::integer as calculated_discounted_night_count,
      greatest(coalesce(p_nightly_price, 0), 0)::numeric as safe_nightly_price
  )
  select
    calculated_night_count,
    round(safe_nightly_price * calculated_night_count, 2),
    least(calculated_discounted_night_count, calculated_night_count),
    case when calculated_discounted_night_count > 0 then 20::numeric else 0::numeric end,
    round(safe_nightly_price * least(calculated_discounted_night_count, calculated_night_count) * 0.20, 2),
    round(
      safe_nightly_price * calculated_night_count
      - safe_nightly_price * least(calculated_discounted_night_count, calculated_night_count) * 0.20,
      2
    ),
    case
      when p_check_in >= date '2026-09-01' and p_check_in < date '2026-10-01'
        then round(safe_nightly_price * 0.80, 2)
      else safe_nightly_price
    end
  from pricing;
$$;

revoke all on function public.calculate_september_2026_reservation_pricing(numeric, date, date)
from public, anon, authenticated;
grant execute on function public.calculate_september_2026_reservation_pricing(numeric, date, date)
to service_role;

create or replace function public.create_admin_reservation_v3(
  p_accommodation_id bigint,
  p_check_in date,
  p_check_out date,
  p_adult_count integer,
  p_child_count integer,
  p_guest_name text,
  p_guest_identity_number text,
  p_guest_phone text,
  p_guest_email text default null,
  p_room_id bigint default null,
  p_status text default 'confirmed',
  p_source text default 'phone',
  p_admin_note text default null
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
  v_accommodation public.accommodations%rowtype;
  v_room public.rooms%rowtype;
  v_selected_room_id bigint;
  v_pricing record;
  v_reservation_code text;
  v_conflict_exists boolean;
  v_guest_count integer;
  v_identity_number text;
begin
  if not public.is_admin() then
    raise exception 'Bu işlem için yönetici yetkisi gereklidir.';
  end if;

  if p_guest_name is null or trim(p_guest_name) = '' then
    raise exception 'Misafir adı zorunludur.';
  end if;

  if p_guest_phone is null or trim(p_guest_phone) = '' then
    raise exception 'Telefon numarası zorunludur.';
  end if;

  v_identity_number := regexp_replace(coalesce(p_guest_identity_number, ''), '[^0-9]', '', 'g');

  if not public.is_valid_tckn(v_identity_number) then
    raise exception 'Geçerli bir T.C. kimlik numarası girin.';
  end if;

  if p_check_out <= p_check_in then
    raise exception 'Çıkış tarihi giriş tarihinden sonra olmalıdır.';
  end if;

  if p_adult_count is null or p_adult_count < 1 then
    raise exception 'En az 1 yetişkin seçilmelidir.';
  end if;

  if p_child_count is null or p_child_count < 0 then
    raise exception 'Çocuk sayısı geçersiz.';
  end if;

  if p_status not in ('pending_payment', 'pending_approval', 'confirmed') then
    raise exception 'Geçersiz rezervasyon durumu.';
  end if;

  if p_source not in ('phone', 'whatsapp', 'walk_in', 'admin') then
    raise exception 'Geçersiz rezervasyon kaynağı.';
  end if;

  v_guest_count := p_adult_count + p_child_count;

  select * into v_accommodation
  from public.accommodations
  where id = p_accommodation_id
    and is_active = true;

  if not found then
    raise exception 'Seçilen konaklama tipi bulunamadı.';
  end if;

  if p_adult_count > v_accommodation.max_adults then
    raise exception 'Bu konaklamada en fazla % yetişkin kalabilir.', v_accommodation.max_adults;
  end if;

  if p_child_count > v_accommodation.max_children then
    raise exception 'Bu konaklamada en fazla % çocuk kalabilir.', v_accommodation.max_children;
  end if;

  if v_guest_count > v_accommodation.max_total_guests then
    raise exception 'Bu konaklamanın maksimum toplam kapasitesi % kişidir.', v_accommodation.max_total_guests;
  end if;

  if p_room_id is not null then
    select * into v_room
    from public.rooms
    where id = p_room_id
      and accommodation_id = p_accommodation_id
      and is_active = true
    for update;

    if not found then
      raise exception 'Seçilen fiziksel oda bulunamadı veya kullanım dışı.';
    end if;

    if v_room.max_guests is not null and v_guest_count > v_room.max_guests then
      raise exception 'Seçilen fiziksel odanın maksimum kapasitesi % kişidir.', v_room.max_guests;
    end if;

    select exists (
      select 1
      from public.reservations r
      where r.room_id = p_room_id
        and (
          r.status in ('pending_approval', 'confirmed')
          or (r.status = 'pending_payment' and r.created_at >= now() - interval '1 hour')
        )
        and r.check_in < p_check_out
        and r.check_out > p_check_in
    ) into v_conflict_exists;

    if v_conflict_exists then
      raise exception 'Seçilen fiziksel oda bu tarihlerde müsait değil.';
    end if;

    v_selected_room_id := p_room_id;
  else
    select rm.id into v_selected_room_id
    from public.rooms rm
    where rm.accommodation_id = p_accommodation_id
      and rm.is_active = true
      and (rm.max_guests is null or rm.max_guests >= v_guest_count)
      and not exists (
        select 1
        from public.reservations r
        where r.room_id = rm.id
          and (
            r.status in ('pending_approval', 'confirmed')
            or (r.status = 'pending_payment' and r.created_at >= now() - interval '1 hour')
          )
          and r.check_in < p_check_out
          and r.check_out > p_check_in
      )
    order by rm.id
    for update skip locked
    limit 1;

    if v_selected_room_id is null then
      raise exception 'Seçilen tarihlerde misafir sayısına uygun müsait fiziksel oda kalmadı.';
    end if;
  end if;

  select * into v_pricing
  from public.calculate_september_2026_reservation_pricing(
    v_accommodation.price,
    p_check_in,
    p_check_out
  );

  v_reservation_code := 'AF-' || to_char(current_date, 'YYYYMMDD') || '-'
    || upper(substring(replace(gen_random_uuid()::text, '-', '') from 1 for 5));

  insert into public.reservations (
    accommodation_id, room_id, reservation_code, guest_name, guest_identity_number,
    guest_phone, guest_email, check_in, check_out, guest_count, adult_count, child_count,
    nightly_price, night_count, total_price, payment_method, status, source, admin_note
  ) values (
    p_accommodation_id, v_selected_room_id, v_reservation_code, trim(p_guest_name),
    v_identity_number, public.normalize_phone(p_guest_phone),
    nullif(lower(trim(p_guest_email)), ''), p_check_in, p_check_out, v_guest_count,
    p_adult_count, p_child_count, v_accommodation.price, v_pricing.night_count,
    v_pricing.total_price, 'bank_transfer', p_status, p_source,
    nullif(trim(p_admin_note), '')
  )
  returning id into reservation_id;

  reservation_code := v_reservation_code;
  room_id := v_selected_room_id;
  total_price := v_pricing.total_price;

  select rm.room_name, rm.room_number
  into room_name, room_number
  from public.rooms rm
  where rm.id = v_selected_room_id;

  return next;
end;
$$;

create or replace function public.create_public_reservation_v5(
  p_accommodation_id bigint,
  p_check_in date,
  p_check_out date,
  p_adult_count integer,
  p_child_count integer,
  p_guest_name text,
  p_guest_identity_number text,
  p_guest_phone text,
  p_guest_email text,
  p_requested_bed_configuration text
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
  v_accommodation public.accommodations%rowtype;
  v_room_id bigint;
  v_pricing record;
  v_reservation_code text;
  v_normalized_phone text;
  v_identity_number text;
  v_guest_count integer;
  v_count_10_minutes integer;
  v_count_1_hour integer;
  v_requires_bed_preference boolean;
  v_deposit_target numeric;
begin
  if p_guest_name is null or trim(p_guest_name) = ''
     or p_guest_identity_number is null or trim(p_guest_identity_number) = ''
     or p_guest_phone is null or trim(p_guest_phone) = ''
     or p_guest_email is null or trim(p_guest_email) = '' then
    raise exception 'Lütfen zorunlu alanları doldurun.';
  end if;

  if p_requested_bed_configuration is not null
     and p_requested_bed_configuration not in ('one_double', 'double_single', 'two_double') then
    raise exception 'Yatak tercihi geçersiz.';
  end if;

  v_identity_number := regexp_replace(p_guest_identity_number, '[^0-9]', '', 'g');

  if not public.is_valid_tckn(v_identity_number) then
    raise exception 'Geçerli bir T.C. kimlik numarası girin.';
  end if;

  if p_guest_email !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'Lütfen geçerli bir e-posta adresi girin.';
  end if;

  if p_adult_count is null or p_adult_count < 1 then
    raise exception 'En az 1 yetişkin seçilmelidir.';
  end if;

  if p_child_count is null or p_child_count < 0 then
    raise exception 'Çocuk sayısı geçersiz.';
  end if;

  v_guest_count := p_adult_count + p_child_count;
  v_normalized_phone := public.normalize_phone(p_guest_phone);

  if v_normalized_phone is null or length(v_normalized_phone) < 10 then
    raise exception 'Lütfen geçerli bir telefon numarası girin.';
  end if;

  perform pg_advisory_xact_lock(hashtext(v_normalized_phone)::bigint);

  select count(*) into v_count_10_minutes
  from public.reservations r
  where public.normalize_phone(r.guest_phone) = v_normalized_phone
    and r.source = 'website'
    and r.created_at >= now() - interval '10 minutes';

  if v_count_10_minutes >= 3 then
    raise exception 'Kısa süre içinde çok fazla rezervasyon talebi oluşturdunuz. Lütfen birkaç dakika sonra tekrar deneyin.';
  end if;

  select count(*) into v_count_1_hour
  from public.reservations r
  where public.normalize_phone(r.guest_phone) = v_normalized_phone
    and r.source = 'website'
    and r.created_at >= now() - interval '1 hour';

  if v_count_1_hour >= 5 then
    raise exception 'Çok fazla rezervasyon talebi oluşturdunuz. Lütfen daha sonra tekrar deneyin.';
  end if;

  if exists (
    select 1
    from public.reservations r
    where public.normalize_phone(r.guest_phone) = v_normalized_phone
      and r.accommodation_id = p_accommodation_id
      and r.check_in = p_check_in
      and r.check_out = p_check_out
      and r.created_at >= now() - interval '1 hour'
      and r.status in ('pending_payment', 'pending_approval', 'confirmed')
  ) then
    raise exception 'Bu bilgilerle zaten aktif bir rezervasyon talebiniz bulunuyor.';
  end if;

  if p_check_out <= p_check_in then
    raise exception 'Çıkış tarihi giriş tarihinden sonra olmalıdır.';
  end if;

  if p_check_in < current_date then
    raise exception 'Geçmiş bir tarih için rezervasyon yapılamaz.';
  end if;

  select * into v_accommodation
  from public.accommodations
  where id = p_accommodation_id
    and is_active = true;

  if not found then
    raise exception 'Seçilen konaklama bulunamadı.';
  end if;

  if p_adult_count > v_accommodation.max_adults then
    raise exception 'Bu konaklamada en fazla % yetişkin kalabilir.', v_accommodation.max_adults;
  end if;

  if p_child_count > v_accommodation.max_children then
    raise exception 'Bu konaklamada en fazla % çocuk kalabilir.', v_accommodation.max_children;
  end if;

  if v_guest_count > v_accommodation.max_total_guests then
    raise exception 'Bu konaklamanın maksimum toplam kapasitesi % kişidir.', v_accommodation.max_total_guests;
  end if;

  select exists (
    select 1 from public.rooms rm
    where rm.accommodation_id = p_accommodation_id
      and rm.is_active = true
      and rm.bed_configuration is not null
  ) into v_requires_bed_preference;

  if v_requires_bed_preference and p_requested_bed_configuration is null then
    raise exception 'Lütfen yatak tercihinizi seçin.';
  end if;

  select rm.id into v_room_id
  from public.rooms rm
  where rm.accommodation_id = p_accommodation_id
    and rm.is_active = true
    and (rm.max_guests is null or rm.max_guests >= v_guest_count)
    and (p_requested_bed_configuration is null or rm.bed_configuration = p_requested_bed_configuration)
    and not exists (
      select 1
      from public.reservations r
      where r.room_id = rm.id
        and (
          r.status in ('pending_approval', 'confirmed')
          or (r.status = 'pending_payment' and r.created_at >= now() - interval '1 hour')
        )
        and r.check_in < p_check_out
        and r.check_out > p_check_in
    )
  order by case when rm.max_guests is null then 1 else 0 end, rm.max_guests, rm.id
  for update skip locked
  limit 1;

  if v_room_id is null then
    if p_requested_bed_configuration is not null then
      raise exception 'Seçtiğiniz yatak düzeninde ve misafir sayınıza uygun müsait oda kalmadı.';
    end if;

    raise exception 'Seçtiğiniz tarihlerde misafir sayınıza uygun müsait oda kalmadı.';
  end if;

  select * into v_pricing
  from public.calculate_september_2026_reservation_pricing(
    v_accommodation.price,
    p_check_in,
    p_check_out
  );

  v_reservation_code := 'AF-' || to_char(current_date, 'YYYYMMDD') || '-'
    || upper(substring(replace(gen_random_uuid()::text, '-', '') from 1 for 5));

  insert into public.reservations (
    accommodation_id, room_id, reservation_code, guest_name, guest_identity_number,
    guest_phone, guest_email, check_in, check_out, guest_count, adult_count, child_count,
    nightly_price, night_count, total_price, payment_method, payment_plan,
    deposit_percentage, deposit_target_amount, payment_status, requested_bed_configuration,
    status, source
  ) values (
    p_accommodation_id, v_room_id, v_reservation_code, trim(p_guest_name), v_identity_number,
    v_normalized_phone, lower(trim(p_guest_email)), p_check_in, p_check_out, v_guest_count,
    p_adult_count, p_child_count, v_accommodation.price, v_pricing.night_count,
    v_pricing.total_price, 'bank_transfer', 'deposit', 0, 0, 'unpaid',
    p_requested_bed_configuration, 'pending_payment', 'website'
  )
  returning id into reservation_id;

  v_deposit_target := case
    when v_pricing.night_count = 1 then round(v_pricing.total_price / 2, 2)
    else least(v_pricing.first_night_price, v_pricing.total_price)
  end;

  update public.reservations r
  set
    deposit_target_amount = v_deposit_target,
    deposit_percentage = case
      when r.total_price > 0 then round((v_deposit_target / r.total_price) * 100, 2)
      else 0
    end,
    updated_at = now()
  where r.id = reservation_id;

  reservation_code := v_reservation_code;
  accommodation_title := v_accommodation.title;
  night_count := v_pricing.night_count;
  total_price := v_pricing.total_price;
  deposit_target_amount := v_deposit_target;
  amount_due_now := v_deposit_target;
  remaining_payment_amount := greatest(v_pricing.total_price - v_deposit_target, 0);

  return next;
end;
$$;

create or replace function public.create_admin_reservation_v5(
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
  v_pricing record;
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

  select * into v_created
  from public.create_admin_reservation_v3(
    p_accommodation_id, p_check_in, p_check_out, p_adult_count, p_child_count,
    p_guest_name, p_guest_identity_number, p_guest_phone, p_guest_email, p_room_id,
    'pending_payment', p_source, p_admin_note
  );

  if v_created.reservation_id is null then
    raise exception 'Rezervasyon oluşturulamadı.';
  end if;

  v_reservation_id := v_created.reservation_id;

  select * into v_reservation
  from public.reservations r
  where r.id = v_reservation_id
  for update;

  select * into v_pricing
  from public.calculate_september_2026_reservation_pricing(
    v_reservation.nightly_price,
    v_reservation.check_in,
    v_reservation.check_out
  );

  v_deposit_target := case
    when v_reservation.night_count = 1 then round(v_reservation.total_price / 2, 2)
    else least(v_pricing.first_night_price, v_reservation.total_price)
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
    sum(case when rp.payment_type = 'refund' then -rp.amount else rp.amount end)
      filter (where rp.status = 'confirmed'),
    0
  ) into v_confirmed_amount
  from public.reservation_payments rp
  where rp.reservation_id = v_reservation_id;

  select * into v_reservation
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

create or replace function public.update_admin_reservation_dates(
  p_reservation_id bigint,
  p_check_in date,
  p_check_out date,
  p_room_id bigint
)
returns table (
  updated_check_in date,
  updated_check_out date,
  updated_night_count integer,
  updated_total_price numeric,
  updated_room_id bigint,
  updated_room_name text,
  updated_room_number text
)
language plpgsql
security definer
set search_path = 'pg_catalog', 'public', 'auth'
set timezone = 'Europe/Istanbul'
as $$
declare
  v_reservation public.reservations%rowtype;
  v_room public.rooms%rowtype;
  v_pricing record;
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

  if v_reservation.status = 'pending_payment'
     and v_reservation.created_at < now() - interval '1 hour' then
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
        or (r.status = 'pending_payment' and r.created_at >= now() - interval '1 hour')
      )
      and r.check_in < p_check_out
      and r.check_out > p_check_in
  ) into v_conflict_exists;

  if v_conflict_exists then
    raise exception 'Seçilen fiziksel oda bu tarihler için müsait değil.';
  end if;

  select * into v_pricing
  from public.calculate_september_2026_reservation_pricing(
    v_reservation.nightly_price,
    p_check_in,
    p_check_out
  );

  v_deposit_target := case
    when v_reservation.payment_plan = 'full' then v_pricing.total_price
    when v_pricing.night_count = 1 then round(v_pricing.total_price / 2, 2)
    else least(v_pricing.first_night_price, v_pricing.total_price)
  end;

  update public.reservations
  set
    check_in = p_check_in,
    check_out = p_check_out,
    room_id = p_room_id,
    night_count = v_pricing.night_count,
    total_price = v_pricing.total_price,
    deposit_target_amount = v_deposit_target,
    deposit_percentage = case
      when v_pricing.total_price > 0 then round((v_deposit_target / v_pricing.total_price) * 100, 2)
      else 0
    end,
    updated_at = now()
  where id = p_reservation_id;

  perform public.refresh_reservation_payment_status(p_reservation_id);

  updated_check_in := p_check_in;
  updated_check_out := p_check_out;
  updated_night_count := v_pricing.night_count;
  updated_total_price := v_pricing.total_price;
  updated_room_id := v_room.id;
  updated_room_name := v_room.room_name;
  updated_room_number := v_room.room_number;

  return next;
end;
$$;

revoke all on function public.create_admin_reservation_v3(
  bigint, date, date, integer, integer, text, text, text, text, bigint, text, text, text
) from public, anon;
grant execute on function public.create_admin_reservation_v3(
  bigint, date, date, integer, integer, text, text, text, text, bigint, text, text, text
) to authenticated, service_role;

revoke all on function public.create_public_reservation_v5(
  bigint, date, date, integer, integer, text, text, text, text, text
) from public;
grant execute on function public.create_public_reservation_v5(
  bigint, date, date, integer, integer, text, text, text, text, text
) to anon, authenticated, service_role;

revoke all on function public.create_admin_reservation_v5(
  bigint, date, date, integer, integer, text, text, text, text,
  bigint, text, text, numeric, text, text
) from public, anon;
grant execute on function public.create_admin_reservation_v5(
  bigint, date, date, integer, integer, text, text, text, text,
  bigint, text, text, numeric, text, text
) to authenticated, service_role;

revoke all on function public.update_admin_reservation_dates(bigint, date, date, bigint)
from public, anon;
grant execute on function public.update_admin_reservation_dates(bigint, date, date, bigint)
to authenticated, service_role;

commit;
