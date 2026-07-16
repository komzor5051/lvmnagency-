import Image from "next/image";

export default function DeskAboutHero() {
  return (
    <header className="relative pt-[110px] max-md:pt-[96px]" data-desk-hero>
      <div className="mx-auto max-w-[1240px] px-8 max-md:px-4">
        <div className="relative min-h-[560px] max-md:min-h-0 max-md:pb-4">
          {/* Main sheet */}
          <div
            className="desk-sheet absolute top-[4%] left-0 w-[56%] px-14 pt-[56px] pb-[48px] max-md:static max-md:w-full max-md:px-7 max-md:py-10"
            data-rv
            data-depth="0.2"
          >
            <h1 className="desk-display text-[clamp(34px,4vw,58px)] text-ink">
              Строю системы. <span className="hl">Своими руками.</span>
            </h1>
            <p className="mt-[28px] max-w-[46ch] text-[17px] leading-[1.62] text-ink-muted">
              С 2022 года строю AI-системы для бизнеса — от первого созвона до передачи вам и
              команде. Каждый процесс собираю сам, без промежуточных менеджеров. Я — тот, с кем вы
              разговариваете, и тот, кто пишет код.
            </p>
          </div>

          {/* Polaroid */}
          <figure
            className="desk-sheet--high absolute top-0 right-[3%] w-[320px] border border-line bg-white p-[14px] pb-[54px] max-md:static max-md:mx-auto max-md:mt-10 max-md:rotate-2"
            data-rv
            data-depth="0.5"
            data-rot="2.8"
            data-tilt
          >
            <span className="desk-tape" aria-hidden />
            <Image
              src="/portrait-editorial.jpg"
              alt="Влад Лямин"
              width={640}
              height={800}
              priority
              className="h-auto w-full grayscale contrast-105"
            />
            <figcaption className="desk-note absolute bottom-3 left-0 right-0 text-center text-[19px]">
              строю сам
            </figcaption>
          </figure>

          {/* Sticky note */}
          <div
            className="desk-sheet--low absolute bottom-[16%] left-[60%] w-[250px] border-0 bg-lime px-6 py-[22px] max-md:static max-md:mx-auto max-md:mt-9 max-md:-rotate-2"
            data-rv
            data-depth="0.75"
            data-rot="-2.2"
          >
            <span className="desk-note block text-[19px] leading-[1.35] text-ink">
              40+ внедрений, 50+ обученных
            </span>
          </div>

          {/* Chip */}
          <span
            className="desk-sheet--low absolute bottom-[8%] left-[8%] px-4 py-[10px] text-[13px] font-semibold max-md:static max-md:mt-6 max-md:ml-8 max-md:inline-block max-md:rotate-[1.6deg]"
            data-rv
            data-depth="0.4"
            data-rot="1.6"
          >
            С 2022 года в AI
          </span>
        </div>
      </div>
    </header>
  );
}
