'use client'
import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Chapter from '@/components/hud/Chapter'
import { useReducedMotion } from '@/components/motion/useReducedMotion'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const STEPS = [
  {
    word: 'Аудит.',
    stage: 'ЭТАП 01',
    body: 'Смотрю, как устроены процессы и где утекают часы. На выходе карта: что автоматизировать первым.',
  },
  {
    word: 'Сборка.',
    stage: 'ЭТАП 02 — 1–3 НЕДЕЛИ',
    body: 'Собираю систему под ваш бизнес. Инструменты подбираю под задачу, а не наоборот.',
  },
  {
    word: 'Масштаб.',
    stage: 'ЭТАП 03',
    body: 'Система забирает рутину на себя. Расширяем её вместе с ростом бизнеса.',
  },
] as const

// Desktop: an unpinned tall (300vh) section with a sticky inner stage.
// A single ScrollTrigger on the outer wrapper reports scroll progress
// (0..1); progress is split into three even zones to pick the active
// word/paragraph. Chosen over a pinned timeline because it needs no
// pin-spacer bookkeeping and degrades to a plain static stack for free
// when the effect is skipped (reduced motion / mobile — see below).
export default function ChapterMethod() {
  const reduced = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [staticMode, setStaticMode] = useState(false)

  useGSAP(
    () => {
      const isCoarseOrNarrow = window.matchMedia('(pointer: coarse), (max-width: 767px)').matches
      if (reduced || isCoarseOrNarrow) {
        setStaticMode(true)
        return
      }

      const el = wrapRef.current
      if (!el) return
      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: self => {
          const zone = Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length))
          setActive(zone)
        },
      })
      return () => trigger.kill()
    },
    { dependencies: [reduced] },
  )

  if (staticMode) {
    return (
      <Chapter name="Method" theme="light" className="px-[6vw] py-28">
        <div className="flex flex-col gap-16">
          {STEPS.map(step => (
            <div key={step.word}>
              <p className="font-display text-[clamp(48px,9vw,130px)]">{step.word}</p>
              <p className="mono-label mt-4 text-ink-muted">{step.stage}</p>
              <p className="mt-3 max-w-[520px] text-[17px] leading-relaxed text-ink-muted">{step.body}</p>
            </div>
          ))}
        </div>
      </Chapter>
    )
  }

  const activeStep = STEPS[active]

  return (
    <Chapter name="Method" theme="light" className="px-0 py-0">
      <div ref={wrapRef} className="relative" style={{ height: '300vh' }}>
        <div className="sticky top-0 flex min-h-svh flex-col justify-center gap-10 px-[6vw] py-28">
          <div className="flex flex-col">
            {STEPS.map((step, i) => (
              <p
                key={step.word}
                className={`font-display text-[clamp(48px,9vw,130px)] transition-colors duration-300 ${
                  i === active ? 'text-ink' : 'ghost'
                }`}
              >
                {step.word}
              </p>
            ))}
          </div>
          <div>
            <p className="mono-label text-ink-muted">{activeStep.stage}</p>
            <p className="mt-3 max-w-[520px] text-[17px] leading-relaxed text-ink-muted">{activeStep.body}</p>
          </div>
        </div>
      </div>
    </Chapter>
  )
}
