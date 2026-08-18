"use client";

import { useLanguage } from "@/lib/language-context";
import type { ProductColorDTO } from "@/types";

export default function ColorSwatchPicker({
  colors,
  selectedId,
  onChange,
}: {
  colors: ProductColorDTO[];
  selectedId: string | null;
  onChange: (colorId: string) => void;
}) {
  const { t } = useLanguage();

  if (colors.length === 0) return null;

  return (
    <div>
      <label className="block text-sm font-medium text-ink dark:text-cream mb-1.5">
        {t("color")}
      </label>
      <div className="relative">
        <select
          value={selectedId ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-wine/20 dark:border-gold/30 bg-surface dark:bg-charcoal-surface px-3 py-2 pr-8 text-sm text-ink dark:text-cream focus:outline-none"
        >
          <option value="" disabled>
            Select a color
          </option>
          {colors.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
              {c.stock <= 0 ? " (Out of stock)" : ""}
            </option>
          ))}
        </select>

        {/* Small swatch preview of the currently selected color */}
        {selectedId && (
          <span
            className="pointer-events-none absolute right-8 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border border-black/10"
            style={{
              backgroundColor: colors.find((c) => c.id === selectedId)?.hex ?? "#ccc",
            }}
          />
        )}
      </div>
    </div>
  );
}
