-- Google Analytics attribution support for website reservations.

alter table public.reservations
  add column if not exists ga_client_id text,
  add column if not exists ga_session_id text,
  add column if not exists attribution_captured_at timestamptz,
  add column if not exists confirmed_conversion_sent_at timestamptz;

create or replace function public.create_public_reservation_v6(
  p_accommodation_id bigint,
  p_check_in date,
  p_check_out date,
  p_adult_count integer,
  p_child_count integer,
  p_guest_name text,
  p_guest_identity_number text,
  p_guest_phone text,
  p_guest_email text,
  p_requested_bed_configuration text,
  p_ga_client_id text default null,
  p_ga_session_id text default null
)
returns table(
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
set search_path = pg_catalog, public, auth
set "TimeZone" = 'Europe/Istanbul'
as $function$
declare
  v_result record;
  v_ga_client_id text := nullif(trim(p_ga_client_id), '');
  v_ga_session_id text := nullif(trim(p_ga_session_id), '');
begin
  if v_ga_client_id is not null and length(v_ga_client_id) > 255 then
    raise exception 'Analytics client kimliği geçersiz.';
  end if;

  if v_ga_session_id is not null and length(v_ga_session_id) > 255 then
    raise exception 'Analytics session kimliği geçersiz.';
  end if;

  select *
  into v_result
  from public.create_public_reservation_v5(
    p_accommodation_id => p_accommodation_id,
    p_check_in => p_check_in,
    p_check_out => p_check_out,
    p_adult_count => p_adult_count,
    p_child_count => p_child_count,
    p_guest_name => p_guest_name,
    p_guest_identity_number => p_guest_identity_number,
    p_guest_phone => p_guest_phone,
    p_guest_email => p_guest_email,
    p_requested_bed_configuration => p_requested_bed_configuration
  );

  if v_result.reservation_id is null then
    raise exception 'Rezervasyon oluşturulamadı.';
  end if;

  update public.reservations
  set
    ga_client_id = v_ga_client_id,
    ga_session_id = v_ga_session_id,
    attribution_captured_at = case
      when v_ga_client_id is not null then now()
      else null
    end
  where id = v_result.reservation_id;

  return query
  select
    v_result.reservation_id::bigint,
    v_result.reservation_code::text,
    v_result.accommodation_title::text,
    v_result.night_count::integer,
    v_result.total_price::numeric,
    v_result.deposit_target_amount::numeric,
    v_result.amount_due_now::numeric,
    v_result.remaining_payment_amount::numeric;
end;
$function$;

revoke all
on function public.create_public_reservation_v6(
  bigint,
  date,
  date,
  integer,
  integer,
  text,
  text,
  text,
  text,
  text,
  text,
  text
)
from public;

grant execute
on function public.create_public_reservation_v6(
  bigint,
  date,
  date,
  integer,
  integer,
  text,
  text,
  text,
  text,
  text,
  text,
  text
)
to anon, authenticated, service_role;