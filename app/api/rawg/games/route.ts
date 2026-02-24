import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? "";
  const page = url.searchParams.get("page") ?? "1";

  const key = process.env.RAWG_API_KEY;
  if (!key) return NextResponse.json({ error: "RAWG_API_KEY missing" }, { status: 500 });

  const upstream = new URL("https://api.rawg.io/api/games");
  upstream.searchParams.set("key", key);
  if (q) upstream.searchParams.set("search", q);
  upstream.searchParams.set("page", page);

  const res = await fetch(upstream.toString(), {
    headers: { "Accept": "application/json" },
    // Cache upstream results at the edge where possible
    next: { revalidate: 60 * 60 },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
