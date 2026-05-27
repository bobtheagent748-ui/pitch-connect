import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RSVP } from '@/lib/types'

export function useRsvps(groupId: string | null = null) {
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const refresh = async () => {
    setLoading(true)
    let query = supabase.from('rsvps').select('*')
    
    if (groupId) {
      query = query.eq('league_id', groupId)
    }
    
    const { data, error } = await query
    if (error || !data) {
      setRsvps([])
    } else {
      setRsvps(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [groupId])

  const upsertRsvp = async (gameId: string, playerId: string, status: 'yes' | 'no' | 'maybe') => {
    const { data: existing } = await supabase.from('rsvps')
      .select('id')
      .match({ game_id: gameId, player_id: playerId })
      .single()

    const payload: any = { game_id: gameId, player_id: playerId, status }
    if (groupId) payload.league_id = groupId
    
    if (existing) {
      await supabase.from('rsvps').update(payload).match({ game_id: gameId, player_id: playerId })
    } else {
      await supabase.from('rsvps').insert(payload)
    }

    // Optimistic update
    setRsvps(prev => prev.filter(r => !(r.game_id === gameId && r.player_id === playerId))
                         .concat({ ...payload, id: 'temp', created_at: new Date().toISOString() }))
    
    return refresh()
  }

  const deleteRsvp = async (gameId: string, playerId: string) => {
    await supabase.from('rsvps').delete().match({ game_id: gameId, player_id: playerId })
    setRsvps(prev => prev.filter(r => !(r.game_id === gameId && r.player_id === playerId)))
    return refresh()
  }

  return { rsvps, refresh, upsertRsvp, deleteRsvp, loading }
}
