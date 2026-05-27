'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { NewPlayer } from '@/lib/types'

export function usePlayers(groupId: string | null = null) {
  const [players, setPlayers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const refreshPlayers = async () => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase
        .from('players')
        .select('*')
        .order('name', { ascending: true })

      if (groupId) {
        query = query.eq('league_id', groupId)
      }

      const { data, error: fetchErr } = await query

      if (fetchErr) {
        console.error('Error fetching players:', fetchErr)
        setError(fetchErr.message)
      } else if (data) {
        console.log('Players loaded:', data)
        setPlayers(data)
      }
    } catch (err: any) {
      console.error('Error fetching players:', err)
      setError(err.message || 'Failed to load players')
    }
    setLoading(false)
  }

  useEffect(() => {
    refreshPlayers()
  }, [groupId])

  const  addPlayer = async (formData: NewPlayer) => {
    setError(null)
    if (!groupId) {
      setError('No active group selected')
      return null
    }

    try {
      const { data, error: insertErr } = await supabase
        .from('players')
        .insert([{
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone || null,
          league_id: groupId,
        }])
        .select()
        .single()

      if (insertErr) {
        console.error('[usePlayers] Error creating player:', insertErr)
        setError(insertErr.message)
        return null
      }

      await refreshPlayers()
      return data
    } catch (err: any) {
      console.error('[usePlayers] Unexpected error in addPlayer:', err)
      setError(err.message || 'Failed to add player')
      return null
    }
  }

  const  updatePlayer = async (playerId: string, formData: NewPlayer) => {
    setError(null)
    const { error: updateErr } = await supabase
      .from('players')
      .update({
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
      })
      .eq('id', playerId)

    if (updateErr) {
      console.error('Error updating player:', updateErr)
      setError(updateErr.message)
      return
    }

    await refreshPlayers()
  }

  const deletePlayer = async (playerId: string) => {
    try {
      const { data, error: deleteErr } = await supabase
        .from('players')
        .delete()
        .eq('id', playerId)
        .select()

      if (deleteErr) {
        console.error('[usePlayers] Error deleting player:', deleteErr)
        setError(deleteErr.message)
        return null
      }

      await refreshPlayers()
      return data
    } catch (err: any) {
      console.error('[usePlayers] Unexpected error in deletePlayer:', err)
      setError(err.message || 'Failed to delete player')
      return null
    }
  }

  return { players, loading, error, addPlayer, updatePlayer, deletePlayer, refreshPlayers }
}
