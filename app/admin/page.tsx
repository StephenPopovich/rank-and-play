import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/perm";
import AdminForms from "./forms";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return <div className="text-zinc-300">Sign in.</div>;
  if (!isAdmin(session.user.role)) return <div className="text-zinc-300">Admins only.</div>;

  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 30 });
  return <AdminForms users={users.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role }))} />;
}
