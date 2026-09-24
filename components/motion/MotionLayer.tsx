"use client";

import { usePathname } from "next/navigation";
import { useGSAP, ScrollTrigger, prefersReducedMotion, hasFinePointer } from "./gsap";
import { resolveTier, effectiveKind, isMotionKind } from "./logic";
import { runners, markIn, type RunCtx } from "./runners";
import { bindTilts } from "./interactions";

// Оживляет разметку data-m на любой странице. Страницы остаются серверными:
// атрибуты стоят в HTML, скрытие делает GSAP после гидратации.
// На смену пути контекст откатывается целиком и собирается заново.
export default function MotionLayer() {
  const pathname = usePathname();

  useGSAP(
    (_context, contextSafe) => {
      const tier = resolveTier({ reduced: prefersReducedMotion(), finePointer: hasFinePointer() });
      const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-m]"));
      if (tier === "off") {
        nodes.forEach(markIn);
        return;
      }
      const cleanups: Array<() => void> = [];
      const ctx: RunCtx = {
        tier,
        safe: (fn) => contextSafe!(fn),
        onCleanup: (fn) => { cleanups.push(fn); },
      };
      for (const el of nodes) {
        const raw = el.dataset.m;
        if (!isMotionKind(raw)) {
          console.warn(`[motion] неизвестный data-m="${raw}"`);
          markIn(el);
          continue;
        }
        const kind = effectiveKind(raw, tier);
        if (!kind) {
          markIn(el);
          continue;
        }
        runners[kind](el, ctx);
      }
      if (tier === "full") cleanups.push(bindTilts());
      ScrollTrigger.refresh();
      // Шрифты меняют высоту заголовков: без пересчёта пин каталога стартует не с того места.
      document.fonts.ready.then(ctx.safe(() => ScrollTrigger.refresh()));
      return () => cleanups.forEach((fn) => fn());
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
