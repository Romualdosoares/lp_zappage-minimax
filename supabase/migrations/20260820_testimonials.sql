-- Avaliações autorizadas para a landing page.
-- Execute no SQL Editor do Supabase após a migration operacional.

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

create index if not exists testimonials_published_created_at_idx
  on public.testimonials(is_published, featured desc, created_at desc);

drop trigger if exists testimonials_touch_updated_at on public.testimonials;
create trigger testimonials_touch_updated_at
before update on public.testimonials
for each row execute function public.touch_updated_at();

alter table public.testimonials enable row level security;

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

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
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
