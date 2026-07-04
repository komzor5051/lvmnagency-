'use client'
import { useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useReducedMotion } from './useReducedMotion'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const PATHS = {
  circle: { viewBox: '0 0 200 80', d: 'M12,42 C8,18 60,6 104,8 C160,10 194,22 192,42 C190,64 140,74 96,72 C50,70 14,62 14,44' },
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
      ease: 'power2.inOut',
      scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
    })
  }, { dependencies: [reduced] })

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
