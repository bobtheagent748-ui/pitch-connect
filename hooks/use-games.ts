import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { NewGameData } from '@/lib/types'

export function useGames(groupId: string | null = null) {
  const [games, setGames] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const refreshGames = async () => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase
        .from('games')
        .select('*')
        .order('date', { ascending: true })
        .range(0, 100)

      if (groupId) {
        query = query.eq('league_id', groupId)
      }

      const { data, error: fetchErr } = await query

      if (fetchErr) {
        console.error('Error fetching games:', fetchErr)
        setError(fetchErr.message)
      } else if (data) {
        setGames(data)
      }
    } catch (err: any) {
      console.error('Error fetching games:', err)
      setError(err.message || 'Failed to load games')
    }
    setLoading(false)
  }

  useEffect(() => {
    refreshGames()
  }, [groupId])

  const createGame = async (formData: NewGameData) => {
    setError(null)
    const { data, error: insertErr } = await supabase
      .from('games')
      .insert([
        {
          field_name: formData.field_name,
          full_address: formData.full_address,
          date: formData.date,
          time: formData.time,
          notes: formData.notes || '',
          league_id: groupId,
        },
      ])
      .select()
      .single()

    if (insertErr) {
      console.error('Error creating game:', insertErr)
      setError(insertErr.message)
      return
    }

    await refreshGames()
  }

  const updateGame = async (gameId: string, formData: NewGameData) => {
    setError(null)
    const { error: updateErr } = await supabase
      .from('games')
      .update({
        field_name: formData.field_name,
        full_address: formData.full_address,
        date: formData.date,
        time: formData.time,
        notes: formData.notes || '',
      })
      .eq('id', gameId)

    if (updateErr) {
      console.error('Error updating game:', updateErr)
      setError(updateErr.message)
      return
    }

    await refreshGames()
  }

  const deleteGame = async (gameId: string) => {
    const { error: deleteErr } = await supabase
      .from('games')
      .delete()
      .eq('id', gameId)

    if (deleteErr) {
      console.error('Error deleting game:', deleteErr)
      setError(deleteErr.message)
      return
    }

    await refreshGames()
  }

  return { games, loading, error, createGame, updateGame, deleteGame, refreshGames }
}
