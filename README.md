# digitalands-v2

## Local development

```bash
npm install
supabase start        # local Postgres/Auth/Storage in Docker (Studio: http://127.0.0.1:54323)
supabase db reset     # build schema from supabase/migrations/ + demo data from supabase/seed.sql
npm run dev
```

`.env.local` points the app at the local stack (URL + anon key printed by `supabase start`).

The serverless functions in `api/` (Stripe checkout, refunds, webhook) do not run under
`vite dev` — use `vercel dev` with `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
`SUPABASE_SERVICE_ROLE_KEY` set, plus `stripe listen --forward-to localhost:3000/api/webhook`
for webhook events.

## Database

- `supabase/migrations/` — source of truth for the schema. Each change is a new timestamped
  file (`supabase migration new <name>`); never edit an applied migration.
- `supabase/seed.sql` — demo data, auto-applied by `supabase db reset`.
- `supabase-migrations.sql` — legacy idempotent convergence script for the pre-CLI production
  DB. Once prod is baselined with the CLI (`supabase link` + `supabase db pull` or applying
  the initial migration), this file can be deleted.

Deploy schema changes to the hosted project:

```bash
supabase login
supabase link --project-ref <ref>   # from the dashboard URL, one time
supabase db push                    # applies pending migrations
```
