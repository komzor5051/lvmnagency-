import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Home banner for the vibecoding course: kicker + headline + one-line pitch on
 * the left, "Узнать больше" button (→ /vibecoding) on the right. White + Lime,
 * hairline frame, sharp corners, no shadow. Copy is jargon-free.
 */
export function CourseBanner() {
  return (
    <section className="border-t border-line">
      <Reveal className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-20">
        <div
          data-reveal
          className="flex flex-col gap-8 border border-ink px-6 py-10 md:flex-row md:items-center md:justify-between md:px-12 md:py-12"
        >
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
              Новый курс · 8-недельный поток
            </p>
            <h2 className="font-heading mt-4 text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] text-ink md:text-[40px]">
              Собери свой продукт с нуля —{" "}
              <span
                // Inset lime band confined to its own line (see /vibecoding hero
                // for rationale) — keeps the highlight off the line above.
                style={{
                  background:
                    "linear-gradient(transparent 0.16em, #c8f04c 0.16em, #c8f04c 0.92em, transparent 0.92em)",
                  padding: "0 0.1em",
                  boxDecorationBreak: "clone",
                  WebkitBoxDecorationBreak: "clone",
                }}
              >
                с AI вместо команды
              </span>
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-muted">
              За 8 недель доводишь свою идею до запуска: с базой данных, входом
              для пользователей и публикацией в интернете. Не туториал и не
              конструктор сайтов — учим управлять AI и понимать каждое решение.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/vibecoding"
              className="group inline-flex items-center gap-2 bg-ink px-8 py-4 text-sm font-bold tracking-tight text-paper transition-colors duration-200 hover:bg-ink/85"
            >
              Узнать больше
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
