import { TELEGRAM_URL } from "@/lib/products";

const links = [
  { label: "Telegram", href: TELEGRAM_URL },
  { label: "GitHub", href: "https://github.com/komzor5051" },
  { label: "Email", href: "mailto:komzor909@gmail.com" },
];

/** Footer: thin top line, copyright left, contact links right, all mono small. */
export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-7 font-mono text-[11px] text-ink-muted md:flex-row md:px-10">
        <p>© 2026 Влад Лямин</p>
        <nav className="flex items-center gap-6" aria-label="Контакты">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              {...(l.href.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
