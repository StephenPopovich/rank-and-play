import { prisma } from "@/lib/db";

export default async function HallOfFamePage() {
  // Placeholder approach: top rated games by community avg
  const games = await prisma.game.findMany({
    take: 20,
    include: { ratings: true },
  });

  const ranked = games
    .map((g) => {
      const avg = g.ratings.length ? g.ratings.reduce((s, r) => s + r.avg, 0) / g.ratings.length : 0;
      return { ...g, hofAvg: avg };
    })
    .sort((a, b) => b.hofAvg - a.hofAvg)
    .slice(0, 10);

  const issues = await prisma.newsletterIssue.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Hall of Fame</h1>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
        <h2 className="text-lg font-semibold">Top community games</h2>
        <div className="mt-3 space-y-2">
          {ranked.map((g, idx) => (
            <div key={g.id} className="flex items-center justify-between rounded-xl bg-zinc-950/50 p-3 ring-1 ring-zinc-800">
              <div className="text-sm">
                <span className="mr-2 font-semibold">#{idx + 1}</span>
                {g.name}
              </div>
              <div className="text-sm text-zinc-300">{g.hofAvg ? g.hofAvg.toFixed(2) : "0.00"} / 5</div>
            </div>
          ))}
          {!ranked.length && <div className="text-sm text-zinc-500">No games rated yet.</div>}
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
        <h2 className="text-lg font-semibold">Hall of Fame Newsletter</h2>
        <p className="mt-2 text-sm text-zinc-300">
          Monthly highlights, top rated games, standout moments, and creator picks.
        </p>
        <form className="mt-3 flex gap-2" method="post" action="/api/newsletter/subscribe">
          <input name="email" type="email" required placeholder="Email" className="w-full rounded bg-zinc-950 p-2 ring-1 ring-zinc-800" />
          <button className="rounded bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500">Subscribe</button>
        </form>

        <div className="mt-4 space-y-2">
          {issues.map((i) => (
            <a key={i.id} href={`/newsletter/${i.slug}`} className="block rounded-xl bg-zinc-950/50 p-3 ring-1 ring-zinc-800 hover:bg-zinc-950">
              <div className="text-sm font-semibold">{i.title}</div>
              <div className="text-xs text-zinc-400">{i.summary ?? ""}</div>
            </a>
          ))}
          {!issues.length && <div className="text-sm text-zinc-500">No issues yet.</div>}
        </div>
      </div>
    </div>
  );
}
