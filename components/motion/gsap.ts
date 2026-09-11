"use client";
// Единая точка регистрации GSAP. Все плагины подключаются здесь, чтобы
// ни один компонент не регистрировал их повторно и не тянул лишний код.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// Кастомные кривые совпадают с --rz-ease и --rz-ease-in-out из razvorot.css,
// чтобы hover на CSS и вход на GSAP двигались одинаково.
export const EASE_OUT = "power3.out";
export const EASE_IN_OUT = "power4.inOut";

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Параллакс и магнит имеют смысл только с мышью. На таче они мешают скроллу.
export function hasFinePointer(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
}

export { gsap, ScrollTrigger, SplitText, useGSAP };

// Только для отладки в dev: доступ к gsap из консоли браузера.
if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  (window as unknown as { __gsap: typeof gsap }).__gsap = gsap;
}
