import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const key = process.env.RAWG_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "RAWG_API_KEY missing" }, { status: 500 });
  }

  const id = params.id;
  const upstream = new URL(`https://api.rawg.io/api/games/${encodeURIComponent(id)}`);
  upstream.searchParams.set("key", key);

  const res = await fetch(upstream.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 * 60 },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}