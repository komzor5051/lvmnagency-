import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ParticleEngine } from "./particles";
import {
  clusterMap,
  docRect,
  portraitMap,
  scatterMap,
  schemeMap,
  type DocRect,
  type PMap,
  type PortraitJson,
} from "./maps";

gsap.registerPlugin(ScrollTrigger);

const N = 3000;
const MIN_FPS = 40;

type Keyframe = { at: number; map: PMap; alpha: number };

/**
 * Wires the particle engine to the page scroll. Keyframes are recomputed from
 * `[data-stage]` anchor positions on every ScrollTrigger refresh, so the
 * choreography survives resizes and is fully reversible (scrub).
 *
 * Returns a cleanup function, or null if the required anchors are missing.
 */
export function initEngine(
  canvas: HTMLCanvasElement,
  json: PortraitJson
): (() => void) | null {
  const portraitEl = document.querySelector('[data-stage="portrait"]');
  const schemeEl = document.querySelector('[data-stage="scheme"]');
  const nodeEls = Array.from(document.querySelectorAll("[data-stage-node]"));
  const countersEl = document.querySelector('[data-stage="counters"]');
  const counterEls = Array.from(document.querySelectorAll("[data-stage-counter]"));
  const finalEl = document.querySelector('[data-stage="final"]');
  const finalImg = document.querySelector<HTMLElement>('[data-stage="final-img"]');
  if (!portraitEl || !schemeEl || nodeEls.length < 2 || !countersEl || !finalEl) {
    return null;
  }

  const engine = new ParticleEngine(canvas, N);
  let killed = false;
  let introDone = false;

  let keyframes: Keyframe[] = [];
  let finalFadeStart = 0;
  let finalFadeEnd = 0;

  const rebuild = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const rPortrait = docRect(portraitEl);
    const rScheme = docRect(schemeEl);
    const rNodes = nodeEls.map(docRect);
    const rCounters = docRect(countersEl);
    const rCounterVals: DocRect[] = counterEls.length
      ? counterEls.map(docRect)
      : [rCounters];
    const rFinal = docRect(finalEl);

    const mPortrait = portraitMap(json, rPortrait, N);
    const mScatter = scatterMap(
      N,
      vw,
      rPortrait.top + rPortrait.height * 0.5,
      Math.max(vh, rScheme.top - rPortrait.top),
      3
    );
    const mScheme = schemeMap(N, rNodes);
    const mCounters = clusterMap(N, rCounterVals);
    const mFinalScatter = scatterMap(N, vw, rFinal.top - vh * 0.6, vh * 1.2, 21);
    const mFinal = portraitMap(json, rFinal, N);

    const schemeIn = rScheme.top - vh; // scheme section enters viewport
    const countersIn = rCounters.top - vh;
    const finalIn = rFinal.top - vh;
    const maxScroll = ScrollTrigger.maxScroll(window);

    keyframes = [
      { at: 0, map: mPortrait, alpha: 1 },
      { at: Math.max(1, schemeIn), map: mScatter, alpha: 0.9 },
      { at: rScheme.top - vh * 0.45, map: mScheme, alpha: 1 },
      { at: Math.max(rScheme.top - vh * 0.4, countersIn), map: mScheme, alpha: 1 },
      { at: rCounters.top - vh * 0.5, map: mCounters, alpha: 1 },
      { at: rCounters.top - vh * 0.15, map: mCounters, alpha: 0 },
      { at: Math.max(rCounters.top, finalIn), map: mFinalScatter, alpha: 0 },
      { at: rFinal.top - vh * 0.55, map: mFinal, alpha: 1 },
      { at: Math.max(maxScroll, rFinal.top), map: mFinal, alpha: 1 },
    ];
    // Guard against non-monotonic stops on unusual layouts.
    for (let i = 1; i < keyframes.length; i++) {
      if (keyframes[i].at <= keyframes[i - 1].at) {
        keyframes[i].at = keyframes[i - 1].at + 1;
      }
    }
    finalFadeStart = rFinal.top - vh * 0.5;
    finalFadeEnd = rFinal.top - vh * 0.15;
  };

  const apply = () => {
    if (!introDone || killed) return;
    const y = window.scrollY;
    let i = 0;
    while (i < keyframes.length - 2 && y >= keyframes[i + 1].at) i++;
    const a = keyframes[i];
    const b = keyframes[i + 1];
    const t = Math.min(1, Math.max(0, (y - a.at) / (b.at - a.at)));
    engine.setSegment(a.map, b.map);
    engine.setT(t);
    engine.alpha = a.alpha + (b.alpha - a.alpha) * t;
    if (finalImg) {
      const p = Math.min(
        1,
        Math.max(0, (y - finalFadeStart) / (finalFadeEnd - finalFadeStart))
      );
      finalImg.style.opacity = String(p);
    }
  };

  rebuild();
  document.documentElement.dataset.canvas = "on";
  if (finalImg) finalImg.style.opacity = "0";
  engine.start();

  const cleanup = () => {
    if (killed) return;
    killed = true;
    trigger.kill();
    ScrollTrigger.removeEventListener("refresh", onRefresh);
    intro.kill();
    engine.destroy();
    delete document.documentElement.dataset.canvas;
    if (finalImg) finalImg.style.opacity = "";
  };

  // Low-FPS bailout: drop back to the static page.
  engine.onFps = (fps) => {
    if (fps < MIN_FPS) cleanup();
  };

  // Intro: 0.5s assemble from noise into the hero portrait.
  const noise = scatterMap(N, window.innerWidth, 0, window.innerHeight, 42);
  engine.setSegment(noise, keyframes[0].map);
  engine.setT(0);
  const intro = gsap.to(
    { t: 0 },
    {
      t: 1,
      duration: 0.5,
      ease: "power2.out",
      onUpdate() {
        engine.setT(this.targets()[0].t);
      },
      onComplete() {
        introDone = true;
        apply();
      },
    }
  );

  const onRefresh = () => {
    rebuild();
    apply();
  };
  ScrollTrigger.addEventListener("refresh", onRefresh);

  const trigger = ScrollTrigger.create({
    trigger: document.body,
    start: 0,
    end: "max",
    onUpdate: apply,
  });

  return cleanup;
}
