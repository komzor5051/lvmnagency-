"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { animate, createTimeline, stagger } from "animejs";

const EASE = "cubicBezier(.2,.7,.2,1)";

function motionAllowed() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Раскрытие по скроллу. Контент в серверном HTML виден всегда: скрывающий
// класс вешается только после монтирования, так что обрыв бандла не даёт
// белого экрана. Hero-въезд запускается только если страница смонтировалась
// быстро — иначе мигание «видно → спрятано → въехало» заметнее самой анимации.
export function ProgramMotion() {
  useEffect(() => {
    if (!motionAllowed()) return;
    const page = document.querySelector<HTMLElement>(".program-page");
    if (!page) return;

    const hero = Array.from(page.querySelectorAll<HTMLElement>("[data-hero]"));
    const card = page.querySelector<HTMLElement>("[data-card-enter]");
    const quickMount = performance.now() < 1500 || performance.getEntriesByType("navigation").length === 0;

    if (quickMount) {
      page.classList.add("program-hero-armed");
      const tl = createTimeline({ defaults: { ease: EASE, duration: 950 } });
      tl.add(hero, { opacity: [0, 1], translateY: [28, 0], delay: stagger(85) }, 0);
      if (card) {
        tl.add(card, { opacity: [0, 1], translateY: [46, 0], rotateY: [-18, 0], rotateX: [9, 0], duration: 1300, ease: "outExpo" }, 220);
      }
      tl.add(page.querySelectorAll(".program-facts > div"), { opacity: [0, 1], translateY: [18, 0], delay: stagger(70), duration: 700 }, 500);
      window.setTimeout(() => page.classList.add("program-mark-in"), 650);
    } else {
      page.classList.add("program-mark-in");
    }

    page.classList.add("program-motion");
    const items = Array.from(page.querySelectorAll<HTMLElement>("[data-reveal]"));
    items.forEach((el) => {
      const group = el.closest<HTMLElement>("[data-stagger]");
      if (group) {
        const siblings = Array.from(group.querySelectorAll<HTMLElement>("[data-reveal]"));
        el.style.setProperty("--d", `${siblings.indexOf(el) * 90}ms`);
      }
    });
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    items.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);
  return null;
}

// Карточка маршрута: наклон за курсором, блик и глубина слоёв. Без hover
// (телефоны) — медленное покачивание. Въезд анимирует обёртку, наклон —
// саму карточку, чтобы трансформации не спорили.
export function TiltCard({ children, className }: { children: ReactNode; className: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !motionAllowed()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      el.classList.add("is-idle");
      return;
    }
    let target = { rx: 0, ry: 0, gx: 50, gy: 50, sheen: 0 };
    const current = { ...target };
    let raf = 0;
    const tick = () => {
      let settled = true;
      for (const key of Object.keys(current) as (keyof typeof current)[]) {
        const diff = target[key] - current[key];
        if (Math.abs(diff) > 0.02) settled = false;
        current[key] += diff * 0.12;
      }
      el.style.setProperty("--rx", `${current.rx.toFixed(2)}deg`);
      el.style.setProperty("--ry", `${current.ry.toFixed(2)}deg`);
      el.style.setProperty("--gx", `${current.gx.toFixed(1)}%`);
      el.style.setProperty("--gy", `${current.gy.toFixed(1)}%`);
      el.style.setProperty("--sheen", current.sheen.toFixed(3));
      raf = settled ? 0 : requestAnimationFrame(tick);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const move = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      target = { rx: (0.5 - py) * 22, ry: (px - 0.5) * 26, gx: px * 100, gy: py * 100, sheen: 1 };
      schedule();
    };
    const leave = () => { target = { ...target, rx: 0, ry: 0, sheen: 0 }; schedule(); };
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div className="program-card-wrap" data-card-enter><aside ref={ref} className={className}>{children}</aside></div>;
}

// Кнопка-магнит: чуть тянется к курсору внутри своей зоны.
export function useMagnet<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !motionAllowed() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const move = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      animate(el, { translateX: dx * 0.18, translateY: dy * 0.28, duration: 350, ease: "outQuad" });
    };
    const leave = () => animate(el, { translateX: 0, translateY: 0, duration: 650, ease: "outElastic(1, .6)" });
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, []);
  return ref;
}
