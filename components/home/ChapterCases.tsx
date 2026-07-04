'use client'
import Chapter from '@/components/hud/Chapter'

const CASES = [
  { n: '01', title: 'Контент-завод для онлайн-школы', result: '60 Ч/МЕС' },
  { n: '02', title: 'Поддержка, которая отвечает сама', result: '80% БЕЗ ЛЮДЕЙ' },
  { n: '03', title: 'Цены конкурентов каждое утро', result: 'БЕЗ РУЧНОГО СБОРА' },
  { n: '04', title: 'Приём заявок в закрытый клуб', result: 'КРУГЛОСУТОЧНО' },
] as const

export default function ChapterCases() {
  return (
    <Chapter name="Cases" theme="dark" className="px-[6vw] py-28">
      <p className="mono-label mb-12 text-dark-muted">Кейсы</p>
      <div className="border-t border-dark-line">
        {CASES.map(c => (
          <div
            key={c.n}
            className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-6 border-b border-dark-line px-2 py-8 transition-colors duration-200 hover:bg-lime hover:text-ink md:gap-10 md:px-4"
          >
            <span className="mono-label text-dark-muted group-hover:text-ink">{c.n}</span>
            <span className="font-display text-[clamp(22px,3.4vw,44px)]">«{c.title}»</span>
            <span className="mono-label text-right text-dark-muted group-hover:text-ink">{c.result}</span>
          </div>
        ))}
      </div>
    </Chapter>
  )
}
