import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const cat = await prisma.forumCategory.findUnique({ where: { slug: params.category } });
  if (!cat) return <div className="text-zinc-300">Category not found.</div>;

  const threads = await prisma.forumThread.findMany({
    where: { categoryId: cat.id },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{cat.name}</h1>
        <Link href={`/forum/${cat.slug}/new`} className="rounded bg-zinc-800 px-3 py-2 hover:bg-zinc-700">New thread</Link>
      </div>

      <div className="space-y-2">
        {threads.map((t) => (
          <Link key={t.id} href={`/forum/${cat.slug}/${t.slug}`} className="block rounded-xl bg-zinc-900/40 p-3 ring-1 ring-zinc-800 hover:bg-zinc-900">
            <div className="text-sm font-semibold">{t.title}</div>
            <div className="text-xs text-zinc-500">Updated {new Date(t.updatedAt).toLocaleString()}</div>
          </Link>
        ))}
        {!threads.length && <div className="text-sm text-zinc-500">No threads yet.</div>}
      </div>
    </div>
  );
}
