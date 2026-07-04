'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useHudState } from './HudContext'

const PATH_NAMES: [string, string][] = [
  ['/products', 'Продукты'], ['/audit', 'AI-аудит'], ['/blog', 'Блог'],
  ['/about', 'Обо мне'], ['/vibecoding', 'Вайбкодинг'], ['/', 'Главная'],
]

export default function HudFrame() {
  const { chapters, activeIndex, extras } = useHudState()
  const pathname = usePathname()
  const active = chapters[activeIndex]
  const dark = active?.theme === 'dark'
  const fallback = PATH_NAMES.find(([p]) => pathname === p || (p !== '/' && pathname.startsWith(p)))?.[1] ?? ''
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className={`pointer-events-none fixed inset-0 z-50 transition-colors duration-500 ${dark ? 'text-dark-ink' : 'text-ink'}`} aria-hidden>
      <span className="mono-label absolute top-5 left-6">{active?.name ?? fallback}</span>
      {chapters.length > 0 && (
        <span className="mono-label absolute top-5 right-6">{pad(activeIndex + 1)} / {pad(chapters.length)}</span>
      )}
      {chapters.length > 1 && (
        <div className="absolute top-6 left-1/2 flex -translate-x-1/2 gap-1.5">
          {chapters.map((c, i) => (
            <span key={c.id} className="h-[3px] w-8 transition-colors duration-300"
              style={{ background: i <= activeIndex ? 'var(--color-lime)' : 'currentColor', opacity: i <= activeIndex ? 1 : 0.18 }} />
          ))}
        </div>
      )}
      <span className="mono-label absolute bottom-5 left-6">{extras.bl ?? 'Влад Лямин'}</span>
      <Link href="https://t.me/lyaminvl" target="_blank"
        className="mono-label pointer-events-auto absolute right-6 bottom-5 hover:text-lime-dark">
        {extras.br ?? '@lyaminvl'}
      </Link>
    </div>
  )
}
