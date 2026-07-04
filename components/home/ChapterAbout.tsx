'use client'
import Link from 'next/link'
import Chapter from '@/components/hud/Chapter'
import SplitLines from '@/components/motion/SplitLines'
import DistortPortrait from '@/components/motion/DistortPortrait'

export default function ChapterAbout() {
  return (
    <Chapter name="About" theme="dark" className="px-[6vw] py-28">
      <div className="grid gap-14 md:grid-cols-[1fr_1.2fr] md:items-center md:gap-20">
        <DistortPortrait
          src="/portrait.jpg"
          alt="Влад Лямин"
          className="aspect-[3/4] w-full max-w-[420px] border border-dark-line"
        />
        <div>
          <SplitLines as="p" className="font-display text-[clamp(32px,5vw,64px)]">
            Каждую систему собираю сам.
          </SplitLines>
          <p className="mt-6 max-w-[480px] text-[17px] leading-relaxed text-dark-muted">
            От первого созвона до передачи. Вы общаетесь со мной, а не с менеджером.
          </p>
          <div className="mt-10 flex items-center gap-8">
            <Link
              href="/about"
              className="inline-block border-b-2 border-dark-ink pb-[1px] text-[15px] font-medium text-dark-ink transition-opacity hover:opacity-60"
            >
              Обо мне
            </Link>
            <span className="font-hand -rotate-2 text-2xl text-dark-muted">Влад Лямин</span>
          </div>
        </div>
      </div>
    </Chapter>
  )
}
