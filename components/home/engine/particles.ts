import type { PMap } from "./maps";

const INK = "#111111";
const LIME = "#A8D030";
const LIME_EVERY = 17; // every 17th particle is lime, matches the static PNG

/**
 * Vanilla 2D-canvas particle engine. Holds current positions and eases them
 * toward a target interpolated between two maps (document coordinates);
 * renders in viewport space by subtracting scrollY.
 */
export class ParticleEngine {
  readonly n: number;
  alpha = 1;
  /** Called once with the average FPS over the first ~30 frames. */
  onFps?: (fps: number) => void;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cur: Float32Array; // x, y, r per particle
  private a: PMap | null = null;
  private b: PMap | null = null;
  private t = 0;
  private raf = 0;
  private last = 0;
  private frames = 0;
  private fpsStart = 0;
  private fpsReported = false;
  private seeds: Float32Array;
  private resize: () => void;

  constructor(canvas: HTMLCanvasElement, n: number) {
    this.canvas = canvas;
    this.n = n;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) throw new Error("2d context unavailable");
    this.ctx = ctx;

    this.cur = new Float32Array(n * 3);
    this.seeds = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      this.cur[i * 3] = Math.random() * window.innerWidth;
      this.cur[i * 3 + 1] = Math.random() * window.innerHeight;
      this.cur[i * 3 + 2] = 1;
      this.seeds[i] = Math.random() * Math.PI * 2;
    }

    this.resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    this.resize();
    window.addEventListener("resize", this.resize);
  }

  setSegment(a: PMap | null, b: PMap | null) {
    this.a = a;
    this.b = b;
  }

  setT(t: number) {
    this.t = Math.min(1, Math.max(0, t));
  }

  start() {
    this.last = performance.now();
    this.fpsStart = this.last;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      this.tick(dt, now / 1000);
      this.render();
      if (!this.fpsReported) {
        this.frames++;
        const elapsed = now - this.fpsStart;
        if (elapsed >= 500) {
          this.fpsReported = true;
          this.onFps?.((this.frames * 1000) / elapsed);
        }
      }
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.resize);
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  private tick(dt: number, time: number) {
    const { a, b, t, cur, seeds } = this;
    if (!a && !b) return;
    const ease = 1 - Math.exp(-dt * 7);
    for (let i = 0; i < this.n; i++) {
      const j = i * 3;
      let tx: number, ty: number, tr: number;
      if (a && b) {
        tx = a[j] + (b[j] - a[j]) * t;
        ty = a[j + 1] + (b[j + 1] - a[j + 1]) * t;
        tr = a[j + 2] + (b[j + 2] - a[j + 2]) * t;
      } else {
        const m = (a ?? b)!;
        tx = m[j];
        ty = m[j + 1];
        tr = m[j + 2];
      }
      // Gentle organic drift so resting particles never look frozen.
      const s = seeds[i];
      tx += Math.sin(time * 0.9 + s) * 1.6;
      ty += Math.cos(time * 0.7 + s * 1.3) * 1.6;

      cur[j] += (tx - cur[j]) * ease;
      cur[j + 1] += (ty - cur[j + 1]) * ease;
      cur[j + 2] += (tr - cur[j + 2]) * ease;
    }
  }

  private render() {
    const { ctx, cur } = this;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const sy = window.scrollY;
    ctx.clearRect(0, 0, w, h);
    if (this.alpha <= 0.01) return;
    ctx.globalAlpha = this.alpha;

    // Two passes batched by colour — cheaper than per-particle fillStyle swaps.
    for (const lime of [false, true]) {
      ctx.fillStyle = lime ? LIME : INK;
      ctx.beginPath();
      for (let i = 0; i < this.n; i++) {
        if ((i % LIME_EVERY === 0) !== lime) continue;
        const j = i * 3;
        const y = cur[j + 1] - sy;
        if (y < -8 || y > h + 8) continue;
        const x = cur[j];
        if (x < -8 || x > w + 8) continue;
        const r = cur[j + 2];
        ctx.moveTo(x + r, y);
        ctx.arc(x, y, r, 0, Math.PI * 2);
      }
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}
