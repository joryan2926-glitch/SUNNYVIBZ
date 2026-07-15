-- SUNNYVIBZ — Module 09 : profils utilisateurs avancés
-- À exécuter dans Supabase SQL Editor lorsque le schéma sera validé.

alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists city text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists website_url text;
alter table public.profiles add column if not exists instagram_url text;
alter table public.profiles add column if not exists visibility text not null default 'public' check (visibility in ('public', 'private'));
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

create table if not exists public.profile_media (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  media_type text not null check (media_type in ('image', 'video', 'audio', 'document')),
  media_url text not null,
  title text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.profile_links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  platform text not null,
  url text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.profile_media enable row level security;
alter table public.profile_links enable row level security;

drop policy if exists "profiles_select_public_or_own" on public.profiles;
create policy "profiles_select_public_or_own" on public.profiles for select using (visibility = 'public' or auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profile_media_select_public_or_own" on public.profile_media;
create policy "profile_media_select_public_or_own" on public.profile_media for select using (exists (select 1 from public.profiles p where p.id = profile_id and (p.visibility = 'public' or p.id = auth.uid())));

drop policy if exists "profile_media_manage_own" on public.profile_media;
create policy "profile_media_manage_own" on public.profile_media for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

drop policy if exists "profile_links_select_public_or_own" on public.profile_links;
create policy "profile_links_select_public_or_own" on public.profile_links for select using (exists (select 1 from public.profiles p where p.id = profile_id and (p.visibility = 'public' or p.id = auth.uid())));

drop policy if exists "profile_links_manage_own" on public.profile_links;
create policy "profile_links_manage_own" on public.profile_links for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create index if not exists profile_media_profile_sort_idx on public.profile_media(profile_id, sort_order);
create index if not exists profile_links_profile_idx on public.profile_links(profile_id);

