'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/lib/supabase/use-supabase'
import type { NewPlayer } from '@/lib/types'

export function usePlayers(groupId: string | null = null) {
  const [players, setPlayers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = useSupabase()

  const refreshPlayers = async () => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase.from('players').select('*').order('name', { ascending: true })
      if (groupId) query = query.eq('league_id', groupId)
      const { data, error: fetchErr } = await query
      if (fetchErr) { console.error('Error fetching players:', fetchErr); setError(fetchErr.message) }
      else if (data) { console.log('Players loaded:', data); setPlayers(data) }
    } catch (err: any) {
      console.error('Error fetching players:', err)
      setError(err.message || 'Failed to load players')
    }
    setLoading(false)
  }

  useEffect(() => { refreshPlayers() }, [groupId])

  const addPlayer = async (formData: NewPlayer) => {
    setError(null)
    console.log('[usePlayers] addPlayer: groupId=', groupId, 'formData=', formData)
    if (!groupId) {
      const msg = 'No active group selected'
      console.error('[usePlayers]', msg)
      setError(msg)
      return null
    }
    try {
      // Check for duplicate email in this group
      if (formData.email) {
        const { data: existing } = await supabase
          .from('players')
          .select('id, name')
          .eq('league_id', groupId)
          .eq('email', formData.email)
          .maybeSingle()
        if (existing) {
          setError(`${formData.email} is already in this group`)
          return null
        }
      }

      const { data, error: insertErr } = await supabase
        .from('players')
        .insert([{ name: formData.name, email: formData.email || null, phone: formData.phone || null, position: formData.position || null, league_id: groupId }])
        .select()
        .single()

      if (insertErr) {
        console.error('[usePlayers] Error creating player:', insertErr)
        if (insertErr.message.includes('duplicate') || insertErr.message.includes('unique')) {
          setError('A player with this email already exists in this group')
        } else {
          setError(insertErr.message)
        }
        return null
      }
      console.log('[usePlayers] Player created:', data)
      await refreshPlayers()
      return data
    } catch (err: any) {
      console.error('[usePlayers] Exception adding player:', err)
      setError(err.message || 'Failed to add player')
      return null
    }
  }

  const updatePlayer = async (playerId: string, formData: NewPlayer) => {
    setError(null)
    try {
      const { error: updateErr } = await supabase
        .from('players')
        .update({ name: formData.name, email: formData.email || null, phone: formData.phone || null, position: formData.position || null })
        .eq('id', playerId)

      if (updateErr) {
        console.error('[usePlayers] Error updating player:', updateErr)
        setError(updateErr.message)
        return
      }
      await refreshPlayers()
    } catch (err: any) {
      console.error('[usePlayers] Exception updating player:', err)
      setError(err.message || 'Failed to update player')
    }
  }

  const deletePlayer = async (playerId: string) => {
    setError(null)
    try {
      const { error: deleteErr } = await supabase.from('players').delete().eq('id', playerId)
      if (deleteErr) {
        console.error('[usePlayers] Error deleting player:', deleteErr)
        setError(deleteErr.message)
        return null
      }
      await refreshPlayers()
    } catch (err: any) {
      console.error('[usePlayers] Exception deleting player:', err)
      setError(err.message || 'Failed to delete player')
      return null
    }
  }

  return { players, loading, error, addPlayer, updatePlayer, deletePlayer, refreshPlayers }
}
