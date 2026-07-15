-- SUNNYVIBZ — Module 06 : portefeuille et paiements
-- À exécuter dans Supabase SQL Editor lorsque le schéma sera validé.

create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  currency text not null default 'EUR',
  balance_cents integer not null default 0 check (balance_cents >= 0),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create table if not exists public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid not null references public.wallets(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount_cents integer not null,
  kind text not null check (kind in ('credit', 'debit', 'refund', 'bonus')),
  label text not null,
  reference text,
  status text not null default 'completed' check (status in ('pending', 'completed', 'failed', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.payment_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount_cents integer not null check (amount_cents > 0),
  purpose text not null,
  provider text not null default 'manual',
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'cancelled')),
  provider_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.wallets enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.payment_requests enable row level security;

drop policy if exists "wallets_select_own" on public.wallets;
create policy "wallets_select_own" on public.wallets for select using (auth.uid() = user_id);

drop policy if exists "wallet_transactions_select_own" on public.wallet_transactions;
create policy "wallet_transactions_select_own" on public.wallet_transactions for select using (auth.uid() = user_id);

drop policy if exists "payment_requests_select_own" on public.payment_requests;
create policy "payment_requests_select_own" on public.payment_requests for select using (auth.uid() = user_id);

drop policy if exists "payment_requests_insert_own" on public.payment_requests;
create policy "payment_requests_insert_own" on public.payment_requests for insert with check (auth.uid() = user_id);

create index if not exists wallet_transactions_user_created_idx
  on public.wallet_transactions(user_id, created_at desc);
create index if not exists payment_requests_user_created_idx
  on public.payment_requests(user_id, created_at desc);

