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

      // The fact chip gently floats.
      gsap.utils.toArray<HTMLElement>("[data-chip-float]", root.current).forEach((chip) => {
        gsap.to(chip, {
          y: -6,
          duration: 2.6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
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
        <p
          data-hero-fade
          className="mb-3 font-hand text-2xl font-semibold text-ink-muted"
        >
          AI-инженер для фаундеров и экспертов · открыт к проектам →
        </p>

        <h1 className="font-heading text-[40px] font-black leading-[1.0] tracking-[-0.04em] text-ink sm:text-[52px] lg:text-[56px] xl:text-[64px]">
          <span className="block overflow-hidden pb-[0.04em]">
            <span data-hero-line className="block">
              Внедряю AI-системы,
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <span data-hero-line className="block">
              которые <span className="lime-mark">окупаются</span>,
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.04em]">
            <span data-hero-line className="block">
              а не презентуются.
            </span>
          </span>
        </h1>

        <p
          data-hero-fade
          className="mt-7 max-w-[540px] text-[17px] leading-[1.55] text-ink-muted md:text-[18px]"
        >
          Меня зовут Влад. С 2022 года я собрал 40+ AI-внедрений для бизнеса —
          агенты, пайплайны, автоматизация. Помогаю в том масштабе, который
          нужен вам сейчас: от часовой консультации до системы под ключ.
        </p>

        <div data-hero-fade className="mt-8 flex flex-wrap items-center gap-5">
          {isExternal(ctaHref) ? (
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 bg-ink px-7 py-4 text-sm font-bold tracking-tight text-paper transition-transform duration-200 hover:-translate-y-0.5"
            >
              Консультация — 5 000 ₽
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          ) : (
            <a
              href={ctaHref}
              className="group inline-flex items-center gap-2 bg-ink px-7 py-4 text-sm font-bold tracking-tight text-paper transition-transform duration-200 hover:-translate-y-0.5"
            >
              Консультация — 5 000 ₽
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          )}
          <a href="#products" className="link-ul py-1 text-sm">
            Форматы и цены ↓
          </a>
        </div>

        <p data-hero-fade className="mt-4 font-hand text-[22px] font-semibold text-ink-muted">
          ↳ запись и план остаются у вас
        </p>
      </div>

      {/* Right: photo in a flat hairline frame with one floating chip */}
      <div className="mx-auto w-full max-w-[420px] lg:ml-auto lg:mr-0" data-hero-fade>
        <div className="relative w-full">
          <div className="relative aspect-[4/5] w-full overflow-hidden border border-line">
            <Image
              src="/portrait.jpg"
              alt="Влад Лямин, AI-инженер"
              fill
              priority
              sizes="(min-width: 1024px) 420px, 90vw"
              className="object-cover"
            />
          </div>

          <div className="absolute -left-3.5 bottom-6 [transform:translateZ(0)]">
            <div
              data-chip-float
              className="border border-ink bg-white px-3 py-2 font-mono text-[11px] font-medium text-ink"
            >
              <span
                className="mr-1.5 inline-block h-[7px] w-[7px] bg-ink align-middle"
                aria-hidden="true"
              />
              беру проекты на июль
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
