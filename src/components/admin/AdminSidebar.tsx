"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import LanguageToggle from "@/components/LanguageToggle";

type NavItem = {
  href: string;
  labelKey: "adminDashboard" | "adminProducts" | "adminOrders" | "adminCouriers";
  help: { en: string; ur: string };
  icon: React.ReactNode;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/admin",
    labelKey: "adminDashboard",
    help: {
      en: "A quick overview of your store: recent orders and stock at a glance.",
      ur: "آپ کی دکان کا فوری جائزہ: حالیہ آرڈرز اور اسٹاک ایک نظر میں۔",
    },
    icon: <path d="M3 12l9-9 9 9M5 10v10h14V10" />,
  },
  {
    href: "/admin/products",
    labelKey: "adminProducts",
    help: {
      en: "Add new laces, edit prices, upload photos from your device, and manage colors & stock.",
      ur: "نئی لیس شامل کریں، قیمتیں تبدیل کریں، اپنے ڈیوائس سے تصاویر اپلوڈ کریں، اور رنگ و اسٹاک منظم کریں۔",
    },
    icon: <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
  },
  {
    href: "/admin/orders",
    labelKey: "adminOrders",
    help: {
      en: "See every order, update its status with one click, and assign a courier to deliver it.",
      ur: "ہر آرڈر دیکھیں، ایک کلک سے حیثیت تبدیل کریں، اور ڈیلیوری کے لیے کورئیر مقرر کریں۔",
    },
    icon: <path d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-2 5h13M9 20a1 1 0 100-2 1 1 0 000 2zM17 20a1 1 0 100-2 1 1 0 000 2z" />,
  },
  {
    href: "/admin/couriers",
    labelKey: "adminCouriers",
    help: {
      en: "Turn an existing customer account into a courier so they show up in the assign-courier list.",
      ur: "کسی موجودہ کسٹمر اکاؤنٹ کو کورئیر بنائیں تاکہ وہ کورئیر مقرر کرنے کی فہرست میں نظر آئے۔",
    },
    icon: <path d="M5 17h14M6 17V9l3-4h6l3 4v8M9 17v3h6v-3" />,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { language, t } = useLanguage();
  const [helpOpen, setHelpOpen] = useState<string | null>(null);

  return (
    <aside className="w-full shrink-0 border-b border-wine/10 dark:border-gold/10 bg-surface dark:bg-charcoal-surface md:h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="flex items-center justify-between p-4">
        <span className="font-display text-lg text-wine dark:text-gold">Azan Lace Admin</span>
        <LanguageToggle />
      </div>

      <nav className="px-2 pb-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <div key={item.href} className="relative">
              <div
                className={`flex items-center rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-wine/10 dark:bg-gold/10 text-wine dark:text-gold"
                    : "text-ink dark:text-cream hover:bg-wine/5 dark:hover:bg-gold/10"
                }`}
              >
                <Link href={item.href} className="flex flex-1 items-center gap-2.5 px-3 py-2.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    {item.icon}
                  </svg>
                  {t(item.labelKey)}
                </Link>
                {/* Help button — explains what this section does, per the "side menu that
                    explains how to do each thing" requirement */}
                <button
                  type="button"
                  aria-label={`${t("adminHelp")}: ${t(item.labelKey)}`}
                  onClick={() => setHelpOpen(helpOpen === item.href ? null : item.href)}
                  className="mr-2 flex h-5 w-5 items-center justify-center rounded-full border border-current text-xs opacity-60 hover:opacity-100"
                >
                  ?
                </button>
              </div>
              {helpOpen === item.href && (
                <div className="mx-3 mb-2 animate-fade-up rounded-lg bg-wine/5 dark:bg-gold/5 p-3 text-xs leading-relaxed text-ink-muted dark:text-cream-muted">
                  {language === "ur" ? item.help.ur : item.help.en}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="px-4 pb-6">
        <Link
          href="/"
          className="block text-xs text-ink-muted dark:text-cream-muted hover:text-wine dark:hover:text-gold"
        >
          ← {t("adminBackToSite")}
        </Link>
      </div>
    </aside>
  );
}
