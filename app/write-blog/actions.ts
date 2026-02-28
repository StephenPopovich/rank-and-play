"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function makeUniqueSlug(base: string, excludePostId?: string) {
  const baseSlug = slugify(base) || "post";

  const found = await prisma.post.findUnique({
    where: { slug: baseSlug },
    select: { id: true },
  });

  if (!found || (excludePostId && found.id === excludePostId)) {
    return baseSlug;
  }

  let n = 2;
  while (true) {
    const candidate = `${baseSlug}-${n}`;
    const hit = await prisma.post.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!hit || (excludePostId && hit.id === excludePostId)) {
      return candidate;
    }

    n += 1;
    if (n > 5000) throw new Error("Could not generate a unique slug");
  }
}

export async function saveBlogPost(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Not authenticated");

  const id = String(formData.get("id") || "").trim();

  const title = String(formData.get("title") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const coverUrl = String(formData.get("coverUrl") || "").trim();
  const contentMd = String(formData.get("contentMd") || "").trim();

  // Accept either checkbox style or select style values
  const publishedRaw = String(formData.get("published") || "").trim();
  const published = publishedRaw === "true" || publishedRaw === "on" || publishedRaw === "1";

  if (!title) throw new Error("Title is required");
  if (!contentMd) throw new Error("Content is required");

  const desiredSlug = slugInput || title;
  const slug = await makeUniqueSlug(desiredSlug, id || undefined);

  const data = {
    type: "BLOG",
    title,
    slug,
    excerpt: excerpt || null,
    coverUrl: coverUrl || null,
    contentMd,
    published,
    authorId: session.user.id,
  };

  const post = id
    ? await prisma.post.update({ where: { id }, data })
    : await prisma.post.create({ data });

  return { id: post.id, slug: post.slug, published: post.published };
}