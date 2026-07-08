-- Zap Page - Supabase schema
-- Cole este arquivo no SQL Editor do Supabase e execute.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'client' check (role in ('client', 'admin', 'master_admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check check (role in ('client', 'admin', 'master_admin'));

create table if not exists public.portfolio_services (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  niche text,
  price text,
  status text not null default 'Ativo',
  featured boolean not null default false,
  description text,
  deliverables text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.briefings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  business_name text,
  owner_name text,
  email text not null,
  whatsapp text,
  city text,
  niche text,
  instagram text,
  current_website text,
  plan_interest text default 'Página Profissional',
  main_goal text,
  audience text,
  services text,
  differentials text,
  prices text,
  service_area text,
  tone text default 'Profissional e direto',
  brand_colors text,
  logo_status text default 'Tenho logo',
  photos_status text default 'Tenho fotos',
  required_sections text[] default array['Serviços', 'Diferenciais', 'Contato WhatsApp'],
  references text,
  objections text,
  notes text,
  status text not null default 'Rascunho',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists portfolio_services_touch_updated_at on public.portfolio_services;
create trigger portfolio_services_touch_updated_at
before update on public.portfolio_services
for each row execute function public.touch_updated_at();

drop trigger if exists briefings_touch_updated_at on public.briefings;
create trigger briefings_touch_updated_at
before update on public.briefings
for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    case
      when lower(new.email) = 'romualdormd@hotmail.com' then 'master_admin'
      else 'client'
    end
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name,
        role = case
          when lower(excluded.email) = 'romualdormd@hotmail.com' then 'master_admin'
          else public.profiles.role
        end;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'master_admin')
  );
$$;

alter table public.profiles enable row level security;
alter table public.portfolio_services enable row level security;
alter table public.briefings enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles for select
using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid() and role = 'client');

drop policy if exists "portfolio_public_read_active" on public.portfolio_services;
create policy "portfolio_public_read_active"
on public.portfolio_services for select
using (status = 'Ativo' or public.is_admin());

drop policy if exists "portfolio_admin_insert" on public.portfolio_services;
create policy "portfolio_admin_insert"
on public.portfolio_services for insert
with check (public.is_admin());

drop policy if exists "portfolio_admin_update" on public.portfolio_services;
create policy "portfolio_admin_update"
on public.portfolio_services for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "portfolio_admin_delete" on public.portfolio_services;
create policy "portfolio_admin_delete"
on public.portfolio_services for delete
using (public.is_admin());

drop policy if exists "briefings_select_own_or_admin" on public.briefings;
create policy "briefings_select_own_or_admin"
on public.briefings for select
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "briefings_insert_own" on public.briefings;
create policy "briefings_insert_own"
on public.briefings for insert
with check (user_id = auth.uid());

drop policy if exists "briefings_update_own_or_admin" on public.briefings;
create policy "briefings_update_own_or_admin"
on public.briefings for update
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

insert into public.portfolio_services
  (id, title, niche, price, status, featured, description, deliverables)
values
  (
    'portfolio-landing-whatsapp',
    'Página profissional com WhatsApp',
    'Negócios locais',
    'A partir de R$197',
    'Ativo',
    true,
    'Estrutura simples, rápida e otimizada para transformar visitas em conversas pelo WhatsApp.',
    'Hero, serviços, diferenciais, planos, FAQ e botões de WhatsApp.'
  ),
  (
    'portfolio-premium-local',
    'Landing premium para atendimento local',
    'Clínicas, salões, assistências e prestadores',
    'A partir de R$297',
    'Ativo',
    true,
    'Página com visual premium, copy direta e organização clara para passar mais confiança.',
    'Copy completa, seções comerciais, CTA mobile e suporte guiado.'
  ),
  (
    'portfolio-ads-ready',
    'Página pronta para anúncios',
    'Tráfego pago',
    'A partir de R$497',
    'Ativo',
    false,
    'Estrutura mais persuasiva para receber campanhas e direcionar o cliente ao WhatsApp.',
    'Página, copy aprimorada, criativos e direcionamento inicial.'
  )
on conflict (id) do update set
  title = excluded.title,
  niche = excluded.niche,
  price = excluded.price,
  status = excluded.status,
  featured = excluded.featured,
  description = excluded.description,
  deliverables = excluded.deliverables;

insert into public.profiles (id, email, full_name, role)
select
  id,
  email,
  coalesce(raw_user_meta_data->>'full_name', ''),
  'master_admin'
from auth.users
where lower(email) = 'romualdormd@hotmail.com'
on conflict (id) do update set
  email = excluded.email,
  full_name = excluded.full_name,
  role = 'master_admin';
