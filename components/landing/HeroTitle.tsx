"use client";

import { WordRotate } from "@/components/ui/word-rotate";

export function HeroTitle() {
  return (
    <h1 className="anim-fade-up d1">
      Ваши сотрудники тратят часы на то, что AI делает за{" "}
      <WordRotate
        className="inline text-[var(--accent)]"
        words={["минуты", "секунды", "копейки"]}
        duration={3000}
      />
    </h1>
  );
}
