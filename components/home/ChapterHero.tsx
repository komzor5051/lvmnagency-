'use client'
import Link from 'next/link'
import Chapter from '@/components/hud/Chapter'
import SplitLines from '@/components/motion/SplitLines'
import HandDrawn from '@/components/motion/HandDrawn'
import Magnetic from '@/components/motion/Magnetic'
import DistortPortrait from '@/components/motion/DistortPortrait'

export default function ChapterHero() {
  return (
    <Chapter name="Hero" theme="light" className="flex min-h-svh flex-col justify-center px-[6vw] py-28">
      <div className="flex flex-col gap-12 md:grid md:grid-cols-[1.6fr_1fr] md:items-center md:gap-16">
        <div>
          <p className="mono-label mb-8 flex items-center gap-3">
            <span className="inline-block size-2 rounded-full bg-lime" />
            Влад Лямин
          </p>
          <SplitLines as="h1" className="font-display text-[clamp(40px,6.2vw,96px)]">
            Помогаю фаундерам строить и масштабировать{' '}
            <HandDrawn kind="circle">системы</HandDrawn> <em>с помощью AI</em>
          </SplitLines>
          <p className="mt-10 max-w-[520px] text-[17px] leading-relaxed text-ink-muted">
            Разбираю, где бизнес держится на ручном труде, и собираю вместо этого систему.
            Она работает, пока вы занимаетесь ростом.
          </p>
          <span className="font-hand mt-4 inline-block -rotate-2 text-2xl text-ink-muted">
            строится 2 недели, работает годами →
          </span>
          <div className="mt-12 flex items-center gap-8">
            <Magnetic>
              <Link href="/audit" className="inline-block text-center bg-ink px-9 py-4 text-[15px] font-medium text-white transition-colors hover:bg-lime hover:text-ink">
                Пройти AI-аудит
              </Link>
            </Magnetic>
            <Link href="https://t.me/lyaminvl" target="_blank" className="link-ul text-[15px]">
              Написать в Telegram
            </Link>
          </div>
        </div>
        <DistortPortrait
          src="/portrait.jpg"
          alt="Влад Лямин"
          className="order-first aspect-[3/4] w-full max-w-[360px] border border-line md:order-none md:mx-0 md:ml-auto"
        />
      </div>
    </Chapter>
  )
}
