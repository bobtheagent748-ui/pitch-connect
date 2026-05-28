'use client'

import { useSession } from 'next-auth/react'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Hook that creates a Supabase client with the current session's
 * Supabase JWT, so RLS policies can identify the user via auth.uid().
 */
export function useSupabase() {
  const { data: session } = useSession()

  if (session?.supabaseAccessToken) {
    return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${session.supabaseAccessToken}`,
        },
      },
    })
  }
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}
