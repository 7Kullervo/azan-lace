"use client";

import { useLanguage } from "@/lib/language-context";

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  const { t } = useLanguage();

  return (
    <div>
      <label className="block text-sm font-medium text-ink dark:text-cream mb-1.5">
        {t("quantity")}
      </label>
      <div className="inline-flex items-center rounded-lg border border-wine/20 dark:border-gold/30">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="px-3 py-2 text-ink dark:text-cream disabled:opacity-30 hover:bg-wine/5 dark:hover:bg-gold/10 transition-colors"
        >
          −
        </button>
        <span className="w-10 text-center text-sm text-ink dark:text-cream select-none">
          {value}
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="px-3 py-2 text-ink dark:text-cream disabled:opacity-30 hover:bg-wine/5 dark:hover:bg-gold/10 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}
