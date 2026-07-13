'use client'
import { useEffect, useRef, type ReactNode } from 'react'
import { createAnimatable, type AnimatableObject } from 'animejs'
import { useReducedMotion } from './useReducedMotion'

export default function Magnetic({ strength = 0.3, children }: { strength?: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const animatableRef = useRef<AnimatableObject | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    animatableRef.current = createAnimatable(el, {
      x: { duration: 400, ease: 'outQuart' },
      y: { duration: 400, ease: 'outQuart' },
    })
    return () => {
      animatableRef.current?.revert()
      animatableRef.current = null
    }
  }, [reduced])

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current || !animatableRef.current) return
    const r = ref.current.getBoundingClientRect()
    animatableRef.current.x((e.clientX - r.left - r.width / 2) * strength)
    animatableRef.current.y((e.clientY - r.top - r.height / 2) * strength)
  }
  const onLeave = () => {
    animatableRef.current?.x(0, 600, 'outElastic(1, 0.4)')
    animatableRef.current?.y(0, 600, 'outElastic(1, 0.4)')
  }
  return <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="inline-block">{children}</div>
}
