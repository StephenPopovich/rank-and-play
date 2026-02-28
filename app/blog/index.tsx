import Link from "next/link";
import { prisma } from "../../src/lib/prisma"; // adjust if your prisma path differs

export async function getServerSideProps() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverUrl: true,
      createdAt: true,
      author: { select: { name: true } },
      type: true,
    },
    take: 50,
  });

  const blogPosts = posts.filter((p) => p.type === "BLOG");

  return { props: { posts: blogPosts } };
}

export default function BlogIndexPage({ posts }: { posts: any[] }) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>Blog</h1>

      {posts.map((p) => (
        <article key={p.id} style={{ border: "1px solid #333", borderRadius: 12, overflow: "hidden", marginTop: 18 }}>
          {p.coverUrl ? <img src={p.coverUrl} alt={p.title} style={{ width: "100%", height: 240, objectFit: "cover" }} /> : null}
          <div style={{ padding: 18 }}>
            <div style={{ opacity: 0.7, fontSize: 12 }}>
              {new Date(p.createdAt).toLocaleDateString()}
              {p.author?.name ? ` • ${p.author.name}` : ""}
            </div>
            <h2 style={{ marginTop: 8 }}>
              <Link href={`/blog/${p.slug}`}>{p.title}</Link>
            </h2>
            {p.excerpt ? <p style={{ opacity: 0.9 }}>{p.excerpt}</p> : null}
          </div>
        </article>
      ))}

      {posts.length === 0 ? <p>No published posts.</p> : null}
    </div>
  );
}