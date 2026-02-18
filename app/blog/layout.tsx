import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Блог LVMN — AI-автоматизация для бизнеса",
  description:
    "Практичные статьи об автоматизации бизнеса с помощью AI. Кейсы, тренды нейросетей, инструменты.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#08090c]">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a
              href="/"
              className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-wider hover:text-[var(--accent)] transition-colors"
            >
              LVMN
            </a>
            <nav className="hidden sm:flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
              <a
                href="/"
                className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                Главная
              </a>
              <span className="text-zinc-300 dark:text-zinc-700">/</span>
              <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                Блог
              </span>
            </nav>
          </div>
          <a
            href="https://t.me/lyaminvl?text=Аудит"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors font-medium"
          >
            Написать в Telegram
          </a>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>
      <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500 dark:text-zinc-400">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
              <a
                href="/"
                className="hover:text-[var(--accent)] transition-colors font-medium"
              >
                LVMN — Главная
              </a>
              <a
                href="https://t.me/lyaminvl"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent)] transition-colors"
              >
                Telegram @lyaminvl
              </a>
            </div>
            <span className="text-zinc-400 dark:text-zinc-600">
              LVMN &copy; {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
