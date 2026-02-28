import Link from "next/link";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type SearchParams = {
  q?: string;
  sort?: string;
  drafts?: string;
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const session = await getServerSession(authOptions);
  const isAuthed = !!session?.user;

  const sp = (await searchParams) || {};
  const q = (sp.q || "").trim();
  const sort = (sp.sort || "new") as "new" | "old" | "az";
  const includeDrafts = isAuthed && sp.drafts === "1";

  const orderBy =
    sort === "old"
      ? { createdAt: "asc" as const }
      : sort === "az"
      ? { title: "asc" as const }
      : { createdAt: "desc" as const };

  // ✅ Removed showInBlog since your Prisma client doesn't have it yet
  const where: any = {
    type: "BLOG",
    ...(includeDrafts ? {} : { published: true }),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { excerpt: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const posts = await prisma.post.findMany({
    where,
    orderBy,
    take: 100,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverUrl: true,
      published: true,
      createdAt: true,
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white">Blog</h1>
          <p className="mt-2 text-sm text-slate-300/90">
            Search and sort posts. Public sees only published posts.
          </p>
        </div>

        {isAuthed ? (
          <Link
            href="/write-blog"
            className="rounded-md bg-white/10 hover:bg-white/15 px-3 py-2 text-sm text-white ring-1 ring-white/10 transition"
          >
            Write Blog
          </Link>
        ) : null}
      </div>

      <form method="GET" className="mt-6 flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-xs text-slate-300/80">Search</label>
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by title or excerpt"
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-white/25"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-slate-300/80">Sort</label>
          <select
            name="sort"
            defaultValue={sort}
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-white/25"
          >
            <option value="new">Newest</option>
            <option value="old">Oldest</option>
            <option value="az">A to Z</option>
          </select>
        </div>

        {isAuthed ? (
          <div className="flex items-center gap-2 pb-2 md:pb-0">
            <input
              id="drafts"
              name="drafts"
              type="checkbox"
              value="1"
              defaultChecked={includeDrafts}
            />
            <label htmlFor="drafts" className="text-sm text-slate-200/90">
              Include drafts
            </label>
          </div>
        ) : null}

        <button
          type="submit"
          className="rounded-md bg-white/10 hover:bg-white/15 px-3 py-2 text-sm text-white ring-1 ring-white/10 transition"
        >
          Apply
        </button>
      </form>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <Link
            key={p.id}
            href={`/blog/${p.slug}`}
            className="overflow-hidden rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
          >
            {p.coverUrl ? (
              <div className="border-b border-white/10">
                <img src={p.coverUrl} alt="" className="h-auto w-full" />
              </div>
            ) : null}

            <div className="p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold text-white">{p.title}</div>
                {!p.published ? (
                  <span className="rounded-md bg-white/10 px-2 py-1 text-[11px] text-slate-200/90 ring-1 ring-white/10">
                    Draft
                  </span>
                ) : null}
              </div>

              <div className="mt-2 text-xs text-slate-300/80">{p.excerpt ?? ""}</div>
            </div>
          </Link>
        ))}
      </div>

      {!posts.length ? (
        <div className="mt-8 text-sm text-slate-300/80">No posts found.</div>
      ) : null}
    </div>
  );
}