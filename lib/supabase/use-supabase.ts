'use client'

import { useMemo } from 'react'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Browser Supabase client.
 *
 * It talks to our own authenticated proxy (/api/db) instead of PostgREST
 * directly. The proxy checks the NextAuth session (or the admin cookie)
 * and forwards with the service key server-side, so no database key ever
 * reaches the browser and RLS can stay enabled with no anon policies.
 */
export function useSupabase() {
  return useMemo(() => {
    const url =
      typeof window === 'undefined'
        ? process.env.NEXT_PUBLIC_SUPABASE_URL!
        : `${window.location.origin}/api/db`

    return createSupabaseClient(url, 'proxy', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  }, [])
}
