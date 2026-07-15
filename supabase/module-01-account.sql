-- SUNNYVIBZ MVP - Module 01
-- Compte utilisateur, SUNNY PASS, wallet, rewards et messagerie de base.
-- À exécuter dans Supabase SQL Editor après supabase/schema.sql.

create table if not exists public.sunny_passes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  pass_number text not null unique,
  qr_payload text not null,
  status text not null default 'active' check (status in ('active', 'suspended', 'expired')),
  issued_at timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  balance_cents integer not null default 0 check (balance_cents >= 0),
  sunny_credits integer not null default 0 check (sunny_credits >= 0),
  currency text not null default 'EUR',
  status text not null default 'active' check (status in ('active', 'blocked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reward_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  points integer not null default 0 check (points >= 0),
  level text not null default 'membre' check (level in ('membre', 'actif', 'createur', 'ambassadeur')),
  last_activity_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references auth.users(id) on delete set null,
  recipient_id uuid references auth.users(id) on delete set null,
  subject text,
  body text not null,
  context_type text,
  context_id uuid,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists sunny_passes_user_idx
  on public.sunny_passes (user_id, status);

create index if not exists wallets_user_idx
  on public.wallets (user_id, status);

create index if not exists reward_accounts_user_idx
  on public.reward_accounts (user_id, level);

create index if not exists messages_sender_recipient_idx
  on public.messages (sender_id, recipient_id, created_at desc);

alter table public.sunny_passes enable row level security;
alter table public.wallets enable row level security;
alter table public.reward_accounts enable row level security;
alter table public.messages enable row level security;

drop policy if exists "Users can read own sunny pass" on public.sunny_passes;
create policy "Users can read own sunny pass"
  on public.sunny_passes for select
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Admins can manage sunny passes" on public.sunny_passes;
create policy "Admins can manage sunny passes"
  on public.sunny_passes for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Users can read own wallet" on public.wallets;
create policy "Users can read own wallet"
  on public.wallets for select
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Admins can manage wallets" on public.wallets;
create policy "Admins can manage wallets"
  on public.wallets for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Users can read own reward account" on public.reward_accounts;
create policy "Users can read own reward account"
  on public.reward_accounts for select
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Admins can manage reward accounts" on public.reward_accounts;
create policy "Admins can manage reward accounts"
  on public.reward_accounts for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Users can read own messages" on public.messages;
create policy "Users can read own messages"
  on public.messages for select
  using (sender_id = auth.uid() or recipient_id = auth.uid() or public.is_admin());

drop policy if exists "Users can send messages" on public.messages;
create policy "Users can send messages"
  on public.messages for insert
  with check (sender_id = auth.uid() and body <> '');

drop policy if exists "Admins can manage messages" on public.messages;
create policy "Admins can manage messages"
  on public.messages for all
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.sunny_passes to authenticated;
grant select on public.wallets to authenticated;
grant select on public.reward_accounts to authenticated;
grant select, insert on public.messages to authenticated;
grant insert, update, delete on public.sunny_passes to authenticated;
grant insert, update, delete on public.wallets to authenticated;
grant insert, update, delete on public.reward_accounts to authenticated;
grant update, delete on public.messages to authenticated;

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  generated_pass_number text;
begin
  generated_pass_number := 'SVZ-' || upper(substr(replace(new.id::text, '-', ''), 1, 10));

  insert into public.profiles (id, full_name, roles)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    array['adherent']::text[]
  )
  on conflict (id) do nothing;

  insert into public.sunny_passes (user_id, pass_number, qr_payload)
  values (
    new.id,
    generated_pass_number,
    'SUNNYVIBZ|' || generated_pass_number || '|' || coalesce(new.email, '')
  )
  on conflict (user_id) do nothing;

  insert into public.wallets (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.reward_accounts (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user_profile();

insert into public.sunny_passes (user_id, pass_number, qr_payload)
select
  profiles.id,
  'SVZ-' || upper(substr(replace(profiles.id::text, '-', ''), 1, 10)),
  'SUNNYVIBZ|SVZ-' || upper(substr(replace(profiles.id::text, '-', ''), 1, 10)) || '|'
from public.profiles
on conflict (user_id) do nothing;

insert into public.wallets (user_id)
select id from public.profiles
on conflict (user_id) do nothing;

insert into public.reward_accounts (user_id)
select id from public.profiles
on conflict (user_id) do nothing;

notify pgrst, 'reload schema';
