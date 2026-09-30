begin;
alter table public.client_sites
  add column if not exists image_url text not null default '',
  add column if not exists image_kind text not null default 'logo';

alter table public.client_sites drop constraint if exists client_sites_image_kind_check;
alter table public.client_sites add constraint client_sites_image_kind_check
  check (image_kind in ('logo', 'preview'));
alter table public.client_sites drop constraint if exists client_sites_image_url_check;
alter table public.client_sites add constraint client_sites_image_url_check
  check (image_url = '' or image_url ~* '^https?://');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-images', 'portfolio-images', true, 5242880, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do update set public = excluded.public,
  file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists portfolio_images_public_read on storage.objects;
create policy portfolio_images_public_read on storage.objects for select
  using (bucket_id = 'portfolio-images');
drop policy if exists portfolio_images_admin_insert on storage.objects;
create policy portfolio_images_admin_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio-images' and public.is_admin());
drop policy if exists portfolio_images_admin_update on storage.objects;
create policy portfolio_images_admin_update on storage.objects for update to authenticated
  using (bucket_id = 'portfolio-images' and public.is_admin())
  with check (bucket_id = 'portfolio-images' and public.is_admin());
drop policy if exists portfolio_images_admin_delete on storage.objects;
create policy portfolio_images_admin_delete on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio-images' and public.is_admin());
commit;
