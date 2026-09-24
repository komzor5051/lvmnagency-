"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger, useGSAP, prefersReducedMotion } from "@/components/motion/gsap";
import { navShouldHide } from "@/components/motion/logic";
import { NAV_HIDE_AFTER } from "@/components/motion/tokens";
import "./nav.css";

const links = [
  { href: "/#products", label: "Продукты" },
  { href: "/about", label: "Обо мне" },
  { href: "/blog", label: "Блог" },
  { href: "/audit", label: "Аудит" },
];

export default function StudioNav() {
  const [open, setOpen] = useState(false);
  const shell = useRef<HTMLElement>(null);

  // Шапка уходит вверх при скролле вниз и возвращается при скролле вверх.
  // Класс, а не твин: переход задан в CSS и отключается reduced-motion.
  useGSAP(() => {
    const el = shell.current;
    if (!el || prefersReducedMotion()) return;
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        el.classList.toggle("is-hidden", navShouldHide({
          y: self.scroll(),
          direction: self.direction,
          menuOpen: document.body.classList.contains("rz-menu-open"),
          threshold: NAV_HIDE_AFTER,
        }));
      },
    });
  });

  useEffect(() => {
    document.body.classList.toggle("rz-menu-open", open);
    return () => document.body.classList.remove("rz-menu-open");
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header className="kn-shell" ref={shell}>
        <nav className="kn-bar" aria-label="Основная навигация">
          <Link className="kn-brand" href="/" aria-label="Влад Лямин — на главную" onClick={close}>
            Влад Лямин
          </Link>

          <div className="kn-links">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={close}>
                {link.label}
              </Link>
            ))}
          </div>

          <Link className="k-btn k-btn--solid kn-cta" href="/products/guide" onClick={close}>
            Начать с гайда
          </Link>

          <button
            className={`kn-toggle ${open ? "is-open" : ""}`}
            type="button"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            aria-controls="rz-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </nav>
      </header>

      <div id="rz-menu" className={`kn-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        {links.map((link) => (
          <Link key={link.href} href={link.href} onClick={close}>
            {link.label}
          </Link>
        ))}
        <Link className="k-btn k-btn--solid" href="/products/guide" onClick={close}>
          Начать с гайда
        </Link>
      </div>
    </>
  );
}
