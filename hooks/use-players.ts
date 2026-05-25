'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { NewPlayerData } from '@/lib/types'

export function usePlayers() {
  const [players, setPlayers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const refreshPlayers = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchErr } = await supabase
        .from('players')
        .select('*')
        .order('name', { ascending: true })

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
  }, [])

  const addPlayer = async (formData: NewPlayerData) => {
    setError(null)
    console.log('[usePlayers] addPlayer called with:', formData)
    
    try {
      const { data, error: insertErr } = await supabase
        .from('players')
        .insert([
          {
            name: formData.name,
            email: formData.email || null,
            phone: formData.phone || null,
          },
        ])
        .select()
        .single()

      if (insertErr) {
        console.error('[usePlayers] Error creating player:', insertErr)
        console.error('[usePlayers] Supabase error code:', insertErr.code)
        console.error('[usePlayers] Supabase details:', insertErr.details)
        setError(insertErr.message)
        return null
      }

      console.log('[usePlayers] Player created:', data)
      
      // Refresh the list after insert
      console.log('[usePlayers] Calling refreshPlayers after insert...')
      await refreshPlayers()
      console.log('[usePlayers] refreshPlayers completed after insert')
      
      return data
    } catch (err: any) {
      console.error('[usePlayers] Unexpected error in addPlayer:', err)
      setError(err.message || 'Failed to add player')
      return null
    }
  }

  const updatePlayer = async (playerId: string, formData: NewPlayerData) => {
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
    console.log('[usePlayers] deletePlayer called for ID:', playerId)
    
    try {
      const { data, error: deleteErr } = await supabase
        .from('players')
        .delete()
        .eq('id', playerId)
        .select()

      if (deleteErr) {
        console.error('[usePlayers] Error deleting player:', deleteErr)
        console.error('[usePlayers] Supabase error code:', deleteErr.code)
        console.error('[usePlayers] Supabase details:', deleteErr.details)
        setError(deleteErr.message)
        return null
      }

      console.log('[usePlayers] Player deleted successfully, data:', data)
      
      // Refresh the list after delete
      console.log('[usePlayers] Calling refreshPlayers after delete...')
      await refreshPlayers()
      console.log('[usePlayers] refreshPlayers completed after delete')
      
      return data
    } catch (err: any) {
      console.error('[usePlayers] Unexpected error in deletePlayer:', err)
      setError(err.message || 'Failed to delete player')
      return null
    }
  }

  return { players, loading, error, addPlayer, updatePlayer, deletePlayer, refreshPlayers }
}