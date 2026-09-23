"use client";
// Единая точка регистрации GSAP. Все плагины подключаются здесь, чтобы
// ни один компонент не регистрировал их повторно и не тянул лишний код.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { EASE } from "./tokens";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// Кривые живут в tokens.ts. Эти имена оставлены для HomeMotion и heroChoreography.
export const EASE_OUT = EASE.out;
export const EASE_IN_OUT = EASE.inOut;

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
