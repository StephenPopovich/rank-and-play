export default function SignUpPage() {
  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Create account</h1>
      <form className="space-y-3" method="post" action="/api/auth/register">
        <div className="space-y-1">
          <label className="text-sm text-zinc-300">Name</label>
          <input name="name" className="w-full rounded bg-zinc-900 p-2 ring-1 ring-zinc-800" />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-zinc-300">Email</label>
          <input name="email" type="email" required className="w-full rounded bg-zinc-900 p-2 ring-1 ring-zinc-800" />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-zinc-300">Password</label>
          <input name="password" type="password" minLength={8} required className="w-full rounded bg-zinc-900 p-2 ring-1 ring-zinc-800" />
          <p className="text-xs text-zinc-500">At least 8 characters</p>
        </div>
        <button className="w-full rounded bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500" type="submit">
          Create account
        </button>
      </form>
      <p className="text-sm text-zinc-400">After signup, go back and sign in.</p>
    </div>
  );
}
