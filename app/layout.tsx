import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { GroupProvider } from "@/lib/group-context"
import { Providers } from "./providers"
import { auth } from "@/auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "The Pitch Connect — Soccer Game Coordination",
  description: "Schedule games, track players, coordinate your soccer group",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers session={session}>
          <GroupProvider>
            <Header />
            <main className="min-h-screen bg-white">
              {children}
            </main>
          </GroupProvider>
        </Providers>
      </body>
    </html>
  )
}
