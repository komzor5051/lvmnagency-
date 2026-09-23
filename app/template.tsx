'use client'
import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/components/motion/gsap'
import { DUR, EASE } from '@/components/motion/tokens'

// Шторка между страницами: тёмный лист уходит вверх. Template перемонтируется
// на каждый переход, модуль — нет, поэтому флаг живёт на уровне модуля.
// На первой загрузке шторки нет: человек из рилса не должен видеть чёрный экран.
// В dev StrictMode эффект вызывается дважды, и шторка может сыграть на первой загрузке. В проде этого нет.
let hasNavigated = false

export default function Template({ children }: { children: React.ReactNode }) {
  const curtain = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    const el = curtain.current
    if (!el) return
    if (!hasNavigated) { hasNavigated = true; return }
    if (prefersReducedMotion()) return
    // useGSAP — layout effect: лист показывается до первой отрисовки новой страницы.
    el.style.display = 'block'
    gsap.set(el, { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' })
    gsap.to(el, {
      clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
      duration: DUR.fast,
      delay: 0.05,
      ease: EASE.inOut,
      onComplete: () => { el.style.display = 'none' },
    })
  }, [])
  return (
    <>
      <div ref={curtain} className="fixed inset-0 z-[90] bg-dark" style={{ display: 'none' }} aria-hidden="true" />
      {children}
    </>
  )
}
