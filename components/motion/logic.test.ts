import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isMotionKind, resolveTier, effectiveKind, parseCount, countFrom, formatCount,
  gridDelay, magnetOffset, navShouldHide, num,
} from "./logic";

test("isMotionKind знает все типы и отсекает мусор", () => {
  for (const k of ["lines", "reveal", "stagger", "mark", "count", "parallax", "pin", "draw"]) {
    assert.equal(isMotionKind(k), true, k);
  }
  assert.equal(isMotionKind("fade"), false);
  assert.equal(isMotionKind(undefined), false);
});

test("resolveTier: reduced-motion важнее указателя", () => {
  assert.equal(resolveTier({ reduced: true, finePointer: true }), "off");
  assert.equal(resolveTier({ reduced: false, finePointer: true }), "full");
  assert.equal(resolveTier({ reduced: false, finePointer: false }), "touch");
});

test("effectiveKind: на таче тяжёлые сцены упрощаются", () => {
  assert.equal(effectiveKind("pin", "touch"), "stagger");
  assert.equal(effectiveKind("parallax", "touch"), null);
  assert.equal(effectiveKind("draw", "touch"), null);
  assert.equal(effectiveKind("lines", "touch"), "lines");
  assert.equal(effectiveKind("pin", "full"), "pin");
  assert.equal(effectiveKind("reveal", "off"), null);
});

test("parseCount: простое число, суффикс, группировка разрядов", () => {
  assert.deepEqual(parseCount("590 ₽"), { prefix: "", value: 590, suffix: " ₽", sep: null });
  assert.deepEqual(parseCount("50+"), { prefix: "", value: 50, suffix: "+", sep: null });
  assert.deepEqual(parseCount("10\u00a0000 ₽/мес"), { prefix: "", value: 10000, suffix: " ₽/мес", sep: "\u00a0" });
  assert.deepEqual(parseCount("25\u00a0000 ₽"), { prefix: "", value: 25000, suffix: " ₽", sep: "\u00a0" });
  assert.deepEqual(parseCount("от 3\u00a0850 ₽"), { prefix: "от ", value: 3850, suffix: " ₽", sep: "\u00a0" });
  assert.deepEqual(parseCount("2023–24"), { prefix: "", value: 2023, suffix: "–24", sep: null });
  assert.equal(parseCount("Сейчас"), null);
  assert.equal(parseCount(""), null);
  assert.deepEqual(parseCount("10 000 ₽"), { prefix: "", value: 10000, suffix: " ₽", sep: " " });
  assert.deepEqual(parseCount("1 000"), { prefix: "", value: 1000, suffix: "", sep: " " });
});

test("countFrom: годы бегут от близкого значения, остальное от нуля", () => {
  assert.equal(countFrom(2022), 1998);
  assert.equal(countFrom(590), 0);
  assert.equal(countFrom(10000), 0);
});

test("formatCount восстанавливает исходный вид", () => {
  const p = parseCount("10\u00a0000 ₽/мес")!;
  assert.equal(formatCount(10000, p), "10\u00a0000 ₽/мес");
  assert.equal(formatCount(999.6, p), "1\u00a0000 ₽/мес");
  assert.equal(formatCount(0, p), "0 ₽/мес");
  const y = parseCount("2022")!;
  assert.equal(formatCount(2022, y), "2022");
  const nb = parseCount("25\u00a0000 ₽")!;
  assert.equal(formatCount(25000, nb), "25\u00a0000 ₽");
});

test("gridDelay: диагональ по строке и колонке", () => {
  assert.equal(gridDelay(0, 2, 0.1), 0);
  assert.equal(gridDelay(1, 2, 0.1), 0.1);
  assert.equal(gridDelay(2, 2, 0.1), 0.1);
  assert.ok(Math.abs(gridDelay(3, 2, 0.1) - 0.2) < 1e-9);
  assert.ok(Math.abs(gridDelay(3, 1, 0.1) - 0.3) < 1e-9);
  assert.equal(gridDelay(5, 0, 0.1), gridDelay(5, 1, 0.1));
});

test("magnetOffset: тянет внутри зоны, отпускает снаружи", () => {
  assert.deepEqual(magnetOffset(500, 0, 50, 20, 110, 12), { x: 0, y: 0 });
  const o = magnetOffset(80, 65, 50, 20, 110, 12);
  assert.ok(Math.abs(o.x - 6) < 1e-9);
  assert.ok(Math.abs(o.y - 6) < 1e-9);
});

test("navShouldHide: только вниз, только после порога, не при открытом меню", () => {
  const base = { threshold: 120, menuOpen: false };
  assert.equal(navShouldHide({ ...base, y: 400, direction: 1 }), true);
  assert.equal(navShouldHide({ ...base, y: 400, direction: -1 }), false);
  assert.equal(navShouldHide({ ...base, y: 80, direction: 1 }), false);
  assert.equal(navShouldHide({ ...base, y: 400, direction: 1, menuOpen: true }), false);
});

test("num: читает data-атрибут с запасным значением", () => {
  assert.equal(num("0.15", 0), 0.15);
  assert.equal(num(undefined, 12), 12);
  assert.equal(num("abc", 3), 3);
});
