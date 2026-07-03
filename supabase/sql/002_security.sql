-- Row-level ownership and least-privilege grants.
-- Run this file after 001_schema.sql.

alter table public.tickets enable row level security;
alter table public.tickets force row level security;

revoke all on table public.tickets from anon;
revoke all on table public.tickets from authenticated;
grant select, insert, update on table public.tickets to authenticated;

drop policy if exists "Users can read their own tickets" on public.tickets;
create policy "Users can read their own tickets"
on public.tickets
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own tickets" on public.tickets;
create policy "Users can create their own tickets"
on public.tickets
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own tickets" on public.tickets;
create policy "Users can update their own tickets"
on public.tickets
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

