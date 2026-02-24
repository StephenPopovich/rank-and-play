"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const ratingSchema = z.object({
  gameId: z.string(),
  gameplay: z.coerce.number().int().min(1).max(5),
  immersion: z.coerce.number().int().min(1).max(5),
  fun: z.coerce.number().int().min(1).max(5),
  story: z.coerce.number().int().min(1).max(5),
  graphics: z.coerce.number().int().min(1).max(5),
  sound: z.coerce.number().int().min(1).max(5),
  replay: z.coerce.number().int().min(1).max(5),
});

export async function submitRating(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Not signed in");

  const parsed = ratingSchema.parse(Object.fromEntries(formData.entries()));
  const avg = (parsed.gameplay + parsed.immersion + parsed.fun + parsed.story + parsed.graphics + parsed.sound + parsed.replay) / 7;

  await prisma.gameRating.upsert({
    where: { userId_gameId: { userId: session.user.id, gameId: parsed.gameId } },
    update: { ...parsed, avg },
    create: { ...parsed, avg, userId: session.user.id },
  });

  revalidatePath(`/games/${await gameSlug(parsed.gameId)}`);
}

async function gameSlug(gameId: string) {
  const g = await prisma.game.findUnique({ where: { id: gameId }, select: { slug: true } });
  return g?.slug ?? "";
}

const commentSchema = z.object({
  gameId: z.string(),
  body: z.string().min(1).max(2000),
});

export async function submitGameComment(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Not signed in");

  const parsed = commentSchema.parse(Object.fromEntries(formData.entries()));
  await prisma.comment.create({
    data: { gameId: parsed.gameId, body: parsed.body, authorId: session.user.id },
  });

  revalidatePath(`/games/${await gameSlug(parsed.gameId)}`);
}
