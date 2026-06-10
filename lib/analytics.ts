"use client";

import posthog from "posthog-js";

type Props = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    ym?: (id: number, action: string, target?: string, params?: Props) => void;
  }
}

const YM_ID = 106695724;

export function track(event: string, props?: Props) {
  if (typeof window === "undefined") return;
  try {
    if (posthog && posthog.__loaded) posthog.capture(event, props);
  } catch {}
  try {
    window.ym?.(YM_ID, "reachGoal", event, props);
  } catch {}
}
