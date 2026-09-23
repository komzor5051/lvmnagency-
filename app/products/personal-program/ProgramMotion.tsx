"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/components/motion/gsap";
import { EASE } from "@/components/motion/tokens";

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

    let tl: gsap.core.Timeline | null = null;
    if (quickMount) {
      page.classList.add("program-hero-armed");
      tl = gsap.timeline({ defaults: { ease: EASE.out, duration: 0.95 } });
      tl.fromTo(hero, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, stagger: 0.085 }, 0);
      if (card) {
        tl.fromTo(card,
          { autoAlpha: 0, y: 46, rotationY: -18, rotationX: 9 },
          { autoAlpha: 1, y: 0, rotationY: 0, rotationX: 0, duration: 1.3, ease: "expo.out" },
          0.22);
      }
      tl.fromTo(page.querySelectorAll(".program-facts > div"),
        { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.7 }, 0.5);
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

    return () => { io.disconnect(); tl?.kill(); };
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
      gsap.to(el, { x: dx * 0.18, y: dy * 0.28, duration: 0.35, ease: "power1.out", overwrite: "auto" });
    };
    const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.65, ease: "elastic.out(1, 0.6)", overwrite: "auto" });
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, []);
  return ref;
}
