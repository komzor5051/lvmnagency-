'use client'
import Link from 'next/link'
import Chapter from '@/components/hud/Chapter'

// Display order is presentation-only; lib/products.ts stays untouched.
// Slugs map to real lib/products.ts ids (Product["id"] / /products/[slug]).
const ENTRIES = [
  { n: '01', label: 'Гайд по AI-системам', href: '/products/guide' },
  { n: '02', label: 'Консультация', href: '/products/consultation' },
  { n: '03', label: 'AI-аудит бизнеса', href: '/audit' },
  { n: '04', label: 'Внедрение под ключ', href: '/products/ai-os' },
] as const

export default function ChapterEntries() {
  return (
    <Chapter name="Entries" theme="light" className="bg-paper2 px-[6vw] py-28">
      <h2 className="font-display mb-12 text-[clamp(36px,5.5vw,72px)]">С чего начать</h2>
      <div className="border-t border-line">
        {ENTRIES.map(e => (
          <Link
            key={e.n}
            href={e.href}
            className="group relative flex items-center gap-6 border-b border-line px-2 py-7 transition-transform duration-200 hover:translate-x-3 md:gap-10 md:px-4"
          >
            <span className="mono-label text-ink-muted">{e.n}</span>
            <span className="font-display flex-1 text-[clamp(22px,3.2vw,42px)] underline-offset-[6px] decoration-1 group-hover:underline">
              {e.label}
            </span>
            <span className="mono-label opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              Открыть →
            </span>
          </Link>
        ))}
      </div>
    </Chapter>
  )
}
