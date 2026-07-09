'use client'
import Link from 'next/link'
import Chapter from '@/components/hud/Chapter'
import SplitLines from '@/components/motion/SplitLines'
import HandDrawn from '@/components/motion/HandDrawn'
import Magnetic from '@/components/motion/Magnetic'
import DistortPortrait from '@/components/motion/DistortPortrait'

export default function ChapterHero() {
  return (
    <Chapter name="Hero" theme="light" className="flex flex-col justify-center px-[6vw] py-24 pb-20 md:min-h-svh md:py-20">
      <div className="flex flex-col gap-6 md:grid md:grid-cols-[1.7fr_1fr] md:items-center md:gap-16">
        <div className="order-first flex items-center gap-3 md:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/portrait.jpg" alt="Влад Лямин" className="aspect-square w-16 shrink-0 border border-line object-cover" />
          <p className="mono-label flex items-center gap-3">
            <span className="inline-block size-2 rounded-full bg-lime" />
            Влад Лямин
          </p>
        </div>
        <div>
          <p className="mono-label mb-6 hidden items-center gap-3 md:flex">
            <span className="inline-block size-2 rounded-full bg-lime" />
            Влад Лямин
          </p>
          <SplitLines as="h1" className="font-display text-[clamp(32px,4.6vw,68px)]">
            Помогаю фаундерам строить и масштабировать{' '}
            <HandDrawn kind="circle">системы</HandDrawn> <em>с помощью AI</em>
          </SplitLines>
          <p className="mt-5 max-w-[480px] text-[17px] leading-relaxed text-ink-muted md:mt-6">
            Разбираю, где бизнес держится на ручном труде, и собираю вместо этого систему.
            Она работает, пока вы занимаетесь ростом.
          </p>
          <span className="font-hand mt-3 hidden -rotate-2 text-2xl text-ink-muted lg:inline-block">
            строится 2 недели, работает годами →
          </span>
          <div className="mt-6 flex items-center gap-8 md:mt-8">
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
          className="hidden aspect-[3/4] w-full max-w-[360px] border border-line md:mx-0 md:ml-auto md:block"
        />
      </div>
    </Chapter>
  )
}
