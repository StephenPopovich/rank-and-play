import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function MePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/signin");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return <div className="text-zinc-300">User missing.</div>;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">My Profile</h1>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
        <div className="text-sm text-zinc-400">Role</div>
        <div className="text-lg font-semibold">{user.role}</div>

        <div className="mt-4 text-sm text-zinc-400">Email</div>
        <div className="text-sm">{user.email}</div>

        <div className="mt-4 text-sm text-zinc-400">Favorites (stored on user for now)</div>
        <div className="text-sm text-zinc-200">Genres: {user.favoriteGenres.join(", ") || "None"}</div>
        <div className="text-sm text-zinc-200">Games: {user.favoriteGames.join(", ") || "None"}</div>
      </div>
    </div>
  );
}
