'use client'
import { useEffect, useRef, type ReactNode } from 'react'
import { animate } from 'animejs'

export default function Template({ children }: { children: ReactNode }) {
  const curtain = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = curtain.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.display = 'none'
      return
    }
    animate(el, {
      translateY: '-100%',
      duration: 600,
      ease: 'inOutQuart',
      delay: 50,
      onComplete: () => { el.style.display = 'none' },
    })
  }, [])
  return (
    <>
      <div ref={curtain} className="fixed inset-0 z-[90] bg-dark" />
      {children}
    </>
  )
}
