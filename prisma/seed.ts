// ============================================================
// Seed script — creates an admin account and a few sample
// lace products so the store isn't empty on first run.
// Run with: npm run prisma:seed
// ============================================================

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- Admin account ---
  // CHANGE THIS PASSWORD before deploying to production.
  const adminPasswordHash = await bcrypt.hash("ChangeMe123!", 10);
  await prisma.user.upsert({
    where: { email: "admin@azanlace.com" },
    update: {},
    create: {
      name: "Azan Lace Admin",
      email: "admin@azanlace.com",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  // --- Sample products ---
  const products = [
    {
      slug: "royal-gold-thread-lace",
      title: "Royal Gold Thread Lace",
      description:
        "Hand-finished trim with a fine metallic gold thread running through an ivory base — a classic choice for dupattas and formal wear borders.",
      price: 450,
      stock: 120,
      thumbnail: "/uploads/placeholder-lace-1.svg",
      colors: [
        { name: "Ivory & Gold", hex: "#E8D9B5" },
        { name: "Maroon & Gold", hex: "#6B1E2B" },
      ],
    },
    {
      slug: "floral-net-lace",
      title: "Floral Net Lace",
      description:
        "Delicate floral embroidery on a soft net base, perfect for necklines and sleeve trims.",
      price: 320,
      stock: 80,
      thumbnail: "/uploads/placeholder-lace-2.svg",
      colors: [
        { name: "White", hex: "#FFFFFF" },
        { name: "Blush Pink", hex: "#E8C4C4" },
      ],
    },
    {
      slug: "crystal-edge-lace",
      title: "Crystal Edge Lace",
      description:
        "Scalloped edge lace finished with tiny crystal beadwork — adds a subtle sparkle to any hemline.",
      price: 580,
      stock: 45,
      thumbnail: "/uploads/placeholder-lace-3.svg",
      colors: [{ name: "Silver", hex: "#C9C9C9" }],
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        title: p.title,
        description: p.description,
        price: p.price,
        stock: p.stock,
        thumbnail: p.thumbnail,
        unit: "GUZ",
        colors: { create: p.colors },
      },
    });
  }

  // --- Sample courier account ---
  const courierPasswordHash = await bcrypt.hash("ChangeMe123!", 10);
  await prisma.user.upsert({
    where: { email: "courier@azanlace.com" },
    update: {},
    create: {
      name: "Sample Courier",
      email: "courier@azanlace.com",
      passwordHash: courierPasswordHash,
      role: "COURIER",
    },
  });

  console.log("Seed complete.");
  console.log("Admin login: admin@azanlace.com / ChangeMe123!");
  console.log("Courier login: courier@azanlace.com / ChangeMe123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
