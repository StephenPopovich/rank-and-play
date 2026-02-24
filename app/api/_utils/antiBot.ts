export async function verifyTurnstile(token?: string | null) {
  // Recommended in production:
  // - Set TURNSTILE_SECRET_KEY in env
  // - Send token from client (Turnstile widget)
  // - Verify here with Cloudflare
  //
  // For now we return true so the starter works immediately.
  // Flip this to enforce once you wire Turnstile.
  if (!process.env.TURNSTILE_SECRET_KEY) return true;
  if (!token) return false;

  const form = new FormData();
  form.append("secret", process.env.TURNSTILE_SECRET_KEY);
  form.append("response", token);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form,
  });

  const json = (await res.json()) as { success: boolean };
  return Boolean(json.success);
}
