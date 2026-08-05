import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI-аудит бизнеса за 5 минут — карта точек роста",
  description:
    "Ответьте на 7 вопросов и узнайте, где AI даст фаундеру реальный ROI: карта процессов под автоматизацию, оценка эффекта и конкретные первые шаги.",
  alternates: { canonical: "/audit" },
  openGraph: {
    title: "AI-аудит бизнеса за 5 минут — Влад Лямин",
    description:
      "Ответьте на 7 вопросов — получите карту точек роста с AI и первые шаги.",
    url: "/audit",
  },
};

export default function AuditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
