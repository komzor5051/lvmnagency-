"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { TELEGRAM_URL } from "@/lib/products";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The only dark section on the page: rounded black block for custom work.
 * Subtle scroll parallax — the block slides up slightly slower than the
 * scroll while entering the viewport. Static under prefers-reduced-motion.
 */
export function DarkBusiness() {
  const root = useRef<HTMLElement>(null);
  const block = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = block.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        el,
        { y: 90 },
        {
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "top 45%",
            scrub: 0.6,
          },
        }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root}>
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div
          ref={block}
          className="relative overflow-hidden rounded-[18px] bg-ink px-7 py-12 text-paper md:px-12 md:py-14"
        >
          {/* Decorative thin border circles */}
          <div
            aria-hidden="true"
            className="absolute -right-10 -top-10 h-[280px] w-[280px] rounded-full border border-white/10"
          />
          <div
            aria-hidden="true"
            className="absolute right-5 top-10 h-[160px] w-[160px] rounded-full border border-white/10"
          />

          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
            02 — ДЛЯ БИЗНЕСА
          </p>
          <h2 className="mt-4 max-w-[560px] font-heading text-3xl font-bold leading-[1.1] tracking-[-0.03em] md:text-[38px]">
            Нужна система под ключ, а не созвон?
          </h2>
          <p className="mt-4 max-w-[520px] text-base leading-[1.55] text-white/65">
            Внедрение агентов и пайплайнов от 50 000 ₽, обучение команд,
            advisory-подписка. Начинаем с 30-минутного разговора о задаче.
          </p>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center rounded-lg bg-white px-6 py-3.5 text-[13px] font-bold tracking-tight text-ink transition-colors hover:bg-paper"
          >
            Рассказать о задаче →
          </a>
        </div>
      </div>
    </section>
  );
}
