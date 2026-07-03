-- Read-only verification queries. Run after the setup scripts.

select
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as rls_forced
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relname = 'tickets';

select policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'public' and tablename = 'tickets'
order by policyname;

select indexname, indexdef
from pg_indexes
where schemaname = 'public' and tablename = 'tickets'
order by indexname;

