"use client";

import Link from "next/link";
import { useMemo, useRef } from "react";

export type UpcomingGame = {
  id: number;
  slug: string;
  name: string;
  background_image?: string | null;
  released?: string | null;
};

export default function UpcomingCarousel(props: {
  title?: string;
  subtitle?: string;
  items: UpcomingGame[];
}) {
  const { title = "Upcoming games", subtitle, items } = props;
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const hasItems = items?.length > 0;

  const list = useMemo(() => {
    return (items ?? []).filter((g) => g?.id && g?.slug && g?.name);
  }, [items]);

  function scrollByAmount(px: number) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: px, behavior: "smooth" });
  }

  return (
    <section className="mt-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          {subtitle ? (
            <p className="mt-1 text-sm text-white/70">{subtitle}</p>
          ) : null}
        </div>

        <div className="hidden sm:flex gap-2">
          <button
            type="button"
            onClick={() => scrollByAmount(-520)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10"
            aria-label="Scroll left"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount(520)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10"
            aria-label="Scroll right"
          >
            →
          </button>
        </div>
      </div>

      {!hasItems ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
          No upcoming games found right now.
        </div>
      ) : (
        <div className="mt-4">
          <div
            ref={scrollerRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-3"
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {list.map((g) => {
              const href = `/games/${g.slug}?rawgId=${g.id}`;
              const released = g.released ? new Date(g.released) : null;

              return (
                <Link
                  key={g.id}
                  href={href}
                  className="group relative w-[78%] shrink-0 sm:w-[320px]"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    <div className="relative aspect-[16/10] w-full bg-black/30">
                      {g.background_image ? (
                        // Using <img> keeps it simple and avoids next/image domain config.
                        // You can switch to next/image later if you add remotePatterns.
                        <img
                          src={g.background_image}
                          alt={`${g.name} cover`}
                          loading="lazy"
                          className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-white/50">
                          No image
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-base font-semibold text-white leading-tight">
                          {g.name}
                        </h3>
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/70">
                          View
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-white/70">
                        {released ? (
                          <>Releases: {released.toLocaleDateString()}</>
                        ) : (
                          <>Release date: Unknown</>
                        )}
                      </p>

                      <p className="mt-2 text-xs text-white/60">
                        Click to load full details and store it in your database.
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <p className="mt-2 text-xs text-white/60">
            Tip: swipe left or right on mobile.
          </p>
        </div>
      )}
    </section>
  );
}