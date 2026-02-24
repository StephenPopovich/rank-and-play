"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasAtLeast } from "@/lib/perm";
import { z } from "zod";
import { redirect } from "next/navigation";

const schema = z.object({
  type: z.enum(["BLOG", "REVIEW"]),
  title: z.string().min(3).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/).min(3).max(200),
  excerpt: z.string().optional(),
  tags: z.string().optional(),
  contentMd: z.string().min(1),
  published: z.string().optional(),
  gameSlug: z.string().optional(),
  overallScore: z.string().optional(),
});

export async function createPost(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Not signed in");
  if (!hasAtLeast(session.user.role, "BLOGGER")) throw new Error("No permission");

  const parsed = schema.parse(Object.fromEntries(formData.entries()));
  const tagNames = (parsed.tags ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const tags = await Promise.all(tagNames.map(async (name) => {
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    return prisma.tag.upsert({
      where: { slug },
      update: { name },
      create: { slug, name },
    });
  }));

  let gameId: string | undefined = undefined;
  if (parsed.type === "REVIEW" && parsed.gameSlug) {
    const game = await prisma.game.findUnique({ where: { slug: parsed.gameSlug } });
    if (game) gameId = game.id;
  }

  const post = await prisma.post.create({
    data: {
      type: parsed.type,
      title: parsed.title,
      slug: parsed.slug,
      excerpt: parsed.excerpt || null,
      contentMd: parsed.contentMd,
      published: parsed.published === "on",
      authorId: session.user.id,
      gameId: gameId ?? null,
      overallScore: parsed.overallScore ? Number(parsed.overallScore) : null,
      tags: {
        create: tags.map((t) => ({ tagId: t.id })),
      },
    },
  });

  redirect(`/post/${post.slug}`);
}
