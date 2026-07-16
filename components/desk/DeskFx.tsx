"use client";
import { useEffect } from "react";
import { animate, svg, onScroll, stagger } from "animejs";

/**
 * Desk DS animation runtime (anime.js v4). One instance per page.
 * Conventions (see docs/design-concepts/variant-b2-desk.html):
 *  - [data-rv]                       fade-in when scrolled into view
 *  - [data-desk-hero] [data-depth]   parallax above the desk (data-rot keeps CSS rotation)
 *  - .draw-hero                      SVG strokes drawn on load (staggered)
 *  - .draw-visible                   SVG strokes drawn when scrolled into view
 *  - #desk-proc-path                 dashed path scrubbed by scroll
 *  - [data-counter]                  number counts up when visible
 *  - [data-tilt]                     pointer tilt on the inner <img>
 */
export default function DeskFx() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("js-desk");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anims: any[] = [];
    const observers: IntersectionObserver[] = [];

    // Scroll reveals (opacity only — rotations live in CSS transforms).
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          anims.push(animate(e.target, { opacity: [0, 1], duration: 900, ease: "outExpo" }));
        });
      },
      { threshold: 0.12 },
    );
    document.querySelectorAll("[data-rv]").forEach((el) => io.observe(el));
    observers.push(io);

    // Depth parallax above the desk. Desktop-only: on small screens the hero
    // elements sit in static flow and translating them breaks the layout.
    const depthEls = matchMedia("(min-width: 769px)").matches
      ? document.querySelectorAll<HTMLElement>("[data-desk-hero] [data-depth]")
      : [];
    depthEls.forEach((el) => {
      const depth = parseFloat(el.dataset.depth || "0");
      const rot = parseFloat(el.dataset.rot || "0");
      try {
        anims.push(
          animate(el, {
            rotate: rot,
            translateY: [0, -120 * depth],
            ease: "linear",
            autoplay: onScroll({
              target: "[data-desk-hero]",
              enter: "top top",
              leave: "bottom top",
              sync: 0.4,
            }),
          }),
        );
      } catch {
        /* parallax is decorative */
      }
    });

    // Hand-drawn strokes on load.
    try {
      anims.push(
        animate(svg.createDrawable(".draw-hero"), {
          draw: ["0 0", "0 1"],
          duration: 1000,
          delay: stagger(350, { start: 600 }),
          ease: "inOutQuad",
        }),
      );
    } catch {
      /* no hero strokes on this page */
    }

    // Strokes drawn when their section becomes visible.
    document.querySelectorAll(".draw-visible").forEach((path) => {
      try {
        const drawable = svg.createDrawable(path as SVGPathElement);
        const dio = new IntersectionObserver(
          (es) => {
            es.forEach((e) => {
              if (!e.isIntersecting) return;
              dio.disconnect();
              anims.push(animate(drawable, { draw: ["0 0", "0 1"], duration: 900, ease: "inOutQuad" }));
            });
          },
          { threshold: 0.5 },
        );
        dio.observe(path.closest("section") || path);
        observers.push(dio);
      } catch {
        /* decorative */
      }
    });

    // Process dashed path scrubbed by scroll.
    if (document.querySelector("#desk-proc-path")) {
      try {
        anims.push(
          animate(svg.createDrawable("#desk-proc-path"), {
            draw: ["0 0", "0 1"],
            ease: "linear",
            autoplay: onScroll({
              target: "[data-desk-proc]",
              enter: "bottom top+=120",
              leave: "center center",
              sync: 0.3,
            }),
          }),
        );
      } catch {
        /* decorative */
      }
    }

    // Count-up numbers.
    document.querySelectorAll<HTMLElement>("[data-counter]").forEach((el) => {
      const target = parseInt(el.dataset.counter || el.textContent || "0", 10);
      const obj = { n: 0 };
      const cio = new IntersectionObserver(
        (es) => {
          es.forEach((e) => {
            if (!e.isIntersecting) return;
            cio.disconnect();
            anims.push(
              animate(obj, {
                n: target,
                duration: 1400,
                ease: "outExpo",
                onUpdate: () => {
                  el.textContent = String(Math.round(obj.n));
                },
              }),
            );
          });
        },
        { threshold: 0.4 },
      );
      cio.observe(el);
      observers.push(cio);
    });

    // Pointer tilt on paper photos.
    const tiltCleanups: Array<() => void> = [];
    document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((holder) => {
      const img = holder.querySelector("img");
      if (!img) return;
      img.style.transition = "transform .15s ease-out";
      const move = (ev: PointerEvent) => {
        const r = holder.getBoundingClientRect();
        const rx = ((ev.clientY - r.top) / r.height - 0.5) * -6;
        const ry = ((ev.clientX - r.left) / r.width - 0.5) * 6;
        img.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      };
      const leave = () => {
        img.style.transform = "none";
      };
      holder.addEventListener("pointermove", move);
      holder.addEventListener("pointerleave", leave);
      tiltCleanups.push(() => {
        holder.removeEventListener("pointermove", move);
        holder.removeEventListener("pointerleave", leave);
      });
    });

    // Scroll sway: papers wobble with scroll velocity, as if pinned to the desk
    // and nudged by the movement. Composes with each element's own rotation:
    // the static base transform is baked in, Tailwind v4 rotate-* utilities use
    // the separate `rotate` property and are untouched. Elements whose transform
    // anime.js owns (hero depth parallax) and the fixed nav are excluded.
    const swayItems = Array.from(
      document.querySelectorAll<HTMLElement>(".desk-sheet, .desk-sheet--high, .desk-sheet--low"),
    )
      .filter((el) => !el.hasAttribute("data-depth") && !el.closest("nav"))
      .map((el, i) => {
        const computed = getComputedStyle(el).transform;
        // Same sign for every sheet — one gust swings all papers the same
        // way; only the amplitude varies so they don't move in lockstep.
        return {
          el,
          base: computed === "none" ? "" : computed,
          factor: 0.65 + ((i * 7) % 5) * 0.14,
        };
      });
    // Under-damped spring driven by scroll velocity (sampled per frame, so it
    // works with Lenis smooth scrolling): a flick pushes the papers over, they
    // overshoot and wobble back like paper caught by wind.
    let sway = 0; // current deflection, deg
    let swayVel = 0; // deg/s
    let gust = 0; // smoothed wind push from scroll velocity, deg
    let swayActive = false;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let swayRaf = 0;
    const swayLoop = (now: number) => {
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;
      const y = window.scrollY;
      const v = dt > 0 ? (y - lastY) / dt : 0; // px/s
      lastY = y;
      const push = Math.max(-5, Math.min(5, v * 0.0045));
      gust += (push - gust) * Math.min(1, dt * 18);
      const acc = (gust - sway) * 130 - swayVel * 6;
      swayVel += acc * dt;
      sway += swayVel * dt;
      const moving = Math.abs(sway) > 0.02 || Math.abs(swayVel) > 0.2 || Math.abs(gust) > 0.02;
      if (moving) {
        if (!swayActive) {
          swayActive = true;
          // CSS transitions (e.g. hover transition-transform on cards) would
          // low-pass the per-frame writes down to nothing — pause them.
          for (const it of swayItems) it.el.style.transitionProperty = "none";
        }
        for (const it of swayItems) {
          it.el.style.transform = `${it.base} rotate(${(sway * it.factor).toFixed(3)}deg)`;
        }
      } else if (swayActive) {
        swayActive = false;
        // Settled: hand transform/transitions back to CSS so hover states work.
        for (const it of swayItems) {
          it.el.style.transform = "";
          it.el.style.transitionProperty = "";
        }
      }
      swayRaf = requestAnimationFrame(swayLoop);
    };
    if (swayItems.length) {
      swayRaf = requestAnimationFrame(swayLoop);
    }

    return () => {
      cancelAnimationFrame(swayRaf);
      swayItems.forEach((it) => {
        it.el.style.transform = "";
      });
      observers.forEach((o) => o.disconnect());
      tiltCleanups.forEach((fn) => fn());
      anims.forEach((a) => {
        try {
          a.cancel();
        } catch {
          /* already finished */
        }
      });
      document.documentElement.classList.remove("js-desk");
    };
  }, []);

  return null;
}
