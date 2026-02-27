# RankAndPlay Starter (Next.js + Prisma + Postgres)

This starter includes:

- Next.js App Router
- Tailwind CSS
- Prisma + PostgreSQL
- NextAuth credentials auth (email + password)
- Role based access (USER, BLOGGER, STREAMER, MOD, ADMIN, OWNER)
- Blog posts and game reviews with tags
- Forum categories, threads, and replies
- Game pages that load on demand from RAWG and only store in DB once a user clicks a game
- Hall of Fame placeholder (top rated games)
- Newsletter issues (admin created) and a subscribe placeholder

---

## Why this is efficient

- Game list pages pull from RAWG and are cached for 1 hour.
- A game detail page only gets stored in your DB when it is requested.
- Rating and comments are server actions, so no extra client bundles.
- PostgreSQL scales extremely well and is cheap.
- Static pages + caching reduce DB load significantly.

---

## Setup

### 1) Install

```bash
npm install
```

---

### 2) Env

```bash
cp .env.example .env
```

Fill in:

- DATABASE_URL
- NEXTAUTH_SECRET
- RAWG_API_KEY

---

## Database Setup

You need a PostgreSQL database.

### Option A — Supabase (Recommended Free Option)

Create a free project:

https://supabase.com/

Go to:

Project Settings → Database → Connection String

Copy the Prisma connection string and paste into:

```
DATABASE_URL="postgresql://..."
```

---

### Option B — Neon (Also Free)

https://neon.tech/

Create project → Copy connection string → Paste into:

```
DATABASE_URL="postgresql://..."
```

---

### Option C — Local PostgreSQL

Install locally:

https://www.postgresql.org/download/

Create DB:

```sql
CREATE DATABASE rankandplay;
```

Connection example:

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/rankandplay"
```

---

## Generate NEXTAUTH Secret

Run:

```bash
openssl rand -base64 32
```

Paste into:

```
NEXTAUTH_SECRET=
```

---

## RAWG API Setup

Get a free API key:

https://rawg.io/apidocs

Paste into:

```
RAWG_API_KEY=
```

---

### 3) Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init
npm install -D tsx
npx tsx prisma/seed.ts
```

---

### 4) Run

```bash
npm run dev
```

Visit:

http://localhost:3000

---

## Roles and levels

- USER: rate, comment, post in forum
- BLOGGER: can create blog posts
- STREAMER: same as blogger + future streamer profile features
- MOD: moderation tools (future)
- ADMIN: manage users, create newsletter issues
- OWNER: highest level

Roles are updated at `/admin` (admins only).

---

## Included Systems

- Blog system
- Game reviews
- Forum threads + replies
- RAWG game ingestion
- Hall of Fame logic
- Newsletter publishing

---

## Common Setup Issues

### Prisma client error?

Run:

```bash
npx prisma generate
```

---

### DB connection failing?

Check:

- DATABASE_URL is correct
- DB allows external connections
- SSL is enabled if required (Supabase / Neon)

---

### Migration issues?

Try:

```bash
npx prisma migrate reset
```

---

## Next steps you will probably want

- Replace credentials auth with OAuth or magic link
- Add Cloudflare Turnstile on signup/login
- Add Redis rate limiting (Upstash)
- Add moderation tools
- Add newsletter double opt-in
- Add search with Meilisearch or Typesense

---

## Why this project matters

This project demonstrates:

- Full stack architecture
- External API ingestion
- Role-based permissions
- Efficient database design
- Scalable patterns

---

## Reviewer Quick Start

To run locally:

1) Clone repo  
2) Create Supabase or Neon DB  
3) Add DATABASE_URL  
4) Add RAWG_API_KEY  
5) Run migrations  
6) Run dev server  

You're live.