import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      colors: true,
      images: { orderBy: { position: "asc" } },
      reviews: { include: { user: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!product || !product.active) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // A few other active products for the "Related Products" section.
  const related = await prisma.product.findMany({
    where: { active: true, id: { not: product.id } },
    take: 4,
    include: { colors: true, images: true },
  });

  return NextResponse.json({ product, related });
}
