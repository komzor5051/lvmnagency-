'use client'
import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/components/motion/gsap'

// Шторка между страницами: тёмный лист уходит по диагонали вверх-вправо.
// Template перемонтируется на каждый переход, поэтому анимация стартует заново.
export default function Template({ children }: { children: React.ReactNode }) {
  const curtain = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    const el = curtain.current
    if (!el) return
    if (prefersReducedMotion()) { el.style.display = 'none'; return }
    gsap.set(el, { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' })
    gsap.to(el, {
      clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
      duration: 0.5,
      delay: 0.05,
      ease: 'power4.inOut',
      onComplete: () => { el.style.display = 'none' },
    })
  }, [])
  return (
    <>
      <div ref={curtain} className="fixed inset-0 z-[90] bg-dark" aria-hidden="true" />
      {children}
    </>
  )
}
