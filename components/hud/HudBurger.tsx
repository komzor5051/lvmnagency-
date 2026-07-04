'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const LINKS = [
  { label: 'Главная', href: '/' },
  { label: 'Продукты', href: '/products' },
  { label: 'AI-аудит', href: '/audit' },
  { label: 'Блог', href: '/blog' },
  { label: 'Обо мне', href: '/about' },
]

/**
 * Burger trigger + compact dropdown, pinned top-left of the HUD on every
 * page. Distinct from the fullscreen HudMenu (opened via the index/bars
 * button) — this is an ordinary small dropdown for quick navigation.
 */
export default function HudBurger() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const onClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousedown', onClickOutside)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mousedown', onClickOutside)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="flex h-[18px] w-[18px] flex-col items-center justify-center gap-[4px] bg-transparent p-0"
        aria-label="Меню"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen(v => !v)}
      >
        <span className="block h-[2px] w-full bg-current" />
        <span className="block h-[2px] w-full bg-current" />
        <span className="block h-[2px] w-full bg-current" />
      </button>
      {open && (
        <nav
          role="menu"
          aria-label="Разделы сайта"
          className="bg-paper border-line text-ink absolute top-full left-0 z-20 mt-3 min-w-[180px] border"
        >
          {LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              role="menuitem"
              className="mono-label hover:underline underline-offset-4 block px-4 py-3"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  )
}
