// This is the game detail page
// It shows a specific game with RSVP status
'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Calendar, MapPin, ArrowLeft } from 'lucide-react'

export default function GameDetailPage() {
  const params = useParams()
  const router = useRouter()
  const gameId = (params?.id as string) ?? ''
  
  // In a real app, you'd fetch game details from API
  const game = {
    id: gameId,
    name: 'Test Game',
    date: '2026-06-04',
    time: '19:00',
    field_name: 'Test Field',
    field_address: 'Test Address',
    notes: 'Bring water and cleats',
  }
  
  const rsvpOptions = ['yes', 'no', 'maybe']

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Games
      </button>

      <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{game.name}</h1>
            <div className="flex items-center gap-3 text-gray-500 mt-2">
              <Calendar className="w-4 h-4" />
              <span>{game.date}</span>
              <MapPin className="w-4 h-4 ml-4" />
              <span>{game.field_name}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h2 className="font-medium mb-4">RSVP Status</h2>
          <div className="space-y-3">
            {rsvpOptions.map(status => (
              <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-900 font-medium capitalize">{status}</span>
                <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                  0
                </span>
              </div>
            ))}
          </div>
          
          <button className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium">
            Mark My RSVP
          </button>
        </div>
      </div>
    </div>
  )
}
