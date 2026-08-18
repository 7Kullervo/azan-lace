import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { colors: true, images: true },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

const colorSchema = z.object({
  id: z.string().optional(), // existing colors keep their id; new ones omit it
  name: z.string().min(1),
  hex: z.string().optional(),
  stock: z.number().int().min(0).default(0),
});

const updateSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().min(1).optional(),
  price: z.number().int().min(0).optional(),
  stock: z.number().int().min(0).optional(),
  unit: z.enum(["GUZ", "METER", "YARD", "INCH", "CENTIMETER", "ROLL", "PIECE"]).optional(),
  thumbnail: z.string().optional(),
  active: z.boolean().optional(),
  images: z.array(z.string()).optional(), // if provided, REPLACES the gallery
  colors: z.array(colorSchema).optional(), // if provided, REPLACES the color list
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data." }, { status: 400 });
  }
  const data = parsed.data;

  // Replacing images/colors is done as delete-then-recreate for simplicity —
  // fine at this catalog size and keeps the admin form logic simple.
  if (data.images) {
    await prisma.productImage.deleteMany({ where: { productId: id } });
  }
  if (data.colors) {
    await prisma.productColor.deleteMany({ where: { productId: id } });
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(data.title ? { title: data.title } : {}),
      ...(data.description ? { description: data.description } : {}),
      ...(data.price !== undefined ? { price: data.price } : {}),
      ...(data.stock !== undefined ? { stock: data.stock } : {}),
      ...(data.unit ? { unit: data.unit } : {}),
      ...(data.thumbnail ? { thumbnail: data.thumbnail } : {}),
      ...(data.active !== undefined ? { active: data.active } : {}),
      ...(data.images ? { images: { create: data.images.map((p, i) => ({ path: p, position: i })) } } : {}),
      ...(data.colors
        ? { colors: { create: data.colors.map((c) => ({ name: c.name, hex: c.hex, stock: c.stock })) } }
        : {}),
    },
    include: { colors: true, images: true },
  });

  return NextResponse.json(product);
}

// Products are soft-deleted (active: false) rather than removed, so past
// orders that reference them stay intact.
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await prisma.product.update({ where: { id }, data: { active: false } });
  return NextResponse.json({ ok: true });
}
