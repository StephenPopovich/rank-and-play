import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rankandplay.com";
const siteName = "RankAndPlay";

export function buildMetadata(args: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${siteUrl}${args.path ?? ""}`;
  const ogImage = args.image ?? `${siteUrl}/og/default.png`;

  return {
    title: args.title,
    description: args.description,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: url },
    robots: args.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      url,
      title: args.title,
      description: args.description,
      siteName,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: args.title,
      description: args.description,
      images: [ogImage],
    },
  };
}