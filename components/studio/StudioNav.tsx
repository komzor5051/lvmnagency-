"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/#systems", label: "Как работаю" },
  { href: "/about", label: "Обо мне" },
  { href: "/blog", label: "Блог" },
  { href: "/audit", label: "AI-аудит" },
];

function Mark() {
  return (
    <span className="studio-mark" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

export default function StudioNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("studio-menu-open", open);
    return () => document.body.classList.remove("studio-menu-open");
  }, [open]);

  return (
    <>
      <header className="studio-nav-shell">
        <nav className="studio-nav bento-nav" aria-label="Основная навигация">
          <Link className="studio-brand" href="/" aria-label="Влад Лямин — на главную" onClick={() => setOpen(false)}>
            <Mark />
            <span>
              Влад Лямин
              <small>AI для работы и бизнеса</small>
            </span>
          </Link>

          <div className="studio-nav-links">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
          </div>

          <Link className="studio-nav-cta bento-nav-cta" href="/products" onClick={() => setOpen(false)}>
            Продукты <span aria-hidden="true">→</span>
          </Link>

          <button
            className={`studio-menu-toggle ${open ? "is-open" : ""}`}
            type="button"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </nav>
      </header>

      <div className={`studio-mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div>
          {links.map((link, index) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              <span>0{index + 1}</span>
              {link.label}
            </Link>
          ))}
          {/* Wrapper keeps the CTA out of the `> div > a` menu-row selector. */}
          <div className="bento-nav-mobile-cta">
            <Link className="bento-btn" href="/products" onClick={() => setOpen(false)}>
              Продукты <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
