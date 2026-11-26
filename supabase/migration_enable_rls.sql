-- PitchConnect: enable RLS everywhere and keep the public API closed.
--
-- The browser used to talk to PostgREST with the anon key, so every table
-- had to stay world-readable/writable. Client queries now go through
-- /api/db, which authenticates the NextAuth session (or the admin cookie)
-- and forwards with the service key. service_role bypasses RLS, so no
-- policies are needed for the app to work — and with none defined, anon
-- and authenticated can reach nothing through the public REST API.

alter table public.leagues            enable row level security;
alter table public.games              enable row level security;
alter table public.players            enable row level security;
alter table public.rsvps              enable row level security;
alter table public.league_members     enable row level security;
alter table public.users              enable row level security;
alter table public.accounts           enable row level security;
alter table public.sessions           enable row level security;
alter table public.verification_token enable row level security;

-- Supabase ships this helper SECURITY DEFINER function; anon has no business
-- calling it through /rest/v1/rpc.
revoke execute on function public.rls_auto_enable() from anon, authenticated, public;
