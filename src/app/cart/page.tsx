"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";
import { formatPKR, UNIT_LABELS } from "@/lib/utils";
import QuantitySelector from "@/components/QuantitySelector";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const { t } = useLanguage();
  const { data: session } = useSession();
  const router = useRouter();

  function handleCheckout() {
    if (!session) {
      router.push("/login?next=/checkout");
      return;
    }
    router.push("/checkout");
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-3xl text-ink dark:text-cream mb-8">{t("yourCart")}</h1>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-wine/10 dark:border-gold/10 p-10 text-center">
          <p className="text-ink-muted dark:text-cream-muted mb-4">{t("emptyCart")}</p>
          <Link
            href="/shop"
            className="inline-block rounded-full bg-wine dark:bg-gold px-6 py-2.5 text-sm font-semibold text-cream dark:text-charcoal"
          >
            {t("continueShopping")}
          </Link>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.colorId}`}
                className="flex gap-4 rounded-2xl border border-wine/10 dark:border-gold/10 p-4"
              >
                <Link href={`/product/${item.slug}`} className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-ivory dark:bg-charcoal">
                  <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                </Link>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link href={`/product/${item.slug}`} className="font-body font-medium text-sm text-ink dark:text-cream hover:text-wine dark:hover:text-gold">
                        {item.title}
                      </Link>
                      {item.colorName && (
                        <p className="text-xs text-ink-muted dark:text-cream-muted mt-0.5">
                          {t("color")}: {item.colorName}
                        </p>
                      )}
                      <p className="text-xs text-ink-muted dark:text-cream-muted">
                        {formatPKR(item.price)} / {UNIT_LABELS[item.unit]}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.colorId)}
                      aria-label="Remove item"
                      className="text-ink-muted dark:text-cream-muted hover:text-wine dark:hover:text-gold text-sm"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <QuantitySelector
                      value={item.quantity}
                      onChange={(q) => updateQuantity(item.productId, item.colorId, q)}
                    />
                    <span className="font-display text-wine dark:text-gold">
                      {formatPKR(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-2xl border border-wine/10 dark:border-gold/10 p-5">
            <div className="flex justify-between text-sm text-ink dark:text-cream mb-2">
              <span>{t("subtotal")}</span>
              <span className="font-display text-wine dark:text-gold">{formatPKR(subtotal)}</span>
            </div>
            <p className="text-xs text-ink-muted dark:text-cream-muted mb-4">
              Shipping and payment method are chosen at checkout.
            </p>
            <button
              onClick={handleCheckout}
              className="w-full rounded-full bg-wine dark:bg-gold px-6 py-3 text-sm font-semibold text-cream dark:text-charcoal transition-transform hover:scale-[1.02]"
            >
              {t("checkout")}
            </button>
            <Link
              href="/shop"
              className="block text-center mt-3 text-sm text-ink-muted dark:text-cream-muted hover:text-wine dark:hover:text-gold"
            >
              {t("continueShopping")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
