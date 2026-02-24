import { prisma } from "@/lib/db";

export default async function NewsletterIssuePage({ params }: { params: { slug: string } }) {
  const issue = await prisma.newsletterIssue.findUnique({ where: { slug: params.slug } });
  if (!issue || !issue.published) return <div className="text-zinc-300">Issue not found.</div>;

  return (
    <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
      <h1 className="text-2xl font-bold">{issue.title}</h1>
      <div className="text-sm text-zinc-400">{new Date(issue.createdAt).toLocaleDateString()}</div>
      <pre className="whitespace-pre-wrap text-sm leading-6 text-zinc-200">{issue.contentMd}</pre>
    </div>
  );
}
