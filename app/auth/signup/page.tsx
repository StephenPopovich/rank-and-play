"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [vegetaAnswer, setVegetaAnswer] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordsMatch = useMemo(() => {
    if (!password || !confirmPassword) return true;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (vegetaAnswer !== "Bulma") {
      setError('Wrong answer. Type Bulma exactly like this: Bulma');
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("email", email);
      fd.append("password", password);
      fd.append("confirmPassword", confirmPassword);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: fd,
        headers: {
          Accept: "application/json",
        },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error || "Signup failed.");
        setLoading(false);
        return;
      }

      setLoading(false);
      router.push("/auth/signup/success");
    } catch {
      setError("Signup failed.");
      setLoading(false);
    }
  }

  const canSubmit =
    !!email &&
    !!password &&
    !!confirmPassword &&
    passwordsMatch &&
    vegetaAnswer === "Bulma" &&
    !loading;

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Create account</h1>

      <p className="text-sm text-gray-300 mb-6">
        Already have an account?{" "}
        <Link className="underline" href="/auth/signin">
          Sign in
        </Link>
      </p>

      {error ? (
        <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Optional"
            autoComplete="name"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            inputMode="email"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Confirm password</label>
          <input
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          {!passwordsMatch ? (
            <p className="mt-1 text-xs text-red-300">Passwords do not match.</p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm mb-1">Who is Vegeta&apos;s Wife</label>
          <input
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2"
            value={vegetaAnswer}
            onChange={(e) => setVegetaAnswer(e.target.value)}
            placeholder='Type Bulma exactly'
            required
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-md bg-purple-600 px-4 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
    </div>
  );
}