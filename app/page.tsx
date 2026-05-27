'use client'

import { useRouter } from 'next/navigation'
import { useGroups } from '@/hooks/use-groups'
import { Trophy, Plus, Users2, Shield, UserPlus, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()
  const { myGroups, joinedGroups, loading } = useGroups()

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
  if (!hasAnyGroups) {
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
          <Link
            href="/groups"
            className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg text-lg font-medium transition"
          >
            <Plus className="w-5 h-5" />
            Create your first group
          </Link>
        </div>
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

      {/* My Groups Section */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-500" />
            My Groups
          </h2>
          <Link
            href="/groups"
            className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            Create Group
          </Link>
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
            <Link href="/groups" className="text-red-500 hover:text-red-600 text-sm font-medium mt-1 inline-block">
              Create your first group →
            </Link>
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
