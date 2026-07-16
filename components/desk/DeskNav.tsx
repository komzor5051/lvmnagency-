"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/products", label: "Продукты" },
  { href: "/blog", label: "Блог" },
  { href: "/about", label: "Кто я" },
];

export default function DeskNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="desk-sheet--low fixed top-4 left-1/2 z-50 flex h-[60px] w-[min(1180px,calc(100%-32px))] -translate-x-1/2 items-center justify-between border border-line bg-white px-5">
      <Link href="/" className="flex items-baseline gap-2 text-ink no-underline" onClick={() => setOpen(false)}>
        <span className="font-tektur text-[18px] font-bold">Влад Лямин</span>
        <span className="desk-note text-[14px] text-ink-muted max-sm:hidden">AI на практике</span>
      </Link>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-6 max-md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-[14px] text-ink no-underline hover:underline hover:underline-offset-4 ${
                pathname?.startsWith(l.href) ? "underline underline-offset-4" : ""
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <Link href="/audit" className="desk-btn px-[18px] py-[9px] text-[13px] no-underline max-sm:hidden">
          Пройти AI-аудит
        </Link>
        <button
          type="button"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="hidden h-11 w-11 cursor-pointer flex-col items-center justify-center gap-[5px] border-0 bg-transparent max-md:flex"
        >
          <span className={`h-[2px] w-6 bg-ink transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`h-[2px] w-6 bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-[2px] w-6 bg-ink transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="desk-sheet absolute top-full left-0 right-0 mt-2 flex flex-col gap-1 p-4 md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="min-h-11 px-2 py-2 text-[16px] text-ink no-underline"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/audit"
            onClick={() => setOpen(false)}
            className="desk-btn desk-btn--lime mt-2 no-underline"
          >
            Пройти AI-аудит
          </Link>
        </div>
      )}
    </nav>
  );
}
