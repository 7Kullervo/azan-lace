import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { z } from "zod";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { colors: true, images: true },
  });
  return NextResponse.json(products);
}

const colorSchema = z.object({
  name: z.string().min(1),
  hex: z.string().optional(),
  stock: z.number().int().min(0).default(0),
});

const productSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(1),
  type: z.enum(["LACE", "OTHER"]).default("LACE"),
  price: z.number().int().min(0),
  stock: z.number().int().min(0),
  unit: z.enum(["GUZ", "METER", "YARD", "INCH", "CENTIMETER", "ROLL", "PIECE"]),
  thumbnail: z.string().min(1), // path returned by /api/upload
  images: z.array(z.string()).default([]), // additional image paths
  colors: z.array(colorSchema).default([]),
});

export async function POST(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid product data." }, { status: 400 });
  }

  const data = parsed.data;

  // Make sure the slug is unique — append a number if needed.
  const baseSlug = slugify(data.title);
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix++}`;
  }

  const product = await prisma.product.create({
    data: {
      slug,
      title: data.title,
      description: data.description,
      type: data.type,
      price: data.price,
      stock: data.stock,
      unit: data.unit,
      thumbnail: data.thumbnail,
      images: { create: data.images.map((path, i) => ({ path, position: i })) },
      colors:
        data.type === "LACE"
          ? { create: data.colors.map((c) => ({ name: c.name, hex: c.hex, stock: c.stock })) }
          : undefined,
    },
    include: { colors: true, images: true },
  });

  return NextResponse.json(product, { status: 201 });
}
