import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { YandexMetrika } from "@/components/YandexMetrika";
import { PostHogProvider } from "@/components/PostHogProvider";
import { TrafficSource } from "@/components/TrafficSource";
import LenisProvider from "@/components/motion/LenisProvider";
import StudioNav from "@/components/studio/StudioNav";
import StudioFooter from "@/components/studio/StudioFooter";
import BentoReveal from "@/components/bento/BentoReveal";
import { SITE_URL } from "@/lib/site";
import "./globals.css";
import "./studio.css";
import "./personal.css";
import "./razvorot.css";
import { jsonLd } from "@/lib/json-ld";

// Self-hosted fonts keep production builds independent from Google Fonts.
const handFont = localFont({
  src: "../public/fonts/martina-script.woff2",
  variable: "--font-hand",
  display: "swap",
});

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  title: {
    // Kept under ~60 chars so Google shows it whole; the long-form pitch lives
    // in the description below.
    default: "Влад Лямин — личная система работы на Claude",
    template: "%s — Влад Лямин",
  },
  description:
    "Гайды, консультации и аудит для тех, кто хочет собрать личную систему работы на Claude и закрывать одному задачи, под которые обычно нанимают команду.",
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
        alt: "Влад Лямин — личная система работы на Claude",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  // One source per format, declared explicitly: the auto-detected app/favicon.ico
  // used to be an unrelated leftover icon and Next put it first, ahead of the
  // real wordmark. Sizes here match the actual files.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48 64x64", type: "image/x-icon" },
      { url: "/favicon.png", sizes: "256x256", type: "image/png" },
    ],
    apple: { url: "/apple-icon.png", sizes: "180x180" },
  },
  alternates: {
    types: {
      "application/rss+xml": "/blog/feed.xml",
    },
  },
  // Google Search Console ownership check.
  verification: {
    google: "8D2vWuof3LXT1wZQFFEzapNasasonF4v_rWisS73ACY",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fbfaf4",
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
    "Помогаю собрать личную систему работы на Claude: гайды, консультации, аудит. 50+ человек обучил, 40+ систем собрал с 2022 года.",
  jobTitle: "AI-консультант, автор гайдов по Claude",
  knowsAbout: [
    "Claude",
    "Claude Code",
    "Личная AI-система",
    "Обучение работе с AI",
    "AI-автоматизация для одного человека",
  ],
  sameAs: ["https://telegram.me/lyaminvl"],
};

// Organization, not LocalBusiness/ProfessionalService: those are LocalBusiness
// subtypes and expect a physical postalAddress, which this practice does not
// publish. Organization carries the same "what is this business and what does
// it sell" signal for answer engines without inviting a validation warning.
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#business`,
  name: "Влад Лямин",
  url: siteUrl,
  logo: `${siteUrl}/favicon.png`,
  image: `${siteUrl}/portrait.jpg`,
  description:
    "Личная практика Влада Лямина: гайды по Claude, консультации один на один и аудит процессов.",
  founder: { "@id": `${siteUrl}/#person` },
  employee: { "@id": `${siteUrl}/#person` },
  areaServed: "Worldwide",
  availableLanguage: ["ru", "en"],
  sameAs: ["https://telegram.me/lyaminvl"],
  knowsAbout: [
    "Claude",
    "Claude Code",
    "Личная AI-система",
    "Обучение работе с AI",
    "AI-автоматизация для одного человека",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    url: "https://telegram.me/lyaminvl",
    availableLanguage: ["ru", "en"],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: "Влад Лямин",
  url: siteUrl,
  inLanguage: "ru",
  author: { "@id": `${siteUrl}/#person` },
  publisher: { "@id": `${siteUrl}/#business` },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="font-sans">
      <head>
        {/* До первой отрисовки: помечаем, что JS есть, чтобы hero не вспыхивал
            статикой перед стартом сцены (см. razvorot.css, html.js). */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body
        className={`${handFont.variable} antialiased`}
      >
        <LenisProvider>
          <BentoReveal />
          <StudioNav />
          <PostHogProvider>{children}</PostHogProvider>
          <StudioFooter />
          <YandexMetrika />
          <TrafficSource />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLd(personSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLd(organizationSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLd(websiteSchema) }}
          />
        </LenisProvider>
      </body>
    </html>
  );
}
