import type { Metadata } from "next";
import localFont from "next/font/local";
import { YandexMetrika } from "@/components/YandexMetrika";
import { PostHogProvider } from "@/components/PostHogProvider";
import LenisProvider from "@/components/motion/LenisProvider";
import StudioNav from "@/components/studio/StudioNav";
import StudioFooter from "@/components/studio/StudioFooter";
import StudioFx from "@/components/studio/StudioFx";
import "./globals.css";
import "./studio.css";

// Self-hosted fonts keep production builds independent from Google Fonts.
const handFont = localFont({
  src: "../public/fonts/martina-script.woff2",
  variable: "--font-hand",
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
    images: [
      {
        url: "/og-studio.png",
        width: 1536,
        height: 1024,
        alt: "Влад Лямин — AI systems studio",
      },
    ],
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
        className={`${handFont.variable} antialiased`}
      >
        <LenisProvider>
          <StudioFx />
          <StudioNav />
          <PostHogProvider>{children}</PostHogProvider>
          <StudioFooter />
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
