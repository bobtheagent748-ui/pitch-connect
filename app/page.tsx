'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGroups } from '@/hooks/use-groups'
import { Trophy, Plus, Users2, Shield, UserPlus, ArrowRight, X } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const { myGroups, joinedGroups, loading, createGroup, refresh } = useGroups()
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setCreating(true)
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    await createGroup(name, slug, description)
    await refresh()
    setName('')
    setDescription('')
    setShowCreate(false)
    setCreating(false)
    router.push(`/groups/${slug}`)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto" />
            <div className="h-4 bg-gray-100 rounded w-48 mx-auto" />
          </div>
        </div>
      </div>
    )
  }

  const hasAnyGroups = (myGroups && myGroups.length > 0) || (joinedGroups && joinedGroups.length > 0)

  // No groups at all — empty state
  if (!hasAnyGroups && !showCreate) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">PitchConnect</h1>
          <p className="text-gray-600">Organize your soccer games with groups</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-12 text-center border border-dashed border-gray-200">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No groups yet</h2>
          <p className="text-gray-600 mb-6">Create your first group to start scheduling games and inviting players.</p>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg text-lg font-medium transition"
          >
            <Plus className="w-5 h-5" />
            Create your first group
          </button>
        </div>
        {showCreate && (
          <CreateGroupForm
            name={name} setName={setName}
            description={description} setDescription={setDescription}
            onSubmit={handleCreate} onCancel={() => setShowCreate(false)}
            creating={creating}
          />
        )}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">PitchConnect</h1>
        <p className="text-gray-600">Your soccer groups at a glance</p>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="mb-8">
          <CreateGroupForm
            name={name} setName={setName}
            description={description} setDescription={setDescription}
            onSubmit={handleCreate} onCancel={() => setShowCreate(false)}
            creating={creating}
          />
        </div>
      )}

      {/* My Groups Section */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-500" />
            My Groups
          </h2>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            Create Group
          </button>
        </div>

        {myGroups && myGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myGroups.map(group => (
              <div
                key={group.id}
                onClick={() => router.push(`/groups/${group.slug}`)}
                className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md hover:border-red-200 transition cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-red-50 rounded-lg p-2.5 shrink-0 group-hover:bg-red-100 transition">
                    <Trophy className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{group.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">/{group.slug}</p>
                    {group.description && (
                      <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">{group.description}</p>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-red-400 transition shrink-0 mt-1" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center border border-dashed border-gray-200">
            <Users2 className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No groups yet</p>
            <button onClick={() => setShowCreate(true)} className="text-red-500 hover:text-red-600 text-sm font-medium mt-1 inline-block">
              Create your first group →
            </button>
          </div>
        )}
      </section>

      {/* Joined Groups Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-500" />
            Joined Groups
          </h2>
        </div>

        {joinedGroups && joinedGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {joinedGroups.map(group => (
              <div
                key={group.id}
                onClick={() => router.push(`/groups/${group.slug}`)}
                className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 rounded-lg p-2.5 shrink-0 group-hover:bg-blue-100 transition">
                    <UserPlus className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{group.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">/{group.slug}</p>
                    {group.description && (
                      <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">{group.description}</p>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition shrink-0 mt-1" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center border border-dashed border-gray-200">
            <UserPlus className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">You haven't joined any groups yet</p>
            <p className="text-gray-400 text-xs mt-1">Groups you're invited to will appear here</p>
          </div>
        )}
      </section>
    </div>
  )
}

function CreateGroupForm({
  name, setName,
  description, setDescription,
  onSubmit, onCancel,
  creating,
}: {
  name: string; setName: (v: string) => void
  description: string; setDescription: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  creating: boolean
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Create a New Group</h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Saturday Pick-up Soccer"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Weekly casual match"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={creating || !name.trim()}
            className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            {creating ? 'Creating...' : 'Create Group'}
          </button>
          <button type="button" onClick={onCancel} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
