/* ============================================================
   ABOUT US PAGE
   ------------------------------------------------------------
   All the wording on this page is plain text below — edit any
   paragraph or list item directly. The "What we offer" list is
   the OFFERINGS array right under this comment: add, remove or
   rename items there.
   ============================================================ */

import Link from "next/link";
import type { Metadata } from "next";
import LaceDivider from "@/components/LaceDivider";

export const metadata: Metadata = {
  title: "About Us — Azan Lace",
  description:
    "Azan Lace has been selling fine laces in Rawalpindi since the 2010s and ships across Pakistan.",
};

// "What we offer" — the first one is the main product, the rest are the extra services.
const OFFERINGS = [
  {
    title: "Premium Laces",
    text: "A wide range of finely crafted laces, from classic everyday trims to rare designs you won't find elsewhere.",
  },
  {
    title: "Buckram",
    text: "Quality buckram so collars, cuffs and borders keep their shape.",
  },
  {
    title: "Clothes Buttons",
    text: "Buttons in many styles and finishes to complete an outfit.",
  },
  {
    title: "Sewing Supplies",
    text: "Threads, needles and everyday sewing essentials, all in one place.",
  },
  {
    title: "Picoo Service",
    text: "Neat picoo finishing so your fabric edges look polished.",
  },
  {
    title: "Measurement Tools for Tailors",
    text: "Measuring tapes, scales and tools that tailors rely on every day.",
  },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-10">
      <h2 className="font-display text-2xl text-wine dark:text-gold mb-4">{title}</h2>
      <div className="space-y-4 text-sm leading-relaxed text-ink-muted dark:text-cream-muted sm:text-base">
        {children}
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div>
      {/* ---------- HEADER BAND ---------- */}
      <section className="bg-surface dark:bg-charcoal-surface transition-colors duration-300">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-gold mb-3">Our story</p>
          <h1 className="font-display text-4xl sm:text-5xl text-wine dark:text-gold">About Azan Lace</h1>
        </div>
        <div className="px-6">
          <LaceDivider />
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6">
        {/* ---------- WHO WE ARE ---------- */}
        <Section title="Who We Are">
          <p>
            Azan Lace is a lace brand that has been selling laces since the 2010s. It was founded
            by <strong className="text-ink dark:text-cream">Malik Sajid</strong>, who named the shop
            after his son, <strong className="text-ink dark:text-cream">Azan Malik</strong>.
          </p>
          <p>
            What started as a family shop in Rawalpindi has grown into a brand people trust for
            beautiful, carefully chosen laces.
          </p>
        </Section>

        <LaceDivider />

        {/* ---------- WHAT WE OFFER ---------- */}
        <Section title="What We Offer">
          <p>
            Laces are at the heart of what we do, but we also stock the extras you need to finish
            a piece of clothing, all under one roof.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            {OFFERINGS.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-wine/10 dark:border-gold/10 bg-surface dark:bg-charcoal-surface p-5"
              >
                <h3 className="font-body font-semibold text-ink dark:text-cream mb-1">{item.title}</h3>
                <p className="text-sm text-ink-muted dark:text-cream-muted">{item.text}</p>
              </div>
            ))}
          </div>
          <p>…and much more. Visit us or browse the shop to see everything we carry.</p>
        </Section>

        <LaceDivider />

        {/* ---------- OUR MISSION ---------- */}
        <Section title="Our Mission">
          <p>
            Our mission is to provide the very best laces: unique designs, and the latest in-fashion
            styles, along with other premium clothing services.
          </p>
          <p>
            We want every customer to find what they need in one place, so nobody has to leave
            disappointed or tire themselves out searching shop after shop.
          </p>
        </Section>

        <LaceDivider />

        {/* ---------- WHY CHOOSE US ---------- */}
        <Section title="Why Choose Us">
          <ul className="list-disc space-y-2 pl-5 marker:text-gold">
            <li>We are among the best-known lace brands in Rawalpindi.</li>
            <li>We ship across all of Pakistan.</li>
            <li>We carry laces that no other vendor has.</li>
            <li>Guaranteed results you can count on.</li>
          </ul>
        </Section>

        <LaceDivider />

        {/* ---------- WHO WE SERVE ---------- */}
        <Section title="Who We Serve">
          <p>
            We serve mainly women, and our collection is designed around their needs. We also
            have a few products for men.
          </p>
        </Section>

        {/* ---------- CALL TO ACTION ---------- */}
        <div className="flex flex-wrap justify-center gap-3 pb-6 pt-4">
          <Link
            href="/shop"
            className="rounded-full bg-wine dark:bg-gold px-7 py-3 text-sm font-semibold text-cream dark:text-charcoal transition-transform hover:scale-105"
          >
            Shop Our Laces
          </Link>
          <Link
            href="/contact"
            className="rounded-full border-2 border-wine dark:border-gold px-7 py-3 text-sm font-semibold text-wine dark:text-gold transition-colors hover:bg-wine hover:text-cream dark:hover:bg-gold dark:hover:text-charcoal"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
