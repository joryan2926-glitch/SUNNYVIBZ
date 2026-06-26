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
  status text not null default 'active' check (status in ('active', 'inactive')),
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

alter table public.artists
  add column if not exists status text not null default 'active' check (status in ('active', 'inactive'));

create table if not exists public.workshops (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  image_url text,
  start_date timestamptz not null,
  location text not null,
  price_label text not null default 'Sur inscription',
  capacity integer not null default 0 check (capacity >= 0),
  seats_remaining integer not null default 0 check (seats_remaining >= 0),
  status text not null default 'available' check (status in ('available', 'full', 'cancelled')),
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.workshop_bookings (
  id uuid primary key default gen_random_uuid(),
  workshop_id uuid not null references public.workshops(id) on delete cascade,
  workshop_title text not null,
  workshop_date timestamptz not null,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.sunny_friday_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  project_name text not null,
  discipline text,
  needs text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'refused', 'archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  image_url text,
  category text,
  author text not null default 'SUNNYVIBZ',
  published_at timestamptz,
  content text not null,
  status text not null default 'draft' check (status in ('published', 'draft')),
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  roles text[] not null default array['adherent']::text[],
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  price_label text not null,
  benefits text[] not null default '{}',
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.user_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subscription_id uuid not null references public.subscriptions(id) on delete restrict,
  status text not null default 'active' check (status in ('active', 'past_due', 'cancelled', 'expired')),
  started_at timestamptz not null default now(),
  ends_at timestamptz,
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

create index if not exists workshops_published_start_date_idx
  on public.workshops (published, start_date);

create index if not exists workshop_bookings_workshop_idx
  on public.workshop_bookings (workshop_id, created_at desc);

create index if not exists workshop_bookings_user_email_idx
  on public.workshop_bookings (user_id, lower(email), created_at desc);

create index if not exists sunny_friday_applications_status_idx
  on public.sunny_friday_applications (status, created_at desc);

create index if not exists articles_status_published_at_idx
  on public.articles (status, published_at desc);

create index if not exists subscriptions_active_featured_idx
  on public.subscriptions (active, featured, created_at);

create index if not exists user_subscriptions_user_idx
  on public.user_subscriptions (user_id, status);

alter table public.events enable row level security;
alter table public.artists enable row level security;
alter table public.gallery enable row level security;
alter table public.contact_messages enable row level security;
alter table public.workshops enable row level security;
alter table public.workshop_bookings enable row level security;
alter table public.sunny_friday_applications enable row level security;
alter table public.articles enable row level security;
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.user_subscriptions enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and is_admin = true
  );
$$;

drop policy if exists "Published events are publicly readable" on public.events;
create policy "Published events are publicly readable"
  on public.events for select
  using (published = true);

drop policy if exists "Admins can manage events" on public.events;
create policy "Admins can manage events"
  on public.events for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Published artists are publicly readable" on public.artists;
create policy "Published artists are publicly readable"
  on public.artists for select
  using (published = true and status = 'active');

drop policy if exists "Admins can manage artists" on public.artists;
create policy "Admins can manage artists"
  on public.artists for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Published gallery items are publicly readable" on public.gallery;
create policy "Published gallery items are publicly readable"
  on public.gallery for select
  using (published = true);

drop policy if exists "Admins can manage gallery" on public.gallery;
create policy "Admins can manage gallery"
  on public.gallery for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Anyone can send contact messages" on public.contact_messages;
create policy "Anyone can send contact messages"
  on public.contact_messages for insert
  with check (status = 'new');

drop policy if exists "Published workshops are publicly readable" on public.workshops;
create policy "Published workshops are publicly readable"
  on public.workshops for select
  using (published = true);

drop policy if exists "Admins can manage workshops" on public.workshops;
create policy "Admins can manage workshops"
  on public.workshops for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Anyone can create workshop bookings" on public.workshop_bookings;
create policy "Anyone can create workshop bookings"
  on public.workshop_bookings for insert
  with check (
    status = 'pending'
    and name <> ''
    and email <> ''
    and (user_id is null or user_id = auth.uid())
  );

drop policy if exists "Users can read their workshop bookings" on public.workshop_bookings;
create policy "Users can read their workshop bookings"
  on public.workshop_bookings for select
  using (
    public.is_admin()
    or (
      auth.role() = 'authenticated'
      and (
        user_id = auth.uid()
        or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
    )
  );

drop policy if exists "Admins can manage workshop bookings" on public.workshop_bookings;
create policy "Admins can manage workshop bookings"
  on public.workshop_bookings for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Anyone can create Sunny Friday applications" on public.sunny_friday_applications;
create policy "Anyone can create Sunny Friday applications"
  on public.sunny_friday_applications for insert
  with check (status = 'pending' and name <> '' and email <> '' and project_name <> '');

drop policy if exists "Admins can manage Sunny Friday applications" on public.sunny_friday_applications;
create policy "Admins can manage Sunny Friday applications"
  on public.sunny_friday_applications for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Published articles are publicly readable" on public.articles;
create policy "Published articles are publicly readable"
  on public.articles for select
  using (status = 'published');

drop policy if exists "Admins can manage articles" on public.articles;
create policy "Admins can manage articles"
  on public.articles for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid() and is_admin = false);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (id = auth.uid() and is_admin = false);

drop policy if exists "Active subscriptions are publicly readable" on public.subscriptions;
create policy "Active subscriptions are publicly readable"
  on public.subscriptions for select
  using (active = true);

drop policy if exists "Admins can manage subscriptions" on public.subscriptions;
create policy "Admins can manage subscriptions"
  on public.subscriptions for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Users can read own subscriptions" on public.user_subscriptions;
create policy "Users can read own subscriptions"
  on public.user_subscriptions for select
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Admins can manage user subscriptions" on public.user_subscriptions;
create policy "Admins can manage user subscriptions"
  on public.user_subscriptions for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can read contact messages" on public.contact_messages;
create policy "Admins can read contact messages"
  on public.contact_messages for select
  using (public.is_admin());

drop policy if exists "Admins can update contact messages" on public.contact_messages;
create policy "Admins can update contact messages"
  on public.contact_messages for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can manage profiles" on public.profiles;
create policy "Admins can manage profiles"
  on public.profiles for all
  using (public.is_admin())
  with check (public.is_admin());

grant usage on schema public to anon, authenticated;
grant select on public.events to anon, authenticated;
grant select on public.artists to anon, authenticated;
grant select on public.gallery to anon, authenticated;
grant insert on public.contact_messages to anon, authenticated;
grant insert, update, delete on public.events to authenticated;
grant insert, update, delete on public.artists to authenticated;
grant insert, update, delete on public.gallery to authenticated;
grant select, update on public.contact_messages to authenticated;
grant select on public.workshops to anon, authenticated;
grant insert on public.workshop_bookings to anon, authenticated;
grant select on public.workshop_bookings to authenticated;
grant insert on public.sunny_friday_applications to anon, authenticated;
grant select, update, delete on public.sunny_friday_applications to authenticated;
grant select on public.articles to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select on public.subscriptions to anon, authenticated;
grant select on public.user_subscriptions to authenticated;
grant insert, update, delete on public.workshops to authenticated;
grant update, delete on public.workshop_bookings to authenticated;
grant insert, update, delete on public.articles to authenticated;
grant insert, update, delete on public.subscriptions to authenticated;
grant insert, update, delete on public.user_subscriptions to authenticated;

insert into public.events
  (title, slug, excerpt, description, start_date, location, image_url, category, price_label, published)
values
  (
    'Sunny Friday',
    'sunny-friday',
    'Le rendez-vous créateurs : stands, musique, ventes, rencontres et vraie vibz culturelle.',
    'Un moment vivant pour découvrir des talents, soutenir la création locale, tester des offres et créer des connexions autour d’une ambiance premium et accessible.',
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
    'Explorer la couleur, la matière et repartir avec une œuvre personnelle.',
    'Un atelier guidé, sans niveau requis, pour apprendre des techniques simples, libérer le geste et vivre un moment créatif en groupe.',
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
    'Peinture, photographie, illustration et performance réunies pour donner de la visibilité aux talents et provoquer des rencontres.',
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
  (name, slug, bio, specialty, image_url, instagram_url, website_url, status, featured, published)
values
  (
    'Maya Sol',
    'maya-sol',
    'Plasticienne solaire qui transforme la couleur en expérience sensible, entre abstraction organique, chaleur visuelle et énergie collective.',
    'Peinture & installation',
    '/artists/maya-sol.svg',
    'https://instagram.com/',
    null,
    'active',
    true,
    true
  ),
  (
    'Noam Vibes',
    'noam-vibes',
    'Photographe des scènes locales, des coulisses et des visages créatifs, avec un regard documentaire et urbain.',
    'Photo & culture urbaine',
    '/artists/noam-vibes.svg',
    'https://instagram.com/',
    null,
    'active',
    true,
    true
  ),
  (
    'Lina Wave',
    'lina-wave',
    'Créatrice visuelle et animatrice d’ateliers, spécialisée dans les formats participatifs qui donnent confiance aux publics.',
    'Ateliers & médiation',
    '/artists/lina-wave.svg',
    null,
    'https://sunnyvibz.fr',
    'active',
    true,
    true
  )
on conflict (slug) do update set
  bio = excluded.bio,
  specialty = excluded.specialty,
  image_url = excluded.image_url,
  instagram_url = excluded.instagram_url,
  website_url = excluded.website_url,
  status = excluded.status,
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

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, roles)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    array['adherent']::text[]
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user_profile();

create or replace function public.reserve_workshop_seat()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  remaining integer;
  current_status text;
begin
  select seats_remaining, status
  into remaining, current_status
  from public.workshops
  where id = new.workshop_id
  for update;

  if remaining is null then
    raise exception 'Atelier introuvable';
  end if;

  if current_status <> 'available' or remaining <= 0 then
    raise exception 'Atelier complet';
  end if;

  update public.workshops
  set
    seats_remaining = seats_remaining - 1,
    status = case when seats_remaining - 1 <= 0 then 'full' else status end
  where id = new.workshop_id;

  return new;
end;
$$;

drop trigger if exists before_workshop_booking_insert on public.workshop_bookings;
create trigger before_workshop_booking_insert
  before insert on public.workshop_bookings
  for each row execute function public.reserve_workshop_seat();

insert into public.workshops
  (title, slug, description, image_url, start_date, location, price_label, capacity, seats_remaining, status, published)
values
  (
    'Atelier peinture & techniques mixtes',
    'atelier-peinture-techniques-mixtes',
    'On explore la couleur, la matière et le geste dans une ambiance bienveillante. Chaque participant repart avec une création personnelle et des techniques faciles à réutiliser.',
    '/gallery/atelier-couleurs.svg',
    '2026-07-10 15:00:00+02',
    'Creative Lab',
    '25 €',
    18,
    7,
    'available',
    true
  ),
  (
    'Photo urbaine & storytelling',
    'photo-urbaine-storytelling',
    'Apprendre à composer une image, capter une ambiance et raconter une histoire visuelle avec son téléphone ou son appareil photo.',
    '/artists/noam-vibes.svg',
    '2026-07-17 18:00:00+02',
    'Maison Créative',
    '35 €',
    12,
    0,
    'full',
    true
  ),
  (
    'Scène ouverte & expression',
    'scene-ouverte-expression',
    'Un format vivant pour tester un texte, une performance, une musique ou une prise de parole dans un cadre chaleureux et sans jugement.',
    '/gallery/scene-ouverte.svg',
    '2026-07-24 19:30:00+02',
    'Sunilounge',
    'Entrée libre sur réservation',
    30,
    14,
    'available',
    true
  )
on conflict (slug) do update set
  description = excluded.description,
  image_url = excluded.image_url,
  start_date = excluded.start_date,
  location = excluded.location,
  price_label = excluded.price_label,
  capacity = excluded.capacity,
  seats_remaining = excluded.seats_remaining,
  status = excluded.status,
  published = excluded.published;

insert into public.articles
  (title, slug, excerpt, image_url, category, author, published_at, content, status)
values
  (
    'Pourquoi SUNNYVIBZ prépare un Market créatif',
    'pourquoi-sunnyvibz-prepare-un-market-creatif',
    'Acheter, réserver, commander, soutenir : le Market doit aider les talents à transformer leur visibilité en opportunités.',
    '/gallery/marche-createurs.svg',
    'Market',
    'Équipe SUNNYVIBZ',
    '2026-06-26 10:00:00+02',
    'Le Market SUNNYVIBZ est pensé comme une passerelle concrète entre la création et le public. On pourra y trouver des œuvres, des prestations, des ateliers, des stands exposants et des services créatifs reliés aux profils talents. L’objectif est simple : donner de la visibilité, créer des commandes et soutenir l’économie culturelle locale.',
    'published'
  ),
  (
    'Mettre les talents au centre de l’écosystème',
    'mettre-les-talents-au-centre',
    'Photos, vidéos, événements, services : les profils talents deviennent les vitrines vivantes de la plateforme.',
    '/gallery/sunny-community.svg',
    'Talents',
    'SUNNYVIBZ',
    '2026-06-26 11:00:00+02',
    'Un profil talent ne doit pas être une fiche froide. Il doit montrer une énergie, un univers, des créations, des vidéos, des événements, des prestations et des envies de collaboration. SunnyVibz veut rendre ces parcours plus visibles et plus accessibles.',
    'published'
  ),
  (
    'Des ateliers pour créer, transmettre et rencontrer',
    'des-ateliers-pour-creer-transmettre-rencontrer',
    'Les ateliers SUNNYVIBZ sont des portes d’entrée simples pour apprendre, tester et rencontrer.',
    '/gallery/creative-lab.svg',
    'Ateliers',
    'Creative Lab',
    '2026-06-26 12:00:00+02',
    'Un atelier réussi n’est pas seulement un cours. C’est un moment où l’on ose essayer, où l’on échange, où l’on repart avec quelque chose de concret. SUNNYVIBZ veut créer des formats accessibles, beaux, utiles et humains.',
    'published'
  ),
  (
    'Brouillon exemple',
    'brouillon-exemple',
    'Cet article ne doit pas apparaître sur le site public.',
    '/gallery/galerie-nocturne.svg',
    'Admin',
    'SUNNYVIBZ',
    null,
    'Contenu de test pour vérifier le statut brouillon.',
    'draft'
  )
on conflict (slug) do update set
  excerpt = excluded.excerpt,
  image_url = excluded.image_url,
  category = excluded.category,
  author = excluded.author,
  published_at = excluded.published_at,
  content = excluded.content,
  status = excluded.status;

insert into public.subscriptions
  (slug, name, description, price_label, benefits, featured, active)
values
  (
    'decouverte',
    'Découverte',
    'Pour entrer dans la communauté, suivre les événements et découvrir la vibz sans pression.',
    'Gratuit / lancement',
    array['Agenda prioritaire', 'Newsletter', 'Accès communauté', 'Invitations découverte']::text[],
    false,
    true
  ),
  (
    'artiste',
    'Artiste',
    'Pour gagner en visibilité, publier son profil média et relier ses créations au Market.',
    'À partir de 9 €/mois',
    array['Profil talent', 'Galerie média', 'Mise en avant Market', 'Candidature Sunny Friday']::text[],
    true,
    true
  ),
  (
    'premium',
    'Premium',
    'Pour accélérer ses projets avec plus de visibilité, d’avantages et d’accompagnement.',
    'À partir de 19 €/mois',
    array['Boost visibilité', 'Accès ateliers premium', 'Réductions stands', 'Accompagnement projet']::text[],
    false,
    true
  )
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  price_label = excluded.price_label,
  benefits = excluded.benefits,
  featured = excluded.featured,
  active = excluded.active;

insert into storage.buckets
  (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'talent-media',
    'talent-media',
    true,
    52428800,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']::text[]
  )
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Talent media is publicly readable" on storage.objects;
create policy "Talent media is publicly readable"
  on storage.objects for select
  using (bucket_id = 'talent-media');

drop policy if exists "Users can upload own talent media" on storage.objects;
create policy "Users can upload own talent media"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'talent-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can update own talent media" on storage.objects;
create policy "Users can update own talent media"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'talent-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'talent-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

notify pgrst, 'reload schema';
