"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";
    if (!key) return;
    if (!posthog.__loaded) {
      posthog.init(key, {
        api_host: host,
        capture_pageview: true,
        session_recording: { maskAllInputs: false },
        autocapture: false,
      });
    }
  }, []);
  return <>{children}</>;
}
