'use client'

import { redirect, usePathname } from 'next/navigation'

export default function PlayersPage() {
  redirect('/groups')
  return null
}
