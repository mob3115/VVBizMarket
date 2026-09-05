# VV Biz Market

A values-based marketplace for buying and selling small businesses. Buyers and sellers match based on shared core values, goal alignment, budget fit, industry, and location.

## Tech Stack

- **Frontend:** React 18, Vite, TailwindCSS, shadcn/ui, TanStack Query, Wouter
- **Backend:** Node.js, Express 5, Drizzle ORM
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel (serverless) + GitHub CI

## Local Development

```bash
# Install dependencies
npm install

# Create .env file from template
cp .env.example .env
# Fill in your Supabase credentials

# Push schema to Supabase
npm run db:push

# Start dev server
npm run dev
```

Open [http://localhost:5000](http://localhost:5000)

## Deployment (Vercel)

1. Push to `main` branch on GitHub
2. Vercel auto-deploys on every push
3. Set environment variables in Vercel → Project → Settings → Environment Variables

## Environment Variables

See `.env.example` for all required variables.

| Variable | Description |
|---|---|
| `DATABASE_URL` | Supabase Transaction Pooler URI |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SECRET_KEY` | Supabase secret key (server-side only) |
| `VITE_SUPABASE_URL` | Supabase project URL (client-side) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key (client-side) |
| `SESSION_SECRET` | Random secret for signing session cookies |

## Database

```bash
# Push schema changes
npm run db:push

# Open Drizzle Studio (visual DB browser)
npm run db:studio
```
