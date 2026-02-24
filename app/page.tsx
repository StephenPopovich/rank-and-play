import Link from "next/link";
import Card from "@/components/Card";

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/60 to-zinc-950 p-6">
        <h1 className="text-2xl font-bold">RankAndPlay</h1>
        <p className="mt-2 text-zinc-300">
          A community where ratings are built from transparent factors, then averaged into a no-bias score.
        </p>
        <div className="mt-4 flex gap-3">
          <Link className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500" href="/games">Browse games</Link>
          <Link className="rounded bg-zinc-800 px-4 py-2 hover:bg-zinc-700" href="/forum">Join the forum</Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Ratings that mean something">
          <p className="text-zinc-300">
            Gameplay, immersion, fun, story, graphics, sound, replay. Each 1 to 5.
          </p>
        </Card>
        <Card title="Hall of Fame moments">
          <p className="text-zinc-300">
            Track legendary games, characters, and moments with community votes.
          </p>
        </Card>
        <Card title="Creator ecosystem">
          <p className="text-zinc-300">
            Bloggers, streamers, and admins can publish content, newsletters, and curated lists.
          </p>
        </Card>
      </div>
    </div>
  );
}
