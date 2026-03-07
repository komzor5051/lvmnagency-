"use client";

import { BorderBeam } from "@/components/ui/border-beam";

export function FeaturedPricingBeam() {
  return (
    <BorderBeam
      duration={6}
      size={200}
      className="from-transparent via-[var(--accent)] to-transparent"
    />
  );
}
