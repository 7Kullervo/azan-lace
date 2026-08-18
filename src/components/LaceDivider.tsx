// ============================================================
// LaceDivider — a thin scalloped-edge divider that reuses the
// lace motif to separate sections, instead of a generic
// straight hairline rule.
// ============================================================

export default function LaceDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 12"
      preserveAspectRatio="none"
      className={`w-full h-3 text-wine/30 dark:text-gold/30 ${className}`}
      aria-hidden="true"
    >
      <path
        d="M0 2 Q 10 12 20 2 T 40 2 T 60 2 T 80 2 T 100 2 T 120 2 T 140 2 T 160 2 T 180 2 T 200 2 T 220 2 T 240 2 T 260 2 T 280 2 T 300 2 T 320 2 T 340 2 T 360 2 T 380 2 T 400 2"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}
