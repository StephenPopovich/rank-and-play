import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { type: "BLOG", published: true },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog</h1>
        <Link href="/editor/new?type=BLOG" className="rounded bg-zinc-800 px-3 py-2 hover:bg-zinc-700">Write</Link>
      </div>

      <div className="space-y-3">
        {posts.map((p) => (
          <Link key={p.id} href={`/post/${p.slug}`} className="block rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 hover:bg-zinc-900">
            <div className="text-lg font-semibold">{p.title}</div>
            <div className="mt-1 text-sm text-zinc-400">{p.excerpt ?? ""}</div>
          </Link>
        ))}
        {!posts.length && <div className="text-zinc-500">No blog posts yet.</div>}
      </div>
    </div>
  );
}
