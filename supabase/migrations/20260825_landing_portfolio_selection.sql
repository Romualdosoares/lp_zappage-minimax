-- Seleção dos projetos que aparecem na seção Portfólio da landing page.
-- Execute uma única vez no SQL Editor do Supabase.

alter table public.client_sites
  add column if not exists show_on_landing boolean not null default false;

create index if not exists client_sites_landing_idx
  on public.client_sites(show_on_landing, is_published, featured desc, created_at desc);
