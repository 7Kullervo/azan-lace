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

## 7. Deploying for free

A genuinely $0/month stack: **Render** (app hosting) + **Neon** (Postgres,
free forever, no expiry) + **Cloudflare R2** (image storage, free up to 10GB).

Worth knowing about the trade-offs before you pick this over a paid host:
- Render's free web service **sleeps after 15 minutes of no traffic** — the
  next visitor waits ~30-60 seconds for it to wake up. Fine for a store still
  being tested; consider Render's $7/mo Starter tier once you have real
  customers who shouldn't hit that delay.
- Render's own free Postgres **deletes your data after 30 days** — that's
  why this guide uses Neon for the database instead, which has no expiry
  on its free tier.
- Free hosting has no persistent disk, so product photo uploads must go to
  Cloudflare R2 instead of local disk — already wired up for you (see
  `src/app/api/upload/route.ts`); you just need to create the bucket and
  add its credentials to your environment variables.
- Skip Vercel for this project specifically — its free Hobby tier's terms
  restrict it to non-commercial personal projects, and this is a real store.

**Setup steps:**
1. **Neon** — sign up at neon.tech, create a project, copy the connection
   string it gives you as your `DATABASE_URL`.
2. **Cloudflare R2** — sign up at dash.cloudflare.com, go to R2, create a
   bucket, enable public access for it (R2 > your bucket > Settings >
   allow public access, or connect a custom domain), then go to
   "Manage API tokens" and create one with R2 read/write permission. Fill
   in `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`,
   `R2_BUCKET_NAME`, and `R2_PUBLIC_URL` (the public bucket URL R2 shows
   you) in your environment variables.
3. **Render** — sign up at render.com (no card needed), New > Web Service,
   connect your GitHub repo. Build command: `npm install && npm run build`.
   Start command: `npm run start`. Add all the variables from `.env.example`
   under Environment, using your real Neon `DATABASE_URL` and R2 values.
   Set `NEXTAUTH_URL` to the `.onrender.com` URL Render gives you once the
   first deploy finishes.
4. Run migrations against the live database once: locally, temporarily set
   `DATABASE_URL` in your terminal to the Neon connection string and run
   `npm run prisma:migrate` and `npm run prisma:seed` — this applies
   directly to the cloud database, no Render-specific step needed.

## 8. Deploying on a paid host (Railway) instead

Railway no longer has an ongoing free tier (a one-time $5 trial credit,
then $1/month after — not enough to run an app plus a database). If you'd
rather pay a small amount for no cold starts and no 30-day database
countdown, Railway remains a good option: create a project, deploy from
GitHub, add a PostgreSQL service, set the same environment variables as
above, generate a domain, and run migrations the same way via the Railway
CLI (`railway run npm run prisma:migrate`).

## 9. Deployment notes

- Set `NEXTAUTH_URL` in `.env` to your real domain once deployed, on
  whichever host you choose.

## 10. Troubleshooting notes (fixed already, kept for reference)

- **"Prisma has detected that this project was built on Vercel..."** — Vercel
  caches `node_modules` between builds, which can skip Prisma's client
  generation step. Fixed by adding `prisma generate` to both the `build`
  script and a `postinstall` script in `package.json`, so it always runs.
- **TypeScript errors about `params` on every dynamic route** (e.g.
  `/product/[slug]`, `/api/admin/orders/[id]/...`) — Next.js 15 changed
  `params` and `searchParams` from plain objects to `Promise`s that must be
  awaited. The project is pinned to Next 15+ and every dynamic route/page
  already uses the new `const { id } = await params` pattern — if you ever
  add a new dynamic route, follow that same pattern.
