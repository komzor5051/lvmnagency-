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
    if (!split.lines || split.lines.length === 0) {
      split.revert()
      return
    }
    // The reveal masks clip anything that leaves the line box — serif
    // descenders (у, р, ф) and the HandDrawn circle/underline SVGs. Bleed
    // (padding cancelled by negative margins) keeps glyphs intact while the
    // line slides in; once the reveal is done the masks stop clipping at all.
    const masks: HTMLDivElement[] = []
    split.lines?.forEach(line => {
      const mask = document.createElement('div')
      mask.style.overflow = 'hidden'
      mask.style.padding = '0.1em 0.35em 0.22em'
      mask.style.margin = '-0.1em -0.35em -0.22em'
      line.parentNode?.insertBefore(mask, line)
      mask.appendChild(line)
      masks.push(mask)
    })
    gsap.from(split.lines, {
      yPercent: 110,
      duration: 0.9,
      ease: 'power4.out',
      stagger: 0.08,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onComplete: () => masks.forEach(m => { m.style.overflow = 'visible' }),
    })
    return () => split.revert()
  }, { dependencies: [reduced], revertOnUpdate: true })

  return <Tag ref={ref as React.Ref<never>} className={className}>{children}</Tag>
}
