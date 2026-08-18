"use client";

import { useTheme } from "@/lib/theme-context";
import { useLanguage } from "@/lib/language-context";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "light" ? t("darkMode") : t("lightMode")}
      title={theme === "light" ? t("darkMode") : t("lightMode")}
      className="relative flex h-8 w-14 items-center rounded-full border border-wine/20 dark:border-gold/30 bg-surface dark:bg-charcoal-surface transition-colors duration-300"
    >
      <span
        className={`absolute h-6 w-6 rounded-full bg-wine dark:bg-gold transition-transform duration-300 ease-out ${
          theme === "dark" ? "translate-x-7" : "translate-x-1"
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
