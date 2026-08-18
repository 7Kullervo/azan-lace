"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { UNIT_LABELS } from "@/lib/utils";
import MultiImageUpload, { type UploadedImage } from "@/components/admin/MultiImageUpload";

type ColorRow = { id?: string; name: string; hex: string; stock: number };

type ProductFormValue = {
  id?: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  unit: string;
  isLace: boolean;
  thumbnail: string;
  images: UploadedImage[];
  colors: ColorRow[];
};

// Guz and Meter come first in the dropdown since they're the primary units
// for lace, per the store's request — the rest are still available for
// other product types.
const UNIT_ORDER = ["GUZ", "METER", "YARD", "INCH", "CENTIMETER", "ROLL", "PIECE"];

export default function ProductForm({ initial }: { initial?: ProductFormValue }) {
  const router = useRouter();
  const { t } = useLanguage();
  const isEdit = Boolean(initial?.id);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [stock, setStock] = useState(initial?.stock ?? 0);
  const [unit, setUnit] = useState(initial?.unit ?? "GUZ");
  const [isLace, setIsLace] = useState(initial?.isLace ?? true);
  const [images, setImages] = useState<UploadedImage[]>(initial?.images ?? []);
  const [thumbnail, setThumbnail] = useState(initial?.thumbnail ?? "");
  const [colors, setColors] = useState<ColorRow[]>(initial?.colors ?? []);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addColorRow() {
    setColors((c) => [...c, { name: "", hex: "#B8894A", stock: 0 }]);
  }
  function updateColorRow(index: number, patch: Partial<ColorRow>) {
    setColors((c) => c.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }
  function removeColorRow(index: number) {
    setColors((c) => c.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!thumbnail) {
      setError("Please upload at least one photo and mark it as the main image.");
      return;
    }

    setSaving(true);
    const payload = {
      title,
      description,
      type: isLace ? "LACE" : "OTHER",
      price: Number(price),
      stock: Number(stock),
      unit,
      thumbnail,
      // The thumbnail is stored separately, so the gallery only needs the rest.
      images: images.map((i) => i.path).filter((p) => p !== thumbnail),
      colors: isLace ? colors.filter((c) => c.name.trim()).map((c) => ({ ...c, stock: Number(c.stock) })) : [],
    };

    const url = isEdit ? `/api/admin/products/${initial!.id}` : "/api/admin/products";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="block text-sm font-medium text-ink dark:text-cream mb-1">
          {t("productTitle")}
        </label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-wine/20 dark:border-gold/30 bg-surface dark:bg-charcoal-surface px-3 py-2.5 text-sm text-ink dark:text-cream focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink dark:text-cream mb-1">
          {t("productDescription")}
        </label>
        <textarea
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-wine/20 dark:border-gold/30 bg-surface dark:bg-charcoal-surface px-3 py-2.5 text-sm text-ink dark:text-cream focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink dark:text-cream mb-1">{t("price")}</label>
          <input
            required
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full rounded-lg border border-wine/20 dark:border-gold/30 bg-surface dark:bg-charcoal-surface px-3 py-2.5 text-sm text-ink dark:text-cream focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink dark:text-cream mb-1">{t("stock")}</label>
          <input
            required
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className="w-full rounded-lg border border-wine/20 dark:border-gold/30 bg-surface dark:bg-charcoal-surface px-3 py-2.5 text-sm text-ink dark:text-cream focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink dark:text-cream mb-1">{t("unit")}</label>
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="w-full rounded-lg border border-wine/20 dark:border-gold/30 bg-surface dark:bg-charcoal-surface px-3 py-2.5 text-sm text-ink dark:text-cream focus:outline-none"
        >
          {UNIT_ORDER.map((u) => (
            <option key={u} value={u}>
              {UNIT_LABELS[u]}
              {(u === "GUZ" || u === "METER") ? " (primary)" : ""}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink dark:text-cream">
        <input type="checkbox" checked={isLace} onChange={(e) => setIsLace(e.target.checked)} />
        {t("isLace")}
      </label>

      <div>
        <label className="block text-sm font-medium text-ink dark:text-cream mb-2">
          {t("mainImage")} / {t("additionalImages")}
        </label>
        <MultiImageUpload
          images={images}
          onChange={setImages}
          mainImage={thumbnail}
          onMainImageChange={setThumbnail}
        />
      </div>

      {isLace && (
        <div>
          <label className="block text-sm font-medium text-ink dark:text-cream mb-2">
            {t("colors")}
          </label>
          <div className="space-y-2">
            {colors.map((row, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="color"
                  value={row.hex}
                  onChange={(e) => updateColorRow(i, { hex: e.target.value })}
                  className="h-9 w-9 shrink-0 rounded border border-wine/20 dark:border-gold/30 bg-transparent"
                />
                <input
                  placeholder={t("colorName")}
                  value={row.name}
                  onChange={(e) => updateColorRow(i, { name: e.target.value })}
                  className="flex-1 rounded-lg border border-wine/20 dark:border-gold/30 bg-surface dark:bg-charcoal-surface px-3 py-2 text-sm text-ink dark:text-cream focus:outline-none"
                />
                <input
                  type="number"
                  min={0}
                  placeholder={t("stock")}
                  value={row.stock}
                  onChange={(e) => updateColorRow(i, { stock: Number(e.target.value) })}
                  className="w-24 rounded-lg border border-wine/20 dark:border-gold/30 bg-surface dark:bg-charcoal-surface px-3 py-2 text-sm text-ink dark:text-cream focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeColorRow(i)}
                  className="text-ink-muted dark:text-cream-muted hover:text-wine dark:hover:text-gold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addColorRow}
            className="mt-2 text-sm text-wine dark:text-gold hover:underline"
          >
            + {t("addColor")}
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-wine dark:bg-gold px-6 py-2.5 text-sm font-semibold text-cream dark:text-charcoal disabled:opacity-60"
        >
          {saving ? "Saving..." : t("save")}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-full border border-wine/20 dark:border-gold/30 px-6 py-2.5 text-sm text-ink dark:text-cream"
        >
          {t("cancel")}
        </button>
      </div>
    </form>
  );
}
