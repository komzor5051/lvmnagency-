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
  "data-m": dataM,
  "data-m-tilt": dataMTilt,
}: {
  href: string;
  event: string;
  eventProps?: EventProps;
  className?: string;
  children: React.ReactNode;
  // Атрибуты MotionLayer (components/motion): вход блока и наклон обложки.
  "data-m"?: string;
  "data-m-tilt"?: string;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => track(event, eventProps)}
      data-m={dataM}
      data-m-tilt={dataMTilt}
    >
      {children}
    </Link>
  );
}
