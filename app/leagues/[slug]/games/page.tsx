'use client'

import { redirect } from 'next/navigation'

export default function LeagueGamesPage({ params }: { params: { slug: string } }) {
  redirect(`/leagues/${params.slug}`)
}
