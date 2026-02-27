import Link from "next/link";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import RatingForm from "./ratingForm";
import CommentForm from "./commentForm";

type RawgGameDetails = {
  id: number;
  slug: string;
  name: string;

  description_raw?: string | null;

  background_image?: string | null;
  background_image_additional?: string | null;
  released?: string | null;

  rating?: number | null; // 0-5
  ratings_count?: number | null;
  metacritic?: number | null;
  playtime?: number | null;

  website?: string | null;
  esrb_rating?: { name: string } | null;

  developers?: Array<{ id: number; name: string }>;
  publishers?: Array<{ id: number; name: string }>;
  genres?: Array<{ id: number; name: string }>;
  platforms?: Array<{ platform: { id: number; name: string } }>;
};

type RawgAdditionsResponse = {
  results: Array<{
    id: number;
    slug: string;
    name: string;
    background_image?: string | null;
    released?: string | null;
    rating?: number | null;
    ratings_count?: number | null;
  }>;
};

function truncate(text: string, max = 520) {
  const t = (text || "").trim();
  if (!t) return "";
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

function joinNames(list?: Array<{ name: string }>, max = 6) {
  const names = (list ?? []).map((x) => x.name).filter(Boolean);
  if (!names.length) return "n/a";
  return names.slice(0, max).join(", ");
}

function toDateLabel(d?: string | null) {
  if (!d) return "Unknown";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "Unknown";
  return dt.toLocaleDateString();
}

async function fetchRawgGame(rawgId: string): Promise<RawgGameDetails> {
  const key = process.env.RAWG_API_KEY;
  if (!key) throw new Error("RAWG_API_KEY missing");

  const res = await fetch(`https://api.rawg.io/api/games/${rawgId}?key=${key}`, {
    next: { revalidate: 3600 },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) throw new Error("RAWG fetch failed");
  return (await res.json()) as RawgGameDetails;
}

async function fetchRawgAdditions(rawgId: string): Promise<RawgAdditionsResponse> {
  const key = process.env.RAWG_API_KEY;
  if (!key) throw new Error("RAWG_API_KEY missing");

  const res = await fetch(`https://api.rawg.io/api/games/${rawgId}/additions?key=${key}&page_size=12`, {
    next: { revalidate: 3600 },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) return { results: [] };
  return (await res.json()) as RawgAdditionsResponse;
}

async function upsertGameFromRawg(slug: string, rawgId?: string | null) {
  if (!rawgId) {
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

export default async function GamePage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { rawgId?: string };
}) {
  const session = await getServerSession(authOptions);

  const game = await upsertGameFromRawg(params.slug, searchParams.rawgId);

  if (!game) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10 text-white">
        <h1 className="text-2xl font-bold">Game not found</h1>
        <p className="mt-3 text-sm text-white/70">We could not load this game yet.</p>
        <div className="mt-6">
          <Link href="/games" className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
            Back to Games
          </Link>
        </div>
      </main>
    );
  }

  // Pull richer RAWG details every time (cached) so the page has more information.
  // Prefer DB rawgId, fallback to query param.
  const rawgId = String(game.rawgId ?? searchParams.rawgId ?? "");
  const [rawg, additions] = await Promise.all([
    rawgId ? fetchRawgGame(rawgId) : Promise.resolve<RawgGameDetails | null>(null),
    rawgId ? fetchRawgAdditions(rawgId) : Promise.resolve<RawgAdditionsResponse>({ results: [] }),
  ]);

  const [ratings, comments] = await Promise.all([
    prisma.gameRating.findMany({ where: { gameId: game.id } }),
    prisma.comment.findMany({
      where: { gameId: game.id },
      include: { author: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  const avg =
    ratings.length ? ratings.reduce((s, r) => s + r.avg, 0) / ratings.length : null;

  const heroImg =
    rawg?.background_image_additional ||
    rawg?.background_image ||
    game.coverUrl ||
    null;

  const overview = truncate(rawg?.description_raw ?? game.description ?? "", 650);

  const platforms =
    rawg?.platforms?.map((p) => p.platform?.name).filter(Boolean) ?? [];
  const platformText = platforms.length ? platforms.slice(0, 10).join(", ") : "n/a";

  const dlcList = (additions.results ?? []).slice(0, 8);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 text-white">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/games"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
        >
          ← Back to Games
        </Link>

        <div className="flex gap-2">
          {rawg?.website ? (
            <a
              href={rawg.website}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
            >
              Official site
            </a>
          ) : null}
        </div>
      </div>

      {/* Feature image */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <div className="relative aspect-[21/9] w-full bg-black/30">
          {heroImg ? (
            <img
              src={heroImg}
              alt={`${game.name} feature image`}
              className="h-full w-full object-cover"
              loading="eager"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-white/60">
              No feature image available
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
            <h1 className="text-2xl font-bold sm:text-3xl">{game.name}</h1>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-white/10 bg-black/60 px-3 py-1 text-white/80">
                Release: {toDateLabel(rawg?.released ?? (game.released ? game.released.toISOString() : null))}
              </span>

              {typeof rawg?.rating === "number" ? (
                <span className="rounded-full border border-white/10 bg-black/60 px-3 py-1">
                  RAWG rating: {rawg.rating.toFixed(1)} / 5
                  {rawg.ratings_count ? (
                    <span className="text-white/70"> · {rawg.ratings_count.toLocaleString()} votes</span>
                  ) : null}
                </span>
              ) : null}

              {typeof rawg?.metacritic === "number" ? (
                <span className="rounded-full border border-white/10 bg-black/60 px-3 py-1">
                  Metacritic: {rawg.metacritic}
                </span>
              ) : null}

              <span className="rounded-full border border-white/10 bg-black/60 px-3 py-1">
                Community avg: {avg ? avg.toFixed(2) : "No ratings yet"} / 5
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold">Overview</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              {overview || "No description yet."}
            </p>

            <p className="mt-4 text-xs text-white/50">
              You can override description, tags, or cover later from an admin route.
            </p>
          </div>

          {/* DLCs */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-end justify-between gap-3">
              <h2 className="text-lg font-semibold">DLC and editions</h2>
              <span className="text-xs text-white/50">
                From RAWG additions
              </span>
            </div>

            {dlcList.length ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {dlcList.map((d) => (
                  <Link
                    key={d.id}
                    href={`/games/${d.slug}?rawgId=${d.id}`}
                    className="group flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10"
                  >
                    <div className="h-16 w-24 overflow-hidden rounded-lg bg-black/30">
                      {d.background_image ? (
                        <img
                          src={d.background_image}
                          alt={d.name}
                          className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                          loading="lazy"
                        />
                      ) : null}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-white">
                        {d.name}
                      </div>
                      <div className="mt-1 text-xs text-white/60">
                        Release: {toDateLabel(d.released)}
                      </div>
                      <div className="mt-1 text-xs text-purple-300">
                        {typeof d.rating === "number" ? (
                          <>Rating: {d.rating.toFixed(1)} / 5</>
                        ) : (
                          <>Rating: n/a</>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-white/70">
                No DLC or editions found for this title.
              </p>
            )}
          </div>

          {/* Auth actions */}
          {session?.user ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-6">
              <div>
                <h2 className="text-lg font-semibold">Rate this game</h2>
                <div className="mt-3">
                  <RatingForm gameId={game.id} />
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold">Leave a comment</h2>
                <div className="mt-3">
                  <CommentForm gameId={game.id} />
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-white/70">Sign in to rate and comment.</p>
            </div>
          )}

          {/* Comments */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold">Comments</h2>

            <div className="mt-4 space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-white/60">
                    {c.author.name ?? c.author.email} ·{" "}
                    {new Date(c.createdAt).toLocaleString()}
                  </div>
                  <div className="mt-2 text-sm text-white/80 whitespace-pre-wrap">
                    {c.body}
                  </div>
                </div>
              ))}

              {!comments.length ? (
                <p className="text-sm text-white/70">No comments yet.</p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Right */}
        <aside className="lg:col-span-1">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold">Details</h2>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-start justify-between gap-3">
                <span className="text-white/60">Studios</span>
                <span className="text-right">{joinNames(rawg?.developers)}</span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <span className="text-white/60">Publishers</span>
                <span className="text-right">{joinNames(rawg?.publishers)}</span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <span className="text-white/60">Genres</span>
                <span className="text-right">{joinNames(rawg?.genres)}</span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <span className="text-white/60">Platforms</span>
                <span className="text-right">{platformText}</span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <span className="text-white/60">ESRB</span>
                <span className="text-right">{rawg?.esrb_rating?.name ?? "n/a"}</span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <span className="text-white/60">Playtime</span>
                <span className="text-right">
                  {typeof rawg?.playtime === "number" ? `${rawg.playtime} hrs avg` : "n/a"}
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-white/60">RAWG ID</div>
              <div className="mt-1 text-sm">{rawg?.id ?? game.rawgId ?? "n/a"}</div>
            </div>

            <p className="mt-4 text-xs text-white/50">
              Budget is not shown because RAWG does not provide reliable budget data for games.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}