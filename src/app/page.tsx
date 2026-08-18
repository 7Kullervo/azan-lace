import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import LaceDivider from "@/components/LaceDivider";

export default async function HomePage() {
  const featured = await prisma.product.findMany({
    where: { active: true },
    take: 8,
    orderBy: { createdAt: "desc" },
    include: { colors: true, images: true },
  });

  return (
    <div>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden bg-surface dark:bg-charcoal-surface transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28 text-center">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-gold mb-4">
            Hand-finished trims, made to be noticed
          </p>
          <h1 className="font-display text-5xl sm:text-6xl leading-tight text-wine dark:text-gold">
            Azan Lace
          </h1>
          <p className="mt-5 max-w-xl mx-auto font-body text-ink-muted dark:text-cream-muted">
            Every guz tells a story of thread, pattern, and patience. Browse our
            collection of lace trims, sold by the guz, meter, and more.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-block rounded-full bg-wine dark:bg-gold px-8 py-3 text-sm font-semibold text-cream dark:text-charcoal transition-transform duration-200 hover:scale-105"
          >
            Explore the Shop
          </Link>
        </div>

        {/* Ambient lace-pattern edge along the bottom of the hero */}
        <div className="px-6">
          <LaceDivider />
        </div>
      </section>

      {/* ---------- FEATURED PRODUCTS ---------- */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="font-display text-2xl text-ink dark:text-cream mb-8">
          Newly Added
        </h2>

        {featured.length === 0 ? (
          <p className="text-ink-muted dark:text-cream-muted">
            No products yet — check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  ...p,
                  colors: p.colors,
                  images: p.images,
                }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
