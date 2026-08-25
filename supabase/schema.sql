-- Zap Page - Supabase schema
-- Cole este arquivo no SQL Editor do Supabase e execute.

create extension if not exists pgcrypto;
create sequence if not exists public.briefing_order_number_seq start with 1001;

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

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  source text not null default 'landing',
  path text,
  label text,
  plan_name text,
  metadata jsonb not null default '{}'::jsonb,
  session_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id text primary key default gen_random_uuid()::text,
  client_name text not null check (char_length(client_name) between 2 and 120),
  business_type text not null check (char_length(business_type) between 2 and 160),
  location text not null default '',
  quote text not null check (char_length(quote) between 3 and 600),
  rating smallint not null default 5 check (rating between 1 and 5),
  photo_url text not null,
  photo_path text not null default '',
  consented_at timestamptz not null,
  is_published boolean not null default false,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists analytics_events_created_at_idx
on public.analytics_events(created_at desc);
create index if not exists analytics_events_event_name_idx
on public.analytics_events(event_name);
create index if not exists analytics_events_session_id_idx
on public.analytics_events(session_id);
create index if not exists testimonials_published_created_at_idx
on public.testimonials(is_published, featured desc, created_at desc);
create index if not exists client_sites_published_created_at_idx
on public.client_sites(is_published, featured desc, created_at desc);
create index if not exists client_sites_landing_idx
on public.client_sites(show_on_landing, is_published, featured desc, created_at desc);

create table if not exists public.briefings (
  id uuid primary key default gen_random_uuid(),
  order_number bigint not null default nextval('public.briefing_order_number_seq'::regclass),
  user_id uuid references auth.users(id) on delete cascade,
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
  logo_file jsonb,
  page_images jsonb not null default '[]'::jsonb,
  required_sections text[] default array['Serviços', 'Diferenciais', 'Contato WhatsApp'],
  reference_links text,
  objections text,
  notes text,
  admin_prompt text,
  status text not null default 'Rascunho',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.briefings
  add column if not exists order_number bigint;
alter table public.briefings
  add column if not exists logo_file jsonb;
alter table public.briefings
  add column if not exists page_images jsonb not null default '[]'::jsonb;
alter table public.briefings
  add column if not exists admin_prompt text;
alter table public.briefings
  alter column user_id drop not null;
alter table public.briefings
  alter column order_number set default nextval('public.briefing_order_number_seq'::regclass);
update public.briefings
set order_number = nextval('public.briefing_order_number_seq'::regclass)
where order_number is null;
alter table public.briefings
  alter column order_number set not null;
alter sequence public.briefing_order_number_seq owned by public.briefings.order_number;
create unique index if not exists briefings_order_number_key
on public.briefings(order_number);

insert into storage.buckets
  (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'briefing-assets',
    'briefing-assets',
    true,
    10485760,
    array['image/png', 'image/jpeg', 'image/webp', 'image/gif']::text[]
  )
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets
  (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'testimonial-assets',
    'testimonial-assets',
    true,
    5242880,
    array['image/png', 'image/jpeg', 'image/webp']::text[]
  )
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

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

drop trigger if exists client_sites_touch_updated_at on public.client_sites;
create trigger client_sites_touch_updated_at
before update on public.client_sites
for each row execute function public.touch_updated_at();

drop trigger if exists briefings_touch_updated_at on public.briefings;
create trigger briefings_touch_updated_at
before update on public.briefings
for each row execute function public.touch_updated_at();

drop trigger if exists testimonials_touch_updated_at on public.testimonials;
create trigger testimonials_touch_updated_at
before update on public.testimonials
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
alter table public.client_sites enable row level security;
alter table public.briefings enable row level security;
alter table public.analytics_events enable row level security;
alter table public.testimonials enable row level security;

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

drop policy if exists "analytics_public_insert" on public.analytics_events;
create policy "analytics_public_insert"
on public.analytics_events for insert
with check (event_name in ('page_view', 'cta_click', 'plan_click', 'whatsapp_click', 'outbound_click'));

drop policy if exists "analytics_admin_select" on public.analytics_events;
create policy "analytics_admin_select"
on public.analytics_events for select
using (public.is_admin());

drop policy if exists "testimonials_public_read_published" on public.testimonials;
create policy "testimonials_public_read_published"
on public.testimonials for select
using (is_published = true or public.is_admin());

drop policy if exists "testimonials_admin_insert" on public.testimonials;
create policy "testimonials_admin_insert"
on public.testimonials for insert
with check (public.is_admin());

drop policy if exists "testimonials_admin_update" on public.testimonials;
create policy "testimonials_admin_update"
on public.testimonials for update
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "testimonials_admin_delete" on public.testimonials;
create policy "testimonials_admin_delete"
on public.testimonials for delete
using (public.is_admin());

drop policy if exists "briefings_select_own_or_admin" on public.briefings;
create policy "briefings_select_own_or_admin"
on public.briefings for select
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "briefings_insert_own" on public.briefings;
create policy "briefings_insert_own"
on public.briefings for insert
with check (user_id = auth.uid());

drop policy if exists "briefings_admin_insert" on public.briefings;
create policy "briefings_admin_insert"
on public.briefings for insert
with check (public.is_admin());

drop policy if exists "briefings_update_own_or_admin" on public.briefings;
create policy "briefings_update_own_or_admin"
on public.briefings for update
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "briefings_admin_delete" on public.briefings;
create policy "briefings_admin_delete"
on public.briefings for delete
using (public.is_admin());

drop policy if exists "briefing_assets_public_read" on storage.objects;
create policy "briefing_assets_public_read"
on storage.objects for select
using (bucket_id = 'briefing-assets');

drop policy if exists "briefing_assets_insert_own_folder" on storage.objects;
create policy "briefing_assets_insert_own_folder"
on storage.objects for insert
with check (
  bucket_id = 'briefing-assets'
  and auth.uid() is not null
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "briefing_assets_update_own_or_admin" on storage.objects;
create policy "briefing_assets_update_own_or_admin"
on storage.objects for update
using (
  bucket_id = 'briefing-assets'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin()
  )
)
with check (
  bucket_id = 'briefing-assets'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin()
  )
);

