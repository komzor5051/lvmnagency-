"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";

type EventProps = Record<string, string | number | boolean | null | undefined>;

/**
 * Link that fires an analytics event on click (PostHog + Metrika via track()).
 * Used from server components (home hero CTA, final CTA) where an inline
 * onClick handler is not available.
 */
export function TrackedLink({
  href,
  event,
  eventProps,
  className,
  children,
}: {
  href: string;
  event: string;
  eventProps?: EventProps;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={className} onClick={() => track(event, eventProps)}>
      {children}
    </Link>
  );
}
