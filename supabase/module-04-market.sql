-- Module 04 - SUNNY Market
-- A exécuter plus tard dans Supabase > SQL Editor.
-- Ce script prépare les offres Market et les demandes liées aux offres.

create extension if not exists "pgcrypto";

create table if not exists public.market_offers (
  id uuid primary key default gen_random_uuid(),
  seller_profile_id uuid references public.community_profiles(id) on delete set null,
  seller_name text not null,
  title text not null,
  slug text not null unique,
  short_description text not null,
  description text not null,
  image_url text,
  offer_type text not null default 'service'
    check (offer_type in ('artwork', 'service', 'workshop', 'stand', 'digital')),
  category text,
  price_label text not null,
  amount_cents integer,
  currency text not null default 'EUR',
  delivery_mode text,
  status text not null default 'available'
    check (status in ('available', 'reserved', 'sold', 'draft')),
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.market_inquiries (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid references public.market_offers(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  message text not null,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'quoted', 'converted', 'closed')),
  created_at timestamptz not null default now()
);

create index if not exists market_offers_public_idx
  on public.market_offers (published, status, featured, created_at desc);

create index if not exists market_inquiries_status_idx
  on public.market_inquiries (status, created_at desc);

alter table public.market_offers enable row level security;
alter table public.market_inquiries enable row level security;

drop policy if exists "Market offers are readable when published" on public.market_offers;
create policy "Market offers are readable when published"
on public.market_offers
for select
using (published = true and status <> 'draft');

drop policy if exists "Admins can manage market offers" on public.market_offers;
create policy "Admins can manage market offers"
on public.market_offers
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

drop policy if exists "Anyone can create market inquiries" on public.market_inquiries;
create policy "Anyone can create market inquiries"
on public.market_inquiries
for insert
with check (true);

drop policy if exists "Users can read their market inquiries" on public.market_inquiries;
create policy "Users can read their market inquiries"
on public.market_inquiries
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Admins can manage market inquiries" on public.market_inquiries;
create policy "Admins can manage market inquiries"
on public.market_inquiries
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

insert into public.market_offers (
  seller_name,
  title,
  slug,
  short_description,
  description,
  image_url,
  offer_type,
  category,
  price_label,
  amount_cents,
  currency,
  delivery_mode,
  status,
  featured,
  published
) values
  (
    'Noam Vibes',
    'Portrait photo artistique',
    'portrait-photo-artistique',
    'Shooting créatif pour portfolio, réseaux sociaux, exposition ou communication professionnelle.',
    'Une séance photo pensée comme une expérience artistique : direction légère, ambiance premium, sélection d’images et livraison optimisée pour profil, portfolio ou communication.',
    '/artists/noam-vibes.svg',
    'service',
    'Photo & vidéo',
    'À partir de 80 €',
    8000,
    'EUR',
    'Sur rendez-vous',
    'available',
    true,
    true
  ),
  (
    'Maya Sol',
    'Œuvre originale sur commande',
    'oeuvre-originale-sur-commande',
    'Création visuelle unique : peinture, illustration ou pièce décorative pour lieu, événement ou collection.',
    'Une œuvre conçue avec le commanditaire : intention, couleurs, format, usage et ambiance. Cette offre prépare les futures commandes personnalisées du SUNNY Market.',
    '/artists/maya-sol.svg',
    'artwork',
    'Œuvres & objets',
    'Sur devis',
    null,
    'EUR',
    'Commande personnalisée',
    'available',
    true,
    true
  ),
  (
    'Lina Wave',
    'Animation atelier créatif',
    'animation-atelier-creatif',
    'Atelier clé en main pour associations, écoles, entreprises, centres de loisirs ou événements.',
    'Un format participatif, accessible et élégant pour faire créer un groupe : peinture, collage, expression visuelle, initiation ou atelier sur mesure.',
    '/gallery/atelier-couleurs.svg',
    'workshop',
    'Ateliers & médiation',
    'À partir de 120 €',
    12000,
    'EUR',
    'SUNNYVIBZ ou hors les murs',
    'available',
    true,
    true
  ),
  (
    'SUNNYVIBZ',
    'Stand exposant Sunny Friday',
    'stand-exposant-sunny-friday',
    'Pré-réservation d’un stand pour exposer, vendre et rencontrer le public lors du marché créatif.',
    'Cette offre prépare le parcours exposant : candidature, validation, emplacement, paiement, QR exposant et visibilité sur le site.',
    '/gallery/marche-createurs.svg',
    'stand',
    'Sunny Friday',
    'Pré-réservation',
    null,
    'EUR',
    'Sur événement',
    'available',
    false,
    true
  )
on conflict (slug) do update set
  seller_name = excluded.seller_name,
  short_description = excluded.short_description,
  description = excluded.description,
  image_url = excluded.image_url,
  offer_type = excluded.offer_type,
  category = excluded.category,
  price_label = excluded.price_label,
  amount_cents = excluded.amount_cents,
  currency = excluded.currency,
  delivery_mode = excluded.delivery_mode,
  status = excluded.status,
  featured = excluded.featured,
  published = excluded.published;
