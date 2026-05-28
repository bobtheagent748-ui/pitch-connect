'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import { LogOut } from 'lucide-react'

const PAGE_SIZE = 25
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

type Tab = 'groups' | 'games' | 'players'

interface AdminPanelProps {
  onLogout: () => void
}

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const [tab, setTab] = useState<Tab>('groups')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
        <button
          onClick={onLogout}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200 bg-white px-6">
        {(['groups', 'games', 'players'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
              tab === t
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {tab === 'groups' && <GroupsSection />}
        {tab === 'games' && <GamesSection />}
        {tab === 'players' && <PlayersSection />}
      </div>
    </div>
  )
}

// ─── Pagination helper ───────────────────────────────────────────

function Pagination({ page, totalCount, onPageChange }: {
  page: number
  totalCount: number
  onPageChange: (p: number) => void
}) {
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  return (
    <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
      <span>{totalCount} total</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Prev
        </button>
        <span className="text-gray-700">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  )
}

// ─── Groups Section ──────────────────────────────────────────────

function GroupsSection() {
  const [rows, setRows] = useState<any[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async (p: number) => {
    setLoading(true)
    const from = (p - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    const { data, count, error } = await supabase
      .from('leagues')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)
    if (!error) {
      setRows(data || [])
      setTotalCount(count || 0)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData(page) }, [page, fetchData])

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Slug</th>
              <th className="px-4 py-2 font-medium">Owner</th>
              <th className="px-4 py-2 font-medium">Created</th>
              <th className="px-4 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No groups found</td></tr>
            ) : rows.map((row) => (
              <tr key={row.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-gray-900">{row.name}</td>
                <td className="px-4 py-2 text-gray-500">{row.slug}</td>
                <td className="px-4 py-2 text-gray-500">{row.owner_id?.slice(0, 8) || '—'}</td>
                <td className="px-4 py-2 text-gray-500">{new Date(row.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  {row.deleted_at ? (
                    <span className="text-red-500 text-xs">Deleted</span>
                  ) : (
                    <span className="text-green-600 text-xs">Active</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalCount={totalCount} onPageChange={setPage} />
    </div>
  )
}

// ─── Games Section ───────────────────────────────────────────────

function GamesSection() {
  const [rows, setRows] = useState<any[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async (p: number) => {
    setLoading(true)
    const from = (p - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    const { data, count, error } = await supabase
      .from('games')
      .select('*', { count: 'exact' })
      .order('date', { ascending: false })
      .range(from, to)
    if (!error) {
      setRows(data || [])
      setTotalCount(count || 0)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData(page) }, [page, fetchData])

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-2 font-medium">Field</th>
              <th className="px-4 py-2 font-medium">Group</th>
              <th className="px-4 py-2 font-medium">Date</th>
              <th className="px-4 py-2 font-medium">Time</th>
              <th className="px-4 py-2 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No games found</td></tr>
            ) : rows.map((row) => (
              <tr key={row.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-gray-900">{row.field_name}</td>
                <td className="px-4 py-2 text-gray-500">{row.league_id?.slice(0, 8) || '—'}</td>
                <td className="px-4 py-2 text-gray-500">{row.date}</td>
                <td className="px-4 py-2 text-gray-500">{row.time}</td>
                <td className="px-4 py-2 text-gray-500">{new Date(row.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalCount={totalCount} onPageChange={setPage} />
    </div>
  )
}

// ─── Players Section ─────────────────────────────────────────────

function PlayersSection() {
  const [rows, setRows] = useState<any[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async (p: number) => {
    setLoading(true)
    const from = (p - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    const { data, count, error } = await supabase
      .from('players')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)
    if (!error) {
      setRows(data || [])
      setTotalCount(count || 0)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData(page) }, [page, fetchData])

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Email</th>
              <th className="px-4 py-2 font-medium">Phone</th>
              <th className="px-4 py-2 font-medium">Position</th>
              <th className="px-4 py-2 font-medium">Group</th>
              <th className="px-4 py-2 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No players found</td></tr>
            ) : rows.map((row) => (
              <tr key={row.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-gray-900">{row.name}</td>
                <td className="px-4 py-2 text-gray-500">{row.email}</td>
                <td className="px-4 py-2 text-gray-500">{row.phone || '—'}</td>
                <td className="px-4 py-2 text-gray-500">{row.position || '—'}</td>
                <td className="px-4 py-2 text-gray-500">{row.league_id?.slice(0, 8) || '—'}</td>
                <td className="px-4 py-2 text-gray-500">{new Date(row.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalCount={totalCount} onPageChange={setPage} />
    </div>
  )
}
