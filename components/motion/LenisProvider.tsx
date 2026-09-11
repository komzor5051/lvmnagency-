'use client'
import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'
import { useReducedMotion } from './useReducedMotion'

// Lenis подменяет нативный скролл, поэтому ScrollTrigger должен слушать
// именно его, а не window. Иначе триггеры отстают от плавного скролла на кадр.
export default function LenisProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ lerp: 0.12 })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [reduced])
  return <>{children}</>
}
