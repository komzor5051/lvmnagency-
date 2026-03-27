import type { Metadata } from "next";
import { Outfit, Manrope, JetBrains_Mono, Geist, Source_Serif_4, Barlow, Instrument_Serif } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "LVMN — AI-продукты для бизнеса за дни, не за месяцы",
    template: "%s | LVMN",
  },
  description:
    "Строим ботов и автоматизации, которые берут рутину на себя. 13 проектов с цифрами. 3-5 дней до результата. Гарантия возврата денег.",
  metadataBase: new URL("https://lvmn.vercel.app"),
  openGraph: {
    type: "website",
    siteName: "LVMN — AI-агентство",
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
        className={`${outfit.variable} ${manrope.variable} ${jetbrainsMono.variable} ${sourceSerif.variable} ${barlow.variable} ${instrumentSerif.variable} antialiased`}
      >
        {children}
        <YandexMetrika />
      </body>
    </html>
  );
}
