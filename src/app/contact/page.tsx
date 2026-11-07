/* ============================================================
   CONTACT US PAGE
   ------------------------------------------------------------
   The shop details are the constants right below this comment.
   Change them here and the whole page (and the map) updates.
   Social media links are NOT here — they live in
   src/components/SocialLinks.tsx.
   ============================================================ */

import type { Metadata } from "next";
import LaceDivider from "@/components/LaceDivider";
import { SocialLinksRow } from "@/components/SocialLinks";

export const metadata: Metadata = {
  title: "Contact Us — Azan Lace",
  description: "Visit, call or email Azan Lace in Chour Harpal, Rawalpindi.",
};

const SHOP_ADDRESS = "Chour Harpal, Rawalpindi, 46000, Pakistan";
const PHONE_DISPLAY = "+92 319 5452674";
const PHONE_LINK = "+923195452674"; // used for tap-to-call, no spaces
const EMAIL = "azanlace1@gmail.com";
const OPENING_HOURS = "10 AM – 10 PM";

// The map is built from the address above. This embed style needs no API key.
const MAP_SRC = `https://www.google.com/maps?q=${encodeURIComponent(SHOP_ADDRESS)}&output=embed`;

function Row({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-wine/10 dark:bg-gold/10 text-wine dark:text-gold">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {icon}
        </svg>
      </span>
      <div>
        <h3 className="font-body text-sm font-semibold text-ink dark:text-cream">{label}</h3>
        <div className="text-sm text-ink-muted dark:text-cream-muted">{children}</div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div>
      {/* ---------- HEADER BAND ---------- */}
      <section className="bg-surface dark:bg-charcoal-surface transition-colors duration-300">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-gold mb-3">We&apos;d love to hear from you</p>
          <h1 className="font-display text-4xl sm:text-5xl text-wine dark:text-gold">Contact Us</h1>
        </div>
        <div className="px-6">
          <LaceDivider />
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-2">
        {/* ---------- DETAILS ---------- */}
        <div className="space-y-6">
          <Row
            label="Shop Location"
            icon={
              <>
                <path d="M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </>
            }
          >
            {SHOP_ADDRESS}
          </Row>

          <Row
            label="Phone"
            icon={<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />}
          >
            <a href={`tel:${PHONE_LINK}`} className="hover:text-wine dark:hover:text-gold">
              {PHONE_DISPLAY}
            </a>
          </Row>

          <Row
            label="Email"
            icon={
              <>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </>
            }
          >
            <a href={`mailto:${EMAIL}`} className="hover:text-wine dark:hover:text-gold">
              {EMAIL}
            </a>
          </Row>

          <Row
            label="Opening Hours"
            icon={
              <>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </>
            }
          >
            {OPENING_HOURS}
          </Row>

          <div>
            <h3 className="font-body text-sm font-semibold text-ink dark:text-cream mb-3">Follow Us</h3>
            <SocialLinksRow />
          </div>
        </div>

        {/* ---------- MAP ---------- */}
        <div className="overflow-hidden rounded-2xl border border-wine/10 dark:border-gold/10 min-h-[320px] lg:min-h-[420px]">
          <iframe
            title="Azan Lace shop location on Google Maps"
            src={MAP_SRC}
            className="h-full w-full min-h-[320px] lg:min-h-[420px]"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
