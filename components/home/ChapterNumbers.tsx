'use client'
import Chapter from '@/components/hud/Chapter'
import { CountUp } from '@/components/motion/CountUp'

const STATS = [
  { value: 17, suffix: '', label: 'систем построено и передано' },
  { value: 60, suffix: ' ч/мес', label: 'освобождает одна система в среднем' },
  { value: 2, suffix: ' недели', label: 'от созвона до работающей версии' },
] as const

export default function ChapterNumbers() {
  return (
    <Chapter name="Numbers" theme="dark" className="px-[6vw] py-28">
      <div className="grid gap-16 md:grid-cols-3">
        {STATS.map(stat => (
          <div key={stat.label} className="border-t border-dark-line pt-6">
            <CountUp
              value={stat.value}
              suffix={stat.suffix}
              className="font-display block text-[clamp(56px,9vw,120px)]"
            />
            <p className="mono-label mt-4 text-dark-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </Chapter>
  )
}
