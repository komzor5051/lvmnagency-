'use client'
import { useEffect, useRef } from 'react'
import { animate, utils } from 'animejs'
import { observeOnce } from './observeOnce'
import DistortPortrait from './DistortPortrait'

/**
 * Editorial portrait treatment: monochrome grade over the photo plus a
 * top-to-bottom curtain reveal with a slow scale settle when the block first
 * enters the viewport. Static full image under prefers-reduced-motion.
 *
 * The element's aspect ratio must match the source image (WebGL in
 * DistortPortrait stretches the texture to the element, it does not cover-crop).
 */
export default function PortraitFrame({
  src,
  alt,
  className = '',
}: {
  src: string
  alt: string
  className?: string
}) {
  const clipRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const clip = clipRef.current
    const inner = innerRef.current
    if (!clip || !inner) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    utils.set(clip, { clipPath: 'inset(0% 0% 100% 0%)' })
    utils.set(inner, { scale: 1.12 })
    return observeOnce(clip, () => {
      animate(clip, { clipPath: 'inset(0% 0% 0% 0%)', duration: 900, ease: 'outQuart' })
      animate(inner, { scale: 1, duration: 1300, ease: 'outCubic' })
    })
  }, [])

  return (
    <div ref={clipRef} className={`overflow-hidden ${className}`}>
      <div ref={innerRef} className="h-full w-full grayscale contrast-[1.06]">
        <DistortPortrait src={src} alt={alt} className="h-full w-full" />
      </div>
    </div>
  )
}
