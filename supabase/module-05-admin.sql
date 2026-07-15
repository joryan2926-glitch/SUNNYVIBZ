-- Module 05 - Administration SUNNYVIBZ
-- A exécuter plus tard dans Supabase > SQL Editor.
-- Ce script prépare une couche admin simple : tâches, vues sauvegardées et journal d'activité.

create extension if not exists "pgcrypto";

create table if not exists public.admin_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  module_key text not null,
  priority text not null default 'medium'
    check (priority in ('low', 'medium', 'high', 'urgent')),
  status text not null default 'todo'
    check (status in ('todo', 'in_progress', 'done', 'blocked')),
  due_at timestamptz,
  assigned_to uuid references auth.users(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_saved_views (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  module_key text not null,
  filters jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_activity_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  module_key text not null,
  action text not null,
  entity_table text,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_tasks_module_status_idx
  on public.admin_tasks (module_key, status, priority, created_at desc);

create index if not exists admin_saved_views_module_idx
  on public.admin_saved_views (module_key, sort_order);

create index if not exists admin_activity_log_module_idx
  on public.admin_activity_log (module_key, created_at desc);

alter table public.admin_tasks enable row level security;
alter table public.admin_saved_views enable row level security;
alter table public.admin_activity_log enable row level security;

drop policy if exists "Admins can manage admin tasks" on public.admin_tasks;
create policy "Admins can manage admin tasks"
on public.admin_tasks
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

drop policy if exists "Admins can manage admin saved views" on public.admin_saved_views;
create policy "Admins can manage admin saved views"
on public.admin_saved_views
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

drop policy if exists "Admins can read admin activity log" on public.admin_activity_log;
create policy "Admins can read admin activity log"
on public.admin_activity_log
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_admin = true
  )
);

drop policy if exists "Admins can create admin activity log" on public.admin_activity_log;
create policy "Admins can create admin activity log"
on public.admin_activity_log
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_admin = true
  )
);

insert into public.admin_tasks (
  title,
  description,
  module_key,
  priority,
  status
) values
  (
    'Valider les réservations ateliers',
    'Contrôler les nouvelles demandes, capacités restantes et priorités abonnés.',
    'workshops',
    'high',
    'todo'
  ),
  (
    'Modérer les offres Market',
    'Vérifier les descriptions, prix, images et statut avant mise en avant.',
    'market',
    'high',
    'todo'
  ),
  (
    'Activer les profils Community',
    'Valider les rôles multiples, compétences, besoins et profils publics.',
    'community',
    'medium',
    'todo'
  ),
  (
    'Préparer les paiements',
    'Connecter Stripe avant tout paiement réel d’abonnement, atelier, stand ou Market.',
    'payments',
    'urgent',
    'blocked'
  )
on conflict do nothing;

insert into public.admin_saved_views (
  name,
  module_key,
  filters,
  sort_order
) values
  (
    'Réservations à traiter',
    'reservations',
    '{"status":"pending"}'::jsonb,
    1
  ),
  (
    'Offres Market en avant',
    'market',
    '{"featured":true,"published":true}'::jsonb,
    2
  ),
  (
    'Profils Community actifs',
    'community',
    '{"status":"active","published":true}'::jsonb,
    3
  )
on conflict do nothing;
