import { gsap } from "./gsap";
import { DUR, EASE, MAGNET, TILT_MAX } from "./tokens";
import { magnetOffset } from "./logic";

// Магнит для сплошных кнопок. Кнопки со своим магнитом (программа) помечены data-magnet="own".
export function bindMagnets(): () => void {
  const offs: Array<() => void> = [];
  document.querySelectorAll<HTMLElement>(".rz-btn--solid:not([data-magnet='own'])").forEach((btn) => {
    const toX = gsap.quickTo(btn, "x", { duration: 0.4, ease: EASE.out });
    const toY = gsap.quickTo(btn, "y", { duration: 0.4, ease: EASE.out });
    const onMove = (e: PointerEvent) => {
      const r = btn.getBoundingClientRect();
      const o = magnetOffset(
        e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2),
        r.width / 2, r.height / 2, MAGNET.radius, MAGNET.pull,
      );
      toX(o.x);
      toY(o.y);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    offs.push(() => {
      window.removeEventListener("pointermove", onMove);
      gsap.set(btn, { x: 0, y: 0 });
    });
  });
  return () => offs.forEach((fn) => fn());
}

// Наклон обложки за курсором: data-m-tilt на карточке, data-m-tilt-target на обложке.
export function bindTilts(): () => void {
  const offs: Array<() => void> = [];
  document.querySelectorAll<HTMLElement>("[data-m-tilt]").forEach((card) => {
    const target = card.querySelector<HTMLElement>("[data-m-tilt-target]");
    if (!target) return;
    gsap.set(target, { transformPerspective: 800 });
    const rx = gsap.quickTo(target, "rotationX", { duration: DUR.base, ease: EASE.out });
    const ry = gsap.quickTo(target, "rotationY", { duration: DUR.base, ease: EASE.out });
    const move = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      ry(px * 2 * TILT_MAX);
      rx(-py * 2 * TILT_MAX);
    };
    const leave = () => { rx(0); ry(0); };
    card.addEventListener("pointermove", move, { passive: true });
    card.addEventListener("pointerleave", leave);
    offs.push(() => {
      card.removeEventListener("pointermove", move);
      card.removeEventListener("pointerleave", leave);
      gsap.set(target, { rotationX: 0, rotationY: 0 });
    });
  });
  return () => offs.forEach((fn) => fn());
}
