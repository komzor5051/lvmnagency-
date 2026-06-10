import type { Metadata } from "next";
import { Manrope, JetBrains_Mono, Inter_Tight } from "next/font/google";
import { YandexMetrika } from "@/components/YandexMetrika";
import { PostHogProvider } from "@/components/PostHogProvider";
import "./globals.css";

// Primary display grotesque for the redesign — bold, tight letter-spacing.
const interTight = Inter_Tight({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
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
    <html lang="ru" className="font-sans">
      <body
        className={`${interTight.variable} ${manrope.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <PostHogProvider>{children}</PostHogProvider>
        <YandexMetrika />
      </body>
    </html>
  );
}
