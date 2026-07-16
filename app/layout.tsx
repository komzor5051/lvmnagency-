import type { Metadata } from "next";
import { Inter_Tight, Onest, Playfair_Display, Literata, JetBrains_Mono, Tektur } from "next/font/google";
import localFont from "next/font/local";
import { YandexMetrika } from "@/components/YandexMetrika";
import { PostHogProvider } from "@/components/PostHogProvider";
import LenisProvider from "@/components/motion/LenisProvider";
import DeskNav from "@/components/desk/DeskNav";
import "./globals.css";

// Brand DS — White + Lime. Display: Inter Tight (headline), body: Onest,
// serif: Playfair Display (blog covers), display: Literata (poster/HUD),
// hand: Marck Script (annotations), mono: JetBrains Mono (labels). All carry
// Cyrillic subset — the brand's Fontshare fonts ship Latin-only, which would
// silently fall back to system sans on a Russian site.
const displayFont = Inter_Tight({
  variable: "--font-heading",
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

const bodyFont = Onest({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Desk DS handwriting: Martina scriptC (A. Gophmann) — elegant Cyrillic
// calligraphy, self-hosted (not on Google Fonts). Replaces Marck Script
// site-wide via the same --font-hand variable.
const handFont = localFont({
  src: "../public/fonts/martina-script.woff2",
  variable: "--font-hand",
  display: "swap",
});

const displaySerif = Literata({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["200", "300", "400"],
  style: ["normal", "italic"],
  display: "swap",
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono-brand",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  display: "swap",
});

// Desk DS display: Tektur — faceted technical grotesk, matches the drafting-
// table metaphor. Headlines, prices, card titles.
const tekturFont = Tektur({
  variable: "--font-tektur",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

// Editorial serif (blog covers, desk margin notes in italic).
const serifFont = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vladlyamin.ru";

export const metadata: Metadata = {
  title: {
    default: "Влад Лямин — помогаю фаундерам строить и масштабировать системы с помощью AI",
    template: "%s — Влад Лямин",
  },
  description:
    "Помогаю фаундерам строить и масштабировать системы с помощью AI. Консультации 1:1, AI-аудит, гайды и внедрение. Влад Лямин.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    siteName: "Влад Лямин",
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: { url: "/favicon.png", type: "image/png" },
    apple: { url: "/apple-icon.png" },
  },
  alternates: {
    types: {
      "application/rss+xml": "/blog/feed.xml",
    },
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: "Влад Лямин",
  alternateName: "Vladislav Lyamin",
  url: siteUrl,
  image: `${siteUrl}/portrait.jpg`,
  description:
    "Помогаю фаундерам строить и масштабировать системы с помощью AI. 40+ внедрений, 50+ обученных с 2022 года.",
  jobTitle: "AI Engineer",
  knowsAbout: [
    "AI-автоматизация бизнеса",
    "JavaScript",
    "Node.js",
    "Business Process Automation",
  ],
  sameAs: ["https://telegram.me/lyaminvl"],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: "Влад Лямин",
  url: siteUrl,
  inLanguage: "ru",
  author: { "@id": `${siteUrl}/#person` },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="font-sans">
      <body
        className={`${displayFont.variable} ${bodyFont.variable} ${handFont.variable} ${displaySerif.variable} ${monoFont.variable} ${serifFont.variable} ${tekturFont.variable} antialiased`}
      >
        <LenisProvider>
          <DeskNav />
          <PostHogProvider>{children}</PostHogProvider>
          <YandexMetrika />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
          />
        </LenisProvider>
      </body>
    </html>
  );
}
