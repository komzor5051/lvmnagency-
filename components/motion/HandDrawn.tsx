'use client'
import { useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useReducedMotion } from './useReducedMotion'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const PATHS = {
  circle: { viewBox: '0 0 220 90', d: 'M120,8 C70,5 16,20 13,45 C10,72 62,87 116,85 C172,83 214,68 214,44 C214,18 160,6 108,9 C94,9.8 80,12 70,16' },
  underline: { viewBox: '0 0 300 12', d: 'M2,8 C60,4 120,10 180,6 C230,3 270,8 298,5' },
} as const

export default function HandDrawn({ kind, className = '', children }: { kind: keyof typeof PATHS; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()
  const { viewBox, d } = PATHS[kind]

  useGSAP(() => {
    const path = ref.current?.querySelector('path')
    if (!path || reduced) return
    const len = path.getTotalLength()
    gsap.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, {
      strokeDashoffset: 0,
      duration: 1.1,
      // SplitLines reveals the line under a mask for ~0.9s; without the delay
      // the stroke finishes drawing while the text is still hidden.
      delay: 0.7,
      ease: 'power2.inOut',
      scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
    })
  }, { dependencies: [reduced], revertOnUpdate: true })

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
