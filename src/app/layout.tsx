import type { Metadata } from "next";
import { Playfair_Display, Inter, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Display face — used sparingly for the logo and headings (see tailwind.config.ts "display")
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

// Body face — everything else (see tailwind.config.ts "body")
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

// Urdu face — used automatically when the site is switched to Urdu mode
const notoNastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  variable: "--font-urdu",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Azan Lace — Fine Lace Trims",
  description:
    "Azan Lace brings you finely crafted lace trims for every occasion, sourced with care and delivered with pride.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} ${notoNastaliq.variable} font-body`}
      >
        <Providers>
          <Header />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
