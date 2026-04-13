import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI-аудит бизнеса — LVMN",
  description:
    "Узнайте за 5 минут, где AI даст реальный ROI в вашем бизнесе. Автоматический анализ процессов с конкретными рекомендациями.",
  openGraph: {
    title: "AI-аудит бизнеса — LVMN",
    description:
      "Ответьте на 7 вопросов — получите карту точек роста с AI и первые шаги.",
  },
};

export default function AuditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
