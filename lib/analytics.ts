"use client";

import posthog from "posthog-js";
import { YM_COUNTER_ID } from "@/lib/metrika";

type Props = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    // Метрика перегружает третий аргумент: для 'reachGoal' это имя цели,
    // для 'params' — сам объект параметров визита.
    ym?: (id: number, action: string, target?: string | Props, params?: Props) => void;
  }
}

export function track(event: string, props?: Props) {
  if (typeof window === "undefined") return;
  try {
    if (posthog && posthog.__loaded) posthog.capture(event, props);
  } catch {}
  try {
    window.ym?.(YM_COUNTER_ID, "reachGoal", event, props);
  } catch {}
}
