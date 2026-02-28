import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import WriteBlogForm from "./write-blog-form";

export default async function WriteBlogPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-white">Write Blog</h1>
      <p className="mt-2 text-sm text-slate-300/90">
        Feature image, SEO title/description, indexing toggle, and blog tile visibility.
      </p>

      <div className="mt-8">
        <WriteBlogForm />
      </div>
    </div>
  );
}