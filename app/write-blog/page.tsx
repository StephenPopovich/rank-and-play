"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveBlogPost } from "./actions";

export default function WriteBlogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get("id") || "";

  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Preserve edit mode
      if (id && !formData.get("id")) {
        formData.set("id", id);
      }

      const result = await saveBlogPost(formData);

      // ✅ THIS IS THE IMPORTANT PART
      // Redirect using slug NOT id
      if (!result?.slug) {
        throw new Error("Post saved but slug missing");
      }

      router.push(`/blog/${result.slug}`);
      router.refresh();

    } catch (err: any) {
      setError(err?.message || "Failed to save post");
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Write Blog Post</h1>

      {error ? (
        <div className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm">
          {error}
        </div>
      ) : null}

      <form className="mt-6 space-y-5" onSubmit={onSubmit}>
        <input type="hidden" name="id" defaultValue={id} />

        <div className="space-y-2">
          <label className="block text-sm font-medium">Title</label>
          <input
            name="title"
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 outline-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Slug (optional)</label>
          <input
            name="slug"
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Feature Image URL</label>
          <input
            name="coverUrl"
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Excerpt</label>
          <textarea
            name="excerpt"
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Content</label>
          <textarea
            name="contentMd"
            className="min-h-[300px] w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 outline-none"
            required
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" />
          Publish now
        </label>

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}