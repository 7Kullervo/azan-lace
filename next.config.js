/** @type {import('next').NextConfig} */
const nextConfig = {
  // Product images uploaded by the admin are saved under /public/uploads
  // and served statically — no external image host needed.
  images: {
    // Add your R2 public domain here once you set it up (see .env.example),
    // e.g. { hostname: "pub-xxxxxxxx.r2.dev" } or your custom domain.
    remotePatterns: [
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "**.r2.cloudflarestorage.com" },
    ],
    dangerouslyAllowSVG: true, // needed for the placeholder SVG product images in /public/uploads
  },

  // ============================================================
  // SECURITY HEADERS
  // ------------------------------------------------------------
  // Baseline hardening applied to every response. Combined with
  // NextAuth's built-in CSRF protection, bcrypt password hashing,
  // Zod input validation on every API route, and the admin/courier
  // role guards in src/lib/*-guard.ts, this covers the common
  // attack surface for a store like this. See README.md "Security"
  // section for production recommendations beyond what code alone
  // can provide (HTTPS, WAF/rate limiting, dependency updates).
  // ============================================================
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" }, // blocks clickjacking via iframes
          { key: "X-Content-Type-Options", value: "nosniff" }, // blocks MIME-sniffing attacks
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
