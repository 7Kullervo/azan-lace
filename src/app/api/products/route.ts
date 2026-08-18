import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/products?q=searchTerm
// Returns all active products. If a search term is given, products whose
// title/description match the term are sorted first, so the Shop page can
// show matches at the top with the rest of the catalog below.
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim().toLowerCase() ?? "";

  const products = await prisma.product.findMany({
    where: { active: true },
    include: { colors: true, images: true },
    orderBy: { createdAt: "desc" },
  });

  if (!q) {
    return NextResponse.json(products);
  }

  const matches: typeof products = [];
  const rest: typeof products = [];

  for (const p of products) {
    const haystack = `${p.title} ${p.description}`.toLowerCase();
    if (haystack.includes(q)) matches.push(p);
    else rest.push(p);
  }

  return NextResponse.json([...matches, ...rest]);
}
