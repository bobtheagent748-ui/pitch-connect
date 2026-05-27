import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { GroupProvider } from "@/lib/group-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PitchConnect — Soccer Game Coordination",
  description: "Schedule games, track players, coordinate your soccer group",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GroupProvider>
          <Header />
          <main className="min-h-screen bg-white">
            {children}
          </main>
        </GroupProvider>
      </body>
    </html>
  )
}
