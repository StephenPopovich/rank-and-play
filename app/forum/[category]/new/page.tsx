import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import NewThreadForm from "./newThreadForm";

export default async function NewThreadPage({ params }: { params: { category: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/signin");
  return <NewThreadForm categorySlug={params.category} />;
}
