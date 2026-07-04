'use client'
import { useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

export default function Template({ children }: { children: ReactNode }) {
  const curtain = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(curtain.current, { display: 'none' })
      return
    }
    gsap.to(curtain.current, {
      yPercent: -100, duration: 0.6, ease: 'power4.inOut', delay: 0.05,
      onComplete: () => gsap.set(curtain.current, { display: 'none' }),
    })
  })
  return (
    <>
      <div ref={curtain} className="fixed inset-0 z-[90] bg-dark" />
      {children}
    </>
  )
}
