"use client";

import { useEffect, useRef, useState } from "react";
import type { SystemMap as SystemMapData } from "@/app/products/content";

// Настоящая майндкарта из данных: центр, ветки, дочерние узлы и линии-связи.
// Узлы — обычный HTML (текст живой, переносится, читается на любом экране),
// связи — SVG-пути, которые пересчитываются по реальным позициям узлов.
// Широкий экран: ветки слева и справа от центра, кривые как в XMind.
// Узкий экран: карта разворачивается вертикально, связи угловые.

type Pt = { x: number; y: number };
type Box = { x: number; y: number; w: number; h: number };

function boxOf(el: HTMLElement, root: HTMLElement): Box {
  let x = 0;
  let y = 0;
  let n: HTMLElement | null = el;
  while (n && n !== root) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

function curve(a: Pt, b: Pt) {
  const k = (b.x - a.x) / 2;
  return `M${a.x} ${a.y} C${a.x + k} ${a.y}, ${b.x - k} ${b.y}, ${b.x} ${b.y}`;
}

function elbow(spineX: number, fromY: number, toY: number, toX: number) {
  return `M${spineX} ${fromY} V${toY} H${toX}`;
}

export function SystemMap({ map }: { map: SystemMapData }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<string[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // Делим ветки на правую и левую стороны по «весу» (сколько строк займут),
  // а не по количеству — иначе одна сторона в полтора раза длиннее другой.
  const weight = (b: SystemMapData["branches"][number]) =>
    b.items.reduce((n, it) => n + 1 + (it.children ? 0.7 : 0), 0) + 1;
  const weights = map.branches.map(weight);
  const total = weights.reduce((n, w) => n + w, 0);
  let half = 1;
  let best = Infinity;
  let acc = 0;
  for (let i = 0; i < map.branches.length - 1; i++) {
    acc += weights[i];
    const diff = Math.abs(acc - (total - acc));
    if (diff < best) {
      best = diff;
      half = i + 1;
    }
  }
  const right = map.branches.slice(0, half);
  const left = map.branches.slice(half);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const draw = () => {
      const stacked = getComputedStyle(root).getPropertyValue("--mm-layout").trim() === "stack";
      const center = root.querySelector<HTMLElement>("[data-mm-center]");
      if (!center) return;
      const c = boxOf(center, root);
      const out: string[] = [];

      root.querySelectorAll<HTMLElement>("[data-mm-branch]").forEach((branchEl) => {
        const side = branchEl.dataset.mmBranch; // "l" | "r"
        const node = branchEl.querySelector<HTMLElement>("[data-mm-node]");
        if (!node) return;
        const b = boxOf(node, root);
        const kids = Array.from(branchEl.querySelectorAll<HTMLElement>("[data-mm-kid]"));

        if (stacked) {
          // Вертикальная раскладка: узел ветки висит на общей вертикали от центра,
          // дочерние узлы лежат плиткой и подключены одной связью на группу.
          const spine = c.x + 18;
          out.push(elbow(spine, c.y + c.h, b.y + b.h / 2, b.x));
          if (kids[0]) {
            const k = boxOf(kids[0], root);
            out.push(elbow(b.x + 18, b.y + b.h, k.y + k.h / 2, k.x));
          }
          return;
        }

        const cAnchor: Pt =
          side === "r" ? { x: c.x + c.w, y: c.y + c.h / 2 } : { x: c.x, y: c.y + c.h / 2 };
        const bIn: Pt = side === "r" ? { x: b.x, y: b.y + b.h / 2 } : { x: b.x + b.w, y: b.y + b.h / 2 };
        out.push(curve(cAnchor, bIn));
        const bOut: Pt = side === "r" ? { x: b.x + b.w, y: b.y + b.h / 2 } : { x: b.x, y: b.y + b.h / 2 };
        kids.forEach((kidEl) => {
          const k = boxOf(kidEl, root);
          const kIn: Pt = side === "r" ? { x: k.x, y: k.y + k.h / 2 } : { x: k.x + k.w, y: k.y + k.h / 2 };
          out.push(curve(bOut, kIn));
        });
      });

      setPaths(out);
      setSize({ w: root.offsetWidth, h: root.offsetHeight });
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(root);
    document.fonts?.ready.then(draw);
    return () => ro.disconnect();
  }, [map]);

  const renderBranch = (branch: SystemMapData["branches"][number], side: "l" | "r", index: number) => (
    <div key={branch.title} className="mm-branch" data-mm-branch={side}>
      <div className="mm-node mm-node--branch" data-mm-node>
        <span className="mm-num">{index + 1}</span>
        {branch.title}
      </div>
      <div className="mm-kids" data-mm-kids>
        {branch.items.map((item) => (
          <div key={item.title} className="mm-node mm-node--kid" data-mm-kid>
            {item.title}
            {item.children?.length ? <small>{item.children.join(" · ")}</small> : null}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="mm" ref={rootRef}>
      <svg
        className="mm-links"
        width={size.w}
        height={size.h}
        viewBox={`0 0 ${size.w || 1} ${size.h || 1}`}
        aria-hidden="true"
      >
        {paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
      <div className="mm-side mm-side--l">{left.map((b, i) => renderBranch(b, "l", half + i))}</div>
      <div className="mm-center" data-mm-center>
        {map.center}
      </div>
      <div className="mm-side mm-side--r">{right.map((b, i) => renderBranch(b, "r", i))}</div>
    </div>
  );
}
