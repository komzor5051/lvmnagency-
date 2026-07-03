"use client";

import Link from "next/link";
import { useState } from "react";
import { consultationHref, isExternal } from "./cta";

const links = [
  { label: "Продукты", href: "/products" },
  { label: "Кейсы", href: "#cases" },
  { label: "Обо мне", href: "/about" },
  { label: "Блог", href: "/blog" },
];

/** Sticky top bar: name left, links center, black consultation button right. */
export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const href = consultationHref();
  const btnClass =
    "inline-flex items-center bg-ink px-4 py-2 text-xs font-bold tracking-tight text-paper transition-transform duration-200 hover:-translate-y-0.5";

  const ConsultationLink = ({ className }: { className?: string }) => {
    if (isExternal(href)) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
          Консультация
        </a>
      );
    }
    return (
      <a href={href} className={className}>
        Консультация
      </a>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
        <Link
          href="/"
          className="font-heading text-[16px] font-extrabold tracking-[-0.02em] text-ink"
        >
          Влад Лямин
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Основное меню">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[13px] text-ink-muted transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Hamburger button — mobile only */}
          <button
            className="flex items-center justify-center transition-opacity duration-200 hover:opacity-70 md:hidden"
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </svg>
            )}
          </button>

          {/* Consultation button — desktop only */}
          <ConsultationLink className={`hidden md:inline-flex ${btnClass}`} />
        </div>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full border-b border-line bg-white md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block border-b border-line px-5 py-4 text-[15px] text-ink transition-colors hover:text-ink-muted"
              onClick={() => setIsOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="px-5 py-4">
            <ConsultationLink
              className="block w-full bg-ink px-4 py-3 text-center text-[13px] font-bold tracking-tight text-paper transition-opacity hover:opacity-80"
            />
          </div>
        </div>
      )}
    </header>
  );
}
