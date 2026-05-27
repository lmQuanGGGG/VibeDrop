# VibeDrop

VibeDrop is a prompt-sharing platform built with Next.js App Router, Supabase SSR, and shadcn/ui.

## Setup

1. Copy environment variables:

```bash
cp .env.example .env.local
```

2. Fill in the Supabase values in `.env.local`.

3. Create the database tables and functions using:

- `supabase/schema.sql`
- `supabase/rls.sql`

4. Run the app:

```bash
npm run dev
```

## Scripts

- `npm run dev` - start the dev server
- `npm run build` - production build
- `npm run start` - start production server
- `npm run lint` - run lint checks
# VibeDrop
