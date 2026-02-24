import { createPost } from "./serverActions";

export default function NewPostForm({ type }: { type: "BLOG" | "REVIEW" }) {
  return (
    <form action={createPost} className="mx-auto max-w-2xl space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
      <h1 className="text-2xl font-bold">New {type === "BLOG" ? "Blog Post" : "Review"}</h1>

      <input type="hidden" name="type" value={type} />

      <label className="block space-y-1">
        <span className="text-sm text-zinc-300">Title</span>
        <input name="title" required className="w-full rounded bg-zinc-950 p-2 ring-1 ring-zinc-800" />
      </label>

      <label className="block space-y-1">
        <span className="text-sm text-zinc-300">Slug</span>
        <input name="slug" required className="w-full rounded bg-zinc-950 p-2 ring-1 ring-zinc-800" placeholder="my-post-slug" />
      </label>

      <label className="block space-y-1">
        <span className="text-sm text-zinc-300">Excerpt</span>
        <input name="excerpt" className="w-full rounded bg-zinc-950 p-2 ring-1 ring-zinc-800" />
      </label>

      {type === "REVIEW" && (
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-sm text-zinc-300">Game slug (from your DB)</span>
            <input name="gameSlug" className="w-full rounded bg-zinc-950 p-2 ring-1 ring-zinc-800" placeholder="elden-ring" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm text-zinc-300">Overall score (0-5)</span>
            <input name="overallScore" type="number" min={0} max={5} step="0.1" className="w-full rounded bg-zinc-950 p-2 ring-1 ring-zinc-800" />
          </label>
        </div>
      )}

      <label className="block space-y-1">
        <span className="text-sm text-zinc-300">Tags (comma separated)</span>
        <input name="tags" className="w-full rounded bg-zinc-950 p-2 ring-1 ring-zinc-800" placeholder="games, mmo, rpg, ufo" />
        <p className="text-xs text-zinc-500">
          Suggested: games, rating, ufo, uap, mmo, rpg, battle-royale, fps, indie, retro, horror, sim, strategy, fighting
        </p>
      </label>

      <label className="block space-y-1">
        <span className="text-sm text-zinc-300">Content (markdown for now)</span>
        <textarea name="contentMd" required className="min-h-[260px] w-full rounded bg-zinc-950 p-2 ring-1 ring-zinc-800" />
      </label>

      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <input name="published" type="checkbox" className="h-4 w-4" />
        Publish immediately
      </label>

      <button className="rounded bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500" type="submit">
        Save
      </button>
    </form>
  );
}
