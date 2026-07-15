-- SUNNYVIBZ — Module 07 : SUNNY Rewards
-- À exécuter dans Supabase SQL Editor lorsque le schéma sera validé.

create table if not exists public.reward_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  points integer not null default 0 check (points >= 0),
  level text not null default 'membre_actif' check (level in ('membre_actif', 'participant', 'createur', 'ambassadeur')),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create table if not exists public.reward_transactions (
  id uuid primary key default gen_random_uuid(),
  reward_account_id uuid not null references public.reward_accounts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  points integer not null,
  kind text not null check (kind in ('earned', 'redeemed', 'bonus', 'expired')),
  label text not null,
  reference text,
  created_at timestamptz not null default now()
);

create table if not exists public.reward_catalog (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  points_cost integer not null check (points_cost > 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.reward_accounts enable row level security;
alter table public.reward_transactions enable row level security;
alter table public.reward_catalog enable row level security;

drop policy if exists "reward_accounts_select_own" on public.reward_accounts;
create policy "reward_accounts_select_own" on public.reward_accounts for select using (auth.uid() = user_id);

drop policy if exists "reward_transactions_select_own" on public.reward_transactions;
create policy "reward_transactions_select_own" on public.reward_transactions for select using (auth.uid() = user_id);

drop policy if exists "reward_catalog_select_active" on public.reward_catalog;
create policy "reward_catalog_select_active" on public.reward_catalog for select using (active = true);

insert into public.reward_catalog (title, description, points_cost)
select * from (values
  ('Accès Sunilounge', 'Une invitation découverte', 60),
  ('−10 % sur un atelier', 'Valable sur une réservation', 120),
  ('Pass événement', 'Une place pour Sunny Friday', 250)
) as seed(title, description, points_cost)
where not exists (select 1 from public.reward_catalog);

create index if not exists reward_transactions_user_created_idx
  on public.reward_transactions(user_id, created_at desc);

