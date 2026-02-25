import Link from "next/link";

const TECH = [
  // Languages
  { label: "TypeScript", note: "Typed app + server code" },
  { label: "JavaScript (ESM)", note: "Node + ecosystem" },
  { label: "HTML", note: "Semantic markup" },
  { label: "CSS", note: "Tailwind utilities" },

  // Framework + UI
  { label: "Next.js", note: "App Router, SSR/ISR" },
  { label: "React", note: "Server + client components" },
  { label: "Tailwind CSS", note: "Utility-first styling" },
  { label: "clsx", note: "Class composition" },

  // Auth + Security
  { label: "NextAuth.js", note: "Credentials auth" },
  { label: "bcryptjs", note: "Password hashing" },
  { label: "Zod", note: "Schema validation" },

  // Data
  { label: "Prisma", note: "ORM + migrations" },
  { label: "PostgreSQL", note: "Relational DB" },
  { label: "RAWG API", note: "Game data source" },

  // Tooling
  { label: "Node.js", note: "Runtime" },
  { label: "ESLint", note: "Linting" },
  { label: "PostCSS", note: "CSS pipeline" },
  { label: "Autoprefixer", note: "Vendor prefixes" },
];

const QUICK_LINKS = [
  { href: "/games", label: "Games" },
  { href: "/reviews", label: "Reviews" },
  { href: "/blog", label: "Blog" },
  { href: "/forum", label: "Forum" },
  { href: "/hall-of-fame", label: "Hall of Fame" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-16 border-t border-white/10">
      {/* Background layer: CSS-only gamer vibe */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />

        {/* Neon glow blobs */}
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-28 bottom-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

        {/* Scanline effect */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.06) 1px, transparent 1px, transparent 6px)",
          }}
        />

        {/* Optional: add your own footer image overlay (put file in /public/images/footer-bg.webp) */}
        {/* Uncomment if you add an image */}
        {/*
        <div
          className="absolute inset-0 opacity-[0.20] mix-blend-screen"
          style={{
            backgroundImage: "url('/images/footer-bg.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        */}
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-lg font-semibold tracking-tight">
                RankAndPlay
              </span>
              <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-xs text-white/80">
                showpiece build
              </span>
            </Link>

            <p className="mt-3 text-sm leading-6 text-white/70">
              Built for speed, SEO, and scale. Server-first pages, typed data
              access, and a clean architecture designed to grow into a full
              gaming community platform.
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/70">
              <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1">
                SSR and ISR ready
              </span>
              <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1">
                RBAC roles
              </span>
              <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1">
                Prisma + Postgres
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-white">Explore</h3>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-white/70 transition hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-white">Source</h3>
              <p className="mt-2 text-sm text-white/70">
                Clean code, typed data, and production-minded defaults. Designed
                as a portfolio-ready foundation for growth.
              </p>
            </div>
          </div>

          {/* Tech stack */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Tech Stack Used
            </h3>

            <div className="mt-3 flex flex-wrap gap-2">
              {TECH.map((t) => (
                <span
                  key={t.label}
                  title={t.note}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 hover:border-white/20 hover:bg-white/10"
                >
                  {t.label}
                </span>
              ))}
            </div>

            <p className="mt-4 text-xs text-white/60">
              Hover a chip for a quick note.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-white/60">
            © {year} RankAndPlay. Built with Next.js, Prisma, and Postgres.
          </p>

          <div className="flex flex-wrap gap-4 text-xs">
            <Link href="/privacy" className="text-white/60 hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="text-white/60 hover:text-white">
              Terms
            </Link>
            <Link href="/contact" className="text-white/60 hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}