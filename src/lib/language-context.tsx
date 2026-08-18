"use client";

// ============================================================
// Language context (English <-> Urdu).
// Switches the `dir` attribute to "rtl" automatically for Urdu
// so layout mirrors correctly, and swaps the body font to the
// Urdu face defined in tailwind.config.ts (font-urdu).
// ============================================================

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translations, type Language, type TranslationKey } from "@/lib/translations";

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
} | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const stored = localStorage.getItem("azan-lace-lang") as Language | null;
    if (stored) applyLanguage(stored);
  }, []);

  function applyLanguage(lang: Language) {
    setLanguageState(lang);
    document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }

  function setLanguage(lang: Language) {
    localStorage.setItem("azan-lace-lang", lang);
    applyLanguage(lang);
  }

  function t(key: TranslationKey): string {
    return translations[language][key] ?? translations.en[key];
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
