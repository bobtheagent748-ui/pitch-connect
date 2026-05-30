-- PitchConnect: Restrict anon key to your Vercel domain
-- This prevents anyone who extracts your anon key from using it outside your app.
-- Run in Supabase SQL Editor

-- 1. Set custom allowed origins for the anon key
-- Go to: Supabase Dashboard → Authentication → Settings → Authorized Domains
-- Add: https://pitch-connect-xi.vercel.app
-- Add: https://pitch-connect-*.vercel.app  (for preview deployments)
-- Add: http://localhost:3000  (for local dev)

-- 2. Verify current allowed origins (read-only, informational)
SELECT * FROM supabase_migrations.schema_migrations LIMIT 0;
-- No SQL needed — this is configured in the Supabase Dashboard UI, not SQL.

-- 3. Optional: enable RLS with a proper JWT bridge (Post-Option-A upgrade path)
-- This would make the anon key read-only and require a signed JWT for writes.
-- Requires SUPABASE_JWT_SECRET to be configured.
