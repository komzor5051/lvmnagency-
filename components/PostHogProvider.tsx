"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";

// Captures a $pageview on every client-side route change. The App Router does
// SPA navigation (no full reload), so PostHog's built-in capture_pageview would
// only ever log the first load — internal page traffic would be undercounted.
// useSearchParams() forces dynamic rendering, so this lives behind <Suspense>.
function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!posthog.__loaded) return;
    let url = window.origin + pathname;
    const qs = searchParams.toString();
    if (qs) url += "?" + qs;
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";
    if (!key) return;
    if (!posthog.__loaded) {
      posthog.init(key, {
        api_host: host,
        capture_pageview: false, // handled manually by PageviewTracker on route change
        capture_pageleave: true, // needed for accurate bounce rate / time on page
        autocapture: true, // record clicks, form interactions — "what people do"
        session_recording: { maskAllInputs: true }, // replay, but mask typed input (PII)
        persistence: "localStorage+cookie",
      });
    }
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      {children}
    </>
  );
}
