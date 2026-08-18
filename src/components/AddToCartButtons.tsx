"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";
import type { CartLineItem } from "@/types";

export default function AddToCartButtons({ buildItem }: { buildItem: () => CartLineItem | null }) {
  const { addItem } = useCart();
  const { t } = useLanguage();
  const router = useRouter();
  const [justAdded, setJustAdded] = useState(false);

  function handleAddToCart() {
    const item = buildItem();
    if (!item) return;
    addItem(item);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  }

  function handleBuyNow() {
    const item = buildItem();
    if (!item) return;
    addItem(item);
    router.push("/cart");
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={handleAddToCart}
        className="flex-1 rounded-full border-2 border-wine dark:border-gold px-6 py-3 text-sm font-semibold text-wine dark:text-gold transition-all duration-200 hover:bg-wine hover:text-cream dark:hover:bg-gold dark:hover:text-charcoal"
      >
        {justAdded ? "Added ✓" : t("addToCart")}
      </button>
      <button
        onClick={handleBuyNow}
        className="flex-1 rounded-full bg-wine dark:bg-gold px-6 py-3 text-sm font-semibold text-cream dark:text-charcoal transition-all duration-200 hover:opacity-90"
      >
        {t("buyNow")}
      </button>
    </div>
  );
}
