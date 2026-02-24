import { createThread } from "./serverActions";

export default function NewThreadForm({ categorySlug }: { categorySlug: string }) {
  return (
    <form action={createThread} className="mx-auto max-w-2xl space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
      <input type="hidden" name="categorySlug" value={categorySlug} />
      <h1 className="text-2xl font-bold">New thread</h1>
      <label className="block space-y-1">
        <span className="text-sm text-zinc-300">Title</span>
        <input name="title" required className="w-full rounded bg-zinc-950 p-2 ring-1 ring-zinc-800" />
      </label>
      <label className="block space-y-1">
        <span className="text-sm text-zinc-300">Slug</span>
        <input name="slug" required placeholder="my-thread" className="w-full rounded bg-zinc-950 p-2 ring-1 ring-zinc-800" />
      </label>
      <label className="block space-y-1">
        <span className="text-sm text-zinc-300">Body</span>
        <textarea name="body" required className="min-h-[220px] w-full rounded bg-zinc-950 p-2 ring-1 ring-zinc-800" />
      </label>
      <button className="rounded bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500" type="submit">Create</button>
    </form>
  );
}
