"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { consultationHref, isExternal } from "./cta";

gsap.registerPlugin(useGSAP);

/**
 * Hero (Brand DS): line-by-line headline assembly (clip + y), lime highlight on
 * "окупаются", photo right in a flat hairline frame with one floating fact
 * chip. Sharp corners, no shadow. prefers-reduced-motion: everything static.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const ctaHref = consultationHref();

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Headline assembles line by line: each line slides up out of its clip.
      const lines = gsap.utils.toArray<HTMLElement>("[data-hero-line]", root.current);
      gsap.set(lines, { yPercent: 110 });
      gsap.to(lines, {
        yPercent: 0,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.1,
      });

      // Kicker, intro and CTAs fade in after the headline.
      const rest = gsap.utils.toArray<HTMLElement>("[data-hero-fade]", root.current);
      gsap.set(rest, { opacity: 0, y: 16 });
      gsap.to(rest, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
        delay: 0.55,
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-12 md:px-10 md:pt-[72px] lg:grid-cols-[7fr_5fr] lg:gap-14 lg:pb-24"
    >
      {/* Left: copy */}
      <div>
        <h1 className="font-heading text-[40px] font-black leading-[1.0] tracking-[-0.04em] text-ink sm:text-[52px] lg:text-[56px] xl:text-[64px]">
          <span className="block overflow-hidden pb-[0.04em]">
            <span data-hero-line className="block">
              Фаундеры тратят часы
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <span data-hero-line className="block">
              на задачи, которые AI
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.04em]">
            <span data-hero-line className="block">
              решает <span className="lime-mark">за минуты</span>.
            </span>
          </span>
        </h1>

        <p
          data-hero-fade
          className="mt-7 max-w-[540px] text-[17px] leading-[1.55] text-ink-muted md:text-[18px]"
        >
          Нахожу, где ваш бизнес теряет время, строю AI-систему под ключ и
          передаю команде — чтобы работало без меня. Один человек, конкретный
          план, измеримый результат за 1–3 дня.
        </p>

        <div data-hero-fade className="mt-8 flex flex-wrap items-center gap-5">
          {isExternal(ctaHref) ? (
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 bg-ink px-7 py-4 text-sm font-bold tracking-tight text-paper transition-colors duration-200 hover:bg-ink/85"
              aria-label="Записаться на консультацию — 5 000 рублей"
            >
              Разобрать мою задачу — 5 000 ₽
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          ) : (
            <a
              href={ctaHref}
              className="group inline-flex items-center gap-2 bg-ink px-7 py-4 text-sm font-bold tracking-tight text-paper transition-colors duration-200 hover:bg-ink/85"
              aria-label="Записаться на консультацию — 5 000 рублей"
            >
              Разобрать мою задачу — 5 000 ₽
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          )}
          <a href="#products" className="link-ul py-1 text-sm">
            Или начать с гайда — 990 ₽
          </a>
        </div>

        <p data-hero-fade className="mt-4 font-hand text-[22px] font-semibold text-ink-muted">
          ↳ консультация 60 минут · план и запись остаются у вас
        </p>
      </div>

      {/* Right: halftone portrait in a flat hairline frame. When the particle
          engine runs, it assembles the same portrait from dots at this anchor
          and the static image fades out (.canvas-hide). */}
      <div className="mx-auto w-full max-w-[420px] lg:ml-auto lg:mr-0" data-hero-fade>
        <div className="relative w-full">
          <div
            data-stage="portrait"
            className="relative aspect-[3/4] w-full overflow-hidden border border-line"
          >
            <Image
              src="/portrait-halftone.png"
              alt="Влад Лямин — halftone-портрет"
              fill
              priority
              sizes="(min-width: 1024px) 420px, 90vw"
              className="canvas-hide object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
