"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { formatPKR, UNIT_LABELS } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import ColorSwatchPicker from "@/components/ColorSwatchPicker";
import QuantitySelector from "@/components/QuantitySelector";
import AddToCartButtons from "@/components/AddToCartButtons";
import ReviewStars from "@/components/ReviewStars";
import ProductCard from "@/components/ProductCard";
import LaceDivider from "@/components/LaceDivider";
import type { ProductDTO } from "@/types";

type ReviewDTO = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string };
};

export default function ProductDetail({
  product,
  reviews: initialReviews,
  related,
}: {
  product: ProductDTO;
  reviews: ReviewDTO[];
  related: ProductDTO[];
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useLanguage();

  const gallery = [{ id: "thumb", path: product.thumbnail }, ...product.images];
  const [activeImage, setActiveImage] = useState(gallery[0].path);
  const [colorId, setColorId] = useState<string | null>(product.colors[0]?.id ?? null);
  const [quantity, setQuantity] = useState(1);

  const [reviews, setReviews] = useState(initialReviews);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const avgRating =
    reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  function buildCartItem() {
    const color = product.colors.find((c) => c.id === colorId);
    return {
      productId: product.id,
      slug: product.slug,
      title: product.title,
      thumbnail: product.thumbnail,
      price: product.price,
      unit: product.unit,
      colorId: color?.id ?? null,
      colorName: color?.name ?? null,
      quantity,
    };
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    setReviewError(null);

    if (!session) {
      router.push("/login");
      return;
    }
    if (newRating === 0) {
      setReviewError("Please select a star rating.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, rating: newRating, comment: newComment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not submit review.");

      setReviews((prev) => [data, ...prev]);
      setNewRating(0);
      setNewComment("");
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* ---------- GALLERY ---------- */}
        <div>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-ivory dark:bg-charcoal">
            <Image src={activeImage} alt={product.title} fill className="object-cover" />
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 flex gap-2">
              {gallery.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(img.path)}
                  className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 transition-colors ${
                    activeImage === img.path ? "border-wine dark:border-gold" : "border-transparent"
                  }`}
                >
                  <Image src={img.path} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ---------- DETAILS ---------- */}
        <div>
          <h1 className="font-display text-3xl text-ink dark:text-cream">{product.title}</h1>

          <div className="mt-2 flex items-center gap-2">
            <ReviewStars rating={Math.round(avgRating)} />
            <span className="text-sm text-ink-muted dark:text-cream-muted">
              {reviews.length > 0 ? `${avgRating.toFixed(1)} (${reviews.length})` : "No reviews yet"}
            </span>
          </div>

          <p className="mt-4 font-display text-2xl text-wine dark:text-gold">
            {formatPKR(product.price)}{" "}
            <span className="font-body text-sm text-ink-muted dark:text-cream-muted">
              / {UNIT_LABELS[product.unit]}
            </span>
          </p>

          <div className="mt-6 space-y-5">
            <ColorSwatchPicker colors={product.colors} selectedId={colorId} onChange={setColorId} />
            <QuantitySelector value={quantity} onChange={setQuantity} />
          </div>

          <div className="mt-6">
            <AddToCartButtons buildItem={buildCartItem} />
          </div>

          <div className="mt-8">
            <h2 className="font-body font-semibold text-sm text-ink dark:text-cream mb-2">
              {t("description")}
            </h2>
            <p className="text-sm leading-relaxed text-ink-muted dark:text-cream-muted whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      <div className="my-12">
        <LaceDivider />
      </div>

      {/* ---------- REVIEWS ---------- */}
      <section>
        <h2 className="font-display text-2xl text-ink dark:text-cream mb-6">{t("reviews")}</h2>

        <form onSubmit={submitReview} className="mb-8 rounded-2xl border border-wine/10 dark:border-gold/10 p-5">
          <h3 className="font-body font-medium text-sm text-ink dark:text-cream mb-3">
            {t("writeReview")}
          </h3>
          <ReviewStars rating={newRating} onChange={setNewRating} interactive size={22} />
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your experience with this lace..."
            rows={3}
            className="mt-3 w-full rounded-lg border border-wine/20 dark:border-gold/30 bg-surface dark:bg-charcoal-surface p-3 text-sm text-ink dark:text-cream focus:outline-none"
          />
          {reviewError && <p className="mt-2 text-sm text-red-600">{reviewError}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-3 rounded-full bg-wine dark:bg-gold px-5 py-2 text-sm font-semibold text-cream dark:text-charcoal disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>

        <div className="space-y-5">
          {reviews.length === 0 && (
            <p className="text-sm text-ink-muted dark:text-cream-muted">
              Be the first to review this product.
            </p>
          )}
          {reviews.map((r) => (
            <div key={r.id} className="border-b border-wine/10 dark:border-gold/10 pb-4">
              <div className="flex items-center justify-between">
                <span className="font-body font-medium text-sm text-ink dark:text-cream">
                  {r.user.name}
                </span>
                <ReviewStars rating={r.rating} size={14} />
              </div>
              <p className="mt-1 text-sm text-ink-muted dark:text-cream-muted">{r.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- RELATED PRODUCTS ---------- */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl text-ink dark:text-cream mb-6">
            {t("relatedProducts")}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
