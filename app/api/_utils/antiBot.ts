import { NextRequest } from "next/server";

export async function verifyTurnstile(_req: NextRequest) {
  // Kid version:
  // If we are building on our computer (localhost), always say YES.
  // Only check bots on the real website (production).
  if (process.env.NODE_ENV !== "production") {
    return { ok: true as const };
  }

  const secret = process.env.TURNSTILE_SECRET_KEY || "";
  if (!secret) {
    return { ok: false as const, error: "Turnstile is not configured on the server." };
  }

  const form = await _req.formData();
  const token = form.get("turnstileToken");

  if (!token || typeof token !== "string") {
    return { ok: false as const, error: "Bot check required." };
  }

  const ip =
    _req.headers.get("cf-connecting-ip") ||
    _req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "";

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (ip) body.set("remoteip", ip);

  const resp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = (await resp.json().catch(() => null)) as any;

  if (!data?.success) {
    return { ok: false as const, error: "Bot check failed." };
  }

  return { ok: true as const };
}