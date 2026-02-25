import Link from "next/link";
import Card from "@/components/Card";
import UpcomingCarousel, { type UpcomingGame } from "@/components/UpcomingCarousel";

type RawgList = {
  results: UpcomingGame[];
};

function fmtDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

async function fetchUpcomingGames(): Promise<UpcomingGame[]> {
  const key = process.env.RAWG_API_KEY;
  if (!key) return [];

  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + 90);

  const upstream = new URL("https://api.rawg.io/api/games");
  upstream.searchParams.set("key", key);
  upstream.searchParams.set("dates", `${fmtDate(start)},${fmtDate(end)}`);
  upstream.searchParams.set("ordering", "released");
  upstream.searchParams.set("page_size", "18");

  const res = await fetch(upstream.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 * 60 },
  });

  if (!res.ok) return [];
  const data = (await res.json()) as RawgList;

  return (data?.results ?? []).map((g) => ({
    id: g.id,
    slug: g.slug,
    name: g.name,
    background_image: g.background_image ?? null,
    released: g.released ?? null,
  }));
}

export default async function Page() {
  const upcoming = await fetchUpcomingGames();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* Hero */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-10">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Rank and Play
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
          A community where ratings are built from transparent factors, then averaged into a no-bias score.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/games"
            className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
          >
            Browse games
          </Link>

          <Link
            href="/forum"
            className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Join the forum
          </Link>
        </div>

        {/* Upcoming carousel */}
        <UpcomingCarousel
          title="Upcoming releases"
          subtitle="Pulled live from RAWG, cached for speed."
          items={upcoming}
        />
      </section>

      {/* Explain the rating system */}
      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <Card title="Rating factors">
          <p className="text-sm text-white/70 leading-6">
            Gameplay, immersion, fun, story, graphics, sound, replay. Each 1 to 5.
          </p>
        </Card>

        <Card title="Hall of Fame">
          <p className="text-sm text-white/70 leading-6">
            Track legendary games, characters, and moments with community votes.
          </p>
          <p className="mt-3">
            <Link href="/hall-of-fame">View the Hall of Fame</Link>
          </p>
        </Card>

        <Card title="Creator ecosystem">
          <p className="text-sm text-white/70 leading-6">
            Bloggers, streamers, and admins can publish content, newsletters, and curated lists.
          </p>
          <p className="mt-3">
            <Link href="/blog">Read blog posts</Link>
          </p>
        </Card>
      </section>

      {/* CTA */}
      <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-white">Built for speed and scale</h2>
        <p className="mt-2 text-sm text-white/70 leading-6">
          Server-rendered pages, cached game lists, and a database that only stores game details when requested.
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
          >
            Create account
          </Link>

          <Link
            href="/reviews"
            className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Browse reviews
          </Link>
        </div>
      </section>
    </main>
  );
}