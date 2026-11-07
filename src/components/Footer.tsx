"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import LaceDivider from "@/components/LaceDivider";
import { SocialLinksRow } from "@/components/SocialLinks";

// The social media URLs live in src/components/SocialLinks.tsx —
// change them there and both this footer and the Contact page update.

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
          <div className="mt-4">
            <SocialLinksRow />
          </div>
        </div>

        <div>
          <h4 className="font-body font-semibold text-sm text-ink dark:text-cream mb-3">Shop</h4>
          <ul className="space-y-2 text-sm text-ink-muted dark:text-cream-muted">
            <li><Link href="/shop" className="hover:text-wine dark:hover:text-gold">{t("shop")}</Link></li>
            <li><Link href="/cart" className="hover:text-wine dark:hover:text-gold">{t("cart")}</Link></li>
            <li><Link href="/dashboard" className="hover:text-wine dark:hover:text-gold">{t("myOrders")}</Link></li>
            <li><Link href="/about" className="hover:text-wine dark:hover:text-gold">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-wine dark:hover:text-gold">Contact Us</Link></li>
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
