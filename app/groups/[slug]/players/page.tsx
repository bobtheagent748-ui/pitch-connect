'use client'

import { useState, useEffect } from 'react'
import { redirect, usePathname } from 'next/navigation'

export default function GroupPlayersPage({ params }: { params: { slug: string } }) {
  // Redirect to the new games page (which now includes both games and players via tabs)
  redirect(`/groups/${params.slug}/games`)
}
