# Azan Lace — Online Store

A custom-built e-commerce site for lace trims, built with **Next.js 14**, **PostgreSQL**, and **Prisma**.

The full build is now in place: storefront, cart, accounts, checkout, order
tracking, and the admin panel.

---

## 1. What's included

**Storefront**
- Homepage + Shop page with working search (matches shown first)
- Product page: image gallery, color dropdown (for laces), guz/meter unit display,
  quantity stepper, Add to Cart / Buy Now, star reviews, related products
- Fully working Cart page (add, update quantity, remove, subtotal)
- Checkout: shipping details + Easypaisa or Cash on Delivery, creates a real order
- Live order tracking page (`/orders/[orderNumber]`) that polls every few seconds
  so status changes the admin makes appear automatically
- Sign up / Log in (NextAuth, email + password)
- Customer dashboard: profile picture upload (from device), editable phone number,
  order history linking to the live tracker
- Light/Dark mode toggle and English/Urdu translation toggle, both remembered
  between visits
- Privacy Policy, Terms & Conditions, and Disclaimer pages (placeholder legal text —
  read the comment at the top of each file before publishing)
- Footer with social media icon links · Prices shown in Pakistani Rupees (Rs.)

**Admin panel** (`/admin`, restricted to accounts with the ADMIN role)
- Urdu mode (same toggle as the main site) and a sidebar with a **?** help button
  on every section explaining what it does
- Products: add/edit, multiple photos uploaded straight from your device (click
  the ★ to choose the main thumbnail), colors with names + swatches, guz/meter/
  other units, stock
- Orders: one-click status buttons — *Product Being Prepared, Prepared, On the
  Way, Might Be Delivered Today, Delivered, Canceled* — and a courier-assignment
  dropdown per order
- Couriers: promote any existing customer account to courier by email

**Courier portal** (`/courier`, restricted to COURIER and ADMIN accounts)
- Shows a courier's assigned deliveries, polling every 10 seconds for new
  assignments
- Delivery-side status buttons only (*On the Way, Might Be Delivered Today,
  Delivered*) — prep-side statuses and cancellation stay admin-only

**Saved addresses** — customers can save multiple delivery addresses from
their dashboard; checkout automatically prefills from the default one.

**Notifications** — `src/lib/notifications.ts` fires on every status change,
including the moment an order is first placed, and is wired into both the
admin and courier status-update routes. Each channel (Email/Nodemailer,
SMS/Twilio, WhatsApp Business API, Push/Firebase) safely no-ops and logs to
the console until you add its API keys to `.env` — see the comments in that
file for the exact `npm install` command and code to uncomment per channel.

## 2. What's still a stub

- **Easypaisa payment**: on hold until real merchant credentials are
  available. The checkout flow already creates the order correctly and
  marks it unpaid for COD/pending payment; the exact spot to add Easypaisa's
  hosted-checkout redirect is commented in `src/app/api/checkout/route.ts`
  (search for "EASYPAISA INTEGRATION POINT") — once you have
  `EASYPAISA_MERCHANT_ID` / `STORE_ID` / `HASH_KEY`, that's the only file
  that needs to change.
- **Order tracking** uses polling (checks every 8–10 seconds) rather than
  websockets — simple and reliable without extra infrastructure. It can be
  swapped for a websocket/SSE push later without changing the rest of the app.

## 3. Security

Built in already:
- Passwords hashed with bcrypt, never stored in plain text
- Every API route validates its input with Zod before touching the database
- Admin and courier sections are guarded server-side (`src/lib/admin-guard.ts`,
  `src/lib/courier-guard.ts`) — not just hidden in the UI
- Couriers can only update orders assigned to them; customers can only view
  their own orders
- Basic rate limiting on login and signup (`src/lib/rate-limit.ts`) to blunt
  brute-force attempts
- Security headers on every response (`next.config.js`): clickjacking,
  MIME-sniffing, and referrer/permissions protections
- File uploads are type- and size-checked before being saved

Recommended before a real launch (infrastructure-level, not code):
- Serve the site over HTTPS only (your host — Vercel, Railway, etc. — handles
  this automatically)
- Put a proper distributed rate limiter/WAF in front in production (the
  built-in one resets per server instance)
- Keep dependencies updated (`npm audit`, Dependabot, etc.)
- Use a real secret manager for `.env` values instead of a plain file on the
  server

---

## 3. Setup Instructions

### Requirements
- Node.js 18+
- A PostgreSQL database (any of these work great and have free tiers:
  [Supabase](https://supabase.com), [Neon](https://neon.tech), [Railway](https://railway.app))

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Copy the environment template and fill in real values
cp .env.example .env
# Open .env and set DATABASE_URL to your PostgreSQL connection string,
# and NEXTAUTH_SECRET to a random string (generate with: openssl rand -base64 32)

# 3. Create the database tables
npm run prisma:migrate

# 4. Add sample products + an admin account
npm run prisma:seed

# 5. Start the site
npm run dev
```

Then open **http://localhost:3000**.

**Seeded admin login** (Phase 2 will use this to access the admin panel):
- Email: `admin@azanlace.com`
- Password: `ChangeMe123!` — change this immediately in a real deployment.

---

## 4. Where to make common changes

Everything below is commented directly in the code, but here's a map:

| What you want to change | File |
|---|---|
| Site colors (background, accent, dark mode) | `tailwind.config.ts` |
| Background image instead of a plain color | `src/app/globals.css` (commented block near the top) |
| Fonts | `src/app/layout.tsx` |
| English/Urdu text | `src/lib/translations.ts` |
| Social media links | `src/components/Footer.tsx` |
| Legal page text | `src/app/privacy-policy/page.tsx`, `terms-and-conditions/page.tsx`, `disclaimer/page.tsx` |
| Database structure (add fields, new tables) | `prisma/schema.prisma` |
| Measurement units | `prisma/schema.prisma` (`MeasurementUnit` enum) + `src/lib/utils.ts` (`UNIT_LABELS`) |
| Order status names | `prisma/schema.prisma` (`OrderStatus` enum) + `src/lib/utils.ts` (`STATUS_LABELS`) |

## 5. Uploading product images

Images are uploaded straight from the admin's device (via `/api/upload`) and saved
to `public/uploads/` — there is no need to paste image links anywhere. The three
sample products currently use simple placeholder SVGs in that folder; replace them
with real product photos once the admin panel (Phase 2) is in place, or manually
via Prisma Studio (`npm run prisma:studio`) in the meantime.

## 6. Deployment notes

- This project stores uploaded images on the local disk (`public/uploads`), which
  works on a normal server or VPS. If you deploy to a platform with a read-only
  filesystem (e.g. Vercel's serverless functions), you'll need to switch file
  storage to a bucket service (S3, Cloudflare R2, Supabase Storage) — the single
  place that changes is `src/app/api/upload/route.ts`.
- Set `NEXTAUTH_URL` in `.env` to your real domain once deployed.
