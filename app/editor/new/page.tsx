import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasAtLeast } from "@/lib/perm";
import { redirect } from "next/navigation";
import NewPostForm from "./newPostForm";

export default async function NewEditorPage({ searchParams }: { searchParams: { type?: "BLOG" | "REVIEW" } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/signin");

  const type = searchParams.type ?? "BLOG";
  if (!hasAtLeast(session.user.role, "BLOGGER")) {
    return <div className="text-zinc-300">You do not have permission to create posts.</div>;
  }

  return <NewPostForm type={type} />;
}
