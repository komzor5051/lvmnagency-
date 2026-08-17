import posthog from "posthog-js";

// Инициализация вызывается перед каждой отправкой, а не только из эффекта
// провайдера. Причина: эффекты детей и сиблингов выполняются раньше эффекта
// провайдера, поэтому потребители, проверяющие posthog.__loaded, роняли
// первое событие за визит — включая самый первый $pageview.
export function ensurePostHog(): boolean {
  if (typeof window === "undefined") return false;
  if (posthog.__loaded) return true;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return false;

  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";
  posthog.init(key, {
    api_host: host,
    capture_pageview: false, // handled manually by PageviewTracker on route change
    capture_pageleave: true, // needed for accurate bounce rate / time on page
    autocapture: true, // record clicks, form interactions — "what people do"
    session_recording: { maskAllInputs: true }, // replay, but mask typed input (PII)
    persistence: "localStorage+cookie",
  });

  return posthog.__loaded ?? false;
}
