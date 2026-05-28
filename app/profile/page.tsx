'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Trophy, User, Save } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/signin')
    }
  }, [status, router])

  // Load existing profile data
  useEffect(() => {
    if (session?.user?.id) {
      const loadProfile = async () => {
        const { data } = await supabase
          .from('users')
          .select('name, email, phone, position')
          .eq('id', session.user.id)
          .single()
        if (data) {
          setFormData({
            name: data.name || '',
            email: data.email || session.user.email || '',
            phone: data.phone || '',
            position: data.position || '',
          })
        } else {
          setFormData(prev => ({
            ...prev,
            email: session.user.email || '',
          }))
        }
      }
      loadProfile()
    }
  }, [session])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const { error } = await supabase
      .from('users')
      .update({
        name: formData.name,
        phone: formData.phone,
        position: formData.position,
      })
      .eq('id', session?.user?.id)

    setSaving(false)
    if (error) {
      setMessage('Error saving profile.')
    } else {
      setMessage('Profile updated!')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  if (status === 'loading') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex justify-center">
        <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/" className="flex items-center gap-2 text-red-500 font-bold text-lg hover:text-red-600">
          <Trophy className="w-6 h-6" />
        </Link>
        <User className="w-5 h-5 text-gray-400" />
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your full name"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            disabled
            className="bg-gray-50 text-gray-500 cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">Email is your login — cannot be changed here.</p>
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 555-0123"
          />
        </div>

        <div>
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            placeholder="Goalkeeper, Forward, etc."
          />
        </div>

        {message && (
          <p className={`text-sm ${message.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
            {message}
          </p>
        )}

        <Button
          type="submit"
          disabled={saving}
          className="w-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>
      </form>
    </div>
  )
}
