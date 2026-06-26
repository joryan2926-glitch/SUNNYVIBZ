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
  with check (true);

insert into public.events
  (title, slug, excerpt, description, start_date, location, category, price_label, published)
values
  (
    'Sunny Friday',
    'sunny-friday',
    'Marché créatif, stands exposants, musique et rencontres artistes.',
    'Un rendez-vous chaleureux pour découvrir des créateurs et vivre l’énergie SUNNYVIBZ.',
    '2026-07-03 18:30:00+02',
    'SUNNYVIBZ Art & Culture',
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
    'Atelier',
    'Sur inscription',
    true
  )
on conflict (slug) do nothing;

insert into public.artists
  (name, slug, bio, specialty, instagram_url, website_url, featured, published)
values
  (
    'Maya Sol',
    'maya-sol',
    'Plasticienne solaire, entre abstraction organique, couleurs chaudes et énergie collective.',
    'Peinture & installation',
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
    'https://instagram.com/',
    null,
    true,
    true
  )
on conflict (slug) do nothing;

insert into public.gallery
  (title, image_url, alt, category, artist_name, sort_order, published)
values
  (
    'Atelier couleurs',
    '/sunnyvibz-hero.svg',
    'Ambiance artistique SUNNYVIBZ avec lumière émeraude et dorée',
    'Ateliers',
    'SUNNYVIBZ',
    1,
    true
  ),
  (
    'Marché créateurs',
    '/sunnyvibz-hero.svg',
    'Marché créatif SUNNYVIBZ',
    'Sunny Friday',
    'Créateurs locaux',
    2,
    true
  );
