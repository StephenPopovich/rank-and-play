import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Sign in</h1>
      <form className="space-y-3" method="post" action="/api/auth/callback/credentials">
        <input name="csrfToken" type="hidden" value="" />
        <div className="space-y-1">
          <label className="text-sm text-zinc-300">Email</label>
          <input name="email" type="email" required className="w-full rounded bg-zinc-900 p-2 ring-1 ring-zinc-800" />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-zinc-300">Password</label>
          <input name="password" type="password" required className="w-full rounded bg-zinc-900 p-2 ring-1 ring-zinc-800" />
        </div>
        <button className="w-full rounded bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500" type="submit">
          Sign in
        </button>
      </form>
      <p className="text-sm text-zinc-400">
        No account? <Link href="/auth/signup">Create one</Link>
      </p>
    </div>
  );
}
