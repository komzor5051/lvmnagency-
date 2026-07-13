'use client'
import { useEffect, useRef, type ElementType, type ReactNode } from 'react'
import { animate, stagger, utils } from 'animejs'
import SplitType from 'split-type'
import { observeOnce } from './observeOnce'
import { useReducedMotion } from './useReducedMotion'

type Props = { as?: ElementType; className?: string; children: ReactNode }

export default function SplitLines({ as: Tag = 'div', className = '', children }: Props) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
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
    utils.set(split.lines, { translateY: '110%' })

    const cleanupObserver = observeOnce(
      el,
      () => {
        animate(split.lines as HTMLElement[], {
          translateY: '0%',
          duration: 900,
          ease: 'outQuint',
          delay: stagger(80),
          onComplete: () => masks.forEach(m => { m.style.overflow = 'visible' }),
        })
      },
      '0px 0px -15% 0px'
    )
    return () => {
      cleanupObserver()
      split.revert()
    }
  }, [reduced])

  return <Tag ref={ref as React.Ref<never>} className={className}>{children}</Tag>
}
