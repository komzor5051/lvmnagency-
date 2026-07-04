'use client'
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { useHudApi } from './HudContext'

type Props = { name: string; theme: 'light' | 'dark'; className?: string; id?: string; children: ReactNode }

export default function Chapter({ name, theme, className = '', id, children }: Props) {
  const autoId = useId()
  const chapterId = id ?? autoId
  const ref = useRef<HTMLElement>(null)
  const { register, setActive } = useHudApi()

  useEffect(() => register({ id: chapterId, name, theme }), [register, chapterId, name, theme])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(chapterId) }),
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [chapterId, setActive])

  return (
    <section ref={ref} data-theme={theme} id={id}
      className={`${theme === 'dark' ? 'bg-dark text-dark-ink' : 'bg-paper text-ink'} ${className}`}>
      {children}
    </section>
  )
}
