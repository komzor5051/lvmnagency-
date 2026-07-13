'use client'
import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from './useReducedMotion'

export default function LenisProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ lerp: 0.12 })
    let rafId: number
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [reduced])
  return <>{children}</>
}
