import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetail from "@/components/ProductDetail";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      colors: true,
      images: { orderBy: { position: "asc" } },
      reviews: { include: { user: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!product || !product.active) notFound();

  const related = await prisma.product.findMany({
    where: { active: true, id: { not: product.id } },
    take: 4,
    include: { colors: true, images: true },
  });

  return (
    <ProductDetail
      product={product}
      reviews={product.reviews.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      }))}
      related={related}
    />
  );
}
