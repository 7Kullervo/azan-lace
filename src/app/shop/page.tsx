import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const rawQuery = resolvedSearchParams.q;
  const q = rawQuery?.trim().toLowerCase() ?? "";

  const products = await prisma.product.findMany({
    where: { active: true },
    include: { colors: true, images: true },
    orderBy: { createdAt: "desc" },
  });

  // When a search term is present, matching products are shown first,
  // then the rest of the catalog below — per the brief.
  let ordered = products;
  if (q) {
    const matches = products.filter((p) =>
      `${p.title} ${p.description}`.toLowerCase().includes(q)
    );
    const rest = products.filter((p) => !matches.includes(p));
    ordered = [...matches, ...rest];
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink dark:text-cream">
          {q ? `Results for "${rawQuery}"` : "Shop All Laces"}
        </h1>
        {q && (
          <p className="text-sm text-ink-muted dark:text-cream-muted mt-1">
            Showing best matches first, followed by the rest of the collection.
          </p>
        )}
      </div>

      {ordered.length === 0 ? (
        <p className="text-ink-muted dark:text-cream-muted">
          No products found. Try a different search.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {ordered.map((p) => (
            <ProductCard key={p.id} product={{ ...p, colors: p.colors, images: p.images }} />
          ))}
        </div>
      )}
    </div>
  );
}
