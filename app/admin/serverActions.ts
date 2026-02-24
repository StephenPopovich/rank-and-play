"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/lib/perm";
import { z } from "zod";
import { redirect } from "next/navigation";

const roleSchema = z.object({
  userId: z.string(),
  role: z.enum(["USER","BLOGGER","STREAMER","MOD","ADMIN","OWNER"]),
});

export async function updateUserRole(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Not signed in");
  if (!isAdmin(session.user.role)) throw new Error("Admins only");

  const parsed = roleSchema.parse(Object.fromEntries(formData.entries()));
  await prisma.user.update({ where: { id: parsed.userId }, data: { role: parsed.role } });
  redirect("/admin");
}

const issueSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/).min(3).max(200),
  summary: z.string().optional(),
  contentMd: z.string().min(1),
  published: z.string().optional(),
});

export async function createNewsletterIssue(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Not signed in");
  if (!isAdmin(session.user.role)) throw new Error("Admins only");

  const parsed = issueSchema.parse(Object.fromEntries(formData.entries()));
  await prisma.newsletterIssue.create({
    data: {
      title: parsed.title,
      slug: parsed.slug,
      summary: parsed.summary || null,
      contentMd: parsed.contentMd,
      published: parsed.published === "on",
    },
  });

  redirect("/hall-of-fame");
}
