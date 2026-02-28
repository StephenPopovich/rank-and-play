"use client";

import * as React from "react";

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

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("File read failed"));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

export default function WriteBlogForm() {
  const [title, setTitle] = React.useState("");
  const [seoTitle, setSeoTitle] = React.useState("");
  const [seoDescription, setSeoDescription] = React.useState("");
  const [contentMd, setContentMd] = React.useState("");

  const [featureImageFile, setFeatureImageFile] = React.useState<File | null>(null);
  const [featureImagePreview, setFeatureImagePreview] = React.useState<string>("");

  const [published, setPublished] = React.useState(false);
  const [allowIndexing, setAllowIndexing] = React.useState(false);
  const [showInBlog, setShowInBlog] = React.useState(true);

  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState<string>("");

  const slugPreview = React.useMemo(() => slugify(title || "your-title"), [title]);
  const excerptPreview = React.useMemo(() => firstParagraph(contentMd), [contentMd]);

  async function onPickImage(file: File | null) {
    setFeatureImageFile(file);
    setFeatureImagePreview("");
    if (!file) return;

    const url = await fileToDataUrl(file);
    setFeatureImagePreview(url);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setSaving(true);

    try {
      const coverDataUrl = featureImageFile ? await fileToDataUrl(featureImageFile) : "";

      const res = await fetch("/api/blog/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          seoTitle,
          seoDescription,
          contentMd,
          coverDataUrl,
          published,
          allowIndexing,
          showInBlog,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to create post");
      }

      const json = await res.json();
      setMsg("Saved. Redirecting...");
      window.location.href = `/blog/${json.slug}`;
    } catch (err: any) {
      setMsg(err?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm font-semibold text-white">Post Basics</div>

        <div className="mt-4">
          <label className="mb-1 block text-sm text-slate-200/90">H1 Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-white outline-none focus:border-white/25"
            placeholder="Example: The 10 Best JRPGs That Still Hold Up"
            required
          />
          <div className="mt-2 text-xs text-slate-300/80">
            Slug preview: <span className="text-slate-200">/blog/{slugPreview}</span>
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-1 block text-sm text-slate-200/90">Feature Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onPickImage(e.target.files?.[0] || null)}
            className="block w-full text-sm text-slate-200/90"
          />
          <div className="mt-2 text-xs text-slate-300/80">
            Recommended for SEO and social sharing: <span className="text-slate-200">1200 x 630</span>.
            For a nicer hero image: <span className="text-slate-200">1600 x 900</span>.
            Use JPG or WebP and keep it under 300KB if possible.
          </div>

          {featureImagePreview ? (
            <div className="mt-3 overflow-hidden rounded-lg border border-white/10">
              <img src={featureImagePreview} alt="Feature preview" className="h-auto w-full" />
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm font-semibold text-white">SEO</div>

        <div className="mt-4">
          <label className="mb-1 block text-sm text-slate-200/90">SEO Title</label>
          <input
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-white outline-none focus:border-white/25"
            placeholder="Optional, falls back to H1 later"
          />
          <div className="mt-2 text-xs text-slate-300/80">Target 50 to 60 characters.</div>
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-sm text-slate-200/90">SEO Description</label>
          <textarea
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-white outline-none focus:border-white/25"
            rows={3}
            placeholder="Target 140 to 160 characters."
          />
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-200/90">
            <input
              type="checkbox"
              checked={allowIndexing}
              onChange={() => setAllowIndexing((v) => !v)}
            />
            Allow indexing (search engines can index this page)
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-200/90">
            <input type="checkbox" checked={showInBlog} onChange={() => setShowInBlog((v) => !v)} />
            Show on Blog page as a tile
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-200/90">
            <input
              type="checkbox"
              checked={published}
              onChange={() => setPublished((v) => !v)}
            />
            Published (visible to others)
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm font-semibold text-white">Content</div>

        <div className="mt-4">
          <label className="mb-1 block text-sm text-slate-200/90">Blog Body (Markdown)</label>
          <textarea
            value={contentMd}
            onChange={(e) => setContentMd(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-white outline-none focus:border-white/25"
            rows={14}
            placeholder="Write your post. The first paragraph becomes the blog tile excerpt."
          />
        </div>

        <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-4">
          <div className="text-xs font-semibold text-slate-200/90">Blog Tile Preview</div>
          <div className="mt-2 text-sm text-white">{title || "Your title will appear here"}</div>
          <div className="mt-2 text-xs text-slate-300/80">
            {excerptPreview || "Your first paragraph will show here as the excerpt."}
          </div>
        </div>
      </div>

      {msg ? <div className="text-sm text-slate-200/90">{msg}</div> : null}

      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-white/10 hover:bg-white/15 px-4 py-2 text-sm text-white ring-1 ring-white/10 transition disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Post"}
      </button>
    </form>
  );
}