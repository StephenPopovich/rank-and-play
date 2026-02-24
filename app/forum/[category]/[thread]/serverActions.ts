"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const schema = z.object({
  threadId: z.string(),
  body: z.string().min(1).max(10000),
});

export async function reply(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Not signed in");

  const parsed = schema.parse(Object.fromEntries(formData.entries()));
  const thread = await prisma.forumThread.findUnique({ where: { id: parsed.threadId }, select: { id: true } });
  if (!thread) throw new Error("Thread missing");

  await prisma.forumPost.create({
    data: { threadId: parsed.threadId, body: parsed.body, authorId: session.user.id },
  });

  // Simple revalidate: current page will refetch on next request
  revalidatePath("/forum");
}
