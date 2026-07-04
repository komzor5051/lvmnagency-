'use client'
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'

export type ChapterInfo = { id: string; name: string; theme: 'light' | 'dark' }
type HudState = {
  chapters: ChapterInfo[]
  activeIndex: number
  extras: { bl?: string; br?: string }
}
type HudApi = {
  register: (c: ChapterInfo) => () => void
  setActive: (id: string) => void
  setHudExtras: (e: { bl?: string; br?: string }) => void
}
const StateCtx = createContext<HudState>({ chapters: [], activeIndex: 0, extras: {} })
const ApiCtx = createContext<HudApi | null>(null)

export function HudProvider({ children }: { children: ReactNode }) {
  const [chapters, setChapters] = useState<ChapterInfo[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [extras, setExtras] = useState<{ bl?: string; br?: string }>({})
  const order = useRef<string[]>([])

  const register = useCallback((c: ChapterInfo) => {
    setChapters(prev => {
      if (!order.current.includes(c.id)) order.current.push(c.id)
      const next = [...prev.filter(p => p.id !== c.id), c]
      next.sort((a, b) => order.current.indexOf(a.id) - order.current.indexOf(b.id))
      return next
    })
    return () => {
      order.current = order.current.filter(id => id !== c.id)
      setChapters(prev => prev.filter(p => p.id !== c.id))
    }
  }, [])

  const api = useMemo<HudApi>(() => ({
    register,
    setActive: setActiveId,
    setHudExtras: setExtras,
  }), [register])

  const activeIndex = Math.max(0, chapters.findIndex(c => c.id === activeId))
  return (
    <ApiCtx.Provider value={api}>
      <StateCtx.Provider value={{ chapters, activeIndex, extras }}>{children}</StateCtx.Provider>
    </ApiCtx.Provider>
  )
}
export const useHudState = () => useContext(StateCtx)
export const useHudApi = () => {
  const api = useContext(ApiCtx)
  if (!api) throw new Error('HudProvider missing')
  return api
}
