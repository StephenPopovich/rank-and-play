"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const params = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<null | "loading" | "error" | "success">(null);
  const [message, setMessage] = useState("");

  const errorParam = params.get("error");

  function translateError(err?: string | null) {
    switch (err) {
      case "CredentialsSignin":
        return "Invalid email or password.";
      case "AccessDenied":
        return "Access denied.";
      case "Configuration":
        return "Server configuration error.";
      default:
        return err ? "Login failed. Try again." : null;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("Checking credentials...");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setStatus("error");
      setMessage(translateError(result.error) || "Login failed.");
      return;
    }

    setStatus("success");
    setMessage("Login successful. Redirecting...");

    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 1200);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0015] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
        <h1 className="text-xl font-semibold text-white mb-2">
          Sign In
        </h1>

        <p className="text-sm text-slate-300 mb-6">
          Enter your account details below.
        </p>

        {errorParam && (
          <div className="mb-4 rounded-lg bg-red-500/10 text-red-300 p-3 text-sm">
            {translateError(errorParam)}
          </div>
        )}

        {status && (
          <div
            className={`mb-4 rounded-lg p-3 text-sm ${
              status === "error"
                ? "bg-red-500/10 text-red-300"
                : status === "success"
                ? "bg-green-500/10 text-green-300"
                : "bg-white/5 text-slate-300"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-300">Email</label>
            <input
              type="email"
              required
              className="mt-1 w-full rounded-lg bg-white/10 p-2 text-white outline-none ring-1 ring-white/10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-slate-300">Password</label>
            <input
              type="password"
              required
              className="mt-1 w-full rounded-lg bg-white/10 p-2 text-white outline-none ring-1 ring-white/10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-purple-600 hover:bg-purple-700 transition px-4 py-2 text-white font-medium"
          >
            {status === "loading" ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}