-- SUNNYVIBZ MVP - Module 02
-- Réservations d'espaces en complément des ateliers.
-- À exécuter dans Supabase SQL Editor après supabase/schema.sql.

create table if not exists public.spaces (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  image_url text,
  location text not null,
  area_label text not null default 'Espace modulable',
  price_label text not null default 'Sur demande',
  hourly_price_cents integer check (hourly_price_cents is null or hourly_price_cents >= 0),
  half_day_price_cents integer check (half_day_price_cents is null or half_day_price_cents >= 0),
  full_day_price_cents integer check (full_day_price_cents is null or full_day_price_cents >= 0),
  capacity integer not null default 0 check (capacity >= 0),
  slots_capacity integer not null default 0 check (slots_capacity >= 0),
  slots_remaining integer not null default 0 check (slots_remaining >= 0),
  status text not null default 'available' check (status in ('available', 'full', 'maintenance')),
  requires_booking boolean not null default true,
  subscriber_priority boolean not null default true,
  access_notes text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.space_bookings (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces(id) on delete cascade,
  space_title text not null,
  requested_date date not null,
  requested_time_slot text not null,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  intended_use text,
  subscription_plan_slug text,
  pricing_note text,
  priority_access boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists spaces_published_status_idx
  on public.spaces (published, status, created_at desc);

create index if not exists space_bookings_space_idx
  on public.space_bookings (space_id, requested_date, created_at desc);

create index if not exists space_bookings_user_email_idx
  on public.space_bookings (user_id, lower(email), created_at desc);

alter table public.spaces enable row level security;
alter table public.space_bookings enable row level security;

drop policy if exists "Published spaces are publicly readable" on public.spaces;
create policy "Published spaces are publicly readable"
  on public.spaces for select
  using (published = true);

drop policy if exists "Admins can manage spaces" on public.spaces;
create policy "Admins can manage spaces"
  on public.spaces for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Anyone can create space bookings" on public.space_bookings;
create policy "Anyone can create space bookings"
  on public.space_bookings for insert
  with check (
    status = 'pending'
    and name <> ''
    and email <> ''
    and requested_time_slot <> ''
    and (user_id is null or user_id = auth.uid())
  );

drop policy if exists "Users can read their space bookings" on public.space_bookings;
create policy "Users can read their space bookings"
  on public.space_bookings for select
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

drop policy if exists "Admins can manage space bookings" on public.space_bookings;
create policy "Admins can manage space bookings"
  on public.space_bookings for all
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.spaces to anon, authenticated;
grant insert on public.space_bookings to anon, authenticated;
grant select on public.space_bookings to authenticated;
grant insert, update, delete on public.spaces to authenticated;
grant update, delete on public.space_bookings to authenticated;

create or replace function public.reserve_space_slot()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  remaining integer;
  current_status text;
begin
  select slots_remaining, status
  into remaining, current_status
  from public.spaces
  where id = new.space_id
  for update;

  if remaining is null then
    raise exception 'Espace introuvable';
  end if;

  if current_status <> 'available' or remaining <= 0 then
    raise exception 'Espace complet';
  end if;

  update public.spaces
  set
    slots_remaining = slots_remaining - 1,
    status = case when slots_remaining - 1 <= 0 then 'full' else status end
  where id = new.space_id;

  return new;
end;
$$;

drop trigger if exists before_space_booking_insert on public.space_bookings;
create trigger before_space_booking_insert
  before insert on public.space_bookings
  for each row execute function public.reserve_space_slot();

insert into public.spaces
  (
    title,
    slug,
    description,
    image_url,
    location,
    area_label,
    price_label,
    hourly_price_cents,
    half_day_price_cents,
    full_day_price_cents,
    capacity,
    slots_capacity,
    slots_remaining,
    status,
    requires_booking,
    subscriber_priority,
    access_notes,
    published
  )
values
  (
    'Creative Lab',
    'creative-lab',
    'Un espace modulable pour ateliers, formations, pratiques artistiques, initiations et sessions de création collective.',
    '/gallery/creative-lab.svg',
    'SUNNYVIBZ Art & Culture',
    'Salle atelier modulable',
    'À partir de 45 € / créneau',
    4500,
    12000,
    22000,
    18,
    8,
    5,
    'available',
    true,
    true,
    'Réservation obligatoire. Priorité aux membres Créative, Premium et projets accompagnés.',
    true
  ),
  (
    'Sunilounge',
    'sunilounge',
    'Un espace chaleureux pour rencontres, discussions, répétitions légères, temps communautaires et formats intimistes.',
    '/gallery/sunny-community.svg',
    'SUNNYVIBZ Art & Culture',
    'Lounge culturel',
    'Sur demande',
    null,
    9000,
    16000,
    25,
    6,
    3,
    'available',
    true,
    true,
    'Adapté aux rencontres, petits formats et temps membres. Confirmation après validation de l’usage.',
    true
  ),
  (
    'Maison Créative',
    'maison-creative',
    'Un espace premium pour expositions, conférences, présentations de projets, rencontres partenaires et temps forts culturels.',
    '/gallery/galerie-nocturne.svg',
    'SUNNYVIBZ Art & Culture',
    'Espace événementiel',
    'Sur devis',
    null,
    18000,
    32000,
    60,
    4,
    1,
    'available',
    true,
    true,
    'Idéal pour expositions, conférences et projets partenaires. Validation obligatoire par l’équipe.',
    true
  )
on conflict (slug) do update set
  description = excluded.description,
  image_url = excluded.image_url,
  location = excluded.location,
  area_label = excluded.area_label,
  price_label = excluded.price_label,
  hourly_price_cents = excluded.hourly_price_cents,
  half_day_price_cents = excluded.half_day_price_cents,
  full_day_price_cents = excluded.full_day_price_cents,
  capacity = excluded.capacity,
  slots_capacity = excluded.slots_capacity,
  slots_remaining = excluded.slots_remaining,
  status = excluded.status,
  requires_booking = excluded.requires_booking,
  subscriber_priority = excluded.subscriber_priority,
  access_notes = excluded.access_notes,
  published = excluded.published;

notify pgrst, 'reload schema';

-- Annulation sécurisée d’une demande espace par son propriétaire.
create or replace function public.cancel_space_booking(p_booking_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  booking_space_id uuid;
begin
  update public.space_bookings
  set status = 'cancelled'
  where id = p_booking_id
    and status <> 'cancelled'
    and (
      user_id = auth.uid()
      or public.is_admin()
      or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  returning space_id into booking_space_id;

  if booking_space_id is null then
    return false;
  end if;

  update public.spaces
  set
    slots_remaining = least(slots_capacity, slots_remaining + 1),
    status = case when status = 'full' then 'available' else status end
  where id = booking_space_id;

  return true;
end;
$$;

grant execute on function public.cancel_space_booking(uuid) to authenticated;
