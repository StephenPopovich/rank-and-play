"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { redirect } from "next/navigation";

const schema = z.object({
  categorySlug: z.string(),
  title: z.string().min(3).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/).min(3).max(200),
  body: z.string().min(1).max(10000),
});

export async function createThread(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Not signed in");

  const parsed = schema.parse(Object.fromEntries(formData.entries()));
  const cat = await prisma.forumCategory.findUnique({ where: { slug: parsed.categorySlug } });
  if (!cat) throw new Error("Category missing");

  await prisma.forumThread.create({
    data: {
      title: parsed.title,
      slug: parsed.slug,
      categoryId: cat.id,
      authorId: session.user.id,
      posts: { create: [{ body: parsed.body, authorId: session.user.id }] },
    },
  });

  redirect(`/forum/${cat.slug}/${parsed.slug}`);
}
