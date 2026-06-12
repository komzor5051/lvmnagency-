import { TELEGRAM_URL } from "@/lib/products";
import { Reveal } from "@/components/motion/Reveal";
import { consultationHref, isExternal } from "./cta";

/** Final CTA: huge headline, consultation button, Telegram fallback. */
export function FinalCta() {
  const href = consultationHref();
  const btnClass =
    "mt-8 inline-flex items-center rounded-lg bg-ink px-8 py-4 text-sm font-bold tracking-tight text-paper transition-colors hover:bg-black";

  return (
    <section className="border-t border-line">
      <Reveal className="mx-auto max-w-6xl px-5 py-20 text-center md:px-10 md:py-24">
        <div data-reveal>
          <h2 className="font-heading text-4xl font-bold tracking-[-0.03em] text-ink md:text-5xl">
            Начнём с часа?
          </h2>
          <p className="mx-auto mt-4 max-w-[480px] text-base text-ink-muted">
            Консультация — самый быстрый способ понять, что AI даст именно
            вашему бизнесу.
          </p>
          {isExternal(href) ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className={btnClass}>
              Забронировать час — 5 000 ₽
            </a>
          ) : (
            <a href={href} className={btnClass}>
              Забронировать час — 5 000 ₽
            </a>
          )}
          <p className="mt-5 text-[13px] text-ink-muted">
            или просто напишите в{" "}
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-accent font-medium text-ink transition-colors hover:text-accent"
            >
              Telegram @lyaminvl
            </a>
          </p>
        </div>
      </Reveal>
    </section>
  );
}
