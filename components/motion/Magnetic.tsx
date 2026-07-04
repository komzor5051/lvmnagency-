'use client'
import { useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { useReducedMotion } from './useReducedMotion'

export default function Magnetic({ strength = 0.3, children }: { strength?: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const onMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    gsap.to(ref.current, {
      x: (e.clientX - r.left - r.width / 2) * strength,
      y: (e.clientY - r.top - r.height / 2) * strength,
      duration: 0.4, ease: 'power3.out',
    })
  }
  const onLeave = () => {
    if (ref.current) gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
  }
  return <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="inline-block">{children}</div>
}
