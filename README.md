# TicketFlow

TicketFlow implements the supplied ticket-system assignment with a React/Vite frontend, Zustand state, a Go REST API on port 8080, and Supabase Auth + PostgreSQL/PostgREST.

## Assignment coverage

| Requirement | Implementation |
| --- | --- |
| Register/login | Supabase email/password Auth through the required routes |
| JWT protection | Authorization: Bearer token validated through Supabase Auth |
| Password hashing | Supabase Auth; passwords never enter the app database |
| Own tickets only | Supabase RLS plus user-scoped PostgREST calls |
| Status flow | Go validation and a PostgreSQL trigger |
| Port/health | Port 8080; GET /health returns {"status":"ok"} |
| Docker | Multi-stage root Dockerfile |

No admin, assignment, or comments module was added.

## Architecture

~~~text
.
├── backend/
│   ├── cmd/api/                 # composition root
│   └── internal/
│       ├── config/              # environment parsing
│       ├── domain/              # user, ticket, status rules
│       ├── httpapi/             # routes, handlers, middleware
│       ├── service/             # use cases and validation
│       └── supabase/            # Auth and PostgREST adapters
├── frontend/src/
│   ├── app/                     # tiny App/router composition
│   ├── pages/                   # lazy route screens
│   ├── features/auth/           # components, API, Zustand store
│   ├── features/tickets/        # components, API, store, rules
│   └── shared/                  # API client, icons, design tokens
├── supabase/sql/                # ordered final SQL scripts
├── design/                      # accepted UI concept
├── Dockerfile
└── TASKS.md
~~~

The frontend follows the supplied reference: App.jsx is composition glue, route pages own screens, features own their components/store/API/lib code, and only cross-feature primitives live under shared.

~~~mermaid
sequenceDiagram
  participant UI as React + Zustand
  participant API as Go API :8080
  participant Auth as Supabase Auth
  participant REST as PostgREST
  participant DB as PostgreSQL + RLS
  UI->>API: Login email/password
  API->>Auth: Password grant
  Auth-->>UI: User + JWT via API
  UI->>API: Bearer JWT + ticket request
  API->>Auth: Validate JWT
  API->>REST: Same Bearer JWT
  REST->>DB: Query as authenticated user
  DB-->>UI: RLS-limited rows via REST/API
~~~

The API never uses a service-role key, so it cannot silently bypass ticket RLS.

## Supabase setup

Follow [supabase/README.md](supabase/README.md).

1. Create a Supabase project.
2. Run supabase/sql/001_schema.sql.
3. Run supabase/sql/002_security.sql.
4. Run supabase/sql/003_verify.sql and confirm RLS, policies, and indexes.
5. Enable Email Auth. Disable email confirmation for automated assignment testing, or confirm accounts before login.
6. Copy the project URL and anon/publishable key into .env.

Never configure a service-role key in this app.

## Local development

Go 1.22 or newer is required.

~~~powershell
Copy-Item .env.example .env
# Fill SUPABASE_URL and SUPABASE_ANON_KEY and load them in your shell.
Set-Location backend
go test ./...
go run ./cmd/api
~~~

In a second terminal:

~~~powershell
Set-Location frontend
Copy-Item .env.example .env.local
pnpm install
pnpm dev
~~~

Leaving VITE_API_URL empty locally uses the Vite /api proxy to port 8080.

## Docker contract

From the repository root:

~~~bash
docker build -t ticket-system .
docker run --env-file .env -p 8080:8080 ticket-system
curl http://localhost:8080/health
~~~

Expected: {"status":"ok"}

## API contract

| Method | Endpoint | Auth | Body |
| --- | --- | --- | --- |
| GET | /health | No | - |
| POST | /auth/register | No | {"email":"user@example.com","password":"secret123"} |
| POST | /auth/login | No | {"email":"user@example.com","password":"secret123"} |
| POST | /tickets | Bearer | {"title":"Broken export","description":"CSV export fails"} |
| GET | /tickets | Bearer | - |
| GET | /tickets/{id} | Bearer | - |
| PATCH | /tickets/{id}/status | Bearer | {"status":"in_progress"} |

Login returns token and access_token aliases. Tickets return id, user_id, title, description, status, created_at, and updated_at.

The strict flow is open -> in_progress -> closed. Skipping, repeating, or reversing a state returns 409. A missing or ownership-hidden ticket returns 404.

## Deployment

1. Push the repository to GitHub.
2. Create a Docker web service with the repository root as build context.
3. Set PORT=8080, SUPABASE_URL, SUPABASE_ANON_KEY, and ALLOWED_ORIGINS=https://YOUR_FRONTEND_HOST.
4. Deploy the frontend as a Vite static site: build pnpm --dir frontend build, output frontend/dist, and VITE_API_URL=https://YOUR_API_HOST.
5. Test https://YOUR_API_HOST/health.
6. Replace these before submission:
   - API: https://YOUR_API_HOST
   - Health: https://YOUR_API_HOST/health
   - Frontend: https://YOUR_FRONTEND_HOST

Deployment is not performed here because hosting and Supabase credentials are user-owned external state.

## Verification

~~~bash
cd backend && go test ./...
cd ../frontend && pnpm build
docker build -t ticket-system .
~~~

The React production build passed in this workspace. Go and Docker are not installed in this execution environment, so run those two checks locally or in CI.

## Assumptions

- Title is required (1-160 characters); description is optional (maximum 5000).
- With email confirmation enabled, users confirm and then log in.
- Ownership-hidden tickets return 404 to avoid disclosing existence.
- JWT validation is delegated to Supabase Auth rather than duplicating signing keys.
