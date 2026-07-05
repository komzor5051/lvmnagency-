'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useHudState } from './HudContext'
import HudMenu from './HudMenu'
import HudBurger from './HudBurger'

const PATH_NAMES: [string, string][] = [
  ['/products', 'Продукты'], ['/audit', 'AI-аудит'], ['/blog', 'Блог'],
  ['/about', 'Обо мне'], ['/vibecoding', 'Вайбкодинг'], ['/', 'Главная'],
]

export default function HudFrame() {
  const { chapters, activeIndex, extras } = useHudState()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const active = chapters[activeIndex]
  const dark = active?.theme === 'dark'
  const fallback = PATH_NAMES.find(([p]) => pathname === p || (p !== '/' && pathname.startsWith(p)))?.[1] ?? ''
  const pad = (n: number) => String(n).padStart(2, '0')
  const openMenu = () => setMenuOpen(true)
  // On mobile the fixed HUD labels ride over large headings while scrolling;
  // a translucent theme-matched chip keeps both readable. Desktop stays bare.
  const chip = `max-md:px-1.5 max-md:py-0.5 max-md:backdrop-blur-sm ${dark ? 'max-md:bg-dark/60' : 'max-md:bg-paper/60'}`

  return (
    <>
      <div className={`pointer-events-none fixed inset-0 z-50 transition-colors duration-500 ${dark ? 'text-dark-ink' : 'text-ink'}`}>
        <div className={`pointer-events-auto absolute top-5 left-6 transition-colors duration-500 ${dark ? 'text-dark-ink' : 'text-ink'}`}>
          <HudBurger />
        </div>
      </div>
      <div className={`pointer-events-none fixed inset-0 z-50 transition-colors duration-500 ${dark ? 'text-dark-ink' : 'text-ink'}`} aria-hidden>
        <span className={`mono-label absolute top-5 left-16 ${chip}`}>{active?.name ?? fallback}</span>
        {chapters.length > 0 ? (
          <button
            type="button"
            onClick={openMenu}
            aria-label="Открыть меню"
            className={`mono-label pointer-events-auto absolute top-5 right-6 bg-transparent p-0 hover:text-lime-dark ${chip}`}
          >
            {pad(activeIndex + 1)} / {pad(chapters.length)}
          </button>
        ) : (
          // Pages without registered chapters (blog, products, audit, about)
          // have no index/bars to click, so expose an explicit "Меню" trigger
          // in the same top-right slot.
          <button
            type="button"
            onClick={openMenu}
            aria-label="Открыть меню"
            className={`mono-label pointer-events-auto absolute top-5 right-6 bg-transparent p-0 hover:text-lime-dark ${chip}`}
          >
            Меню
          </button>
        )}
        {chapters.length > 1 && (
          <button
            type="button"
            onClick={openMenu}
            aria-label="Открыть меню"
            className="pointer-events-auto absolute top-6 left-1/2 flex -translate-x-1/2 gap-1.5 bg-transparent p-0"
          >
            {chapters.map((c, i) => (
              <span key={c.id} className="h-[3px] w-8 transition-colors duration-300"
                style={{ background: i <= activeIndex ? 'var(--color-lime)' : 'currentColor', opacity: i <= activeIndex ? 1 : 0.18 }} />
            ))}
          </button>
        )}
        <span className={`mono-label absolute bottom-5 left-6 ${chip}`}>{extras.bl ?? 'Влад Лямин'}</span>
        <Link href="https://t.me/lyaminvl" target="_blank" rel="noopener noreferrer"
          className={`mono-label pointer-events-auto absolute right-6 bottom-5 hover:text-lime-dark ${chip}`}>
          {extras.br ?? '@lyaminvl'}
        </Link>
      </div>
      <HudMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
