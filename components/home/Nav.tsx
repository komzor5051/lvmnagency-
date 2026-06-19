import Link from "next/link";
import { consultationHref, isExternal } from "./cta";

const links = [
  { label: "Продукты", href: "/products" },
  { label: "Кейсы", href: "#cases" },
  { label: "Обо мне", href: "/about" },
  { label: "Блог", href: "/blog" },
];

/** Sticky top bar: name left, links center, black consultation button right. */
export function Nav() {
  const href = consultationHref();
  const btnClass =
    "inline-flex items-center bg-ink px-4 py-2 text-xs font-bold tracking-tight text-paper transition-transform duration-200 hover:-translate-y-0.5";

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

        {isExternal(href) ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className={btnClass}>
            Консультация
          </a>
        ) : (
          <a href={href} className={btnClass}>
            Консультация
          </a>
        )}
      </div>
    </header>
  );
}
