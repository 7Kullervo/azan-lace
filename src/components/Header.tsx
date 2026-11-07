"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import SearchBar from "@/components/SearchBar";

export default function Header() {
  const { data: session } = useSession();
  const { itemCount } = useCart();
  const { t, language } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  // Labels for the About / Contact links, in English or Urdu.
  const aboutLabel = language === "ur" ? "ہمارے بارے میں" : "About Us";
  const contactLabel = language === "ur" ? "رابطہ کریں" : "Contact Us";

  return (
    <header className="sticky top-0 z-40 border-b border-wine/10 dark:border-gold/10 bg-ivory/90 dark:bg-charcoal/90 backdrop-blur-sm transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        {/* Logo — display font, the one place the brand name is set in large type */}
        <Link
          href="/"
          className="font-display text-2xl tracking-wide text-wine dark:text-gold whitespace-nowrap"
        >
          Azan Lace
        </Link>

        <nav className="hidden md:flex items-center gap-6 font-body text-sm text-ink dark:text-cream ml-4">
          <Link href="/" className="hover:text-wine dark:hover:text-gold transition-colors">
            {t("home")}
          </Link>
          <Link href="/shop" className="hover:text-wine dark:hover:text-gold transition-colors">
            {t("shop")}
          </Link>
          <Link href="/about" className="hover:text-wine dark:hover:text-gold transition-colors">
            {aboutLabel}
          </Link>
          <Link href="/contact" className="hover:text-wine dark:hover:text-gold transition-colors">
            {contactLabel}
          </Link>
        </nav>

        <div className="hidden sm:block flex-1 max-w-sm mx-auto">
          <SearchBar />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />

          <Link
            href="/cart"
            aria-label={t("cart")}
            className="relative rounded-full p-2 hover:bg-wine/5 dark:hover:bg-gold/10 transition-colors"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-ink dark:text-cream">
              <path d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-2 5h13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="20" r="1.4" fill="currentColor" />
              <circle cx="17" cy="20" r="1.4" fill="currentColor" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-wine dark:bg-gold px-1 text-[10px] font-semibold text-cream dark:text-charcoal">
                {itemCount}
              </span>
            )}
          </Link>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-full p-2 hover:bg-wine/5 dark:hover:bg-gold/10 transition-colors"
              aria-label={t("myAccount")}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-ink dark:text-cream">
                <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" />
                <path d="M4.5 20c1.6-3.6 4.7-5.5 7.5-5.5s5.9 1.9 7.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-44 animate-fade-up rounded-xl border border-wine/10 dark:border-gold/20 bg-surface dark:bg-charcoal-surface py-2 shadow-lg"
                onMouseLeave={() => setMenuOpen(false)}
              >
                {session ? (
                  <>
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-ink dark:text-cream hover:bg-wine/5 dark:hover:bg-gold/10">
                      {t("myAccount")}
                    </Link>
                    {/* @ts-expect-error - role added in lib/auth.ts session callback */}
                    {session.user?.role === "ADMIN" && (
                      <Link href="/admin" className="block px-4 py-2 text-sm text-wine dark:text-gold hover:bg-wine/5 dark:hover:bg-gold/10">
                        Admin Panel
                      </Link>
                    )}
                    {/* @ts-expect-error - role added in lib/auth.ts session callback */}
                    {(session.user?.role === "COURIER" || session.user?.role === "ADMIN") && (
                      <Link href="/courier" className="block px-4 py-2 text-sm text-wine dark:text-gold hover:bg-wine/5 dark:hover:bg-gold/10">
                        Courier Portal
                      </Link>
                    )}
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="block w-full text-left px-4 py-2 text-sm text-ink dark:text-cream hover:bg-wine/5 dark:hover:bg-gold/10"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block px-4 py-2 text-sm text-ink dark:text-cream hover:bg-wine/5 dark:hover:bg-gold/10">
                      {t("login")}
                    </Link>
                    <Link href="/signup" className="block px-4 py-2 text-sm text-ink dark:text-cream hover:bg-wine/5 dark:hover:bg-gold/10">
                      {t("signup")}
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pb-3 sm:hidden">
        <SearchBar />
      </div>

      {/* Phone-only link row (the main nav above is hidden on small screens) */}
      <nav className="flex items-center justify-center gap-5 px-4 pb-3 text-sm text-ink dark:text-cream md:hidden">
        <Link href="/" className="hover:text-wine dark:hover:text-gold">{t("home")}</Link>
        <Link href="/shop" className="hover:text-wine dark:hover:text-gold">{t("shop")}</Link>
        <Link href="/about" className="hover:text-wine dark:hover:text-gold">{aboutLabel}</Link>
        <Link href="/contact" className="hover:text-wine dark:hover:text-gold">{contactLabel}</Link>
      </nav>
    </header>
  );
}
