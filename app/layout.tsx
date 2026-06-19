import type { Metadata } from "next";
import { Inter_Tight, Onest, Caveat, Playfair_Display } from "next/font/google";
import { YandexMetrika } from "@/components/YandexMetrika";
import { PostHogProvider } from "@/components/PostHogProvider";
import "./globals.css";

// Brand DS — White + Lime. Display: dense grotesk (Cabinet Grotesk's role),
// body: Onest (Satoshi analogue), hand: Caveat for annotations. All carry a
// Cyrillic subset — the brand's Fontshare fonts ship Latin-only, which would
// silently fall back to system sans on a Russian site.
const displayFont = Inter_Tight({
  variable: "--font-display",
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

const handFont = Caveat({
  variable: "--font-hand",
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700"],
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

export const metadata: Metadata = {
  title: {
    default: "Влад Лямин — AI-инженер. Внедряю AI-системы, которые окупаются",
    template: "%s — Влад Лямин",
  },
  description:
    "Внедряю AI-системы, которые окупаются, а не презентуются. Консультации 1:1, AI-аудит, гайды и внедрение автоматизации для бизнеса. Влад Лямин, AI-инженер, Новосибирск.",
  metadataBase: new URL("https://lvmn.vercel.app"),
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="font-sans">
      <body
        className={`${displayFont.variable} ${bodyFont.variable} ${handFont.variable} ${serifFont.variable} antialiased`}
      >
        <PostHogProvider>{children}</PostHogProvider>
        <YandexMetrika />
      </body>
    </html>
  );
}
