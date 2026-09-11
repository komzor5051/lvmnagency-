"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP, EASE_OUT, prefersReducedMotion, hasFinePointer } from "./gsap";
import { heroChoreography } from "./heroChoreography";

// Motion-слой главной. Разметка остаётся серверной и полностью видимой в HTML:
// скрытие делает gsap.set внутри useGSAP до первой отрисовки, поэтому
// поисковики и читалки видят текст, а глаз не ловит вспышку.
// При prefers-reduced-motion ничего не запускается и ничего не скрывается.
export default function HomeMotion() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const root = scope.current?.parentElement;
      if (!root) return;
      const q = gsap.utils.selector(root);
      const fine = hasFinePointer();

      // --- Hero -----------------------------------------------------------
      const hero = q<HTMLElement>(".rz-hero")[0];
      const h1 = q<HTMLElement>(".rz-hero .rz-h1")[0];
      const eyebrow = q<HTMLElement>(".rz-hero-eyebrow")[0];
      const mark = q<HTMLElement>(".rz-hero .rz-mark")[0];
      const lead = q<HTMLElement>(".rz-hero-lead")[0];
      const acts = q<HTMLElement>(".rz-hero-acts")[0];
      const facts = q<HTMLElement>(".rz-hero-aside p");

      if (hero && h1 && eyebrow && mark && lead && acts) {
        // h1 прячем синхронно: разрезка ждёт шрифтов, а вспышка целого заголовка
        // до разрезки видна глазом. Открываем его в onSplit, когда строки уже в масках.
        gsap.set([h1, eyebrow, lead, acts, ...facts], { autoAlpha: 0 });
        gsap.set([lead, acts], { y: 24 });

        const countUp = (p: HTMLElement) => {
          const strong = p.querySelector("strong");
          const raw = strong?.textContent ?? "";
          const m = raw.match(/^(\d+)(.*)$/);
          if (!strong || !m) return gsap.to({}, { duration: 0 });
          const target = Number(m[1]);
          const suffix = m[2];
          // Год считаем от близкого значения, иначе 2022 бежит от нуля две секунды.
          const state = { v: target > 100 ? target - 24 : 0 };
          return gsap.to(state, {
            v: target,
            duration: 1.6,
            ease: EASE_OUT,
            onUpdate: () => { strong.textContent = `${Math.round(state.v)}${suffix}`; },
          });
        };

        // Шрифты должны быть готовы до разрезки, иначе строки посчитаются по fallback.
        document.fonts.ready.then(() => {
          const split = SplitText.create(h1, { type: "lines", mask: "lines", autoSplit: false });
          // SplitText пересобирает разметку: span маркера внутри строки новый,
          // старая ссылка указывает на выброшенный узел. Берём живой.
          const liveMark = h1.querySelector<HTMLElement>(".rz-mark") ?? mark;
          gsap.set(liveMark, { "--mark-w": "0%" });
          gsap.set(split.lines, { yPercent: 110 });
          gsap.set(h1, { autoAlpha: 1 });
          const tl = gsap.timeline({
            defaults: { ease: EASE_OUT },
            // После сцены возвращаем исходную разметку: строки снова переносятся
            // браузером, и при ресайзе ничего не ломается и не переигрывается.
            onComplete: () => {
              split.revert();
              hero.classList.add("is-in"); // снимает CSS-скрытие html.js, см. razvorot.css
            },
          });
          heroChoreography(tl, {
            eyebrow, lines: split.lines, mark: liveMark, lead, acts, facts, countUp,
          });
        });
      }

      // --- Продукты: строки входят каскадом ----------------------------------
      // Триггеры передаём элементами: строковые селекторы внутри useGSAP
      // ищутся в scope, а scope здесь пустой якорь.
      const index = q<HTMLElement>(".rz-index")[0];
      const rows = q<HTMLElement>(".rz-row");
      if (index && rows.length) {
        gsap.from(rows, {
          autoAlpha: 0,
          y: 40,
          duration: 1,
          ease: EASE_OUT,
          stagger: 0.12,
          clearProps: "transform", // hover-сдвиг в CSS не должен спорить с GSAP
          scrollTrigger: { trigger: index, start: "top 82%", once: true },
        });
      }

      // --- Обо мне: портрет с параллаксом ----------------------------------
      const about = q<HTMLElement>(".rz-about")[0];
      const portrait = q<HTMLElement>(".rz-portrait img")[0];
      if (about && portrait && fine) {
        gsap.fromTo(
          portrait,
          { yPercent: -12, scale: 1.24 },
          {
            yPercent: 12,
            scale: 1.24,
            ease: "none",
            scrollTrigger: { trigger: about, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      }

      // --- Финальный CTA: маркер рисуется при входе в кадр --------------------
      const cta = q<HTMLElement>(".rz-cta")[0];
      const ctaMark = q<HTMLElement>(".rz-cta .rz-mark")[0];
      if (cta && ctaMark) {
        gsap.fromTo(
          ctaMark,
          { "--mark-w": "0%" },
          {
            "--mark-w": "100%",
            duration: 0.9,
            ease: "power3.inOut",
            scrollTrigger: { trigger: cta, start: "top 70%", once: true },
          },
        );
      }

      // --- Магнитные кнопки ---------------------------------------------------
      const cleanups: Array<() => void> = [];
      if (fine) {
        const RADIUS = 110;
        const PULL = 12;
        q<HTMLElement>(".rz-btn--solid").forEach((btn) => {
          const toX = gsap.quickTo(btn, "x", { duration: 0.4, ease: EASE_OUT });
          const toY = gsap.quickTo(btn, "y", { duration: 0.4, ease: EASE_OUT });
          const onMove = (e: PointerEvent) => {
            const r = btn.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2);
            const dy = e.clientY - (r.top + r.height / 2);
            const d = Math.hypot(dx, dy);
            if (d > RADIUS + r.width / 2) { toX(0); toY(0); return; }
            toX((dx / (RADIUS + r.width / 2)) * PULL);
            toY((dy / (RADIUS + r.height / 2)) * PULL);
          };
          const onLeave = () => { toX(0); toY(0); };
          window.addEventListener("pointermove", onMove, { passive: true });
          btn.addEventListener("pointerleave", onLeave);
          cleanups.push(() => {
            window.removeEventListener("pointermove", onMove);
            btn.removeEventListener("pointerleave", onLeave);
          });
        });
      }

      ScrollTrigger.refresh();
      return () => cleanups.forEach((fn) => fn());
    },
    { scope },
  );

  // Пустой якорь: анимируем соседей внутри <main className="rz">.
  return <div ref={scope} hidden aria-hidden="true" data-home-motion />;
}
