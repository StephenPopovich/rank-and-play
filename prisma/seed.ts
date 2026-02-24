import { prisma } from "../lib/db";

async function main() {
  const categories = [
    { name: "General", slug: "general" },
    { name: "MMO", slug: "mmo" },
    { name: "RPG", slug: "rpg" },
    { name: "Battle Royale", slug: "battle-royale" },
    { name: "UFO / UAP", slug: "ufo-uap" },
    { name: "Hardware and Performance", slug: "hardware-performance" },
  ];

  for (const c of categories) {
    await prisma.forumCategory.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: c,
    });
  }

  const tags = [
    "games",
    "rating",
    "ufo",
    "uap",
    "mmo",
    "rpg",
    "battle-royale",
    "fps",
    "indie",
    "retro",
    "horror",
    "sim",
    "strategy",
    "fighting",
    "speedrun",
    "co-op",
    "single-player",
    "multiplayer",
    "streaming",
    "patch-notes",
  ];

  for (const name of tags) {
    const slug = name.toLowerCase();
    await prisma.tag.upsert({
      where: { slug },
      update: { name },
      create: { slug, name },
    });
  }

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
