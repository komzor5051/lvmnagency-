'use client'
import Chapter from '@/components/hud/Chapter'
import SplitLines from '@/components/motion/SplitLines'
import HandDrawn from '@/components/motion/HandDrawn'

const TRIAD = [
  { index: '01', label: 'Не агентство', counter: 'работаю сам, без менеджеров между нами' },
  { index: '02', label: 'Не очередной курс', counter: 'строю рабочие системы, а не теорию' },
  { index: '03', label: 'Не разовый проект', counter: 'система остаётся и растёт вместе с бизнесом' },
] as const

export default function ChapterManifesto() {
  return (
    <Chapter name="Manifesto" theme="dark" className="px-[6vw] py-28">
      <SplitLines as="p" className="font-display max-w-[900px] text-[clamp(28px,4vw,48px)]">
        Бизнес растёт до точки, где всё завязано на основателе. Дальше либо нанимать,
        либо строить <HandDrawn kind="circle">систему</HandDrawn>.
      </SplitLines>
      <div className="mt-20">
        {TRIAD.map(row => (
          <div
            key={row.index}
            className="flex flex-col gap-2 border-t border-dark-line py-8 last:border-b md:flex-row md:items-baseline md:gap-10"
          >
            <span className="mono-label text-dark-muted">{row.index}</span>
            <span className="font-display text-[clamp(24px,2.6vw,38px)]">{row.label}</span>
            <span className="mono-label text-dark-muted md:ml-auto md:text-right">{row.counter}</span>
          </div>
        ))}
      </div>
    </Chapter>
  )
}
