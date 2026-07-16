import Image from "next/image";
import Link from "next/link";

export default function DeskHero() {
  return (
    <header className="relative min-h-[100dvh] pt-[110px]" data-desk-hero>
      <div className="mx-auto max-w-[1240px] px-8 max-md:px-4">
        <div className="relative h-[calc(100dvh-120px)] min-h-[660px] max-md:h-auto max-md:min-h-0 max-md:pb-14">
          {/* Main sheet */}
          <div
            className="desk-sheet absolute top-[6%] left-0 w-[58%] px-14 pt-[60px] pb-[52px] max-md:static max-md:w-full max-md:px-7 max-md:py-10"
            data-rv
            data-depth="0.25"
          >
            <h1 className="desk-display text-[clamp(38px,4.4vw,64px)] text-ink">
              Я Влад. Строю <span className="hl">системы с AI</span>
            </h1>
            <p className="mt-[30px] max-w-[44ch] text-[17px] leading-[1.62] text-ink-muted">
              Внедряю AI в бизнес, обучаю людей и пишу о том, что реально работает. Здесь — мои
              продукты, заметки и способы поработать со мной.
            </p>
            <div className="mt-8 flex items-center gap-[18px]">
              <Link href="/audit" className="desk-btn desk-btn--lime no-underline">
                Пройти AI-аудит
              </Link>
              <a href="#products" className="link-ul text-[15px]">
                Смотреть продукты
              </a>
            </div>
          </div>

          {/* Polaroid */}
          <figure
            className="desk-sheet--high absolute top-[3%] right-[2%] w-[320px] border border-line bg-white p-[14px] pb-[54px] max-md:static max-md:mx-auto max-md:mt-10 max-md:rotate-2"
            data-rv
            data-depth="0.55"
            data-rot="3.4"
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
              собственной персоной
            </figcaption>
          </figure>

          {/* Sticky note */}
          <div
            className="desk-sheet--low absolute right-[23%] bottom-[12%] w-[280px] border-0 bg-lime px-6 py-[22px] max-md:static max-md:mx-auto max-md:mt-9 max-md:w-[250px] max-md:-rotate-2"
            data-rv
            data-depth="0.8"
            data-rot="-2.6"
          >
            <span className="desk-note block text-[19px] leading-[1.35] text-ink">
              освободить 20 часов в неделю. реально?
            </span>
          </div>

          {/* Hand-drawn arrow */}
          <svg
            className="pointer-events-none absolute right-[43%] bottom-[28%] h-[70px] w-[120px] overflow-visible max-md:hidden"
            viewBox="0 0 130 80"
            aria-hidden
            data-rv
          >
            <path className="desk-stroke draw-hero" d="M 6 10 C 50 6, 95 22, 118 62 M 118 62 l -14 -6 M 118 62 l 2 -15" />
          </svg>

          {/* Chips */}
          <span
            className="desk-sheet--low absolute bottom-[30%] left-[62%] px-4 py-[10px] text-[13px] font-semibold max-md:static max-md:mt-7 max-md:ml-6 max-md:inline-block max-md:rotate-[1.8deg]"
            data-rv
            data-depth="0.4"
            data-rot="1.8"
          >
            Внедрение за 1-3 дня
          </span>
          <span
            className="desk-sheet--low absolute bottom-[7%] left-[7%] px-4 py-[10px] text-[13px] font-semibold max-md:static max-md:mt-4 max-md:ml-24 max-md:inline-block max-md:-rotate-1"
            data-rv
            data-depth="0.65"
            data-rot="-1.4"
          >
            Без кода и найма
          </span>
        </div>
      </div>
    </header>
  );
}
