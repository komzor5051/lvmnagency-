'use client'
import Chapter from '@/components/hud/Chapter'
import SplitLines from '@/components/motion/SplitLines'
import PortraitFrame from '@/components/motion/PortraitFrame'

export default function AboutIntro() {
  return (
    <Chapter name="Intro" theme="dark" className="px-[6vw] py-28">
      <div className="grid gap-14 md:grid-cols-[1.2fr_1fr] md:items-center md:gap-20">
        <div>
          <SplitLines as="h1" className="font-display text-[clamp(40px,7vw,96px)]">
            Строю системы. <em>Своими руками.</em>
          </SplitLines>
          <p className="mt-8 max-w-[520px] text-[17px] leading-relaxed text-dark-muted">
            С 2022 года строю AI-системы для бизнеса — от первого созвона до передачи вам
            и команде. Каждый процесс собираю сам, без промежуточных менеджеров. Я — тот, с
            кем вы разговариваете, и тот, кто пишет код.
          </p>
        </div>
        <figure className="relative w-full max-w-[420px] md:justify-self-end">
          <span aria-hidden className="absolute -right-3 -bottom-3 h-full w-full border border-dark-line" />
          <PortraitFrame
            src="/portrait-editorial.jpg"
            alt="Влад Лямин"
            className="relative aspect-[3/4] w-full border border-dark-line bg-dark"
          />
        </figure>
      </div>
    </Chapter>
  )
}
