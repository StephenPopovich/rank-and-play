import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { rateLimit } from "@/app/api/_utils/rateLimit";
import { verifyTurnstile } from "@/app/api/_utils/antiBot";

const schema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8),
  turnstileToken: z.string().optional(),
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  const rl = rateLimit(`register:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const form = await req.formData();
  const parsed = schema.safeParse({
    name: form.get("name")?.toString() || undefined,
    email: form.get("email")?.toString(),
    password: form.get("password")?.toString(),
    turnstileToken: form.get("turnstileToken")?.toString() || undefined,
  });
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const botOk = await verifyTurnstile(parsed.data.turnstileToken);
  if (!botOk) return NextResponse.json({ error: "Bot check failed" }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return NextResponse.json({ error: "Email already used" }, { status: 409 });

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  await prisma.user.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name,
      passwordHash,
    },
  });

  return NextResponse.redirect(new URL("/auth/signin", req.url));
}
