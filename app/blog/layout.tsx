import type { Metadata } from "next";
import Link from "next/link";
import "./blog.css";

export const metadata: Metadata = {
  title: "Блог Влада Лямина — AI-автоматизация для бизнеса",
  description:
    "Влад Лямин, AI-инженер: практичные разборы автоматизации бизнеса с помощью AI. Кейсы из 40+ внедрений, тренды нейросетей, рабочие инструменты.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
          <div className="flex items-baseline gap-6">
            <Link
              href="/"
              className="text-lg font-bold tracking-[-0.03em] text-ink hover:underline decoration-accent decoration-2 underline-offset-4"
            >
              Влад Лямин
            </Link>
            <nav className="hidden sm:flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-ink-muted">
              <Link href="/" className="hover:text-ink transition-colors">
                Главная
              </Link>
              <span aria-hidden className="text-accent">
                /
              </span>
              <span className="text-ink">Блог</span>
            </nav>
          </div>
          <a
            href="https://t.me/lyaminvl?text=Аудит"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm px-4 py-2 bg-ink text-paper font-medium hover:bg-black transition-colors"
          >
            Написать в Telegram
          </a>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {children}
      </main>
      <footer className="border-t border-line mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs uppercase tracking-wider text-ink-muted">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
              <Link
                href="/"
                className="hover:text-ink hover:underline decoration-accent underline-offset-4 transition-colors"
              >
                Влад Лямин — Главная
              </Link>
              <a
                href="https://t.me/lyaminvl"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink hover:underline decoration-accent underline-offset-4 transition-colors"
              >
                Telegram @lyaminvl
              </a>
            </div>
            <span>&copy; {new Date().getFullYear()} Влад Лямин</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
