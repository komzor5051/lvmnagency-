import { gsap, SplitText } from "./gsap";
import { DUR, EASE, STAGGER, RISE, TRIGGER_START } from "./tokens";
import { parseCount, formatCount, countFrom, gridDelay, num, type MotionKind } from "./logic";
import { scenes } from "./scenes";

export type RunCtx = {
  tier: "full" | "touch";
  // Оборачивает отложенный колбэк (например, после загрузки шрифтов),
  // чтобы созданные в нём твины откатились вместе с контекстом useGSAP.
  safe: (fn: () => void) => () => void;
  onCleanup: (fn: () => void) => void;
};

// .is-in снимает CSS-страховку первого экрана (razvorot.css, data-m-hero).
export function markIn(el: Element): void {
  el.classList.add("is-in");
}

const CLEAR = "transform,opacity,visibility";
const enter = (trigger: Element) => ({ trigger, start: TRIGGER_START, once: true });

function reveal(el: HTMLElement, ctx: RunCtx): void {
  gsap.from(el, {
    autoAlpha: 0, y: RISE[ctx.tier], duration: DUR.base, ease: EASE.out,
    delay: num(el.dataset.mDelay, 0), clearProps: CLEAR,
    scrollTrigger: enter(el), onComplete: () => markIn(el),
  });
}

function columnsOf(el: HTMLElement): number {
  const cs = getComputedStyle(el);
  if (!cs.display.includes("grid")) return 1;
  return cs.gridTemplateColumns.split(" ").filter(Boolean).length || 1;
}

// Элементы каскада: явно помеченные [data-m-item] или прямые потомки.
function stagger(el: HTMLElement, ctx: RunCtx): void {
  const marked = el.querySelectorAll<HTMLElement>("[data-m-item]");
  const items = marked.length ? Array.from(marked) : (Array.from(el.children) as HTMLElement[]);
  if (!items.length) return markIn(el);
  const cols = columnsOf(el);
  const step = num(el.dataset.mStep, STAGGER.items);
  gsap.from(items, {
    autoAlpha: 0, y: RISE[ctx.tier], duration: DUR.base, ease: EASE.out,
    delay: num(el.dataset.mDelay, 0), stagger: (i: number) => gridDelay(i, cols, step),
    clearProps: CLEAR, scrollTrigger: enter(el), onComplete: () => markIn(el),
  });
}

// Строки заголовка выезжают из масок. Лаймовый маркер внутри дорисовывается
// после строк: SplitText пересобирает разметку, поэтому маркер ищем уже в ней.
function lines(el: HTMLElement, ctx: RunCtx): void {
  gsap.set(el, { autoAlpha: 0 });
  document.fonts.ready.then(ctx.safe(() => {
    const split = SplitText.create(el, { type: "lines", mask: "lines", autoSplit: false });
    ctx.onCleanup(() => split.revert());
    const liveMark = el.querySelector<HTMLElement>(".rz-mark");
    gsap.set(el, { autoAlpha: 1 });
    if (liveMark) gsap.set(liveMark, { "--mark-w": "0%" });
    const tl = gsap.timeline({
      scrollTrigger: enter(el),
      onComplete: () => { split.revert(); markIn(el); },
    });
    tl.from(split.lines, { yPercent: 110, duration: DUR.slow, ease: EASE.lines, stagger: STAGGER.lines });
    if (liveMark) tl.to(liveMark, { "--mark-w": "100%", duration: 0.75, ease: "power2.inOut" }, "-=0.45");
  }));
}

function mark(el: HTMLElement): void {
  const target = el.classList.contains("rz-mark") ? el : el.querySelector<HTMLElement>(".rz-mark");
  if (!target) return markIn(el);
  gsap.fromTo(target, { "--mark-w": "0%" }, {
    "--mark-w": "100%", duration: 0.9, ease: EASE.inOut,
    scrollTrigger: enter(el), onComplete: () => markIn(el),
  });
}

// Только для листовых элементов с текстом: textContent затирает детей.
function count(el: HTMLElement, ctx: RunCtx): void {
  const original = el.textContent ?? "";
  const parts = parseCount(original);
  if (!parts) return markIn(el);
  const state = { v: countFrom(parts.value) };
  const paint = () => { el.textContent = formatCount(state.v, parts); };
  paint();
  ctx.onCleanup(() => { el.textContent = original; });
  gsap.to(state, {
    v: parts.value, duration: DUR.count, ease: EASE.out, onUpdate: paint,
    scrollTrigger: enter(el), onComplete: () => markIn(el),
  });
}

// Картинка движется внутри родителя с overflow: hidden. Масштаб прячет края.
function parallax(el: HTMLElement): void {
  const depth = num(el.dataset.mDepth, 12);
  const scale = 1 + depth / 50;
  gsap.fromTo(el, { yPercent: -depth, scale }, {
    yPercent: depth, scale, ease: "none",
    scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
  });
}

function draw(el: HTMLElement): void {
  gsap.fromTo(el, { scaleY: 0 }, {
    scaleY: 1, ease: "none",
    scrollTrigger: { trigger: el.parentElement ?? el, start: "top 75%", end: "bottom 60%", scrub: true },
  });
}

function pin(el: HTMLElement): void {
  const scene = scenes[el.dataset.mScene ?? ""];
  if (!scene) {
    console.warn(`[motion] неизвестная сцена "${el.dataset.mScene}"`);
    return;
  }
  scene(el);
}

export const runners: Record<MotionKind, (el: HTMLElement, ctx: RunCtx) => void> = {
  lines, reveal, stagger, mark, count, parallax, draw, pin,
};
