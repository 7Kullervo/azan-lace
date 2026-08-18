// ============================================================
// LaceLoader — the site's signature loading icon.
// A small doily-like motif drawn with dashed strokes that
// animate as if being woven, using the "lace-weave" keyframe
// defined in tailwind.config.ts. Reused anywhere content loads
// (page transitions, image uploads, add-to-cart, etc).
// ============================================================

export default function LaceLoader({ size = 56 }: { size?: number }) {
  return (
    <div role="status" aria-label="Loading" className="inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer scalloped ring — like a lace doily edge */}
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="currentColor"
          strokeOpacity="0.15"
          strokeWidth="1.5"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          strokeLinecap="round"
          className="text-gold origin-center animate-lace-weave"
        />
        {/* Inner cross-thread pattern */}
        <path
          d="M50 22 L50 78 M22 50 L78 50 M30 30 L70 70 M70 30 L30 70"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.3"
          className="text-wine dark:text-gold"
        />
        {/* Center bead */}
        <circle cx="50" cy="50" r="4" fill="currentColor" className="text-wine dark:text-gold" />
      </svg>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
