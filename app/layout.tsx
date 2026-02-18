import type { Metadata } from "next";
import { Outfit, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import { YandexMetrika } from "@/components/YandexMetrika";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: {
    default: "LVMN — AI-продукты для бизнеса за дни, не за месяцы",
    template: "%s | LVMN",
  },
  description:
    "Строим AI-продукты для бизнеса: боты, автоматизации, MVP-сервисы — за 3-5 дней. 13 кейсов с цифрами. С гарантией результата.",
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
    <html lang="ru">
      <body
        className={`${outfit.variable} ${cormorant.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
        <YandexMetrika />
      </body>
    </html>
  );
}
