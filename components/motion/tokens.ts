// Единственный источник таймингов движения. CSS-зеркало — переменные
// --rz-ease, --rz-ease-in-out, --rz-dur-fast, --rz-dur-base в razvorot.css.
export const DUR = { fast: 0.35, base: 0.7, slow: 1.1, count: 1.6 } as const;
export const EASE = { out: "power3.out", inOut: "power4.inOut", lines: "power4.out" } as const;
export const STAGGER = { items: 0.08, lines: 0.12 } as const;
// Подъём при входе. На телефоне короче: длинный путь на маленьком экране читается как рывок.
export const RISE = { full: 32, touch: 20 } as const;
export const TRIGGER_START = "top 85%";
export const TILT_MAX = 6; // градусов, наклон обложки за курсором
export const MAGNET = { radius: 110, pull: 12 } as const;
export const NAV_HIDE_AFTER = 120; // px, раньше шапку не прячем
