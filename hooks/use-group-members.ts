import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useGroupMembers(groupId: string | null = null) {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const refresh = async () => {
    setLoading(true)
    if (!groupId) {
      setMembers([])
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('league_members')
      .select('*, players(*)')
      .eq('league_id', groupId)

    if (error) {
      console.error('Error fetching group members:', error)
      setMembers([])
    } else if (data) {
      setMembers(data)
    }
    setLoading(false)
  }

  const addMember = async (groupId: string, playerId: string) => {
    const { error } = await supabase
      .from('league_members')
      .insert({"league_id": groupId, "player_id": playerId})
    
    await refresh()
    return !error
  }

  const removeMember = async (groupId: string, playerId: string) => {
    const { error } = await supabase
      .from('league_members')
      .delete()
      .match({"league_id": groupId, "player_id": playerId})
    
    await refresh()
    return !error
  }

  const isMember = async (groupId: string, playerId: string) => {
    const { data, error } = await supabase
      .from('league_members')
      .select('id')
      .match({"league_id": groupId, "player_id": playerId})
      .single()
    
    return !error && data !== null
  }

  useEffect(() => {
    refresh()
  }, [groupId])

  return { members, loading, refresh, addMember, removeMember, isMember }
}

export default useGroupMembers
