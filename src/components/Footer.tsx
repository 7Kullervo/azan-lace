"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import LaceDivider from "@/components/LaceDivider";

/* ============================================================
   SOCIAL MEDIA LINKS
   ------------------------------------------------------------
   Replace these placeholder URLs with the store's real social
   media page links.
   ============================================================ */
const SOCIAL_LINKS = [
  { name: "Facebook", href: "https://facebook.com/azanlace" },
  { name: "Instagram", href: "https://instagram.com/azanlace" },
  { name: "X", href: "https://x.com/azanlace" },
  { name: "YouTube", href: "https://youtube.com/@azanlace" },
  { name: "TikTok", href: "https://tiktok.com/@azanlace" },
];

// Small inline icons so no external image files are required.
function SocialIcon({ name }: { name: string }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "currentColor" } as const;
  switch (name) {
    case "Facebook":
      return (
        <svg {...common}>
          <path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.5c0-.9.25-1.5 1.55-1.5H16.5V4.3C16.2 4.26 15.2 4.2 14 4.2c-2.4 0-4 1.46-4 4.15V10.5H7.5v3H10V21h3.5z" />
        </svg>
      );
    case "Instagram":
      return (
        <svg {...common}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.6" fill="none" />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" fill="none" />
          <circle cx="17" cy="7" r="1" />
        </svg>
      );
    case "X":
      return (
        <svg {...common}>
          <path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "YouTube":
      return (
        <svg {...common}>
          <rect x="3" y="6" width="18" height="12" rx="3" stroke="currentColor" strokeWidth="1.6" fill="none" />
          <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5z" />
        </svg>
      );
    case "TikTok":
      return (
        <svg {...common}>
          <path d="M14 3v10.2a2.8 2.8 0 1 1-2-2.68V8.4a4.9 4.9 0 1 0 4 4.8V8.6a5.9 5.9 0 0 0 3-.82V5.5a3.9 3.9 0 0 1-3-1.5H14z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-20 border-t border-wine/10 dark:border-gold/10 bg-surface dark:bg-charcoal-surface transition-colors duration-300">
      <div className="px-6 pt-2">
        <LaceDivider />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <h3 className="font-display text-xl text-wine dark:text-gold mb-2">Azan Lace</h3>
          <p className="text-sm text-ink-muted dark:text-cream-muted max-w-xs">{t("footerAbout")}</p>

          {/* Social icons — tiny, clickable, open the store's real profile pages */}
          <div className="flex gap-3 mt-4">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-wine/20 dark:border-gold/30 text-wine dark:text-gold hover:bg-wine hover:text-cream dark:hover:bg-gold dark:hover:text-charcoal transition-colors duration-200"
              >
                <SocialIcon name={s.name} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-body font-semibold text-sm text-ink dark:text-cream mb-3">Shop</h4>
          <ul className="space-y-2 text-sm text-ink-muted dark:text-cream-muted">
            <li><Link href="/shop" className="hover:text-wine dark:hover:text-gold">{t("shop")}</Link></li>
            <li><Link href="/cart" className="hover:text-wine dark:hover:text-gold">{t("cart")}</Link></li>
            <li><Link href="/dashboard" className="hover:text-wine dark:hover:text-gold">{t("myOrders")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-body font-semibold text-sm text-ink dark:text-cream mb-3">Legal</h4>
          <ul className="space-y-2 text-sm text-ink-muted dark:text-cream-muted">
            <li><Link href="/privacy-policy" className="hover:text-wine dark:hover:text-gold">{t("privacyPolicy")}</Link></li>
            <li><Link href="/terms-and-conditions" className="hover:text-wine dark:hover:text-gold">{t("termsConditions")}</Link></li>
            <li><Link href="/disclaimer" className="hover:text-wine dark:hover:text-gold">{t("disclaimer")}</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-wine/10 dark:border-gold/10 py-4 text-center text-xs text-ink-muted dark:text-cream-muted">
        © {new Date().getFullYear()} Azan Lace. All rights reserved.
      </div>
    </footer>
  );
}
