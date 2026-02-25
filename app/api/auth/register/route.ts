import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { rateLimit } from "@/app/api/_utils/rateLimit";
import { verifyTurnstile } from "@/app/api/_utils/antiBot";

export const runtime = "nodejs";

const schema = z
  .object({
    name: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    turnstileToken: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function getFormString(form: FormData, key: string): string | undefined {
  const v = form.get(key);
  return typeof v === "string" ? v : undefined;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  const rl = rateLimit(`register:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const form = await req.formData();

  const parsed = schema.safeParse({
    name: getFormString(form, "name") || undefined,
    email: getFormString(form, "email"),
    password: getFormString(form, "password"),
    confirmPassword: getFormString(form, "confirmPassword"),
    turnstileToken: getFormString(form, "turnstileToken") || undefined,
  });

  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => ({
      field: i.path.join(".") || "_",
      message: i.message,
    }));
    return NextResponse.json({ error: "Invalid input", issues }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();

  const botOk = await verifyTurnstile(parsed.data.turnstileToken);
  if (!botOk) {
    return NextResponse.json(
      { error: "Bot check failed", issues: [{ field: "turnstileToken", message: "Bot check failed" }] },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Email already used", issues: [{ field: "email", message: "Email already used" }] },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  await prisma.user.create({
    data: {
      email,
      name: parsed.data.name,
      passwordHash,
    },
  });

  return NextResponse.redirect(new URL("/auth/signin?created=1", req.url));
}