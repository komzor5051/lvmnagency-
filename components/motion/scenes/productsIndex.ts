import { gsap } from "../gsap";

// Каталог главной на десктопе: блок закреплён, скролл по очереди делает
// строку активной — лаймовая полоса слева (--row-bar) и полная яркость.
// Последняя строка остаётся активной, после неё пин отпускается.
export function productsIndex(el: HTMLElement): void {
  const rows = Array.from(el.querySelectorAll<HTMLElement>(".rz-row"));
  if (rows.length < 2) return;
  gsap.set(rows, { opacity: 0.45, "--row-bar": 0 });
  const tl = gsap.timeline({
    defaults: { duration: 0.5, ease: "none" },
    scrollTrigger: { trigger: el, start: "top 20%", end: `+=${rows.length * 45}%`, pin: true, scrub: 0.4 },
  });
  rows.forEach((row, i) => {
    tl.to(row, { opacity: 1, "--row-bar": 1 }, i);
    if (i < rows.length - 1) tl.to(row, { opacity: 0.45, "--row-bar": 0 }, i + 0.75);
  });
}
