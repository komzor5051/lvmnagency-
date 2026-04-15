import type { Metadata } from "next";
import { Outfit, Manrope, JetBrains_Mono, Geist, Source_Serif_4, Barlow, Instrument_Serif, Playfair_Display, Inter } from "next/font/google";
import { YandexMetrika } from "@/components/YandexMetrika";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "cyrillic"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif-accent",
  subsets: ["latin"],
  style: ["italic"],
  weight: ["300", "400"],
  display: "swap",
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  style: ["normal", "italic"],
  weight: ["400", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LVMN — AI-консалтинг и обучение",
    template: "%s | LVMN",
  },
  description:
    "Влад Лямин — AI-first специалист. Помогаю бизнесу внедрять AI-автоматизацию и сотрудникам осваивать AI-инструменты. Без агентства, без субподрядчиков — работаю напрямую.",
  metadataBase: new URL("https://lvmn.vercel.app"),
  openGraph: {
    type: "website",
    siteName: "LVMN — AI-консалтинг",
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: { url: "/favicon.svg", type: "image/svg+xml" },
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
    <html lang="ru" className={cn("font-sans", geist.variable)}>
      <body
        className={`${outfit.variable} ${manrope.variable} ${jetbrainsMono.variable} ${sourceSerif.variable} ${barlow.variable} ${instrumentSerif.variable} ${playfair.variable} ${inter.variable} antialiased`}
      >
        {children}
        <YandexMetrika />
      </body>
    </html>
  );
}
