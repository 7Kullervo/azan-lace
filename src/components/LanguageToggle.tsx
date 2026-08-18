"use client";

import { useLanguage } from "@/lib/language-context";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "ur" : "en")}
      className="rounded-full border border-wine/20 dark:border-gold/30 px-3 py-1 text-xs font-body font-medium text-ink dark:text-cream hover:bg-wine/5 dark:hover:bg-gold/10 transition-colors duration-200"
    >
      {language === "en" ? "اردو" : "EN"}
    </button>
  );
}
