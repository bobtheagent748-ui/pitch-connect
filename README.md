# PitchConnect — Soccer Game Scheduling & RSVP Tool
## Quick Start (5 min)

### 1. Install & Configure
```bash
# 1. Install dependencies
cd /Users/agentbob/ai-project/pitch-connect
npm install

# 2. Create environment file
cp .env.example .env.local
# then edit .env.local with your Supabase URL & Anon Key
```

### 2. Set Up Database (1 min in Supabase)
1. Go to https://app.supabase.com → Create project (free)
2. SQL Editor → paste contents of `supabase/schema.sql` → Run

### 3. Run Locally
```bash
npm run dev
```
Open http://localhost:3000 — you're done!

### 4. Deploy to Vercel
```bash
npm i -g vercel
vercel
```
Or connect GitHub repo to Vercel.com for auto-deploy.

---

## Project Structure
```
src/
  ├── app/              Next.js pages (Home only — MVP)
  ├── components/       Reusable UI (Button, Card, GameList)
  ├── hooks/           Custom hooks (useGames)
  └── lib/             Supabase client + utils
```

## Features Built
- **Game scheduling** — create/manage games
- **Game list** — display upcoming games
- **RSVP buttons** — Yes / Maybe / Can't Go
- **WhatsApp sharing** — share game details via `wa.me`

## What's Next (for you)
- Add player roster management
- Add magic link auth
- Connect to live Vercel deployment
- Polish UI / add animations
