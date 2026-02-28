// components/Nav.tsx
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignOutButton from "@/components/SignOutButton";

const navLink =
  "text-sm text-slate-200/90 hover:text-white hover:bg-white/5 px-3 py-2 rounded-md transition";

export default async function Nav() {
  const session = await getServerSession(authOptions);
  const isAuthed = !!session?.user;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0015]/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-white/10 ring-1 ring-white/10" />
            <span className="font-semibold text-white">RankAndPlay</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link className={navLink} href="/games">
              Games
            </Link>
            <Link className={navLink} href="/hall-of-fame">
              Hall of Fame
            </Link>
            <Link className={navLink} href="/forum">
              Forum
            </Link>
            <Link className={navLink} href="/blog">
              Blog
            </Link>
            <Link className={navLink} href="/reviews">
              Reviews
            </Link>

            {isAuthed && (
              <Link className={navLink} href="/profile">
                Profile
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {isAuthed ? (
              <>
                <div className="hidden sm:block text-right leading-tight">
                  <div className="text-sm font-medium text-white">
                    {session?.user?.name || "Signed in"}
                  </div>
                  <div className="text-xs text-slate-300/80">
                    {session?.user?.email || ""}
                  </div>
                </div>

                <SignOutButton />
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="rounded-md bg-white/10 hover:bg-white/15 px-3 py-2 text-sm text-white ring-1 ring-white/10 transition"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>

        <nav className="md:hidden pb-3 flex flex-wrap gap-2">
          <Link className={navLink} href="/games">
            Games
          </Link>
          <Link className={navLink} href="/hall-of-fame">
            Hall of Fame
          </Link>
          <Link className={navLink} href="/forum">
            Forum
          </Link>
          <Link className={navLink} href="/blog">
            Blog
          </Link>
          <Link className={navLink} href="/reviews">
            Reviews
          </Link>
          {isAuthed && (
            <Link className={navLink} href="/profile">
              Profile
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}