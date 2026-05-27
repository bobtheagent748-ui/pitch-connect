'use client'

import { redirect, usePathname } from 'next/navigation'

export default function GamesPage() {
  redirect('/groups')
  // Never reached
  return null
}
