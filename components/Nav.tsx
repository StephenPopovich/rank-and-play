import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Nav() {
  const session = await getServerSession(authOptions);
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/" className="text-lg font-semibold text-zinc-100">Rankandplay.com</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/games">Games</Link>
          <Link href="/hall-of-fame">Hall of Fame</Link>
          <Link href="/forum">Forum</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/reviews">Reviews</Link>
          {session?.user ? (
            <>
              <Link href="/me">Me</Link>
              <form action="/api/auth/signout" method="post">
                <button className="rounded bg-zinc-800 px-3 py-1 hover:bg-zinc-700">Sign out</button>
              </form>
            </>
          ) : (
            <Link className="rounded bg-indigo-600 px-3 py-1 text-white hover:bg-indigo-500" href="/auth/signin">Sign in</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
