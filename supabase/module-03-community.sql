-- Module 03 - SUNNY Community
-- A exécuter plus tard dans Supabase > SQL Editor.
-- Ce script ajoute les profils communautaires publics et un fil d'annonces simple.

create extension if not exists "pgcrypto";

create table if not exists public.community_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  display_name text not null,
  slug text not null unique,
  headline text,
  bio text,
  avatar_url text,
  profile_type text not null default 'adherent'
    check (profile_type in ('adherent', 'artiste', 'association', 'entreprise', 'partenaire', 'benevole', 'admin')),
  roles text[] not null default array['Adhérent']::text[],
  location text,
  skills text[] not null default array[]::text[],
  needs text[] not null default array[]::text[],
  status text not null default 'active'
    check (status in ('active', 'inactive')),
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  author_user_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  author_role text,
  title text not null,
  content text not null,
  category text,
  call_to_action_label text,
  call_to_action_href text,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists community_profiles_published_status_idx
  on public.community_profiles (published, status, featured, created_at desc);

create index if not exists community_posts_published_created_at_idx
  on public.community_posts (published, created_at desc);

alter table public.community_profiles enable row level security;
alter table public.community_posts enable row level security;

drop policy if exists "Community profiles are readable when published" on public.community_profiles;
create policy "Community profiles are readable when published"
on public.community_profiles
for select
using (published = true and status = 'active');

drop policy if exists "Users can create their community profile" on public.community_profiles;
create policy "Users can create their community profile"
on public.community_profiles
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "Users can update their community profile" on public.community_profiles;
create policy "Users can update their community profile"
on public.community_profiles
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Admins can manage community profiles" on public.community_profiles;
create policy "Admins can manage community profiles"
on public.community_profiles
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_admin = true
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_admin = true
  )
);

drop policy if exists "Community posts are readable when published" on public.community_posts;
create policy "Community posts are readable when published"
on public.community_posts
for select
using (published = true);

drop policy if exists "Users can create community posts" on public.community_posts;
create policy "Users can create community posts"
on public.community_posts
for insert
to authenticated
with check (author_user_id = auth.uid());

drop policy if exists "Users can update their community posts" on public.community_posts;
create policy "Users can update their community posts"
on public.community_posts
for update
to authenticated
using (author_user_id = auth.uid())
with check (author_user_id = auth.uid());

drop policy if exists "Admins can manage community posts" on public.community_posts;
create policy "Admins can manage community posts"
on public.community_posts
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_admin = true
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_admin = true
  )
);

insert into public.community_profiles (
  display_name,
  slug,
  headline,
  bio,
  avatar_url,
  profile_type,
  roles,
  location,
  skills,
  needs,
  featured,
  published
) values
  (
    'Maya Sol',
    'maya-sol-community',
    'Peinture, installation et univers solaire',
    'Maya transforme la couleur en expérience sensible. Elle intervient sur les expositions, ateliers participatifs et projets visuels SUNNYVIBZ.',
    '/artists/maya-sol.svg',
    'artiste',
    array['Artiste', 'Adhérente', 'Ambassadrice']::text[],
    'Maison Créative',
    array['Peinture', 'Installation', 'Ateliers']::text[],
    array['Expositions', 'Commandes', 'Partenaires']::text[],
    true,
    true
  ),
  (
    'Noam Vibes',
    'noam-vibes-community',
    'Photo, contenus sociaux et culture urbaine',
    'Noam capte les coulisses, les portraits et les moments forts. Son profil prépare les futures offres photo et vidéo du SUNNY Market.',
    '/artists/noam-vibes.svg',
    'artiste',
    array['Photographe', 'Créateur', 'Partenaire']::text[],
    'Creative Lab',
    array['Photo', 'Vidéo', 'Portfolio']::text[],
    array['Modèles', 'Événements', 'Collaborations']::text[],
    true,
    true
  ),
  (
    'Collectif Sunilounge',
    'collectif-sunilounge',
    'Rencontres, médiation et projets associatifs',
    'Un collectif ouvert pour animer les temps communautaires, accueillir les nouveaux membres et connecter les initiatives locales.',
    '/gallery/sunny-community.svg',
    'association',
    array['Association', 'Bénévoles', 'Partenaire']::text[],
    'Sunilounge',
    array['Médiation', 'Accueil', 'Coordination']::text[],
    array['Bénévoles', 'Animateurs', 'Sponsors']::text[],
    true,
    true
  ),
  (
    'Lina Wave',
    'lina-wave-community',
    'Ateliers créatifs et transmission',
    'Lina conçoit des formats simples, beaux et participatifs pour initier les publics à la création visuelle.',
    '/artists/lina-wave.svg',
    'artiste',
    array['Animatrice', 'Artiste', 'Adhérente']::text[],
    'Creative Lab',
    array['Animation', 'Design', 'Formation']::text[],
    array['Groupes', 'Écoles', 'Entreprises']::text[],
    true,
    true
  )
on conflict (slug) do update set
  headline = excluded.headline,
  bio = excluded.bio,
  avatar_url = excluded.avatar_url,
  profile_type = excluded.profile_type,
  roles = excluded.roles,
  location = excluded.location,
  skills = excluded.skills,
  needs = excluded.needs,
  featured = excluded.featured,
  published = excluded.published;

insert into public.community_posts (
  author_name,
  author_role,
  title,
  content,
  category,
  call_to_action_label,
  call_to_action_href,
  published
) values
  (
    'Équipe SUNNYVIBZ',
    'Administration',
    'Recherche bénévoles pour Sunny Friday',
    'Nous préparons le prochain marché créatif. Besoin de bénévoles pour l’accueil, l’installation, l’orientation public et les contenus photos.',
    'Bénévolat',
    'Proposer son aide',
    '/contact',
    true
  ),
  (
    'Maison Créative',
    'Programmation',
    'Appel à talents : Couleurs Urbaines',
    'Peinture, photo, sculpture, musique, performance : les talents actifs peuvent proposer une création ou une mini-exposition.',
    'Appel à artistes',
    'Voir les talents',
    '/talents',
    true
  ),
  (
    'SUNNY Market',
    'Marketplace',
    'Préparation des premières offres Market',
    'Les profils actifs peuvent commencer à lister leurs prestations : photo, atelier, œuvre, animation, service créatif ou accompagnement.',
    'Market',
    'Découvrir le Market',
    '/marketplace',
    true
  )
on conflict do nothing;
