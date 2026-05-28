import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * Server-side Supabase client. Uses the service_role key which bypasses
 * RLS — all access control is enforced in application code.
 *
 * NEVER import this in a client component. Use useSupabase() hook instead.
 */
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseServiceKey)
}
