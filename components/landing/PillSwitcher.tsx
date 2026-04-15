"use client";

import { useRef, useLayoutEffect, useState } from "react";

export type TabId = "biz" | "emp";

interface PillSwitcherProps {
  value: TabId;
  onChange: (value: TabId) => void;
}

const TABS: { id: TabId; label: string }[] = [
  { id: "biz", label: "Бизнесу" },
  { id: "emp", label: "Сотрудникам" },
];

export function PillSwitcher({ value, onChange }: PillSwitcherProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState({ width: 0, transform: "translateX(0px)" });

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const activeBtn = container.querySelector<HTMLButtonElement>(`[data-tabid="${value}"]`);
    if (!activeBtn) return;
    setPillStyle({
      width: activeBtn.offsetWidth,
      transform: `translateX(${activeBtn.offsetLeft}px)`,
    });
  }, [value]);

  return (
    <div className="pill-switcher" ref={containerRef} role="tablist">
      <div
        className="pill-switcher-pill"
        style={{ width: pillStyle.width, transform: pillStyle.transform }}
        aria-hidden="true"
      />
      {TABS.map((tab) => (
        <button
          key={tab.id}
          data-tabid={tab.id}
          role="tab"
          aria-selected={value === tab.id}
          className={`pill-switcher-btn${value === tab.id ? " active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
