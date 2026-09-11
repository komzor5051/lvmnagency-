import type { gsap } from "./gsap";

// Все части hero, которые участвуют в стартовой сцене. Элементы уже скрыты
// через gsap.set, задача этой функции — только порядок и тайминги.
export type HeroParts = {
  eyebrow: HTMLElement;
  lines: Element[]; // строки заголовка, каждая в своей маске
  mark: HTMLElement; // лаймовый маркер под «личную»
  lead: HTMLElement;
  acts: HTMLElement;
  facts: HTMLElement[]; // три цифры справа
  countUp: (target: HTMLElement) => gsap.core.Tween; // набегание цифры
};

// Хореография hero. Единственное место, где решает вкус, а не инженерия.
// Позиционный параметр ("-=0.4") задаёт, насколько следующий шаг
// накладывается на предыдущий. Чем больше перекрытие, тем плотнее ритм.
export function heroChoreography(tl: gsap.core.Timeline, p: HeroParts): gsap.core.Timeline {
  tl.to(p.eyebrow, { autoAlpha: 1, duration: 0.6 }, 0.1)
    .to(p.lines, { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.09 }, 0.15)
    .to(p.mark, { backgroundSize: "100% .66em", duration: 0.7, ease: "power3.inOut" }, "-=0.55")
    .to(p.lead, { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.5")
    .to(p.acts, { autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.45")
    .to(p.facts, { autoAlpha: 1, duration: 0.5, stagger: 0.1 }, "-=0.4");
  p.facts.forEach((f, i) => tl.add(p.countUp(f), `-=${0.9 - i * 0.1}`));
  return tl;
}
