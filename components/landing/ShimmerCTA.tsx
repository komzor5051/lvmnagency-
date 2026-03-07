"use client";

import { ShimmerButton } from "@/components/ui/shimmer-button";

export function ShimmerCTA({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block"
    >
      <ShimmerButton
        background="rgba(13, 148, 136, 1)"
        shimmerColor="rgba(255,255,255,0.3)"
        shimmerSize="0.08em"
        borderRadius="8px"
        className="h-[50px] px-8"
      >
        <span className="flex items-center gap-2 text-[15px] font-bold text-white">
          {children}
        </span>
      </ShimmerButton>
    </a>
  );
}
