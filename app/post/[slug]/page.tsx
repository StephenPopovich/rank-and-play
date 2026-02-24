import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import PostCommentForm from "./postCommentForm";

export default async function PostPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { author: true, tags: { include: { tag: true } }, comments: { include: { author: true }, orderBy: { createdAt: "desc" } } },
  });

  if (!post || !post.published) return <div className="text-zinc-300">Post not found.</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <div className="mt-2 text-sm text-zinc-400">
          By {post.author.name ?? post.author.email} • {new Date(post.createdAt).toLocaleDateString()}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span key={t.id} className="rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-200">{t.tag.name}</span>
          ))}
        </div>
        <pre className="mt-4 whitespace-pre-wrap text-sm leading-6 text-zinc-200">{post.contentMd}</pre>
      </div>

      {session?.user ? (
        <PostCommentForm postId={post.id} />
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 text-zinc-300">
          Sign in to comment.
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Comments</h2>
        {post.comments.map((c) => (
          <div key={c.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-3">
            <div className="text-xs text-zinc-400">{c.author.name ?? c.author.email} • {new Date(c.createdAt).toLocaleString()}</div>
            <div className="mt-2 text-sm text-zinc-200">{c.body}</div>
          </div>
        ))}
        {!post.comments.length && <div className="text-sm text-zinc-500">No comments yet.</div>}
      </div>
    </div>
  );
}
