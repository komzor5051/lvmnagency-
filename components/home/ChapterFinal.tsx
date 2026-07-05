'use client'
import Link from 'next/link'
import Chapter from '@/components/hud/Chapter'
import Magnetic from '@/components/motion/Magnetic'
import { TELEGRAM_URL } from '@/lib/products'

const NAV_LINKS = [
  { label: 'Главная', href: '/' },
  { label: 'Продукты', href: '/products' },
  { label: 'Аудит', href: '/audit' },
  { label: 'Блог', href: '/blog' },
  { label: 'Обо мне', href: '/about' },
] as const

export default function ChapterFinal() {
  return (
    <Chapter name="Final" theme="light" className="flex min-h-svh flex-col justify-between px-[6vw] py-28">
      <div className="flex flex-1 flex-col justify-center">
        <h2 className="font-display text-[clamp(44px,8vw,110px)]">
          Готовы строить <span className="ghost">систему?</span>
        </h2>
        <p className="mt-8 max-w-[560px] text-[17px] leading-relaxed text-ink-muted">
          Начните с гайда или напишите мне в Telegram — отвечаю сам.
        </p>
        <div className="mt-12 flex flex-wrap items-center gap-8">
          <Magnetic>
            <Link
              href="/products"
              className="inline-block text-center bg-ink px-9 py-4 text-[15px] font-medium text-white transition-colors hover:bg-lime hover:text-ink"
            >
              Смотреть продукты
            </Link>
          </Magnetic>
          <Link href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="link-ul text-[15px]">
            Написать в Telegram
          </Link>
        </div>
      </div>

      <footer className="mt-24 border-t border-line pt-10">
        <nav aria-label="Основная навигация" className="flex flex-wrap gap-x-10 gap-y-4">
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} className="font-display text-[28px] transition-opacity hover:opacity-60 md:text-[36px]">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mono-label mt-10 flex flex-wrap items-center gap-8 text-ink-muted">
          <span>© {new Date().getFullYear()} Влад Лямин</span>
          <Link href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
            Telegram
          </Link>
          <Link href="/blog/feed.xml" className="hover:text-ink">
            RSS
          </Link>
        </div>
      </footer>
    </Chapter>
  )
}
