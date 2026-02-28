// components/SignOutButton.tsx
"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-md bg-white/10 hover:bg-white/15 px-3 py-2 text-sm text-white ring-1 ring-white/10 transition"
    >
      Sign out
    </button>
  );
}