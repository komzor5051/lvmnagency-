'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const LINKS = [
  { label: 'Блог', href: '/blog' },
  { label: 'Продукты', href: '/products' },
  { label: 'AI-аудит', href: '/audit' },
  { label: 'Обо мне', href: '/about' },
]

/**
 * Compact site-nav dropdown scoped to the hero's name label. Distinct from
 * the global fullscreen HudMenu — this is a small, ordinary dropdown for
 * quick navigation, no takeover, no gsap timeline.
 */
export default function HeroQuickNav() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Close on route change, same idea as HudMenu's usePathname effect.
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
    <div ref={rootRef} className="relative mb-8 inline-block">
      <button
        type="button"
        className="mono-label flex items-center gap-3"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        <span className="inline-block size-2 rounded-full bg-lime" />
        Влад Лямин
        <span aria-hidden="true">{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <nav
          role="menu"
          aria-label="Быстрая навигация"
          className="bg-paper border-line absolute top-full left-0 z-20 mt-1 min-w-[180px] border"
        >
          {LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              role="menuitem"
              className="mono-label hover:bg-lime hover:text-ink block px-4 py-3 transition-colors duration-150"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  )
}
