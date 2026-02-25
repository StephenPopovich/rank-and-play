"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Issue = { field: string; message: string };

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark";
        }
      ) => string;
      reset?: (widgetId?: string) => void;
    };
  }
}

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReady, setTurnstileReady] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [topError, setTopError] = useState("");

  const passwordsMatch = useMemo(() => {
    if (!password || !confirmPassword) return true;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

  useEffect(() => {
    if (!siteKey) {
      setTurnstileReady(false);
      return;
    }

    const existing = document.querySelector('script[data-turnstile="1"]');
    if (existing) {
      setTurnstileReady(true);
      return;
    }

    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.defer = true;
    s.dataset.turnstile = "1";
    s.onload = () => setTurnstileReady(true);
    document.head.appendChild(s);
  }, [siteKey]);

  useEffect(() => {
    if (!siteKey) return;
    if (!turnstileReady) return;
    if (!window.turnstile) return;

    const el = document.getElementById("turnstile-slot");
    if (!el) return;

    el.innerHTML = "";

    window.turnstile.render(el, {
      sitekey: siteKey,
      theme: "dark",
      callback: (token) => setTurnstileToken(token),
      "expired-callback": () => setTurnstileToken(""),
      "error-callback": () => setTurnstileToken(""),
    });
  }, [siteKey, turnstileReady]);

  function fieldError(field: string) {
    return issues.find((i) => i.field === field)?.message || "";
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTopError("");
    setIssues([]);

    if (password !== confirmPassword) {
      setIssues([{ field: "confirmPassword", message: "Passwords do not match." }]);
      return;
    }

    if (siteKey && !turnstileToken) {
      setTopError("Please complete the bot check.");
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("email", email);
      fd.append("password", password);
      fd.append("confirmPassword", confirmPassword);
      if (turnstileToken) fd.append("turnstileToken", turnstileToken);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: fd,
      });

      // Your route currently redirects on success, so this handles both cases:
      // - If it returns JSON error, we show it
      // - If it redirects, Next will follow it and res.ok will still be true
      if (!res.ok) {
        const data = await res.json().catch(() => null);

        if (data?.issues?.length) {
          setIssues(data.issues as Issue[]);
        } else {
          setTopError(data?.error || "Could not create account.");
        }

        if (window.turnstile?.reset) window.turnstile.reset();
        setTurnstileToken("");
        return;
      }

      router.push("/auth/signin?created=1");
    } catch {
      setTopError("Could not create account.");
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit =
    !submitting &&
    !!email &&
    !!password &&
    !!confirmPassword &&
    passwordsMatch &&
    (!siteKey || !!turnstileToken);

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-semibold text-white">Create account</h1>

      <p className="mt-2 text-sm text-white/70">
        Already have an account?{" "}
        <Link href="/auth/signin" className="text-white underline underline-offset-4">
          Sign in
        </Link>
      </p>

      {topError ? (
        <div className="mt-6 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
          {topError}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm text-white/80">Name</label>
          <input
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-white/25"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            placeholder="Optional"
          />
          {fieldError("name") ? (
            <p className="mt-1 text-xs text-red-300">{fieldError("name")}</p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm text-white/80">Email</label>
          <input
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-white/25"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            inputMode="email"
            required
          />
          {fieldError("email") ? (
            <p className="mt-1 text-xs text-red-300">{fieldError("email")}</p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm text-white/80">Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-white/25"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <p className="mt-1 text-xs text-white/60">At least 8 characters</p>
          {fieldError("password") ? (
            <p className="mt-1 text-xs text-red-300">{fieldError("password")}</p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm text-white/80">Confirm password</label>
          <input
            type="password"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-white/25"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />

          {!passwordsMatch ? (
            <p className="mt-1 text-xs text-red-300">Passwords do not match.</p>
          ) : fieldError("confirmPassword") ? (
            <p className="mt-1 text-xs text-red-300">{fieldError("confirmPassword")}</p>
          ) : null}
        </div>

        {/* Turnstile */}
        {siteKey ? (
          <div className="pt-2">
            <div id="turnstile-slot" />
            {!turnstileToken ? (
              <p className="mt-2 text-xs text-white/60">Complete the bot check to continue.</p>
            ) : null}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Creating..." : "Create account"}
        </button>

        <p className="text-xs text-white/60">
          After signup, go back and sign in.
        </p>
      </form>
    </div>
  );
}