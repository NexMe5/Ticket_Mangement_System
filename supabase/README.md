# Supabase setup

The Go API uses Supabase Auth for registration, password login, and JWT validation. Ticket CRUD is sent to Supabase PostgREST with the caller's bearer token, so PostgreSQL Row Level Security remains the final ownership boundary.

## Hosted project

1. Create a Supabase project and wait for database provisioning to finish.
2. Open **SQL Editor** and run these scripts in order:
   - `sql/001_schema.sql`
   - `sql/002_security.sql`
   - `sql/003_verify.sql` (verification only)
3. In **Authentication > Providers > Email**, keep Email enabled. For assignment/test environments, disable **Confirm email** so registration immediately creates a usable session. If confirmation stays enabled, users must confirm before login.
4. In **Project Settings > API**, copy the Project URL and anon/publishable key into the root `.env` as `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
5. Never place the service-role key in the browser or this API. The anon key plus the user's JWT is sufficient and preserves RLS.
6. Add your deployed frontend URL to the allowed origins in the API's `ALLOWED_ORIGINS`. Add the frontend URL under **Authentication > URL Configuration** only if email confirmation or redirects are enabled.

## Security model

- `auth.users` is managed only by Supabase Auth; no duplicate password/profile table is created.
- Password hashing is handled by Supabase Auth.
- Every ticket row stores `user_id = auth.uid()`.
- RLS permits authenticated users to select, insert, and update only their own rows.
- The database trigger permits only `open -> in_progress -> closed`; closed tickets cannot be reopened even if the API is bypassed.
- The API forwards each caller's JWT to PostgREST. It does not use a service-role bypass.

## Optional local Supabase CLI

If you use the Supabase CLI, link the project and apply the same files manually with `supabase db reset` after placing them in a migration, or paste them into the local Studio SQL editor. The repository intentionally keeps the final reviewable SQL in `supabase/sql/` as requested.
