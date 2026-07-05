'use client'
import Link from 'next/link'
import Chapter from '@/components/hud/Chapter'
import SplitLines from '@/components/motion/SplitLines'
import Magnetic from '@/components/motion/Magnetic'
import { TELEGRAM_URL } from '@/lib/products'

const PRINCIPLES = [
  {
    title: 'AI — это не магия',
    text: 'Это софт. У него есть стоимость, задержки и процент ошибок. Кто продаёт магию — продаёт презентацию.',
  },
  {
    title: 'Сначала метрика, потом модель',
    text: 'Пока не названа цифра, которую меняем — часы, заявки, конверсия — обсуждать нечего. Модель выбирается под метрику.',
  },
  {
    title: 'Скучная автоматизация выигрывает у эффектных агентов',
    text: 'Парсер, который год работает без сбоев, приносит больше, чем впечатляющий агент, который падает раз в неделю.',
  },
  {
    title: 'Обучение важнее внедрения',
    text: 'Система, в которой разбираетесь только вы — это зависимость. Я передаю команде понимание, как это работает и как это менять.',
  },
] as const

export default function AboutPrinciples() {
  return (
    <Chapter name="Principles" theme="light" className="px-[6vw] py-28">
      <SplitLines as="h2" className="font-display max-w-[900px] text-[clamp(32px,5.5vw,72px)]">
        Скучный AI, который <span className="hl">работает</span>
      </SplitLines>

      <ol className="mt-16 grid gap-x-12 gap-y-12 lg:grid-cols-2">
        {PRINCIPLES.map((p, i) => (
          <li key={p.title} className="flex gap-6">
            <span aria-hidden="true" className="mono-label pt-1 text-ink-muted">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <h3 className="font-display text-[22px] leading-tight md:text-[26px]">{p.title}</h3>
              <p className="mt-3 max-w-[420px] leading-relaxed text-ink-muted">{p.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-20 flex items-center gap-8 border-t border-line pt-10">
        <Magnetic>
          <Link
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-center bg-ink px-9 py-4 text-[15px] font-medium text-white transition-colors hover:bg-lime hover:text-ink"
          >
            Написать в Telegram
          </Link>
        </Magnetic>
        <span className="font-hand -rotate-2 text-2xl text-ink-muted">отвечаю сам</span>
      </div>
    </Chapter>
  )
}
