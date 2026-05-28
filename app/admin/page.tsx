'use client'

import { useState, useEffect } from 'react'
import { login, logout, isAdmin } from './actions'
import { AdminPanel } from './AdminPanel'

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    isAdmin().then(setAuthenticated)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const ok = await login(password)
    setLoading(false)
    if (ok) {
      setAuthenticated(true)
      setPassword('')
    } else {
      setError('Invalid password')
    }
  }

  const handleLogout = async () => {
    await logout()
    setAuthenticated(false)
  }

  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 w-full max-w-sm">
          <h1 className="text-xl font-bold text-gray-900 mb-6">Admin</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
          <button
            type="submit"
            disabled={!password || loading}
            className="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 rounded-md disabled:opacity-50 transition"
          >
            {loading ? 'Verifying...' : 'Login'}
          </button>
        </form>
      </div>
    )
  }

  return <AdminPanel onLogout={handleLogout} />
}
