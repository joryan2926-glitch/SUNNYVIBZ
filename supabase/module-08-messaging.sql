-- SUNNYVIBZ — Module 08 : messagerie
-- Compatible avec le module 01 qui crée déjà une table messages legacy.
-- À exécuter dans Supabase SQL Editor.

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  subject text,
  context_type text check (context_type in ('general', 'booking', 'market', 'project', 'partnership', 'support')),
  context_id uuid,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversation_members (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  last_read_at timestamptz,
  joined_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

-- Compatibilité avec public.messages du module 01.
alter table public.messages
  add column if not exists conversation_id uuid references public.conversations(id) on delete cascade;
alter table public.messages
  add column if not exists edited_at timestamptz;

alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;

drop policy if exists "conversation_members_select_own" on public.conversation_members;
create policy "conversation_members_select_own"
on public.conversation_members for select
using (auth.uid() = user_id);

drop policy if exists "conversation_members_insert_member" on public.conversation_members;
create policy "conversation_members_insert_member"
on public.conversation_members for insert
with check (
  auth.uid() = user_id
  or exists (
    select 1 from public.conversations c
    where c.id = conversation_id and c.created_by = auth.uid()
  )
);

drop policy if exists "conversation_members_update_own" on public.conversation_members;
create policy "conversation_members_update_own"
on public.conversation_members for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "conversations_select_member" on public.conversations;
create policy "conversations_select_member"
on public.conversations for select
using (
  exists (
    select 1 from public.conversation_members cm
    where cm.conversation_id = id and cm.user_id = auth.uid()
  )
);

drop policy if exists "conversations_insert_own" on public.conversations;
create policy "conversations_insert_own"
on public.conversations for insert
with check (auth.uid() = created_by);

drop policy if exists "messages_select_member" on public.messages;
create policy "messages_select_member"
on public.messages for select
using (
  exists (
    select 1 from public.conversation_members cm
    where cm.conversation_id = messages.conversation_id
      and cm.user_id = auth.uid()
  )
);

drop policy if exists "messages_insert_member" on public.messages;
create policy "messages_insert_member"
on public.messages for insert
with check (
  auth.uid() = sender_id
  and exists (
    select 1 from public.conversation_members cm
    where cm.conversation_id = messages.conversation_id
      and cm.user_id = auth.uid()
  )
);

create index if not exists conversation_members_user_idx
  on public.conversation_members(user_id);
create index if not exists messages_conversation_created_idx
  on public.messages(conversation_id, created_at asc);

notify pgrst, 'reload schema';