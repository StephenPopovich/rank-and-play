import Link from "next/link";

type RawgList = {
  results: Array<{ id: number; slug: string; name: string; background_image?: string | null; released?: string | null }>;
};

async function fetchGames(q: string, page: string) {
  const url = new URL("http://localhost:3000/api/rawg/games");
  url.searchParams.set("q", q);
  url.searchParams.set("page", page);
  // In production, use absolute URL from headers. For starter simplicity we use relative via fetch below.
  const res = await fetch(`${process.env.NEXTAUTH_URL ?? ""}/api/rawg/games?q=${encodeURIComponent(q)}&page=${encodeURIComponent(page)}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return { results: [] } as RawgList;
  return (await res.json()) as RawgList;
}

export default async function GamesPage({ searchParams }: { searchParams: { q?: string; page?: string } }) {
  const q = searchParams.q ?? "";
  const page = searchParams.page ?? "1";
  const data = await fetchGames(q, page);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Games</h1>
      <form className="flex gap-2" action="/games" method="get">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search RAWG..."
          className="w-full rounded bg-zinc-900 p-2 ring-1 ring-zinc-800"
        />
        <button className="rounded bg-zinc-800 px-4 py-2 hover:bg-zinc-700">Search</button>
      </form>

      <div className="grid gap-3 md:grid-cols-3">
        {data.results.map((g) => (
          <Link key={g.id} href={`/games/${g.slug}?rawgId=${g.id}`} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-3 hover:bg-zinc-900">
            <div className="text-sm font-semibold">{g.name}</div>
            <div className="mt-1 text-xs text-zinc-400">Released: {g.released ?? "Unknown"}</div>
            <div className="mt-2 text-xs text-zinc-500">
              Click to load the full page and store it in your DB if you want.
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
