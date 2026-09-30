-- Public invalidation signal: includes removals/unpublishing without exposing private rows.
begin;

create table if not exists public.portfolio_revision (
  id integer primary key check (id = 1),
  revision bigint not null default 0
);
insert into public.portfolio_revision (id) values (1) on conflict (id) do nothing;
alter table public.portfolio_revision enable row level security;
revoke all on public.portfolio_revision from anon, authenticated;
grant select on public.portfolio_revision to anon, authenticated;
drop policy if exists portfolio_revision_public_read on public.portfolio_revision;
create policy portfolio_revision_public_read on public.portfolio_revision
  for select to anon, authenticated using (true);

create or replace function public.notify_portfolio_change()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.portfolio_revision set revision = revision + 1 where id = 1;
  return null;
end;
$$;
revoke all on function public.notify_portfolio_change() from public, anon, authenticated;
drop trigger if exists client_sites_notify_change on public.client_sites;
create trigger client_sites_notify_change
  after insert or update or delete on public.client_sites
  for each statement execute function public.notify_portfolio_change();

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
    and not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'portfolio_revision'
    ) then
    alter publication supabase_realtime add table public.portfolio_revision;
  end if;
end;
$$;
commit;
