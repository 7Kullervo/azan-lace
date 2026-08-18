/* ============================================================
   DISCLAIMER — PLACEHOLDER TEXT
   ------------------------------------------------------------
   Starter wording only — adjust to reflect your actual business
   practices (product photos vs. real color, fabric care, etc.)
   ============================================================ */

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="font-display text-3xl text-wine dark:text-gold mb-6">Disclaimer</h1>
      <div className="space-y-5 text-sm leading-relaxed text-ink-muted dark:text-cream-muted">
        <p>
          The information and products provided on the Azan Lace website are for general
          retail purposes. While we make every effort to display our lace products,
          colors, and descriptions accurately, actual colors may vary slightly depending
          on your device's screen settings and lighting conditions when photographed.
        </p>

        <h2 className="font-body font-semibold text-ink dark:text-cream text-base mt-6">
          Product Availability
        </h2>
        <p>
          Stock levels shown on the site are updated regularly but are not guaranteed to
          be accurate at all times. In the rare case an item becomes unavailable after you
          order it, we will contact you to offer an alternative or a refund.
        </p>

        <h2 className="font-body font-semibold text-ink dark:text-cream text-base mt-6">
          Fabric Care
        </h2>
        <p>
          [Add general care instructions for your lace products here, e.g. hand-wash
          recommendations, ironing temperature, storage tips.]
        </p>

        <h2 className="font-body font-semibold text-ink dark:text-cream text-base mt-6">
          External Links
        </h2>
        <p>
          Our website may contain links to external sites, including our social media
          pages. We are not responsible for the content or practices of those external
          sites.
        </p>

        <p className="text-xs italic">Last updated: [add date when you finalize this page]</p>
      </div>
    </div>
  );
}
