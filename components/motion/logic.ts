// Чистая логика движения: без DOM и GSAP, поэтому покрыта тестами.

export type Tier = "full" | "touch" | "off";
export type MotionKind = "lines" | "reveal" | "stagger" | "mark" | "count" | "parallax" | "pin" | "draw";

const KINDS: readonly MotionKind[] = ["lines", "reveal", "stagger", "mark", "count", "parallax", "pin", "draw"];

export function isMotionKind(v: string | undefined): v is MotionKind {
  return v !== undefined && (KINDS as readonly string[]).includes(v);
}

export function resolveTier(env: { reduced: boolean; finePointer: boolean }): Tier {
  if (env.reduced) return "off";
  return env.finePointer ? "full" : "touch";
}

// Пин и скраб во встроенном браузере Instagram дёргают скролл.
// На таче пин-сцена становится каскадом, параллакс и линия стоят на месте.
const TOUCH_FALLBACK: Partial<Record<MotionKind, MotionKind | null>> = {
  pin: "stagger",
  parallax: null,
  draw: null,
};

export function effectiveKind(kind: MotionKind, tier: Tier): MotionKind | null {
  if (tier === "off") return null;
  if (tier === "touch" && kind in TOUCH_FALLBACK) return TOUCH_FALLBACK[kind] ?? null;
  return kind;
}

export type CountParts = { prefix: string; value: number; suffix: string; sep: string | null };

// Разделитель разрядов: пробел, неразрывный или узкий неразрывный.
const COUNT_RE = /^([^\d]*?)(\d{1,3}(?:[   ]\d{3})+|\d+)([\s\S]*)$/;

export function parseCount(text: string): CountParts | null {
  const m = text.match(COUNT_RE);
  if (!m) return null;
  const raw = m[2];
  const digits = raw.replace(/[   ]/g, "");
  const sep = digits.length === raw.length ? null : raw.charAt(raw.search(/[   ]/));
  return { prefix: m[1], value: Number(digits), suffix: m[3], sep };
}

// Год считаем от близкого значения, иначе 2022 бежит от нуля две секунды.
export function countFrom(value: number): number {
  return value >= 1900 && value <= 2100 ? value - 24 : 0;
}

export function formatCount(n: number, parts: CountParts): string {
  let body = String(Math.round(n));
  if (parts.sep) body = body.replace(/\B(?=(\d{3})+(?!\d))/g, parts.sep);
  return `${parts.prefix}${body}${parts.suffix}`;
}

// Диагональный каскад: элемент (строка r, колонка c) стартует через (r + c) шагов.
export function gridDelay(index: number, columns: number, step: number): number {
  const cols = Math.max(1, columns);
  return (Math.floor(index / cols) + (index % cols)) * step;
}

export function magnetOffset(
  dx: number, dy: number, halfW: number, halfH: number, radius: number, pull: number,
): { x: number; y: number } {
  const reachX = radius + halfW;
  const reachY = radius + halfH;
  if (Math.hypot(dx, dy) > reachX) return { x: 0, y: 0 };
  return { x: (dx / reachX) * pull, y: (dy / reachY) * pull };
}

export function navShouldHide(s: { y: number; direction: number; menuOpen: boolean; threshold: number }): boolean {
  return !s.menuOpen && s.y > s.threshold && s.direction === 1;
}

export function num(v: string | undefined, fallback: number): number {
  if (v === undefined) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}
