"use client";

import posthog from "posthog-js";

type Props = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    // Сигнатура ym вариативна по действию: reachGoal(id,"reachGoal",target,params),
    // params(id,"params",object), hit(id,"hit",url). Узкий тип ломает сборку на
    // вызовах params — держим общий, он покрывает все формы.
    ym?: (id: number, action: string, ...args: unknown[]) => void;
  }
}

// Единственный источник правды по счётчику: его же импортирует
// components/YandexMetrika.tsx, чтобы hit и reachGoal не разъезжались.
export const YM_ID = 110064196;

export function track(event: string, props?: Props) {
  if (typeof window === "undefined") return;
  try {
    if (posthog && posthog.__loaded) posthog.capture(event, props);
  } catch {}
  try {
    window.ym?.(YM_ID, "reachGoal", event, props);
  } catch {}
}
