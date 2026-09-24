"use client";

import { useEffect, useRef, useState } from "react";

// Перекрестие за курсором с координатами в делениях линейки (1 деление = 40px).
// Только для мыши и без reduced motion: на телефоне оно бессмысленно.
export function Crosshair() {
  const root = useRef<HTMLDivElement>(null);
  const x = useRef<HTMLDivElement>(null);
  const y = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || calm) return;

    const scope = root.current?.parentElement;
    if (!scope) return;
    let raf = 0;

    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = scope.getBoundingClientRect();
        const ux = ((e.clientX - rect.left) / 40).toFixed(1);
        const uy = ((e.clientY - rect.top) / 40).toFixed(1);
        if (x.current) x.current.style.transform = `translateY(${e.clientY}px)`;
        if (y.current) y.current.style.transform = `translateX(${e.clientX}px)`;
        if (tag.current) {
          tag.current.textContent = `x ${ux}  y ${uy}`;
          tag.current.style.transform = `translate(${e.clientX + 14}px, ${e.clientY + 14}px)`;
        }
      });
    };
    const on = () => root.current?.classList.add("is-on");
    const off = () => root.current?.classList.remove("is-on");

    scope.addEventListener("pointermove", move);
    scope.addEventListener("pointerenter", on);
    scope.addEventListener("pointerleave", off);
    return () => {
      cancelAnimationFrame(raf);
      scope.removeEventListener("pointermove", move);
      scope.removeEventListener("pointerenter", on);
      scope.removeEventListener("pointerleave", off);
    };
  }, []);

  return (
    <div ref={root} className="lab-cross" aria-hidden="true">
      <div ref={x} className="lab-cross-x" />
      <div ref={y} className="lab-cross-y" />
      <div ref={tag} className="lab-cross-tag" />
    </div>
  );
}

type AccItem = { title: string; body: string };

export function Accordion({ items, firstOpen = false }: { items: AccItem[]; firstOpen?: boolean }) {
  const [open, setOpen] = useState<number | null>(firstOpen ? 0 : null);

  return (
    <div className="lab-acc">
      {items.map((item, i) => {
        const isOpen = open === i;
        const id = `lab-acc-${item.title.replace(/\s+/g, "-")}`;
        return (
          <div key={item.title} data-m-item className={`lab-acc-item${isOpen ? " is-open" : ""}`}>
            <button
              type="button"
              className="lab-acc-btn"
              aria-expanded={isOpen}
              aria-controls={id}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="lab-acc-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-heading text-lg font-bold tracking-[-0.02em] md:text-xl">{item.title}</span>
              <span className="lab-acc-sign" aria-hidden="true" />
            </button>
            <div id={id} className="lab-acc-panel" role="region">
              <div>
                <p className="lab-acc-body">{item.body}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
