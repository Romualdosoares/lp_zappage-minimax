# Benefícios dos planos para barbearias

## Contrato e verificação antes de aplicar

A migração `supabase/migrations/20260929010000_barbershop_plan_benefits.sql` altera somente textos padrão conhecidos e acrescenta os novos benefícios aprovados. Os registros continuam na tabela `public.plan_benefits`, editáveis pelo mesmo painel. Preços, permissões do painel, realtime e filtro de benefícios ativos não mudam.

As substituições são exatas: “Página profissional simples” por “Página profissional para barbearia”; “Nome, cidade e dados do negócio” por “Nome, cidade e dados da barbearia”; “Apresentação do negócio” por “Apresentação da barbearia”. No Express e no Profissional, os antigos benefícios de link dão lugar a “Bio personalizada para o Instagram”, mantendo sua posição e estado ativo. Essa bio é a página separada descrita na oferta, com Contato e Agendamento; não é somente o texto do perfil. No Turbo, “10 criativos para anúncio” passa a “10 arquivos finais de criativos no total, incluindo adaptações”.

São acrescentados a bio nos planos em que o texto exato ainda não existe e, no Profissional, “4 arquivos finais de criativos, incluindo adaptações” e “Artes para Meta Ads, WhatsApp e Instagram”. Textos personalizados de criativos no Turbo não são substituídos nem recebem uma promessa adicional automática; revise-os pelo painel. As 10 unidades do Turbo são o total, não 10 mais as 4 do Profissional.

Validar em um banco PostgreSQL descartável com a tabela e o trigger originais antes de aplicar ao Supabase. Casos obrigatórios:

1. Os três planos recebem uma página personalizada para a bio do Instagram. O Profissional recebe 4 arquivos finais de criativos. O Turbo passa de 10 criativos para 10 arquivos finais no total, incluindo adaptações.
2. Os textos padrão substituídos mantêm ID, `is_active`, `sort_order` e `created_at`. O trigger pode atualizar `updated_at`.
3. Textos personalizados, benefícios inativos e ordem definida pelo administrador permanecem. A migração não tenta reconhecer textos personalizados por semelhança.
4. Quando o texto novo já existe, não deve ocorrer violação de unicidade nem reativação. Se também existir o texto antigo, ambos permanecem e um aviso indica a revisão manual necessária.
5. Reexecutar a migração não muda dados. Excluir um benefício acrescentado e reexecutar também não o recria.
6. A reversão restaura somente os textos alterados e remove somente os registros inseridos pela migração. Outros benefícios não mudam.
7. A reversão deve abortar integralmente se algum registro afetado tiver sido editado ou excluído depois da aplicação, ou se o texto anterior agora conflitar com outro registro.
8. `anon`, `authenticated` e `service_role` não podem consultar o backup privado. A leitura e edição existentes em `public.plan_benefits` continuam funcionando.

## Aplicação

1. Confira o projeto Supabase de destino e exporte os benefícios atuais pelo procedimento operacional habitual.
2. Revise os textos da migração e a lista atual do painel, principalmente benefícios personalizados que já possam descrever bio ou criativos.
3. Execute o arquivo completo usando uma conexão administrativa PostgreSQL ou o SQL Editor do Supabase. Não use a chave pública do frontend. O arquivo contém sua própria transação.
4. Confira os avisos, os três planos na página e a edição pelo painel. Novos benefícios entram ativos, ao final de cada plano, sem reordenar os anteriores.

Não reexecute `schema.sql` nem a carga inicial histórica sobre produção: textos antigos podem ser reinseridos, pois a chave única contém o texto do benefício.

A tabela privada guarda os estados anteriores e posteriores e um marcador único. Esse marcador impede nova aplicação mesmo se um benefício for posteriormente editado, desativado ou excluído. O backup não é publicado no realtime. A migração mantém um bloqueio de escrita breve durante a alteração; execute em um momento adequado.

## Reversão

O procedimento abaixo exige a mesma conexão administrativa. Ele conserva o backup e registra a reversão. Não reaplique a oferta apagando o marcador: prepare outra migração se for necessário.

Se a comparação detectar uma edição posterior, nada será revertido. Revise o caso manualmente pelo painel, usando o backup como referência. O procedimento não desabilita triggers: os textos restaurados recebem um novo `updated_at`.

```sql
begin;
lock table public.plan_benefits in share row exclusive mode;

do $rollback$
declare
  migration_id constant text := '20260929010000_barbershop_plan_benefits';
  backup_row barbershop_migrations.plan_benefits_backup%rowtype;
  changed record;
  current_row jsonb;
begin
  select * into backup_row
  from barbershop_migrations.plan_benefits_backup
  where migration_key = migration_id
  for update;

  if not found then
    raise exception 'Backup da migração não encontrado. Nenhum dado foi revertido.';
  end if;
  if backup_row.reverted_at is not null then
    raise notice 'Reversão já registrada. Nenhum dado foi alterado.';
    return;
  end if;

  -- Verifica todos os registros afetados antes de realizar qualquer alteração.
  for changed in
    select a.value as after_row, p.value as before_row
    from jsonb_array_elements(backup_row.after_rows) a(value)
    left join jsonb_array_elements(backup_row.before_rows) p(value)
      on p.value->>'id' = a.value->>'id'
    where p.value is distinct from a.value
  loop
    select to_jsonb(b) into current_row
    from public.plan_benefits b
    where b.id = changed.after_row->>'id';

    if current_row is distinct from changed.after_row then
      raise exception 'Benefício % foi editado ou excluído após a migração. Reversão cancelada.',
        changed.after_row->>'id';
    end if;

    if changed.before_row is not null and exists (
      select 1 from public.plan_benefits b
      where b.plan_key = changed.before_row->>'plan_key'
        and b.benefit_text = changed.before_row->>'benefit_text'
        and b.id <> changed.before_row->>'id'
    ) then
      raise exception 'O texto anterior do benefício % conflita com outro registro. Reversão cancelada.',
        changed.before_row->>'id';
    end if;
  end loop;

  for changed in
    select a.value as after_row, p.value as before_row
    from jsonb_array_elements(backup_row.after_rows) a(value)
    left join jsonb_array_elements(backup_row.before_rows) p(value)
      on p.value->>'id' = a.value->>'id'
    where p.value is distinct from a.value
  loop
    if changed.before_row is null then
      delete from public.plan_benefits
      where id = changed.after_row->>'id';
    else
      update public.plan_benefits
      set benefit_text = changed.before_row->>'benefit_text'
      where id = changed.before_row->>'id';
    end if;
  end loop;

  update barbershop_migrations.plan_benefits_backup
  set reverted_at = now()
  where migration_key = migration_id;
end;
$rollback$;

commit;
```

## Validação realizada no desenvolvimento

Revisão estática dos predicados, preservação de campos, tratamento de unicidade, transação, marcador, permissões e reversão. Não há `psql`, Docker ou Supabase CLI disponíveis no PATH deste ambiente. Não foi executado PostgreSQL nem acessado o Supabase de produção. A revisão estática não substitui os oito casos acima em um banco de teste.
