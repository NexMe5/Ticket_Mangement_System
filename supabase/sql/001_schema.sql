-- TicketFlow core schema.
-- Run this file first in the Supabase SQL editor.

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 160),
  description text not null default '' check (char_length(description) <= 5000),
  status text not null default 'open'
    check (status in ('open', 'in_progress', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tickets_user_id_idx
  on public.tickets (user_id);

create index if not exists tickets_user_created_at_idx
  on public.tickets (user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.enforce_ticket_status_transition()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = old.status then
    raise exception using
      errcode = '23514',
      message = 'ticket status must move from open to in_progress to closed';
  end if;

  if not (
    (old.status = 'open' and new.status = 'in_progress') or
    (old.status = 'in_progress' and new.status = 'closed')
  ) then
    raise exception using
      errcode = '23514',
      message = 'invalid ticket status transition';
  end if;

  return new;
end;
$$;

drop trigger if exists tickets_set_updated_at on public.tickets;
create trigger tickets_set_updated_at
before update on public.tickets
for each row execute function public.set_updated_at();

drop trigger if exists tickets_enforce_status_transition on public.tickets;
create trigger tickets_enforce_status_transition
before update of status on public.tickets
for each row execute function public.enforce_ticket_status_transition();
