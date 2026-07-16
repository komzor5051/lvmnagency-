import type { Metadata } from "next";
import DeskFx from "@/components/desk/DeskFx";
import DeskAboutHero from "@/components/desk/DeskAboutHero";
import DeskAboutTimeline from "@/components/desk/DeskAboutTimeline";
import DeskAboutPrinciples from "@/components/desk/DeskAboutPrinciples";
import DeskFooter from "@/components/desk/DeskFooter";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vladlyamin.ru";

export const metadata: Metadata = {
  title: "Обо мне",
  description:
    "С 2022 года помогаю фаундерам строить и масштабировать системы с помощью AI. 40+ внедрений, принципы скучного AI.",
  alternates: { canonical: `${siteUrl}/about` },
  openGraph: {
    title: "Обо мне — Влад Лямин",
    description:
      "С 2022 года помогаю фаундерам строить и масштабировать системы с помощью AI. 40+ внедрений, принципы скучного AI.",
    type: "profile",
    url: `${siteUrl}/about`,
    locale: "ru_RU",
    images: [{ url: `${siteUrl}/portrait.jpg`, width: 880, height: 1100, alt: "Влад Лямин" }],
  },
};

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: "Влад Лямин",
  alternateName: "Vladislav Lyamin",
  url: siteUrl,
  image: {
    "@type": "ImageObject",
    url: `${siteUrl}/portrait.jpg`,
    width: 880,
    height: 1100,
  },
  description:
    "Помогаю фаундерам строить и масштабировать системы с помощью AI. 40+ внедрений, 50+ обученных с 2022 года.",
  knowsAbout: [
    "AI-автоматизация бизнеса",
    "Business Process Automation",
    "LLM Integration",
  ],
  sameAs: ["https://telegram.me/lyaminvl"],
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${siteUrl}/about`,
  },
};

export default function AboutPage() {
  return (
    <main>
      <DeskFx />
      <DeskAboutHero />
      <DeskAboutTimeline />
      <DeskAboutPrinciples />
      <DeskFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
    </main>
  );
}
