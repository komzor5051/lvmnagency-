/**
 * Target maps for the particle engine. A map is a packed Float32Array of
 * [x, y, r] triplets in DOCUMENT pixel coordinates (the engine subtracts
 * scrollY at render time — the canvas itself is fixed to the viewport).
 */

export type PMap = Float32Array;

export type PortraitJson = { aspect: number; pts: number[] };

export type DocRect = { left: number; top: number; width: number; height: number };

/** getBoundingClientRect → document coordinates. */
export function docRect(el: Element): DocRect {
  const r = el.getBoundingClientRect();
  return {
    left: r.left + window.scrollX,
    top: r.top + window.scrollY,
    width: r.width,
    height: r.height,
  };
}

/** Deterministic LCG so maps are stable across rebuilds. */
function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/** Portrait halftone points contain-fitted into rect. */
export function portraitMap(json: PortraitJson, rect: DocRect, n: number): PMap {
  const boxW = Math.min(rect.width, rect.height / json.aspect);
  const boxH = boxW * json.aspect;
  const ox = rect.left + (rect.width - boxW) / 2;
  const oy = rect.top + (rect.height - boxH) / 2;
  const src = json.pts;
  const m = src.length / 3;
  // Dot radius scales with the rendered box (72 = build-time grid columns).
  const rScale = (boxW / 72) * 0.48;
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const j = (i % m) * 3;
    out[i * 3] = ox + src[j] * boxW;
    out[i * 3 + 1] = oy + src[j + 1] * boxH;
    out[i * 3 + 2] = Math.max(0.6, src[j + 2] * rScale);
  }
  return out;
}

/** Random scatter across a horizontal band of the document. */
export function scatterMap(
  n: number,
  width: number,
  docTop: number,
  height: number,
  seed = 1
): PMap {
  const rnd = rng(seed);
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    out[i * 3] = rnd() * width;
    out[i * 3 + 1] = docTop + rnd() * height;
    out[i * 3 + 2] = 0.6 + rnd() * 1.6;
  }
  return out;
}

/**
 * Pipeline scheme: ~70% of particles sit on node box perimeters,
 * ~30% flow along the edges connecting consecutive nodes.
 */
export function schemeMap(n: number, nodes: DocRect[], seed = 7): PMap {
  const rnd = rng(seed);
  const out = new Float32Array(n * 3);
  const nodeShare = Math.floor(n * 0.7);

  for (let i = 0; i < nodeShare; i++) {
    const b = nodes[i % nodes.length];
    const per = 2 * (b.width + b.height);
    let d = rnd() * per;
    let x = b.left;
    let y = b.top;
    if (d < b.width) {
      x = b.left + d;
    } else if ((d -= b.width) < b.height) {
      x = b.left + b.width;
      y = b.top + d;
    } else if ((d -= b.height) < b.width) {
      x = b.left + b.width - d;
      y = b.top + b.height;
    } else {
      y = b.top + b.height - (d - b.width);
    }
    out[i * 3] = x + (rnd() - 0.5) * 3;
    out[i * 3 + 1] = y + (rnd() - 0.5) * 3;
    out[i * 3 + 2] = 0.8 + rnd() * 1.2;
  }

  for (let i = nodeShare; i < n; i++) {
    const e = i % (nodes.length - 1);
    const a = nodes[e];
    const b = nodes[e + 1];
    const t = rnd();
    const ax = a.left + a.width;
    const ay = a.top + a.height / 2;
    const bx = b.left;
    const by = b.top + b.height / 2;
    out[i * 3] = ax + (bx - ax) * t;
    out[i * 3 + 1] = ay + (by - ay) * t + (rnd() - 0.5) * 6;
    out[i * 3 + 2] = 0.7 + rnd() * 1.0;
  }
  return out;
}

/** Particles clustered around rect centers (counter "impact"). */
export function clusterMap(n: number, rects: DocRect[], seed = 13): PMap {
  const rnd = rng(seed);
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const b = rects[i % rects.length];
    const cx = b.left + b.width / 2;
    const cy = b.top + b.height / 2;
    // Rough gaussian via sum of two uniforms.
    const gx = (rnd() + rnd() - 1) * b.width * 1.1;
    const gy = (rnd() + rnd() - 1) * b.height * 1.4;
    out[i * 3] = cx + gx;
    out[i * 3 + 1] = cy + gy;
    out[i * 3 + 2] = 0.7 + rnd() * 1.3;
  }
  return out;
}
