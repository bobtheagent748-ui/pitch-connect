'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useGroups } from '@/hooks/use-groups'
import { Plus, Trophy } from 'lucide-react'

export default function GroupsPage() {
  const router = useRouter()
  const { groups, refresh, createGroup, loading } = useGroups()
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) {
      setError('Group name is required')
      return
    }
    const autoSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    setSlug(slug || autoSlug)
    try {
      await createGroup(name, slug || autoSlug, description)
      setSuccess('Group created!')
      setName('')
      setSlug('')
      setDescription('')
      setTimeout(() => setSuccess(''), 3000)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to create group')
    }
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Delete this group? All associated games and players will be removed.')) return
    // TODO: implement deleteGroup
    router.refresh()
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-red-500" />
            Groups
          </h1>
        </div>
        <div className="text-center py-12 text-gray-400">Loading groups...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-red-500" />
            Groups
          </h1>
          <p className="text-gray-600 mt-1">Create and manage your soccer groups. Each group has its own games and players.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Group
        </button>
      </div>

      {showCreate && (
        <div className="mb-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Create a New Group</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Saturday Pick-up Soccer" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" autoFocus />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">pitchconnect.io/groups/</span>
                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="saturday-pickup" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Weekly casual match" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Create Group</button>
              <button type="button" onClick={() => setShowCreate(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {success && <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>}
      {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

      {groups.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No groups yet</p>
          <button onClick={() => setShowCreate(true)} className="text-red-500 hover:text-red-600 font-medium">Create your first group →</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map(group => (
            <div
              key={group.id}
              onClick={() => router.push(`/groups/${group.slug}/games`)}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md hover:border-red-200 transition cursor-pointer relative group"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition">
                <button onClick={(e) => handleDelete(group.id, e)} className="text-gray-400 hover:text-red-500 transition p-1" title="Delete group">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-red-50 rounded-lg p-2">
                  <Trophy className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{group.name}</h3>
                  <p className="text-xs text-gray-400">/{group.slug}</p>
                  {group.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{group.description}</p>}
                </div>
              </div>
              <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                <span className="flex items-center gap-1">Click to manage games & players</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
