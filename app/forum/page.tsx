import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function ForumPage() {
  const cats = await prisma.forumCategory.findMany({ orderBy: { createdAt: "asc" } });
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Forum</h1>
      <p className="text-sm text-zinc-300">
        Categories are seeded in prisma/seed.ts. Only logged in users can post.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {cats.map((c) => (
          <Link key={c.id} href={`/forum/${c.slug}`} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 hover:bg-zinc-900">
            <div className="text-lg font-semibold">{c.name}</div>
            <div className="mt-1 text-xs text-zinc-500">Open category</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
