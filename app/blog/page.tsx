import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: {
      type: "BLOG",
      published: true,
    },
    orderBy: { createdAt: "desc" },
    take: 30,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverUrl: true,
      createdAt: true,
      author: { select: { name: true } },
    },
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <h1 className="text-4xl font-bold">Blog</h1>
      <p className="mt-2 text-sm text-neutral-300">Latest posts and updates.</p>

      <div className="mt-8 grid gap-6">
        {posts.map((p) => (
          <article
            key={p.id}
            className="overflow-hidden rounded-2xl border border-white/10 bg-black/20"
          >
            {p.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.coverUrl}
                alt={p.title}
                className="h-56 w-full object-cover"
              />
            ) : null}

            <div className="p-6">
              <div className="text-xs text-neutral-400">
                {new Date(p.createdAt).toLocaleDateString()}
                {p.author?.name ? ` • ${p.author.name}` : ""}
              </div>

              <h2 className="mt-2 text-2xl font-semibold">
                <Link href={`/blog/${p.slug}`} className="hover:underline">
                  {p.title}
                </Link>
              </h2>

              {p.excerpt ? (
                <p className="mt-3 text-sm text-neutral-200">{p.excerpt}</p>
              ) : null}

              <div className="mt-4">
                <Link
                  href={`/blog/${p.slug}`}
                  className="text-sm font-semibold text-purple-300 hover:text-purple-200"
                >
                  Read more
                </Link>
              </div>
            </div>
          </article>
        ))}

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-sm text-neutral-300">
            No blog posts yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}