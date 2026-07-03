create extension if not exists pgcrypto;

create table if not exists public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null check (
    char_length(trim(customer_name)) >= 2
    and char_length(trim(customer_name)) <= 80
  ),
  customer_phone text not null check (
    char_length(trim(customer_phone)) >= 7
    and char_length(trim(customer_phone)) <= 30
  ),
  customer_email text check (
    customer_email is null
    or customer_email = ''
    or customer_email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  ),
  business_type text not null check (
    business_type in ('pre_founder', 'sole_proprietor', 'corporation', 'other')
  ),
  inquiry_category text not null check (
    inquiry_category in (
      'government_support',
      'business_plan',
      'management_diagnosis',
      'estimate_request',
      'sales_marketing',
      'other'
    )
  ),
  contact_time text check (
    contact_time is null
    or contact_time in (
      'weekday_morning',
      'weekday_afternoon',
      'weekday_evening',
      'anytime'
    )
  ),
  message text not null check (
    char_length(trim(message)) >= 5
    and char_length(trim(message)) <= 2000
  ),
  privacy_agreed boolean not null default false check (privacy_agreed = true),
  request_status text not null default 'new' check (
    request_status in ('new', 'contacted', 'completed')
  ),
  created_at timestamptz not null default now()
);

alter table public.consultation_requests
  add column if not exists contact_time text;

alter table public.consultation_requests
  drop constraint if exists consultation_requests_inquiry_category_check;

alter table public.consultation_requests
  add constraint consultation_requests_inquiry_category_check
  check (
    inquiry_category in (
      'government_support',
      'business_plan',
      'management_diagnosis',
      'estimate_request',
      'sales_marketing',
      'other'
    )
  );

alter table public.consultation_requests
  drop constraint if exists consultation_requests_contact_time_check;

alter table public.consultation_requests
  add constraint consultation_requests_contact_time_check
  check (
    contact_time is null
    or contact_time in (
      'weekday_morning',
      'weekday_afternoon',
      'weekday_evening',
      'anytime'
    )
  );

alter table public.consultation_requests enable row level security;

grant usage on schema public to anon, authenticated;
grant insert on table public.consultation_requests to anon, authenticated;

drop policy if exists "allow_public_consultation_request_insert"
on public.consultation_requests;

create policy "allow_public_consultation_request_insert"
on public.consultation_requests
for insert
to anon, authenticated
with check (
  privacy_agreed = true
  and request_status = 'new'
);
