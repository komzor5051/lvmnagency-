import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { YandexMetrika } from "@/components/YandexMetrika";
import { PostHogProvider } from "@/components/PostHogProvider";
import LenisProvider from "@/components/motion/LenisProvider";
import StudioNav from "@/components/studio/StudioNav";
import StudioFooter from "@/components/studio/StudioFooter";
import StudioFx from "@/components/studio/StudioFx";
import { SITE_URL } from "@/lib/site";
import "./globals.css";
import "./studio.css";
import "./personal.css";
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
    default: "Влад Лямин — помогаю внедрять AI в работу бизнеса",
    template: "%s — Влад Лямин",
  },
  description:
    "Помогаю предпринимателям и небольшим командам находить полезные сценарии AI, настраивать рабочие процессы и осваивать их без технической сложности.",
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
        alt: "Влад Лямин — AI для работы и бизнеса",
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
    "Помогаю предпринимателям и небольшим командам встраивать AI в ежедневную работу. 40+ внедрений, 50+ обученных с 2022 года.",
  jobTitle: "AI-консультант",
  knowsAbout: [
    "AI-автоматизация бизнеса",
    "Внедрение AI в рабочие процессы",
    "Обучение команд работе с AI",
    "Business Process Automation",
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
    "Личная практика Влада Лямина: аудит процессов, настройка полезных сценариев AI и обучение команд работе с ними.",
  founder: { "@id": `${siteUrl}/#person` },
  employee: { "@id": `${siteUrl}/#person` },
  areaServed: "Worldwide",
  availableLanguage: ["ru", "en"],
  sameAs: ["https://telegram.me/lyaminvl"],
  knowsAbout: [
    "AI-автоматизация бизнеса",
    "Практическое применение AI в бизнесе",
    "Business Process Automation",
    "Обучение команд работе с AI",
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
    // suppressHydrationWarning: инлайн-скрипт ниже добавляет на <html> класс
    // studio-fx-armed до гидратации, поэтому серверная и клиентская разметка
    // здесь заведомо расходятся. Без этого React пишет ошибку несовпадения на
    // каждой загрузке и заглушает ею настоящие ошибки в консоли.
    <html lang="ru" className="font-sans" suppressHydrationWarning>
      <head>
        <script
          // Вооружает скрытие синхронно, до первой отрисовки — иначе контент
          // мигнёт. Таймер снимает вооружение, если StudioFx так и не
          // смонтировался: инлайн-скрипт доказывает лишь то, что исполняется
          // инлайн-JS, а не то, что приехал основной бандл.
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement;d.classList.add("studio-fx-armed");window.__studioFxSafety=window.setTimeout(function(){d.classList.remove("studio-fx-armed")},2500)})()`,
          }}
        />
      </head>
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
