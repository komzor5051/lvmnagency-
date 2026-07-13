'use client'
import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'

// One square per unit of work. The formation morphs with the active method
// step while the user scrolls the sticky stage (animejs.com-style):
//   Аудит   — scattered audit map, one square marked lime (what to automate first)
//   Сборка  — squares assemble into a tight 3x3 system grid
//   Масштаб — the grid breathes up and every cell fills lime
const CELL = 96
const GAP = 24

const SCATTER: Array<[number, number, number]> = [
  [0, 36, -9],
  [236, 0, 12],
  [96, 148, -16],
  [300, 168, 7],
  [16, 264, 11],
  [188, 300, -7],
  [318, 52, -13],
  [120, 44, 6],
  [240, 232, 14],
]

const GRID: Array<[number, number, number]> = Array.from({ length: 9 }, (_, i) => [
  24 + (i % 3) * (CELL + GAP),
  24 + Math.floor(i / 3) * (CELL + GAP),
  0,
])

const LIME = '#C8F04C'
const PAPER_TRANSPARENT = 'rgba(255, 255, 255, 0)'

export default function MethodMorph({ step }: { step: number }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const mounted = useRef(false)

  useEffect(() => {
    const box = boxRef.current
    if (!box) return
    const squares = Array.from(box.children) as HTMLElement[]
    const instant = !mounted.current
    mounted.current = true
    const duration = instant ? 0 : 750

    const target = step === 0 ? SCATTER : GRID
    animate(squares, {
      translateX: (_el: unknown, i = 0) => target[i][0],
      translateY: (_el: unknown, i = 0) => target[i][1],
      rotate: (_el: unknown, i = 0) => target[i][2],
      backgroundColor: (_el: unknown, i = 0) =>
        step === 2 || (step === 0 && i === 2) ? LIME : PAPER_TRANSPARENT,
      duration,
      delay: instant ? 0 : stagger(36, { from: 'first' }),
      ease: 'inOutQuart',
    })
    animate(box, {
      scale: step === 2 ? 1.06 : 1,
      duration: instant ? 0 : 900,
      ease: 'outCubic',
    })
  }, [step])

  return (
    <div
      ref={boxRef}
      aria-hidden
      className="relative"
      style={{ width: 24 * 2 + CELL * 3 + GAP * 2, height: 24 * 2 + CELL * 3 + GAP * 2 }}
    >
      {Array.from({ length: 9 }, (_, i) => (
        <span
          key={i}
          className="absolute left-0 top-0 border border-ink"
          style={{ width: CELL, height: CELL }}
        />
      ))}
    </div>
  )
}
