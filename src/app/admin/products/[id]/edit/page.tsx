import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { colors: true, images: true },
  });

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl text-ink dark:text-cream mb-6">Edit Product</h1>
      <ProductForm
        initial={{
          id: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          stock: product.stock,
          unit: product.unit,
          isLace: product.type === "LACE",
          thumbnail: product.thumbnail,
          images: [
            { path: product.thumbnail },
            ...product.images.map((i) => ({ path: i.path })),
          ],
          colors: product.colors.map((c) => ({ id: c.id, name: c.name, hex: c.hex ?? "#B8894A", stock: c.stock })),
        }}
      />
    </div>
  );
}
