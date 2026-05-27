import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Group } from '@/lib/types'

export function useGroups(userId?: string | null) {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const refresh = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('leagues')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    if (error || !data) {
      setGroups([])
    } else {
      setGroups(data)
    }
    setLoading(false)
  }, [])

  const createGroup = async (name: string, slug: string, description?: string, ownerId?: string) => {
    const payload: Record<string, any> = { name, slug, description }
    if (ownerId) payload.owner_id = ownerId
    await supabase.from('leagues').insert(payload)
    await refresh()
    return slug
  }

  const deleteGroup = async (id: string) => {
    await supabase.from('leagues').update({ deleted_at: new Date().toISOString() }).eq('id', id)
    await refresh()
  }

  const getGroupBySlug = async (slug: string) => {
    const { data, error } = await supabase.from('leagues')
      .select('*')
      .is('deleted_at', null)
      .eq('slug', slug)
      .single()
    if (error || !data) return null
    return data
  }

  useEffect(() => {
    refresh()
  }, [refresh])

  // When auth is wired up, pass userId to filter groups:
  // - myGroups: groups the user owns (owner_id === userId)
  // - joinedGroups: groups the user is a member/invited to (in league_members but not owner)
  // For now without auth, show all groups in both sections
  const myGroups = userId
    ? groups.filter(g => g.owner_id === userId)
    : groups

  const joinedGroups = userId
    ? groups.filter(g => g.owner_id !== userId)
    : []

  return { groups, myGroups, joinedGroups, loading, refresh, createGroup, deleteGroup, getGroupBySlug }
}
