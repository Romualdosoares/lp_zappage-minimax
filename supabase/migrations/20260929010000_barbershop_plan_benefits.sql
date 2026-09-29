-- Aplicação pontual da oferta para barbearias. Reversão: docs/barbearias-beneficios.md.
-- Execute como administrador PostgreSQL, após validar em um banco de teste.
begin;

create schema if not exists barbershop_migrations;
revoke all on schema barbershop_migrations from public, anon, authenticated, service_role;

create table if not exists barbershop_migrations.plan_benefits_backup (
  migration_key text primary key,
  before_rows jsonb not null,
  after_rows jsonb not null,
  applied_at timestamptz not null default now(),
  reverted_at timestamptz
);

alter table barbershop_migrations.plan_benefits_backup enable row level security;
revoke all on barbershop_migrations.plan_benefits_backup
  from public, anon, authenticated, service_role;

-- Serializa aplicações concorrentes e impede edições entre os dois snapshots.
lock table public.plan_benefits in share row exclusive mode;

do $migration$
declare
  migration_id constant text := '20260929010000_barbershop_plan_benefits';
  previous_rows jsonb;
  final_rows jsonb;
  replacement record;
  addition record;
begin
  if exists (
    select 1 from barbershop_migrations.plan_benefits_backup
    where migration_key = migration_id
  ) then
    raise notice 'Migração já registrada; nenhum benefício será recriado ou alterado.';
    return;
  end if;

  select coalesce(jsonb_agg(to_jsonb(b) order by b.id), '[]'::jsonb)
  into previous_rows
  from public.plan_benefits b;

  for replacement in
    select * from (values
      ('express', 'Página profissional simples', 'Página profissional para barbearia'),
      ('express', 'Nome, cidade e dados do negócio', 'Nome, cidade e dados da barbearia'),
      ('express', 'Link pronto para divulgar', 'Bio personalizada para o Instagram'),
      ('professional', 'Apresentação do negócio', 'Apresentação da barbearia'),
      ('professional', 'Link pronto para Instagram e anúncios', 'Bio personalizada para o Instagram'),
      ('turbo', '10 criativos para anúncio', '10 arquivos finais de criativos no total, incluindo adaptações')
    ) as replacements(plan_key, old_text, new_text)
  loop
    if exists (
      select 1 from public.plan_benefits b
      where b.plan_key = replacement.plan_key and b.benefit_text = replacement.old_text
    ) and exists (
      select 1 from public.plan_benefits b
      where b.plan_key = replacement.plan_key and b.benefit_text = replacement.new_text
    ) then
      raise warning 'Plano %: textos antigo e novo coexistem. Revise pelo painel: % / %',
        replacement.plan_key, replacement.old_text, replacement.new_text;
    else
      -- Altera apenas o texto padrão exato. O trigger existente atualiza updated_at.
      update public.plan_benefits b
      set benefit_text = replacement.new_text
      where b.plan_key = replacement.plan_key
        and b.benefit_text = replacement.old_text
        and not exists (
          select 1 from public.plan_benefits destination
          where destination.plan_key = replacement.plan_key
            and destination.benefit_text = replacement.new_text
        );
    end if;
  end loop;

  for addition in
    select * from (values
      (1, 'express', 'Bio personalizada para o Instagram'),
      (2, 'professional', 'Bio personalizada para o Instagram'),
      (3, 'professional', '4 arquivos finais de criativos, incluindo adaptações'),
      (4, 'professional', 'Artes para Meta Ads, WhatsApp e Instagram'),
      (5, 'turbo', 'Bio personalizada para o Instagram')
    ) as additions(position, plan_key, benefit_text)
    order by position
  loop
    -- Inclui também registros inativos na checagem: nunca reativa um existente.
    if not exists (
      select 1 from public.plan_benefits b
      where b.plan_key = addition.plan_key and b.benefit_text = addition.benefit_text
    ) then
      insert into public.plan_benefits (plan_key, benefit_text, is_active, sort_order)
      select addition.plan_key, addition.benefit_text, true,
        coalesce(max(b.sort_order), 0) + 10
      from public.plan_benefits b
      where b.plan_key = addition.plan_key
      on conflict (plan_key, benefit_text) do nothing;
    end if;
  end loop;

  select coalesce(jsonb_agg(to_jsonb(b) order by b.id), '[]'::jsonb)
  into final_rows
  from public.plan_benefits b;

  insert into barbershop_migrations.plan_benefits_backup
    (migration_key, before_rows, after_rows)
  values (migration_id, previous_rows, final_rows);
end;
$migration$;

commit;
