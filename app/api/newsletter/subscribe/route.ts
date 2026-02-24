import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/app/api/_utils/rateLimit";
import { verifyTurnstile } from "@/app/api/_utils/antiBot";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  const rl = rateLimit(`newsletter:${ip}`, { limit: 20, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const form = await req.formData();
  const email = form.get("email")?.toString();
  const token = form.get("turnstileToken")?.toString() || null;
  const botOk = await verifyTurnstile(token);
  if (!botOk) return NextResponse.json({ error: "Bot check failed" }, { status: 400 });

  if (!email || !email.includes("@")) return NextResponse.json({ error: "Invalid email" }, { status: 400 });

  // Minimal v1: only logged in users get stored subscription in DB.
  // If you want public newsletter signups, add a separate Subscriber table with email-only + double opt-in.
  // Here we just bounce back with a friendly message.
  return NextResponse.redirect(new URL("/hall-of-fame?subscribed=1", req.url));
}
