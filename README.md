# RankAndPlay Starter (Next.js + Prisma + Postgres)

This starter includes:
- Next.js App Router
- Tailwind CSS
- Prisma + Postgres
- NextAuth credentials auth (email + password)
- Role based access (USER, BLOGGER, STREAMER, MOD, ADMIN, OWNER)
- Blog posts and game reviews with tags
- Forum categories, threads, and replies
- Game pages that load on demand from RAWG and only store in DB once a user clicks a game
- Hall of Fame placeholder (top rated games)
- Newsletter issues (admin created) and a subscribe placeholder

## Why this is efficient
- Game list pages pull from RAWG and are cached for 1 hour.
- A game detail page only gets stored in your DB when it is requested.
- Rating and comments are server actions, so no extra client bundles.
- Postgres is cheap and scales well. Static pages and cached data keep DB load down.

## Setup
1) Install
```bash
npm i
```

2) Env
```bash
cp .env.example .env
```
Fill in:
- DATABASE_URL
- NEXTAUTH_SECRET
- RAWG_API_KEY

3) Prisma
```bash
npx prisma generate
npx prisma migrate dev --name init
node --loader ts-node/esm prisma/seed.ts
```

Note: If ts-node is not installed, you can run seed via `tsx` or add a script. Simplest:
```bash
npm i -D tsx
npx tsx prisma/seed.ts
```

4) Run
```bash
npm run dev
```

## Roles and levels
- USER: rate, comment, post in forum, message (to be added)
- BLOGGER: can create blog posts
- STREAMER: same as blogger plus future streamer profile features
- MOD: future moderation tools
- ADMIN: manage users, create newsletter issues
- OWNER: highest level

Roles are updated at `/admin` (admins only).

## Next steps you will probably want
- Replace credentials auth with email magic link or OAuth.
- Add Cloudflare Turnstile on signup, login, comments, ratings.
- Add Redis rate limiting (Upstash) for multiple server instances.
- Add a dedicated Subscriber table for newsletter double opt-in.
- Add a moderation queue and spam scoring.
- Add search with Meilisearch or Typesense when content grows.
