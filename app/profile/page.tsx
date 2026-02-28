// app/profile/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200 ring-1 ring-white/10">
      {children}
    </span>
  );
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin");

  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      name: true,
      email: true,
      role: true,
      bio: true,
      avatarUrl: true,
      favoriteGenres: true,
      favoriteGames: true,
      platforms: true,
      _count: {
        select: {
          posts: true,
          comments: true,
          ratings: true,
          forumThreads: true,
          forumPosts: true,
          sentMessages: true,
          receivedMessages: true,
          newsletterSubscriptions: true,
        },
      },
    },
  });

  if (!user) redirect("/auth/signin");

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Your Profile</h1>
        <p className="text-sm text-slate-300/90">
          This page shows safe account data stored in your database for the signed in user.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <section className="md:col-span-2 rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="User avatar"
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold text-white">
                  {user.name || "Unnamed user"}
                </h2>
                <Pill>{user.role}</Pill>
              </div>

              <div className="mt-1 text-sm text-slate-300/90">
                <div>
                  <span className="text-slate-400">Email:</span>{" "}
                  <span className="text-slate-200">{user.email}</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                  <span>
                    <span className="text-slate-400">Member since:</span>{" "}
                    <span className="text-slate-200">{formatDate(user.createdAt)}</span>
                  </span>
                  <span>
                    <span className="text-slate-400">Last updated:</span>{" "}
                    <span className="text-slate-200">{formatDate(user.updatedAt)}</span>
                  </span>
                </div>
              </div>

              {user.bio ? (
                <div className="mt-4 rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
                  <div className="text-xs font-semibold text-slate-300">Bio</div>
                  <div className="mt-1 text-sm text-slate-200 whitespace-pre-wrap">
                    {user.bio}
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
                  <div className="text-sm text-slate-300/90">
                    No bio yet.
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
              <div className="text-xs text-slate-300">User ID</div>
              <div className="mt-1 text-sm text-slate-200 break-all">{user.id}</div>
            </div>

            <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
              <div className="text-xs text-slate-300">Favorites</div>
              <div className="mt-1 text-sm text-slate-200">
                {user.favoriteGames?.length || 0} games
              </div>
              <div className="text-sm text-slate-200">
                {user.favoriteGenres?.length || 0} genres
              </div>
            </div>

            <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
              <div className="text-xs text-slate-300">Platforms</div>
              <div className="mt-1 text-sm text-slate-200">
                {user.platforms?.length || 0} selected
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
              <h3 className="text-sm font-semibold text-white">Arrays stored on User</h3>

              <div className="mt-4 space-y-4">
                <div>
                  <div className="text-xs font-semibold text-slate-300">Favorite genres</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {user.favoriteGenres?.length ? (
                      user.favoriteGenres.map((g) => <Pill key={g}>{g}</Pill>)
                    ) : (
                      <span className="text-sm text-slate-300/90">None yet</span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-300">Favorite games</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {user.favoriteGames?.length ? (
                      user.favoriteGames.map((g) => <Pill key={g}>{g}</Pill>)
                    ) : (
                      <span className="text-sm text-slate-300/90">None yet</span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-300">Platforms</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {user.platforms?.length ? (
                      user.platforms.map((p) => <Pill key={p}>{p}</Pill>)
                    ) : (
                      <span className="text-sm text-slate-300/90">None yet</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
          <h3 className="text-sm font-semibold text-white">Activity Counts</h3>
          <p className="mt-1 text-sm text-slate-300/90">
            Quick overview pulled via Prisma relation counts.
          </p>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2">
              <span className="text-slate-200">Posts</span>
              <span className="text-white">{user._count.posts}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2">
              <span className="text-slate-200">Comments</span>
              <span className="text-white">{user._count.comments}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2">
              <span className="text-slate-200">Ratings</span>
              <span className="text-white">{user._count.ratings}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2">
              <span className="text-slate-200">Forum threads</span>
              <span className="text-white">{user._count.forumThreads}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2">
              <span className="text-slate-200">Forum posts</span>
              <span className="text-white">{user._count.forumPosts}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2">
              <span className="text-slate-200">DM sent</span>
              <span className="text-white">{user._count.sentMessages}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2">
              <span className="text-slate-200">DM received</span>
              <span className="text-white">{user._count.receivedMessages}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2">
              <span className="text-slate-200">Newsletter</span>
              <span className="text-white">{user._count.newsletterSubscriptions}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}