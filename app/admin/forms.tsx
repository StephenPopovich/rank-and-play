import { updateUserRole, createNewsletterIssue } from "./serverActions";
import type { Role } from "@prisma/client";

export default function AdminForms({ users }: { users: Array<{ id: string; email: string; name: string | null; role: Role }> }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin</h1>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
        <h2 className="text-lg font-semibold">User roles</h2>
        <div className="mt-3 space-y-2">
          {users.map((u) => (
            <form key={u.id} action={updateUserRole} className="flex flex-wrap items-center gap-2 rounded-xl bg-zinc-950/40 p-3 ring-1 ring-zinc-800">
              <input type="hidden" name="userId" value={u.id} />
              <div className="min-w-[240px] text-sm">
                <div className="font-semibold">{u.name ?? u.email}</div>
                <div className="text-xs text-zinc-500">{u.email}</div>
              </div>
              <select name="role" defaultValue={u.role} className="rounded bg-zinc-950 p-2 ring-1 ring-zinc-800">
                {["USER","BLOGGER","STREAMER","MOD","ADMIN","OWNER"].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <button className="rounded bg-zinc-800 px-3 py-2 hover:bg-zinc-700">Update</button>
            </form>
          ))}
        </div>
      </div>

      <form action={createNewsletterIssue} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
        <h2 className="text-lg font-semibold">Create newsletter issue</h2>
        <label className="block space-y-1">
          <span className="text-sm text-zinc-300">Title</span>
          <input name="title" required className="w-full rounded bg-zinc-950 p-2 ring-1 ring-zinc-800" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm text-zinc-300">Slug</span>
          <input name="slug" required placeholder="hof-january-2026" className="w-full rounded bg-zinc-950 p-2 ring-1 ring-zinc-800" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm text-zinc-300">Summary</span>
          <input name="summary" className="w-full rounded bg-zinc-950 p-2 ring-1 ring-zinc-800" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm text-zinc-300">Content</span>
          <textarea name="contentMd" required className="min-h-[220px] w-full rounded bg-zinc-950 p-2 ring-1 ring-zinc-800" />
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input name="published" type="checkbox" className="h-4 w-4" />
          Publish immediately
        </label>
        <button className="rounded bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500" type="submit">Create</button>
      </form>
    </div>
  );
}
