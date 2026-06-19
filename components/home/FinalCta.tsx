import { TELEGRAM_URL } from "@/lib/products";
import { Reveal } from "@/components/motion/Reveal";
import { consultationHref, isExternal } from "./cta";

/** Final CTA: huge headline, consultation button, Telegram fallback. */
export function FinalCta() {
  const href = consultationHref();
  const btnClass =
    "group mt-8 inline-flex items-center gap-2 bg-lime px-8 py-4 text-sm font-bold tracking-tight text-ink transition-transform duration-200 hover:-translate-y-0.5";
  const arrow = (
    <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
  );

  return (
    <section className="border-t border-line">
      <Reveal className="mx-auto max-w-7xl px-5 py-20 text-center md:px-10 md:py-24">
        <div data-reveal>
          <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-ink md:text-[52px] md:leading-none">
            Один час изменит всё
          </h2>
          <p className="mx-auto mt-4 max-w-[480px] text-base text-ink-muted">
            Консультация — самый быстрый способ понять, что AI даст именно
            вашему бизнесу.
          </p>
          {isExternal(href) ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className={btnClass}>
              Забронировать час — 5 000 ₽ {arrow}
            </a>
          ) : (
            <a href={href} className={btnClass}>
              Забронировать час — 5 000 ₽ {arrow}
            </a>
          )}
          <p className="mt-[18px] font-hand text-[22px] font-semibold text-ink-muted">
            ↳ оплата онлайн · запись остаётся у вас
          </p>
          <p className="mt-3 text-[13px] text-ink-muted">
            или просто напишите в{" "}
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="link-ul"
            >
              Telegram @lyaminvl
            </a>
          </p>
        </div>
      </Reveal>
    </section>
  );
}
