'use client'
import Chapter from '@/components/hud/Chapter'
import SplitLines from '@/components/motion/SplitLines'
import DistortPortrait from '@/components/motion/DistortPortrait'

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
        <DistortPortrait
          src="/portrait.jpg"
          alt="Влад Лямин"
          className="aspect-[3/4] w-full max-w-[420px] border border-dark-line md:justify-self-end"
        />
      </div>
    </Chapter>
  )
}
