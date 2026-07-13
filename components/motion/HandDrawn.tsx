'use client'
import { useEffect, useRef, type ReactNode } from 'react'
import { animate } from 'animejs'
import { createDrawable } from 'animejs/svg'
import { observeOnce } from './observeOnce'
import { useReducedMotion } from './useReducedMotion'

const PATHS = {
  circle: { viewBox: '0 0 220 90', d: 'M120,8 C70,5 16,20 13,45 C10,72 62,87 116,85 C172,83 214,68 214,44 C214,18 160,6 108,9 C94,9.8 80,12 70,16' },
  underline: { viewBox: '0 0 300 12', d: 'M2,8 C60,4 120,10 180,6 C230,3 270,8 298,5' },
} as const

export default function HandDrawn({ kind, className = '', children }: { kind: keyof typeof PATHS; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()
  const { viewBox, d } = PATHS[kind]

  useEffect(() => {
    const root = ref.current
    const path = root?.querySelector('path')
    if (!root || !path || reduced) return

    const [drawable] = createDrawable(path)
    return observeOnce(
      root,
      () => {
        animate(drawable, {
          draw: ['0 0', '0 1'],
          duration: 1100,
          // SplitLines reveals the line under a mask for ~0.9s; without the delay
          // the stroke finishes drawing while the text is still hidden.
          delay: 700,
          ease: 'inOutCubic',
        })
      },
      '0px 0px -20% 0px'
    )
  }, [reduced])

  const underlineStyle = kind === 'underline'
    ? { left: '-2%', top: 'auto' as const, bottom: '-0.18em', width: '104%', height: '0.28em' }
    : undefined
  return (
    <span ref={ref} className={`hw-wrap ${className}`}>
      {children}
      <svg viewBox={viewBox} preserveAspectRatio="none" style={underlineStyle}><path d={d} /></svg>
    </span>
  )
}
