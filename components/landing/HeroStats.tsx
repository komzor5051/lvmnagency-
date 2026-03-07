"use client";

import { NumberTicker } from "@/components/ui/number-ticker";

export function HeroStats() {
  return (
    <div className="hero-stats anim-fade-up d4">
      <div>
        <div className="hero-stat-num">
          <NumberTicker value={13} />
        </div>
        <div className="hero-stat-label">проектов запущено</div>
      </div>
      <div>
        <div className="hero-stat-num">3-5</div>
        <div className="hero-stat-label">дней до запуска</div>
      </div>
      <div>
        <div className="hero-stat-num">
          <NumberTicker value={60} />%
        </div>
        <div className="hero-stat-label">рутины уходит</div>
      </div>
    </div>
  );
}
