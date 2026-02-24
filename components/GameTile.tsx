import Image from "next/image";
import Link from "next/link";

type RawgNamed = { name: string };

export type RawgGameDetail = {
  id: number;
  slug: string;
  name: string;
  released: string | null;
  background_image: string | null;

  metacritic: number | null;
  rating: number;
  ratings_count: number;

  genres?: RawgNamed[];
  platforms?: Array<{ platform: RawgNamed }>;

  developers?: RawgNamed[];
  publishers?: RawgNamed[];
};

function joinNames(items?: RawgNamed[], max = 2) {
  if (!items?.length) return "Unknown";
  return items
    .slice(0, max)
    .map((x) => x.name)
    .join(", ");
}

export default function GameTile({ game }: { game: RawgGameDetail }) {
  const genres = joinNames(game.genres, 3);
  const platforms = game.platforms?.slice(0, 3).map((p) => p.platform.name).join(", ") ?? "Unknown";
  const devs = joinNames(game.developers, 2);
  const pubs = joinNames(game.publishers, 2);

  return (
    <Link
      href={`/games/${game.slug}`}
      className="group rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/70 transition overflow-hidden"
    >
      <div className="relative aspect-[16/9] w-full bg-zinc-950">
        {game.background_image ? (
          <Image
            src={game.background_image}
            alt={game.name}
            fill
            className="object-cover group-hover:scale-[1.02] transition"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-400">
            No image
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold leading-tight text-zinc-50">{game.name}</h3>
          <div className="shrink-0 text-xs text-zinc-300">
            {game.metacritic ? (
              <span className="rounded-md border border-zinc-700 px-2 py-1">
                Metacritic {game.metacritic}
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-2 text-sm text-zinc-300 space-y-1">
          <div>
            <span className="text-zinc-400">Released:</span>{" "}
            {game.released ?? "Unknown"}
          </div>
          <div>
            <span className="text-zinc-400">Genres:</span> {genres}
          </div>
          <div>
            <span className="text-zinc-400">Platforms:</span> {platforms}
          </div>
          <div>
            <span className="text-zinc-400">Developers:</span> {devs}
          </div>
          <div>
            <span className="text-zinc-400">Publishers:</span> {pubs}
          </div>
          <div>
            <span className="text-zinc-400">RAWG rating:</span>{" "}
            {game.rating.toFixed(2)} ({game.ratings_count})
          </div>
        </div>

        <div className="mt-3 text-xs text-indigo-300 group-hover:text-indigo-200">
          Click to open game page
        </div>
      </div>
    </Link>
  );
}