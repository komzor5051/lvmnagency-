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

    return () => {
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
