'use client'
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

export default function DistortPortrait({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [glOk, setGlOk] = useState(false)

  useEffect(() => {
    if (reduced || window.matchMedia('(pointer: coarse)').matches) return
    let cleanup = () => {}
    let alive = true
    ;(async () => {
      try {
        const { Renderer, Program, Mesh, Triangle, Texture } = await import('ogl')
        const el = wrap.current
        if (!el || !alive) return
        const renderer = new Renderer({ dpr: Math.min(2, devicePixelRatio), alpha: true })
        const gl = renderer.gl
        el.appendChild(gl.canvas)
        gl.canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%'
        const texture = new Texture(gl)
        const img = new Image()
        img.src = src
        img.onload = () => { texture.image = img; setGlOk(true) }
        const program = new Program(gl, {
          vertex: `attribute vec2 uv, position; varying vec2 vUv;
            void main(){ vUv = uv; gl_Position = vec4(position,0.,1.); }`,
          fragment: `precision highp float; uniform sampler2D tMap; uniform vec2 uMouse; uniform float uHover;
            varying vec2 vUv;
            void main(){
              float d = distance(vUv, uMouse);
              vec2 off = normalize(vUv - uMouse) * uHover * 0.04 * smoothstep(0.35, 0.0, d);
              gl_FragColor = texture2D(tMap, vUv + off);
            }`,
          uniforms: { tMap: { value: texture }, uMouse: { value: [0.5, 0.5] }, uHover: { value: 0 } },
        })
        const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })
        const resize = () => renderer.setSize(el.clientWidth, el.clientHeight)
        resize()
        addEventListener('resize', resize)
        let hover = 0, target = 0, raf = 0
        const onMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect()
          program.uniforms.uMouse.value = [(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height]
        }
        el.addEventListener('mousemove', onMove)
        el.addEventListener('mouseenter', () => { target = 1 })
        el.addEventListener('mouseleave', () => { target = 0 })
        const loop = () => {
          hover += (target - hover) * 0.08
          program.uniforms.uHover.value = hover
          renderer.render({ scene: mesh })
          raf = requestAnimationFrame(loop)
        }
        loop()
        cleanup = () => { cancelAnimationFrame(raf); removeEventListener('resize', resize); gl.canvas.remove() }
      } catch { /* fallback: plain img */ }
    })()
    return () => { alive = false; cleanup() }
  }, [src, reduced])

  return (
    <div ref={wrap} className={`relative overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className={`h-full w-full object-cover ${glOk ? 'opacity-0' : ''}`} />
    </div>
  )
}
