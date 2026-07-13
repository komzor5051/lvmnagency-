'use client'

import { useReducedMotion } from '@/components/motion/useReducedMotion'

type SignalProps = {
  label: string
  detail: string
  className: string
}

function Signal({ label, detail, className }: SignalProps) {
  return (
    <div className={`absolute z-10 border border-line bg-paper px-3 py-2 ${className}`}>
      <p className="mono-label text-[9px] text-ink-muted">{label}</p>
      <p className="mt-1 text-xs leading-tight text-ink">{detail}</p>
    </div>
  )
}

/**
 * A compact visual model of the work: messy inputs enter a designed system
 * and leave as dependable actions. It stays secondary to the hero copy and
 * is deliberately static on touch/reduced-motion devices.
 */
export default function HeroSystemMap() {
  const reduced = useReducedMotion()
  const motionClass = reduced ? 'system-map--still' : ''

  return (
    <div className={`relative mx-auto hidden aspect-[4/5] w-full max-w-[420px] md:block ${motionClass}`}>
      <svg
        aria-hidden="true"
        viewBox="0 0 420 525"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        fill="none"
      >
        <path className="system-line" d="M42 124C116 124 124 184 174 219" />
        <path className="system-line system-line--late" d="M374 111C303 118 303 190 246 225" />
        <path className="system-line system-line--late" d="M210 303C218 358 277 379 351 385" />
        <path className="system-line" d="M181 306C161 365 103 400 55 422" />
        <circle className="system-node" cx="174" cy="219" r="5" />
        <circle className="system-node system-node--late" cx="246" cy="225" r="5" />
        <circle className="system-node system-node--late" cx="210" cy="303" r="5" />
      </svg>

      <Signal label="ВХОДЯЩЕЕ" detail="ручные процессы" className="left-[-4%] top-[8%] w-32" />
      <Signal label="КОНТЕКСТ" detail="данные и правила" className="right-[-2%] top-[6%] w-32" />
      <Signal label="РЕЗУЛЬТАТ" detail="система работает" className="bottom-[8%] right-[-5%] w-36" />
      <Signal label="ЭФФЕКТ" detail="часы возвращаются" className="bottom-[2%] left-[-5%] w-32" />

      <div className="absolute inset-[13%] overflow-hidden border border-ink bg-paper">
        <div className="h-full w-full grayscale contrast-[1.06]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/portrait-editorial.jpg" alt="Влад Лямин" className="h-full w-full object-cover" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 border-t border-ink bg-paper px-3 py-2">
          <p className="mono-label flex items-center justify-between text-[9px]">
            <span>AI-система</span>
            <span className="flex items-center gap-1.5"><i className="system-node inline-block size-1.5 bg-lime" /> онлайн</span>
          </p>
        </div>
      </div>

      <p className="mono-label absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-lime px-2 py-1 text-[9px] text-ink">
        СБОРКА
      </p>
    </div>
  )
}