drop policy if exists "briefing_assets_delete_own_or_admin" on storage.objects;
create policy "briefing_assets_delete_own_or_admin"
on storage.objects for delete
using (
  bucket_id = 'briefing-assets'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin()
  )
);

drop policy if exists "testimonial_assets_public_read" on storage.objects;
create policy "testimonial_assets_public_read"
on storage.objects for select
using (bucket_id = 'testimonial-assets');

drop policy if exists "testimonial_assets_admin_insert" on storage.objects;
create policy "testimonial_assets_admin_insert"
on storage.objects for insert
with check (bucket_id = 'testimonial-assets' and public.is_admin());

drop policy if exists "testimonial_assets_admin_update" on storage.objects;
create policy "testimonial_assets_admin_update"
on storage.objects for update
using (bucket_id = 'testimonial-assets' and public.is_admin())
with check (bucket_id = 'testimonial-assets' and public.is_admin());

drop policy if exists "testimonial_assets_admin_delete" on storage.objects;
create policy "testimonial_assets_admin_delete"
on storage.objects for delete
using (bucket_id = 'testimonial-assets' and public.is_admin());

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

-- Benefícios exibidos nos cards de preço da landing page.
create table if not exists public.plan_benefits (
  id text primary key default gen_random_uuid()::text,
  plan_key text not null check (plan_key in ('express', 'professional', 'turbo')),
  benefit_text text not null check (char_length(btrim(benefit_text)) between 2 and 240),
  is_active boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (plan_key, benefit_text)
);

create index if not exists plan_benefits_plan_order_idx
  on public.plan_benefits(plan_key, sort_order, created_at);

drop trigger if exists plan_benefits_touch_updated_at on public.plan_benefits;
create trigger plan_benefits_touch_updated_at
before update on public.plan_benefits
for each row execute function public.touch_updated_at();

alter table public.plan_benefits replica identity full;
alter table public.plan_benefits enable row level security;

revoke all on public.plan_benefits from anon, authenticated;
grant select on public.plan_benefits to anon, authenticated;
grant insert, update, delete on public.plan_benefits to authenticated;

drop policy if exists "plan_benefits_public_read" on public.plan_benefits;
create policy "plan_benefits_public_read"
on public.plan_benefits for select
to anon, authenticated
using (true);

drop policy if exists "plan_benefits_admin_insert" on public.plan_benefits;
create policy "plan_benefits_admin_insert"
on public.plan_benefits for insert
to authenticated
with check (public.is_admin());

drop policy if exists "plan_benefits_admin_update" on public.plan_benefits;
create policy "plan_benefits_admin_update"
on public.plan_benefits for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "plan_benefits_admin_delete" on public.plan_benefits;
create policy "plan_benefits_admin_delete"
on public.plan_benefits for delete
to authenticated
using (public.is_admin());

insert into public.plan_benefits (plan_key, benefit_text, is_active, sort_order)
values
  ('express', 'Página profissional simples', true, 10),
  ('express', 'Botão direto para WhatsApp', true, 20),
  ('express', 'Nome, cidade e dados do negócio', true, 30),
  ('express', 'Lista básica de serviços', true, 40),
  ('express', 'Visual moderno', true, 50),
  ('express', 'Otimizada para celular', true, 60),
  ('express', 'Link pronto para divulgar', true, 70),
  ('express', 'Suporte técnico inicial', true, 80),
  ('express', '3 revisões incluídas', true, 90),
  ('professional', 'Página profissional completa', true, 10),
  ('professional', 'Apresentação do negócio', true, 20),
  ('professional', 'Seção de serviços', true, 30),
  ('professional', 'Seção de diferenciais', true, 40),
  ('professional', 'Copy persuasiva', true, 50),
  ('professional', 'Botões estratégicos de WhatsApp', true, 60),
  ('professional', 'Design premium', true, 70),
  ('professional', 'Otimizada para celular', true, 80),
  ('professional', 'Link pronto para Instagram e anúncios', true, 90),
  ('professional', 'Suporte técnico', true, 100),
  ('professional', '3 revisões incluídas', true, 110),
  ('professional', 'Suporte comercial guiado por 30 dias', true, 120),
  ('professional', 'Orientação passo a passo para divulgação', true, 130),
  ('turbo', 'Tudo do plano Profissional', true, 10),
  ('turbo', 'Página com estrutura mais persuasiva', true, 20),
  ('turbo', 'Copy de venda aprimorada', true, 30),
  ('turbo', '10 criativos para anúncio', true, 40),
  ('turbo', 'Texto principal para Facebook/Instagram Ads', true, 50),
  ('turbo', 'Título e descrição para anúncio', true, 60),
  ('turbo', 'Direcionamento inicial para campanha', true, 70),
  ('turbo', 'Estrutura premium para tráfego pago', true, 80),
  ('turbo', 'Suporte técnico', true, 90),
  ('turbo', '3 revisões incluídas', true, 100),
  ('turbo', 'Suporte comercial guiado por 30 dias', true, 110),
  ('turbo', 'Acompanhamento passo a passo', true, 120)
on conflict (plan_key, benefit_text) do nothing;

do $$
begin
  if exists (
    select 1 from pg_publication where pubname = 'supabase_realtime'
  ) and not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'plan_benefits'
  ) then
    alter publication supabase_realtime add table public.plan_benefits;
  end if;
end
$$;
