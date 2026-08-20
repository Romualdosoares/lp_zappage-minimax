-- Zap Page: métricas, CRM, financeiro e endurecimento de segurança.
-- Execute uma única vez no SQL Editor do projeto Supabase, antes de publicar o painel.

alter table public.briefings
  add column if not exists pipeline_stage text not null default 'Novo lead';

alter table public.briefings drop constraint if exists briefings_pipeline_stage_check;
alter table public.briefings add constraint briefings_pipeline_stage_check check (
  pipeline_stage in ('Novo lead', 'Contato feito', 'Proposta enviada', 'Pago', 'Briefing', 'Em produção', 'Entregue')
);
create index if not exists briefings_pipeline_stage_updated_at_idx
  on public.briefings(pipeline_stage, updated_at desc);

create table if not exists public.crm_tasks (
  id uuid primary key default gen_random_uuid(),
  briefing_id uuid references public.briefings(id) on delete set null,
  title text not null check (char_length(title) <= 180),
  description text not null default '',
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done', 'cancelled')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  assignee text not null default '',
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists crm_tasks_open_due_at_idx on public.crm_tasks(status, due_at asc);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  briefing_id uuid references public.briefings(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  plan_name text not null default '',
  amount_cents integer not null check (amount_cents >= 0),
  currency text not null default 'BRL' check (currency = 'BRL'),
  status text not null default 'pending' check (status in ('pending', 'paid', 'overdue', 'cancelled', 'refunded', 'failed')),
  provider text not null default 'manual',
  external_id text,
  due_at timestamptz,
  paid_at timestamptz,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(provider, external_id)
);
create index if not exists orders_status_created_at_idx on public.orders(status, created_at desc);
create index if not exists orders_customer_email_idx on public.orders(customer_email);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  provider text not null,
  external_event_id text,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  received_at timestamptz not null default now(),
  unique(provider, external_event_id)
);

drop trigger if exists crm_tasks_touch_updated_at on public.crm_tasks;
create trigger crm_tasks_touch_updated_at before update on public.crm_tasks
for each row execute function public.touch_updated_at();
drop trigger if exists orders_touch_updated_at on public.orders;
create trigger orders_touch_updated_at before update on public.orders
for each row execute function public.touch_updated_at();

alter table public.crm_tasks enable row level security;
alter table public.orders enable row level security;
alter table public.payment_events enable row level security;

drop policy if exists "crm_tasks_admin_all" on public.crm_tasks;
create policy "crm_tasks_admin_all" on public.crm_tasks for all
using (public.is_admin()) with check (public.is_admin());
drop policy if exists "orders_admin_all" on public.orders;
create policy "orders_admin_all" on public.orders for all
using (public.is_admin()) with check (public.is_admin());
drop policy if exists "payment_events_admin_select" on public.payment_events;
create policy "payment_events_admin_select" on public.payment_events for select
using (public.is_admin());

-- Eventos públicos passam pelo endpoint /api/analytics, onde há validação e limitação.
drop policy if exists "analytics_public_insert" on public.analytics_events;
drop policy if exists "analytics_authenticated_insert" on public.analytics_events;
create index if not exists analytics_events_created_event_idx
  on public.analytics_events(created_at desc, event_name);

-- Métricas agregadas: evita transportar todos os eventos para o navegador.
create or replace function public.admin_dashboard_metrics(p_start timestamptz, p_end timestamptz)
returns table (page_views bigint, unique_sessions bigint, plan_clicks bigint, whatsapp_clicks bigint)
language sql
stable
security invoker
set search_path = public
as $$
  select
    count(*) filter (where event_name = 'page_view'),
    count(distinct session_id) filter (where session_id is not null),
    count(*) filter (where event_name = 'plan_click'),
    count(*) filter (where event_name = 'whatsapp_click')
  from public.analytics_events
  where created_at >= coalesce(p_start, now() - interval '30 days')
    and created_at <= coalesce(p_end, now());
$$;
grant execute on function public.admin_dashboard_metrics(timestamptz, timestamptz) to authenticated;

-- Remove promoção automática por e-mail; promova administradores manualmente no SQL Editor.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''), 'client')
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name;
  return new;
end;
$$;

-- Arquivos de briefing deixam de ser públicos. Clientes acessam apenas sua pasta; admins, tudo.
update storage.buckets set public = false where id = 'briefing-assets';
drop policy if exists "briefing_assets_public_read" on storage.objects;
drop policy if exists "briefing_assets_select_own_or_admin" on storage.objects;
create policy "briefing_assets_select_own_or_admin" on storage.objects for select
using (
  bucket_id = 'briefing-assets' and (
    (storage.foldername(name))[1] = auth.uid()::text or public.is_admin()
  )
);
