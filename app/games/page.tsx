import Link from "next/link";

type RawgGame = {
  id: number;
  slug: string;
  name: string;
  background_image?: string | null;
  released?: string | null;
  rating?: number | null; // RAWG aggregate rating 0-5
  ratings_count?: number | null;
};

type RawgResponse = {
  count: number;
  results: RawgGame[];
  next?: string | null;
  previous?: string | null;
};

const PAGE_SIZE = 24;

const SORT_OPTIONS: Record<string, { label: string; ordering: string }> = {
  top: { label: "Top rated", ordering: "-rating" },
  new: { label: "New releases", ordering: "-released" },
  upcoming: { label: "Upcoming", ordering: "released" },
  popular: { label: "Most added", ordering: "-added" },
};

function clampPage(n: number) {
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.floor(n);
}

function toIgnStyleScore(rawgRating: number) {
  // RAWG rating is 0-5. Convert to a familiar 0-10 style display.
  // This is a presentation trick, not an actual IGN score.
  const score10 = rawgRating * 2;
  return Math.round(score10 * 10) / 10;
}

async function fetchGames(args: {
  page: number;
  q: string;
  sortKey: string;
}): Promise<RawgResponse | null> {
  const key = process.env.RAWG_API_KEY;
  if (!key) return null;

  const sort = SORT_OPTIONS[args.sortKey] ?? SORT_OPTIONS.top;

  const url = new URL("https://api.rawg.io/api/games");
  url.searchParams.set("key", key);
  url.searchParams.set("page", String(args.page));
  url.searchParams.set("page_size", String(PAGE_SIZE));
  url.searchParams.set("ordering", sort.ordering);

  if (args.q.trim()) {
    url.searchParams.set("search", args.q.trim());
    url.searchParams.set("search_precise", "true");
  }

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 * 60 }, // 1 hour cache
    headers: { Accept: "application/json" },
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function GamesPage({
  searchParams,
}: {
  searchParams?: { page?: string; q?: string; sort?: string };
}) {
  const page = clampPage(Number(searchParams?.page || 1));
  const q = (searchParams?.q || "").toString();
  const sortKey = (searchParams?.sort || "top").toString();

  const data = await fetchGames({ page, q, sortKey });

  if (!process.env.RAWG_API_KEY) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-3xl font-bold text-white">Games</h1>
        <p className="mt-3 text-sm text-white/70">
          RAWG API key missing. Add RAWG_API_KEY to your .env and restart the dev server.
        </p>
      </main>
    );
  }

  const games = data?.results ?? [];
  const total = data?.count ?? 0;
  const totalPages = total > 0 ? Math.ceil(total / PAGE_SIZE) : 1;

  const hasNext = Boolean(data?.next) && page < totalPages;
  const hasPrev = Boolean(data?.previous) && page > 1;

  const activeSort = SORT_OPTIONS[sortKey] ? sortKey : "top";

  // Build base query for links while preserving filters
  function buildHref(nextPage: number) {
    const sp = new URLSearchParams();
    if (q.trim()) sp.set("q", q.trim());
    if (activeSort) sp.set("sort", activeSort);
    sp.set("page", String(nextPage));
    return `/games?${sp.toString()}`;
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Games</h1>
          <p className="mt-2 text-sm text-white/70">
            Browse games from RAWG. Results are cached for speed.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Link
            href="/games"
            className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            Reset
          </Link>
        </div>
      </div>

      {/* Search and Sort */}
      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
        <form action="/games" method="GET" className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="block text-xs text-white/70">Search</label>
            <input
              name="q"
              defaultValue={q}
              placeholder="Search RAWG, for example Elden Ring"
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-white/25"
            />
          </div>

          <div>
            <label className="block text-xs text-white/70">Sort</label>
            <select
              name="sort"
              defaultValue={activeSort}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-white/25"
            >
              {Object.entries(SORT_OPTIONS).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>
          </div>

          {/* Keep page=1 when submitting new search */}
          <input type="hidden" name="page" value="1" />

          <div className="sm:col-span-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
            >
              Apply
            </button>

            <p className="text-xs text-white/60">
              Showing {games.length} of {total.toLocaleString()} results. Page {page} of{" "}
              {totalPages.toLocaleString()}.
            </p>
          </div>
        </form>
      </section>

      {/* Grid */}
      <div className="mt-8 grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {games.map((game) => {
          const href = `/games/${game.slug}?rawgId=${game.id}`;
          const released = game.released ? new Date(game.released) : null;

          const rawgRating = typeof game.rating === "number" ? game.rating : null;
          const ignLike = rawgRating !== null ? toIgnStyleScore(rawgRating) : null;

          return (
            <Link
              key={game.id}
              href={href}
              className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10"
            >
              <div className="relative aspect-[16/10] w-full bg-black/30">
                {game.background_image ? (
                  <img
                    src={game.background_image}
                    alt={game.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-white/50">
                    No image
                  </div>
                )}

                {/* Rating badge */}
                {ignLike !== null ? (
                  <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs text-white">
                    Score: {ignLike} / 10
                  </div>
                ) : null}
              </div>

              <div className="p-4">
                <h2 className="text-sm font-semibold text-white leading-tight">
                  {game.name}
                </h2>

                {released ? (
                  <p className="mt-1 text-xs text-white/60">
                    Released: {released.toLocaleDateString()}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-white/50">Release date: Unknown</p>
                )}

                {rawgRating !== null ? (
                  <p className="mt-2 text-xs text-purple-300 font-medium">
                    RAWG rating: {rawgRating.toFixed(1)} / 5
                    {game.ratings_count ? (
                      <span className="text-white/50"> • {game.ratings_count.toLocaleString()} votes</span>
                    ) : null}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-white/50">RAWG rating: Not available</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="mt-12 flex items-center justify-between gap-3">
        {hasPrev ? (
          <Link
            href={buildHref(page - 1)}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            ← Previous
          </Link>
        ) : (
          <div />
        )}

        <div className="flex flex-col items-center">
          <span className="text-sm text-white/70">
            Page {page} of {totalPages.toLocaleString()}
          </span>
          <span className="text-xs text-white/50">24 per page</span>
        </div>

        {hasNext ? (
          <Link
            href={buildHref(page + 1)}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            Next →
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Note about IGN */}
      <p className="mt-6 text-xs text-white/50">
        Note: “Score” is a display conversion of RAWG&apos;s 0–5 rating to a 0–10 format. It is not an official IGN rating.
      </p>
    </main>
  );
}