create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_portfolio_admin()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.admin_users where user_id = (select auth.uid()));
$$;
revoke all on function public.is_portfolio_admin() from public;
grant execute on function public.is_portfolio_admin() to anon, authenticated;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(), slug text not null unique,
  full_name text not null, headline text not null default '', introduction text not null default '',
  philosophy text not null default '', location text not null default '', availability text not null default '',
  photo_path text, resume_path text, published boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint profiles_slug_format check (slug ~ '^[a-z0-9-]+$')
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(), slug text not null unique, name text not null,
  category text not null default '', description text not null default '', problem text not null default '',
  solution text not null default '', role text not null default '', technologies text[] not null default '{}',
  status text not null default 'Idea' check (status in ('Idea','Research','In Development','Prototype','Completed','Deployed')),
  github_url text, demo_url text, featured boolean not null default false,
  published boolean not null default false, sort_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint projects_slug_format check (slug ~ '^[a-z0-9-]+$'),
  constraint projects_github_url check (github_url is null or github_url ~ '^https://'),
  constraint projects_demo_url check (demo_url is null or demo_url ~ '^https://')
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(), name text not null, category text not null,
  icon text, featured boolean not null default false, published boolean not null default false,
  sort_order integer not null default 0, created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(), unique (name, category)
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null,
  recognition text not null, organization text not null default '', team text,
  year integer check (year is null or year between 1990 and 2200),
  category text not null check (category in ('Wins','Hackathons','Technical Activities','Workshops','Certifications','Participation')),
  short_description text not null default '', long_description text not null default '',
  review_required boolean not null default false, featured boolean not null default false,
  published boolean not null default false, sort_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint achievements_slug_format check (slug ~ '^[a-z0-9-]+$')
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(), organization text not null, role text not null,
  experience_type text not null check (experience_type in ('Internship','Employment','Freelance','Responsibilities','Technical Volunteering')),
  description text not null default '', start_date date, end_date date, published boolean not null default false,
  sort_order integer not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint experiences_dates_order check (start_date is null or end_date is null or end_date >= start_date)
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(), institution text not null, qualification text not null,
  field_of_study text not null default '', location text not null default '', start_year integer, end_year integer,
  details text not null default '', published boolean not null default false, sort_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint education_years check ((start_year is null or start_year between 1950 and 2200) and (end_year is null or end_year between 1950 and 2200) and (start_year is null or end_year is null or end_year >= start_year))
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(), label text not null, url text not null, icon text,
  published boolean not null default false, sort_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint social_links_url check (url ~ '^https://|^mailto:')
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(), setting_key text not null unique,
  setting_value jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now(),
  constraint site_settings_key_format check (setting_key ~ '^[a-z0-9_]+$')
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(), name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254), subject text not null default '' check (char_length(subject) <= 160),
  message text not null check (char_length(message) between 1 and 5000), is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(), storage_path text not null unique, original_filename text not null,
  mime_type text not null check (mime_type in ('image/jpeg','image/png','image/webp','application/pdf')),
  category text not null check (category in ('profile','resume','certificate','project','event','other')),
  project_id uuid references public.projects (id) on delete set null, alt_text text not null default '',
  published boolean not null default false, created_at timestamptz not null default now(),
  constraint assets_path_safe check (storage_path !~ '(^/|\.\.)')
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(), achievement_id uuid references public.achievements (id) on delete set null,
  asset_id uuid references public.assets (id) on delete set null, title text not null, recognition text not null,
  organization text not null default '', year integer check (year is null or year between 1990 and 2200),
  short_description text not null default '', long_description text not null default '',
  category text not null check (category in ('Wins','Hackathons','Technical Activities','Workshops','Certifications','Participation')),
  review_required boolean not null default false, featured boolean not null default false,
  published boolean not null default false, sort_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create index if not exists projects_public_order_idx on public.projects (published, sort_order);
create index if not exists skills_public_order_idx on public.skills (published, category, sort_order);
create index if not exists achievements_public_order_idx on public.achievements (published, sort_order);
create index if not exists certificates_public_order_idx on public.certificates (published, sort_order);
create index if not exists experiences_public_order_idx on public.experiences (published, sort_order);
create index if not exists education_public_order_idx on public.education (published, sort_order);
create index if not exists contact_messages_created_idx on public.contact_messages (created_at desc);
create index if not exists assets_category_created_idx on public.assets (category, created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = ''
as $$ begin new.updated_at = now(); return new; end; $$;

do $$
declare table_name text;
begin
  foreach table_name in array array['profiles','projects','skills','achievements','experiences','education','social_links','site_settings','certificates'] loop
    execute format('drop trigger if exists set_updated_at on public.%I', table_name);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name);
  end loop;
