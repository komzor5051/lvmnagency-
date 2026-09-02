"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/#products", label: "Продукты" },
  { href: "/about", label: "Обо мне" },
  { href: "/blog", label: "Блог" },
  { href: "/audit", label: "Аудит" },
];

export default function StudioNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("rz-menu-open", open);
    return () => document.body.classList.remove("rz-menu-open");
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header className="rz-nav-shell">
        <nav className="rz-nav" aria-label="Основная навигация">
          <Link className="rz-brand" href="/" aria-label="Влад Лямин — на главную" onClick={close}>
            Влад Лямин
          </Link>

          <div className="rz-nav-links">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={close}>
                {link.label}
              </Link>
            ))}
          </div>

          <Link className="rz-btn rz-btn--solid rz-nav-cta" href="/products/guide" onClick={close}>
            Начать с гайда
          </Link>

          <button
            className={`rz-menu-toggle ${open ? "is-open" : ""}`}
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

      <div className={`rz-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        {links.map((link) => (
          <Link key={link.href} href={link.href} onClick={close}>
            {link.label}
          </Link>
        ))}
        <Link className="rz-btn rz-btn--solid" href="/products/guide" onClick={close}>
          Начать с гайда
        </Link>
      </div>
    </>
  );
}
