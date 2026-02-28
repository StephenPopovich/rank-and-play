import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function firstParagraph(md: string) {
  const cleaned = md
    .replace(/\r/g, "")
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean)[0];

  if (!cleaned) return "";
  return cleaned.replace(/^#+\s+/g, "").slice(0, 220);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();

  const title = String(body.title || "").trim();
  const seoTitle = String(body.seoTitle || "").trim();
  const seoDescription = String(body.seoDescription || "").trim();
  const contentMd = String(body.contentMd || "");
  const coverDataUrl = String(body.coverDataUrl || "");

  const published = Boolean(body.published);
  const allowIndexing = Boolean(body.allowIndexing);
  const showInBlog = Boolean(body.showInBlog);

  if (!title) return new Response("Title required", { status: 400 });
  if (!contentMd) return new Response("Content required", { status: 400 });

  const slugBase = slugify(title);
  if (!slugBase) return new Response("Invalid title", { status: 400 });

  let slug = slugBase;
  const existing = await prisma.post.findUnique({ where: { slug } });
  if (existing) slug = `${slugBase}-${Date.now()}`;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) return new Response("User not found", { status: 404 });

  const excerpt = firstParagraph(contentMd);

  const created = await prisma.post.create({
    data: {
      type: "BLOG",
      title,
      slug,
      excerpt,
      contentMd,
      coverUrl: coverDataUrl || null,
      published,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      allowIndexing,
      showInBlog,
      authorId: user.id,
    },
    select: { slug: true },
  });

  return Response.json({ slug: created.slug });
}