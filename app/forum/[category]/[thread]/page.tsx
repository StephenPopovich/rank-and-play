import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ReplyForm from "./replyForm";

export default async function ThreadPage({ params }: { params: { category: string; thread: string } }) {
  const session = await getServerSession(authOptions);
  const cat = await prisma.forumCategory.findUnique({ where: { slug: params.category } });
  if (!cat) return <div className="text-zinc-300">Category not found.</div>;

  const thread = await prisma.forumThread.findUnique({
    where: { slug: params.thread },
    include: { posts: { include: { author: true }, orderBy: { createdAt: "asc" } } },
  });
  if (!thread) return <div className="text-zinc-300">Thread not found.</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{thread.title}</h1>
      <div className="space-y-3">
        {thread.posts.map((p) => (
          <div key={p.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="text-xs text-zinc-400">{p.author.name ?? p.author.email} • {new Date(p.createdAt).toLocaleString()}</div>
            <div className="mt-2 whitespace-pre-wrap text-sm text-zinc-200">{p.body}</div>
          </div>
        ))}
      </div>

      {session?.user ? <ReplyForm threadId={thread.id} /> : (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 text-zinc-300">Sign in to reply.</div>
      )}
    </div>
  );
}
