import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { League } from '@/lib/types'

export function useLeagues() {
  const [leagues, setLeagues] = useState<League[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const refresh = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('leagues').select('*').order('created_at', { ascending: false })
    if (error || !data) {
      setLeagues([])
    } else {
      setLeagues(data)
    }
    setLoading(false)
  }, [])

  const createLeague = async (name: string, slug: string, description?: string) => {
    await supabase.from('leagues').insert({ name, slug, description })
    await refresh()
    return slug
  }

  const deleteLeague = async (id: string) => {
    await supabase.from('leagues').delete().match({ id })
    await refresh()
  }

  const getLeagueBySlug = async (slug: string) => {
    const { data, error } = await supabase.from('leagues')
      .select('*')
      .match({ slug })
      .single()
    if (error || !data) return null
    return data
  }

  useEffect(() => {
    refresh()
  }, [refresh])

  // Keep refresh function stable for hooks dependency
  return { leagues, loading, refresh, createLeague, deleteLeague, getLeagueBySlug }
}
