'use client'
import { useEffect, useRef, useState } from 'react'
import { createTimeline } from 'animejs'
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
  }, [reduced])

  useEffect(() => {
    if (!show || !ref.current) return
    const counter = { v: 0 }
    const tl = createTimeline({ onComplete: () => setShow(false) })
    tl.add(counter, {
      v: 100,
      duration: 900,
      ease: 'inOutCubic',
      onUpdate: () => setN(Math.round(counter.v)),
    }).add(ref.current, { translateY: ['0%', '-100%'], duration: 500, ease: 'inOutQuart' }, '+=100')
  }, [show])

  if (!show) return null
  return (
    <div ref={ref} className="fixed inset-0 z-[100] flex items-center justify-center bg-dark text-dark-ink">
      <span className="font-display text-[clamp(48px,8vw,110px)]">Влад Лямин</span>
      <span className="mono-label absolute right-8 bottom-8">{n}</span>
    </div>
  )
}
