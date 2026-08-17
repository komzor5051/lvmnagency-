"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { ensurePostHog } from "@/lib/posthog";

// Captures a $pageview on every client-side route change. The App Router does
// SPA navigation (no full reload), so PostHog's built-in capture_pageview would
// only ever log the first load — internal page traffic would be undercounted.
// useSearchParams() forces dynamic rendering, so this lives behind <Suspense>.
function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!ensurePostHog()) return;
    let url = window.origin + pathname;
    const qs = searchParams.toString();
    if (qs) url += "?" + qs;
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    ensurePostHog();
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