end;
$$;

alter table public.admin_users enable row level security;
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.achievements enable row level security;
alter table public.experiences enable row level security;
alter table public.education enable row level security;
alter table public.social_links enable row level security;
alter table public.site_settings enable row level security;
alter table public.contact_messages enable row level security;
alter table public.assets enable row level security;
alter table public.certificates enable row level security;

create policy "admins read own allowlist record" on public.admin_users for select to authenticated using (user_id = (select auth.uid()));
create policy "admins manage profiles" on public.profiles for all to authenticated using ((select public.is_portfolio_admin())) with check ((select public.is_portfolio_admin()));
create policy "public read published profiles" on public.profiles for select to anon, authenticated using (published);
create policy "admins manage projects" on public.projects for all to authenticated using ((select public.is_portfolio_admin())) with check ((select public.is_portfolio_admin()));
create policy "public read published projects" on public.projects for select to anon, authenticated using (published);
create policy "admins manage skills" on public.skills for all to authenticated using ((select public.is_portfolio_admin())) with check ((select public.is_portfolio_admin()));
create policy "public read published skills" on public.skills for select to anon, authenticated using (published);
create policy "admins manage achievements" on public.achievements for all to authenticated using ((select public.is_portfolio_admin())) with check ((select public.is_portfolio_admin()));
create policy "public read published achievements" on public.achievements for select to anon, authenticated using (published);
create policy "admins manage experiences" on public.experiences for all to authenticated using ((select public.is_portfolio_admin())) with check ((select public.is_portfolio_admin()));
create policy "public read published experiences" on public.experiences for select to anon, authenticated using (published);
create policy "admins manage education" on public.education for all to authenticated using ((select public.is_portfolio_admin())) with check ((select public.is_portfolio_admin()));
create policy "public read published education" on public.education for select to anon, authenticated using (published);
create policy "admins manage social links" on public.social_links for all to authenticated using ((select public.is_portfolio_admin())) with check ((select public.is_portfolio_admin()));
create policy "public read published social links" on public.social_links for select to anon, authenticated using (published);
create policy "admins manage settings" on public.site_settings for all to authenticated using ((select public.is_portfolio_admin())) with check ((select public.is_portfolio_admin()));
create policy "admins read contact messages" on public.contact_messages for select to authenticated using ((select public.is_portfolio_admin()));
create policy "public submit contact messages" on public.contact_messages for insert to anon, authenticated with check (true);
create policy "admins update contact messages" on public.contact_messages for update to authenticated using ((select public.is_portfolio_admin())) with check ((select public.is_portfolio_admin()));
create policy "admins delete contact messages" on public.contact_messages for delete to authenticated using ((select public.is_portfolio_admin()));
create policy "admins manage assets" on public.assets for all to authenticated using ((select public.is_portfolio_admin())) with check ((select public.is_portfolio_admin()));
create policy "public read published assets" on public.assets for select to anon, authenticated using (published);
create policy "admins manage certificates" on public.certificates for all to authenticated using ((select public.is_portfolio_admin())) with check ((select public.is_portfolio_admin()));
create policy "public read published certificates" on public.certificates for select to anon, authenticated using (published);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-assets', 'portfolio-assets', true, 10485760, array['image/jpeg','image/png','image/webp','application/pdf'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
create policy "public read portfolio assets" on storage.objects for select to anon, authenticated using (bucket_id = 'portfolio-assets');
create policy "admins upload portfolio assets" on storage.objects for insert to authenticated with check (bucket_id = 'portfolio-assets' and (select public.is_portfolio_admin()));
create policy "admins update portfolio assets" on storage.objects for update to authenticated using (bucket_id = 'portfolio-assets' and (select public.is_portfolio_admin())) with check (bucket_id = 'portfolio-assets' and (select public.is_portfolio_admin()));
create policy "admins delete portfolio assets" on storage.objects for delete to authenticated using (bucket_id = 'portfolio-assets' and (select public.is_portfolio_admin()));