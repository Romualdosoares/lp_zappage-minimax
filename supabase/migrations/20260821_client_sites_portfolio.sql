-- Portfólio público de sites criados para clientes.
-- Execute uma única vez no SQL Editor do Supabase.

create extension if not exists pgcrypto;

create table if not exists public.client_sites (
  id text primary key default gen_random_uuid()::text,
  company_name text not null check (char_length(company_name) between 2 and 160),
  site_url text not null check (site_url ~* '^https?://'),
  is_published boolean not null default true,
  featured boolean not null default false,
  show_on_landing boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists client_sites_published_created_at_idx
  on public.client_sites(is_published, featured desc, created_at desc);

create index if not exists client_sites_landing_idx
  on public.client_sites(show_on_landing, is_published, featured desc, created_at desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists client_sites_touch_updated_at on public.client_sites;
create trigger client_sites_touch_updated_at
before update on public.client_sites
for each row execute function public.touch_updated_at();

alter table public.client_sites enable row level security;

drop policy if exists "client_sites_public_read_published" on public.client_sites;
create policy "client_sites_public_read_published"
on public.client_sites for select
using (is_published = true or public.is_admin());

drop policy if exists "client_sites_admin_insert" on public.client_sites;
create policy "client_sites_admin_insert"
on public.client_sites for insert
with check (public.is_admin());

drop policy if exists "client_sites_admin_update" on public.client_sites;
create policy "client_sites_admin_update"
on public.client_sites for update
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "client_sites_admin_delete" on public.client_sites;
create policy "client_sites_admin_delete"
on public.client_sites for delete
using (public.is_admin());
