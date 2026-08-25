-- Benefícios editáveis dos três planos exibidos na landing page.
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
