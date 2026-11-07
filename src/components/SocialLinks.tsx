/* ============================================================
   SOCIAL MEDIA LINKS — CHANGE THEM HERE
   ------------------------------------------------------------
   Replace these placeholder URLs with the store's real social
   media page links. They are used in two places automatically:
   the footer and the Contact Us page.
   ============================================================ */
export const SOCIAL_LINKS = [
  { name: "Facebook", href: "https://facebook.com/azanlace" },
  { name: "Instagram", href: "https://instagram.com/azanlace" },
  { name: "X", href: "https://x.com/azanlace" },
  { name: "YouTube", href: "https://youtube.com/@azanlace" },
  { name: "TikTok", href: "https://tiktok.com/@azanlace" },
];

// Small inline icons so no external image files are required.
export function SocialIcon({ name }: { name: string }) {
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

// A row of round icon buttons that open each social page in a new tab.
export function SocialLinksRow() {
  return (
    <div className="flex gap-3">
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
  );
}
