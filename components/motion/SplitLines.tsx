'use client'
import { useRef, type ElementType, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import SplitType from 'split-type'
import { useReducedMotion } from './useReducedMotion'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Props = { as?: ElementType; className?: string; children: ReactNode }

export default function SplitLines({ as: Tag = 'div', className = '', children }: Props) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useGSAP(() => {
    const el = ref.current
    if (!el || reduced) return
    const split = new SplitType(el as HTMLElement, { types: 'lines' })
    split.lines?.forEach(line => {
      const mask = document.createElement('div')
      mask.style.overflow = 'hidden'
      line.parentNode?.insertBefore(mask, line)
      mask.appendChild(line)
    })
    gsap.from(split.lines, {
      yPercent: 110,
      duration: 0.9,
      ease: 'power4.out',
      stagger: 0.08,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    })
    return () => split.revert()
  }, { dependencies: [reduced] })

  return <Tag ref={ref as React.Ref<never>} className={className}>{children}</Tag>
}
