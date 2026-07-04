'use client'
import Chapter from '@/components/hud/Chapter'
import SplitLines from '@/components/motion/SplitLines'
import HandDrawn from '@/components/motion/HandDrawn'

const TRIAD = [
  { index: '01', label: 'Не агентство' },
  { index: '02', label: 'Не очередной курс' },
  { index: '03', label: 'Не разовый проект' },
] as const

export default function ChapterManifesto() {
  return (
    <Chapter name="Manifesto" theme="dark" className="px-[6vw] py-28">
      <SplitLines as="p" className="font-display max-w-[900px] text-[clamp(28px,4vw,48px)]">
        Бизнес растёт до точки, где всё завязано на основателе. Дальше либо нанимать,
        либо строить <HandDrawn kind="circle">систему</HandDrawn>.
      </SplitLines>
      <div className="mt-20 max-w-[640px]">
        {TRIAD.map(row => (
          <div
            key={row.index}
            className="flex items-baseline gap-6 border-t border-dark-line py-6 first:border-t"
          >
            <span className="mono-label text-dark-muted">{row.index}</span>
            <span className="font-display text-[18px] md:text-[20px]">{row.label}</span>
          </div>
        ))}
      </div>
    </Chapter>
  )
}
