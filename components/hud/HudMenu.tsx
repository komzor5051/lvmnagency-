'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { animate } from 'animejs'
import { useReducedMotion } from '../motion/useReducedMotion'

const LINKS = [
  { label: 'Главная', index: '01', href: '/' },
  { label: 'Продукты', index: '02', href: '/products' },
  { label: 'AI-аудит', index: '03', href: '/audit' },
  { label: 'Блог', index: '04', href: '/blog' },
  { label: 'Обо мне', index: '05', href: '/about' },
]

const HIDDEN_CLIP = 'inset(0% 0% 100% 0%)'
const VISIBLE_CLIP = 'inset(0% 0% 0% 0%)'

type Props = { open: boolean; onClose: () => void }

/**
 * Fullscreen poster menu — the global replacement for the old top nav.
 * Opened from the HUD (index/bars button, or the "Меню" button on
 * chapter-less pages). Animates with an anime.js clip-path wipe; instant
 * show/hide when the user prefers reduced motion.
 */
export default function HudMenu({ open, onClose }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const pathname = usePathname()

  // Route changes always close the menu, even if navigation happened via
  // browser back/forward rather than a click inside the menu.
  useEffect(() => {
    onClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Scroll lock: Lenis (see LenisProvider) smooth-scrolls the native window
  // scroll rather than an internal wrapper, so simply toggling overflow on
  // <html>/<body> is enough to stop it — no separate lenis.stop() call needed.
  useEffect(() => {
    if (!open) return
    document.documentElement.classList.add('overflow-hidden')
    document.body.classList.add('overflow-hidden')
    return () => {
      document.documentElement.classList.remove('overflow-hidden')
      document.body.classList.remove('overflow-hidden')
    }
  }, [open])

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    if (reduced) {
      el.style.clipPath = open ? VISIBLE_CLIP : HIDDEN_CLIP
      return
    }
    animate(el, {
      clipPath: open ? VISIBLE_CLIP : HIDDEN_CLIP,
      duration: 500,
      ease: open ? 'outQuart' : 'inQuart',
    })
  }, [open, reduced])

  return (
    <div
      ref={rootRef}
      className={`fixed inset-0 z-[80] flex flex-col justify-between bg-dark text-dark-ink ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      style={{ clipPath: HIDDEN_CLIP }}
      aria-hidden={!open}
      inert={!open}
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest('a, button')) onClose()
      }}
    >
      <nav
        className="flex flex-1 flex-col items-start justify-center gap-1 px-6 sm:px-14"
        aria-label="Разделы сайта"
      >
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="group font-display flex items-baseline gap-5 text-[clamp(40px,8vw,96px)] underline-offset-[10px] decoration-2 duration-150 hover:underline sm:gap-8"
          >
            <span>{l.label}</span>
            <span className="mono-label text-dark-muted transition-colors duration-150 group-hover:text-lime">
              {l.index}
            </span>
          </Link>
        ))}
      </nav>
      <div className="flex items-center justify-between border-t border-dark-line px-6 py-5 sm:px-14">
        <a
          href="https://t.me/lyaminvl"
          target="_blank"
          rel="noopener noreferrer"
          className="mono-label hover:text-lime"
        >
          @lyaminvl
        </a>
        <button type="button" onClick={onClose} className="mono-label hover:text-lime" aria-label="Закрыть меню">
          Закрыть
        </button>
      </div>
    </div>
  )
}
