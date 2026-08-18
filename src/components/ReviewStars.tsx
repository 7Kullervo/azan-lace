"use client";

import { useState } from "react";

export default function ReviewStars({
  rating,
  onChange,
  interactive = false,
  size = 18,
}: {
  rating: number;
  onChange?: (rating: number) => void;
  interactive?: boolean;
  size?: number;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? rating;

  return (
    <div className="flex items-center gap-0.5" role={interactive ? "radiogroup" : undefined}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(null)}
          onClick={() => interactive && onChange?.(star)}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          <svg width={size} height={size} viewBox="0 0 24 24" fill={star <= display ? "currentColor" : "none"}
            className={star <= display ? "text-gold" : "text-ink-muted/40 dark:text-cream-muted/40"}
          >
            <path
              d="M12 2.5l2.9 6.4 6.9.6-5.3 4.6 1.6 6.9L12 17.6l-6.1 3.4 1.6-6.9L2.2 9.5l6.9-.6L12 2.5z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}
