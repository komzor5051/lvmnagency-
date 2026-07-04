'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useReducedMotion } from './useReducedMotion'

export default function Preloader() {
  const [show, setShow] = useState(false)
  const [n, setN] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || sessionStorage.getItem('lvmn_seen')) return
    sessionStorage.setItem('lvmn_seen', '1')
    setShow(true)
    const counter = { v: 0 }
    const tl = gsap.timeline({ onComplete: () => setShow(false) })
    tl.to(counter, { v: 100, duration: 1.1, ease: 'power2.inOut', onUpdate: () => setN(Math.round(counter.v)) })
      .to(ref.current, { yPercent: -100, duration: 0.5, ease: 'power4.inOut' }, '+=0.1')
  }, [reduced])

  if (!show) return null
  return (
    <div ref={ref} className="fixed inset-0 z-[100] flex items-center justify-center bg-dark text-dark-ink">
      <span className="font-display text-[clamp(48px,8vw,110px)]">Влад Лямин</span>
      <span className="mono-label absolute right-8 bottom-8 text-2xl">{n}</span>
    </div>
  )
}
