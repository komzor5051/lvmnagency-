import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI-аудит бизнеса — LVMN",
  description:
    "Бесплатный AI-аудит за 2 минуты. Узнайте, какие процессы в вашем бизнесе можно автоматизировать и сколько это сэкономит.",
  openGraph: {
    title: "AI-аудит бизнеса — LVMN",
    description:
      "Ответьте на 6 вопросов — и AI покажет, что можно автоматизировать в вашем бизнесе.",
  },
};

export default function AuditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
