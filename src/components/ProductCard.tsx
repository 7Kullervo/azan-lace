"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatPKR } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import type { ProductDTO } from "@/types";

export default function ProductCard({ product }: { product: ProductDTO }) {
  const router = useRouter();
  const { t } = useLanguage();

  function handleBuyNow(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    // Buy Now on the card skips straight to the product page where
    // quantity/color is chosen before purchase.
    router.push(`/product/${product.slug}?buyNow=1`);
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-wine/10 dark:border-gold/10 bg-surface dark:bg-charcoal-surface transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-ivory dark:bg-charcoal">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Buy button — fades up on hover, per the brief */}
        <button
          onClick={handleBuyNow}
          className="absolute inset-x-3 bottom-3 translate-y-3 rounded-full bg-wine/95 dark:bg-gold/95 py-2 text-sm font-medium text-cream dark:text-charcoal opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
        >
          {t("buyNow")}
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-body text-sm font-medium text-ink dark:text-cream line-clamp-1">
          {product.title}
        </h3>
        <p className="mt-1 font-display text-lg text-wine dark:text-gold">
          {formatPKR(product.price)}
        </p>
      </div>
    </Link>
  );
}
