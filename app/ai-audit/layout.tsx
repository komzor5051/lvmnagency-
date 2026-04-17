import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Аудит бизнеса — LVMN",
  description:
    "Находим где теряется время и деньги. Даём конкретный план что автоматизировать первым. Бесплатный экспресс-разбор за 30 минут.",
  openGraph: {
    title: "AI Аудит бизнеса — LVMN",
    description:
      "Находим где теряется время и деньги. Даём конкретный план что автоматизировать первым.",
  },
};

export default function AiAuditLayout({ children }: { children: React.ReactNode }) {
  return children;
}
