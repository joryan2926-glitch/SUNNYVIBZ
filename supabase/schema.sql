create extension if not exists "pgcrypto";

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  description text,
  start_date timestamptz not null,
  end_date timestamptz,
  location text,
  image_url text,
  category text,
  price_label text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.artists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  bio text,
  specialty text,
  image_url text,
  instagram_url text,
  website_url text,
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  alt text,
  category text,
  artist_name text,
  sort_order integer not null default 100,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now()
);

create index if not exists events_published_start_date_idx
  on public.events (published, start_date);

create index if not exists artists_published_featured_idx
  on public.artists (published, featured, created_at desc);

create index if not exists gallery_published_sort_idx
  on public.gallery (published, sort_order, created_at desc);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

alter table public.events enable row level security;
alter table public.artists enable row level security;
alter table public.gallery enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "Published events are publicly readable" on public.events;
create policy "Published events are publicly readable"
  on public.events for select
  using (published = true);

drop policy if exists "Published artists are publicly readable" on public.artists;
create policy "Published artists are publicly readable"
  on public.artists for select
  using (published = true);

drop policy if exists "Published gallery items are publicly readable" on public.gallery;
create policy "Published gallery items are publicly readable"
  on public.gallery for select
  using (published = true);

drop policy if exists "Anyone can send contact messages" on public.contact_messages;
create policy "Anyone can send contact messages"
  on public.contact_messages for insert
  with check (status = 'new');

grant usage on schema public to anon, authenticated;
grant select on public.events to anon, authenticated;
grant select on public.artists to anon, authenticated;
grant select on public.gallery to anon, authenticated;
grant insert on public.contact_messages to anon, authenticated;

insert into public.events
  (title, slug, excerpt, description, start_date, location, image_url, category, price_label, published)
values
  (
    'Sunny Friday',
    'sunny-friday',
    'Marché créatif, stands exposants, musique et rencontres artistes.',
    'Un rendez-vous chaleureux pour découvrir des créateurs et vivre l’énergie SUNNYVIBZ.',
    '2026-07-03 18:30:00+02',
    'SUNNYVIBZ Art & Culture',
    '/gallery/marche-createurs.svg',
    'Marché créateurs',
    'Entrée libre',
    true
  ),
  (
    'Atelier peinture & techniques mixtes',
    'atelier-peinture-techniques-mixtes',
    'Un atelier accessible pour explorer couleur, matière et expression personnelle.',
    'Guidé par un artiste invité, cet atelier initie les participants à une pratique créative libre.',
    '2026-07-10 15:00:00+02',
    'Creative Lab',
    '/gallery/atelier-couleurs.svg',
    'Atelier',
    'Sur inscription',
    true
  ),
  (
    'Exposition Couleurs Urbaines',
    'exposition-couleurs-urbaines',
    'Une exposition collective autour de l’énergie urbaine et des cultures visuelles.',
    'Peinture, photographie, illustration et performance réunies pour célébrer la scène artistique locale.',
    '2026-07-18 19:00:00+02',
    'Maison Créative',
    '/gallery/galerie-nocturne.svg',
    'Exposition',
    'Billetterie bientôt',
    true
  )
on conflict (slug) do update set
  excerpt = excluded.excerpt,
  description = excluded.description,
  start_date = excluded.start_date,
  location = excluded.location,
  image_url = excluded.image_url,
  category = excluded.category,
  price_label = excluded.price_label,
  published = excluded.published;

insert into public.artists
  (name, slug, bio, specialty, image_url, instagram_url, website_url, featured, published)
values
  (
    'Maya Sol',
    'maya-sol',
    'Plasticienne solaire, entre abstraction organique, couleurs chaudes et énergie collective.',
    'Peinture & installation',
    '/artists/maya-sol.svg',
    'https://instagram.com/',
    null,
    true,
    true
  ),
  (
    'Noam Vibes',
    'noam-vibes',
    'Photographe documentaire des scènes locales, des coulisses et des visages créatifs.',
    'Photo & culture urbaine',
    '/artists/noam-vibes.svg',
    'https://instagram.com/',
    null,
    true,
    true
  ),
  (
    'Lina Wave',
    'lina-wave',
    'Artiste visuelle et animatrice d’ateliers, spécialisée dans les formats participatifs.',
    'Ateliers & médiation',
    '/artists/lina-wave.svg',
    null,
    'https://sunnyvibz.fr',
    true,
    true
  )
on conflict (slug) do update set
  bio = excluded.bio,
  specialty = excluded.specialty,
  image_url = excluded.image_url,
  instagram_url = excluded.instagram_url,
  website_url = excluded.website_url,
  featured = excluded.featured,
  published = excluded.published;

delete from public.gallery
where title in (
  'Atelier couleurs',
  'Marché créateurs',
  'Galerie nocturne',
  'Scène ouverte',
  'Creative Lab',
  'Communauté Sunny'
);

insert into public.gallery
  (title, image_url, alt, category, artist_name, sort_order, published)
values
  (
    'Atelier couleurs',
    '/gallery/atelier-couleurs.svg',
    'Ambiance artistique SUNNYVIBZ avec lumière émeraude et dorée',
    'Ateliers',
    'SUNNYVIBZ',
    1,
    true
  ),
  (
    'Marché créateurs',
    '/gallery/marche-createurs.svg',
    'Marché créatif SUNNYVIBZ',
    'Sunny Friday',
    'Créateurs locaux',
    2,
    true
  ),
  (
    'Galerie nocturne',
    '/gallery/galerie-nocturne.svg',
    'Galerie nocturne avec lumière néon',
    'Galerie',
    'SUNNYVIBZ',
    3,
    true
  ),
  (
    'Scène ouverte',
    '/gallery/scene-ouverte.svg',
    'Scène ouverte artistique SUNNYVIBZ',
    'Événements',
    'Collectif',
    4,
    true
  ),
  (
    'Creative Lab',
    '/gallery/creative-lab.svg',
    'Creative Lab SUNNYVIBZ pour ateliers et formations',
    'Ateliers',
    'SUNNYVIBZ',
    5,
    true
  ),
  (
    'Communauté Sunny',
    '/gallery/sunny-community.svg',
    'Communauté artistique et culturelle SUNNYVIBZ',
    'Communauté',
    'SUNNYVIBZ',
    6,
    true
  );

notify pgrst, 'reload schema';
