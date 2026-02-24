type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, opts: { limit: number; windowMs: number }) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now > b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true, remaining: opts.limit - 1, resetAt: now + opts.windowMs };
  }
  if (b.count >= opts.limit) return { ok: false, remaining: 0, resetAt: b.resetAt };
  b.count += 1;
  return { ok: true, remaining: opts.limit - b.count, resetAt: b.resetAt };
}
