'use client'
import Link from 'next/link'
import Chapter from '@/components/hud/Chapter'
import SplitLines from '@/components/motion/SplitLines'
import PortraitFrame from '@/components/motion/PortraitFrame'

export default function ChapterAbout() {
  return (
    <Chapter name="About" theme="dark" className="px-[6vw] py-28">
      <div className="grid gap-14 md:grid-cols-[1fr_1.2fr] md:items-center md:gap-20">
        <figure className="relative w-full max-w-[420px]">
          <span aria-hidden className="absolute -right-3 -bottom-3 h-full w-full border border-dark-line" />
          <PortraitFrame
            src="/portrait-editorial.jpg"
            alt="Влад Лямин"
            className="relative aspect-[3/4] w-full border border-dark-line bg-dark"
          />
          <figcaption className="mono-label mt-4 flex items-center justify-between text-dark-muted">
            <span>Влад Лямин</span>
            <span className="flex items-center gap-2">
              <span className="inline-block size-1.5 bg-lime" />
              AI-инженер
            </span>
          </figcaption>
        </figure>
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
              className="relative inline-block border-b-2 border-dark-ink pb-[1px] text-[15px] font-medium text-dark-ink transition-opacity hover:opacity-60 after:absolute after:content-[''] after:-inset-x-2 after:-inset-y-[8px]"
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
