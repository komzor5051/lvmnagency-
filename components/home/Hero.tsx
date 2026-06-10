"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DrawLine } from "@/components/motion/DrawLine";
import { TiltCard } from "@/components/motion/TiltCard";
import { consultationHref, isExternal } from "./cta";

gsap.registerPlugin(useGSAP);

/**
 * Hero: line-by-line headline assembly (clip + y), orange DrawLine under
 * "окупаются", photo right in a 3D-tilt card with floating fact chips at
 * different translateZ depths. prefers-reduced-motion: everything static.
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

      // Chips gently float (inner element, so translateZ on the wrapper survives).
      gsap.utils.toArray<HTMLElement>("[data-chip-float]", root.current).forEach((chip, i) => {
        gsap.to(chip, {
          y: -8,
          duration: 2.2 + i * 0.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: i * 0.35,
        });
      });
    },
    { scope: root }
  );

  const chipBase =
    "rounded-[10px] px-3.5 py-2.5 text-[11px] font-semibold tracking-tight shadow-[0_8px_24px_rgba(0,0,0,0.08)]";

  return (
    <section
      ref={root}
      className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-14 md:px-10 md:pt-20 lg:grid-cols-[7fr_5fr] lg:gap-12 lg:pb-24"
    >
      {/* Left: copy */}
      <div>
        <p
          data-hero-fade
          className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted"
        >
          AI-ИНЖЕНЕР · НОВОСИБИРСК · ОТКРЫТ К ПРОЕКТАМ
        </p>

        <h1 className="mt-6 font-heading text-[40px] font-bold leading-[1.02] tracking-[-0.04em] text-ink sm:text-[52px] lg:text-[56px] xl:text-[64px]">
          <span className="block overflow-hidden pb-[0.08em]">
            <span data-hero-line className="block">
              Внедряю AI-системы,
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.14em]">
            <span data-hero-line className="block">
              которые{" "}
              <span className="relative whitespace-nowrap">
                окупаются
                <DrawLine
                  className="absolute -bottom-[0.08em] left-0 h-[0.18em] w-full"
                  delay={1.1}
                />
              </span>
              ,
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <span data-hero-line className="block">
              а не презентуются.
            </span>
          </span>
        </h1>

        <p
          data-hero-fade
          className="mt-7 max-w-[540px] text-[17px] leading-[1.55] text-ink-muted md:text-[19px]"
        >
          Меня зовут Влад. С 2022 года я собрал 40+ AI-внедрений для бизнеса —
          агенты, пайплайны, автоматизация. Здесь можно купить мой опыт: от
          часовой консультации до системы под ключ.
        </p>

        <div data-hero-fade className="mt-9 flex flex-wrap items-center gap-4">
          {isExternal(ctaHref) ? (
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg bg-ink px-7 py-4 text-sm font-bold tracking-tight text-paper transition-colors hover:bg-black"
            >
              Консультация — 10 000 ₽
            </a>
          ) : (
            <a
              href={ctaHref}
              className="inline-flex items-center rounded-lg bg-ink px-7 py-4 text-sm font-bold tracking-tight text-paper transition-colors hover:bg-black"
            >
              Консультация — 10 000 ₽
            </a>
          )}
          <a
            href="#products"
            className="underline-accent py-4 text-sm font-medium text-ink transition-colors hover:text-accent"
          >
            Смотреть продукты ↓
          </a>
        </div>
      </div>

      {/* Right: photo with 3D tilt and floating chips */}
      <div className="mx-auto w-full max-w-[420px] lg:max-w-none" data-hero-fade>
        <TiltCard className="rounded-2xl">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-[24px_40px_80px_rgba(0,0,0,0.18)]">
            <Image
              src="/portrait.jpg"
              alt="Влад Лямин, AI-инженер"
              fill
              priority
              sizes="(min-width: 1024px) 420px, 90vw"
              className="object-cover"
            />
          </div>

          <div className="absolute -right-3 top-5 [transform:translateZ(40px)]">
            <div data-chip-float className={`${chipBase} border border-line bg-white text-ink`}>
              40+ внедрений
            </div>
          </div>

          <div className="absolute -left-4 bottom-16 [transform:translateZ(60px)]">
            <div data-chip-float className={`${chipBase} border border-line bg-white font-normal text-ink`}>
              <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-accent align-middle" aria-hidden="true" />
              сейчас: 1 слот на июнь
            </div>
          </div>

          <div className="absolute -bottom-4 right-8 [transform:translateZ(50px)]">
            <div
              data-chip-float
              className={`${chipBase} bg-ink font-mono text-paper shadow-[0_12px_28px_rgba(0,0,0,0.2)]`}
            >
              n8n · Claude · Supabase
            </div>
          </div>
        </TiltCard>
      </div>
    </section>
  );
}
