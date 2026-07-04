import type { Metadata } from "next";
import { Inter_Tight, Onest, Marck_Script, Playfair_Display, Literata, JetBrains_Mono } from "next/font/google";
import { YandexMetrika } from "@/components/YandexMetrika";
import { PostHogProvider } from "@/components/PostHogProvider";
import LenisProvider from "@/components/motion/LenisProvider";
import { HudProvider } from "@/components/hud/HudContext";
import HudFrame from "@/components/hud/HudFrame";
import Preloader from "@/components/motion/Preloader";
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

const handFont = Marck_Script({
  variable: "--font-hand",
  subsets: ["latin", "cyrillic"],
  weight: "400",
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

// Editorial serif for blog cover titles (a16z-style overlay). Cover-only — the
// rest of the site stays sans (Inter Tight / Onest).
const serifFont = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vladlyamin.ru";

export const metadata: Metadata = {
  title: {
    default: "Влад Лямин — AI-инженер. Внедряю AI-системы, которые окупаются",
    template: "%s — Влад Лямин",
  },
  description:
    "Внедряю AI-системы, которые окупаются, а не презентуются. Консультации 1:1, AI-аудит, гайды и внедрение автоматизации для бизнеса. Влад Лямин, AI-инженер.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    siteName: "Влад Лямин — AI-инженер",
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
    "AI-инженер: помогаю фаундерам и экспертам внедрить AI-системы, которые окупаются. 40+ внедрений, 50+ обученных с 2022 года.",
  jobTitle: "AI Engineer",
  knowsAbout: [
    "AI-автоматизация бизнеса",
    "n8n",
    "Supabase",
    "Claude API",
    "Telegram Bot API",
    "JavaScript",
    "Node.js",
    "Business Process Automation",
  ],
  sameAs: ["https://t.me/lyaminvl"],
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
        className={`${displayFont.variable} ${bodyFont.variable} ${handFont.variable} ${displaySerif.variable} ${monoFont.variable} ${serifFont.variable} antialiased`}
      >
        <LenisProvider>
          <HudProvider>
            <Preloader />
            <HudFrame />
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
          </HudProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
