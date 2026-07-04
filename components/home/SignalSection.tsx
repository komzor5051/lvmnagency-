import Image from "next/image";
import Link from "next/link";
import { TELEGRAM_URL } from "@/lib/products";
import { Reveal } from "@/components/motion/Reveal";
import { consultationHref, isExternal } from "./cta";

/**
 * Chapter 5 «Сигнал»: the particles converge into a sharp photographic
 * portrait (the engine drives the img opacity 0 → 1 over the last stretch
 * of scroll). Statically — photo, Caveat signature, final CTA. Absorbs the
 * former AboutTeaser and FinalCta sections.
 */
export function SignalSection() {
  const href = consultationHref();
  const btnClass =
    "group mt-8 inline-flex items-center gap-2 bg-lime px-8 py-4 text-sm font-bold tracking-tight text-ink transition-transform duration-200 hover:-translate-y-0.5";
  const arrow = (
    <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
  );

  return (
    <section className="border-t border-line">
      <Reveal className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:grid-cols-[380px_1fr] md:gap-16 md:px-10 md:py-28">
        {/* Portrait: particle target (data-stage="final"); the photo itself
            fades in as the particles settle (data-stage="final-img"). */}
        <div data-reveal className="mx-auto w-full max-w-[380px]">
          <div
            data-stage="final"
            className="relative aspect-[3/4] w-full overflow-hidden border border-line"
          >
            <Image
              src="/portrait.jpg"
              alt="Влад Лямин"
              fill
              sizes="380px"
              className="object-cover"
              data-stage="final-img"
            />
          </div>
          <p className="mt-4 text-center font-hand text-[26px] font-semibold text-ink">
            Влад Лямин
          </p>
        </div>

        <div data-reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted">
            04 — Сигнал
          </p>
          <h2 className="mt-3 font-heading text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] text-ink md:text-[46px]">
            Разберём вашу задачу вместе — за час
          </h2>
          <p className="mt-4 max-w-[520px] text-base leading-[1.6] text-ink-muted">
            Приходите с вопросом, процессом или идеей. Уходите со списком:
            что делать, на каком инструменте, в каком порядке. С 2022 помогаю
            фаундерам и командам освободить время от рутины — не прихожу,
            настраиваю и исчезаю, а остаюсь рядом, пока AI не станет частью
            вашей работы. Подробнее о подходе —{" "}
            <Link href="/about" className="link-ul">
              в манифесте
            </Link>
            .
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
