"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/lib/language-context";

export default function SearchBar({ className = "" }: { className?: string }) {
  const router = useRouter();
  const { t } = useLanguage();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    // Sends the user to the Shop page, which reads ?q= and sorts
    // matching products first (see src/app/shop/page.tsx).
    router.push(trimmed ? `/shop?q=${encodeURIComponent(trimmed)}` : "/shop");
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("search")}
        aria-label={t("search")}
        className="w-full rounded-full border border-wine/20 dark:border-gold/30 bg-surface dark:bg-charcoal-surface px-4 py-2 pr-10 text-sm text-ink dark:text-cream placeholder:text-ink-muted dark:placeholder:text-cream-muted focus:outline-none"
      />
      <button
        type="submit"
        aria-label={t("search")}
        className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-wine dark:text-gold hover:bg-wine/10 dark:hover:bg-gold/10 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </form>
  );
}
