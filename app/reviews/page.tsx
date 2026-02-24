import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function ReviewsPage() {
  const posts = await prisma.post.findMany({
    where: { type: "REVIEW", published: true },
    orderBy: { createdAt: "desc" },
    take: 30,
    include: { game: true },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Game Reviews</h1>
        <Link href="/editor/new?type=REVIEW" className="rounded bg-zinc-800 px-3 py-2 hover:bg-zinc-700">Write</Link>
      </div>

      <div className="space-y-3">
        {posts.map((p) => (
          <Link key={p.id} href={`/post/${p.slug}`} className="block rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 hover:bg-zinc-900">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-lg font-semibold">{p.title}</div>
                <div className="mt-1 text-sm text-zinc-400">
                  {p.game ? `Game: ${p.game.name}` : "Game: not linked"} • Score: {p.overallScore ?? "n/a"} / 5
                </div>
              </div>
              <div className="text-xs text-zinc-500">Open</div>
            </div>
          </Link>
        ))}
        {!posts.length && <div className="text-zinc-500">No reviews yet.</div>}
      </div>
    </div>
  );
}
