"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const schema = z.object({
  postId: z.string(),
  body: z.string().min(1).max(2000),
});

export async function submitPostComment(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Not signed in");

  const parsed = schema.parse(Object.fromEntries(formData.entries()));
  const post = await prisma.post.findUnique({ where: { id: parsed.postId }, select: { slug: true } });
  if (!post) throw new Error("Post missing");

  await prisma.comment.create({
    data: { postId: parsed.postId, body: parsed.body, authorId: session.user.id },
  });

  revalidatePath(`/post/${post.slug}`);
}
