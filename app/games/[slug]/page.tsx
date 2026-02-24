import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import RatingForm from "./ratingForm";
import CommentForm from "./commentForm";

type RawgGame = {
  id: number;
  slug: string;
  name: string;
  description_raw?: string;
  background_image?: string | null;
  released?: string | null;
};

async function fetchRawgGame(rawgId: string) {
  const key = process.env.RAWG_API_KEY;
  if (!key) throw new Error("RAWG_API_KEY missing");
  const res = await fetch(`https://api.rawg.io/api/games/${rawgId}?key=${key}`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error("RAWG fetch failed");
  return (await res.json()) as RawgGame;
}

async function upsertGameFromRawg(slug: string, rawgId?: string | null) {
  if (!rawgId) {
    // If you want: fetch by slug here. Keeping it simple.
    return prisma.game.findUnique({ where: { slug } });
  }
  const rawg = await fetchRawgGame(rawgId);
  const released = rawg.released ? new Date(rawg.released) : null;

  return prisma.game.upsert({
    where: { slug },
    update: {
      rawgId: rawg.id,
      name: rawg.name,
      description: rawg.description_raw ?? null,
      coverUrl: rawg.background_image ?? null,
      released: released ?? undefined,
    },
    create: {
      rawgId: rawg.id,
      slug: rawg.slug,
      name: rawg.name,
      description: rawg.description_raw ?? null,
      coverUrl: rawg.background_image ?? null,
      released: released ?? undefined,
    },
  });
}

export default async function GamePage({ params, searchParams }: { params: { slug: string }, searchParams: { rawgId?: string } }) {
  const session = await getServerSession(authOptions);
  const game = await upsertGameFromRawg(params.slug, searchParams.rawgId);

  if (!game) {
    return <div className="text-zinc-300">Game not found.</div>;
  }

  const [ratings, comments] = await Promise.all([
    prisma.gameRating.findMany({ where: { gameId: game.id } }),
    prisma.comment.findMany({ where: { gameId: game.id }, include: { author: true }, orderBy: { createdAt: "desc" }, take: 50 }),
  ]);

  const avg = ratings.length ? (ratings.reduce((s, r) => s + r.avg, 0) / ratings.length) : null;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
        <h1 className="text-2xl font-bold">{game.name}</h1>
        <div className="mt-1 text-sm text-zinc-400">
          Community avg: {avg ? avg.toFixed(2) : "No ratings yet"} / 5
        </div>
        <p className="mt-3 text-sm leading-6 text-zinc-300 line-clamp-6">{game.description ?? "No description yet."}</p>
        <div className="mt-3 text-xs text-zinc-500">
          You can edit this page later from an admin route by overriding description, tags, or cover.
        </div>
      </div>

      {session?.user ? (
        <div className="grid gap-4 md:grid-cols-2">
          <RatingForm gameId={game.id} />
          <CommentForm gameId={game.id} />
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 text-zinc-300">
          Sign in to rate and comment.
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Comments</h2>
        {comments.map((c) => (
          <div key={c.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-3">
            <div className="text-xs text-zinc-400">{c.author.name ?? c.author.email} • {new Date(c.createdAt).toLocaleString()}</div>
            <div className="mt-2 text-sm text-zinc-200">{c.body}</div>
          </div>
        ))}
        {!comments.length && <div className="text-sm text-zinc-500">No comments yet.</div>}
      </div>
    </div>
  );
}
