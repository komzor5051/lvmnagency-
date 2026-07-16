import Link from "next/link";

export default function DeskCta() {
  return (
    <section className="relative px-4 pt-[170px] pb-[190px] text-center max-md:py-[100px]">
      <span
        className="desk-note absolute top-[100px] right-[15%] rotate-3 text-[20px] text-ink max-md:static max-md:mb-6 max-md:inline-block max-md:-rotate-2"
        data-rv
      >
        15 минут, честно
      </span>
      <h2 className="desk-display mx-auto max-w-[16ch] text-[clamp(38px,5vw,76px)] text-ink" data-rv>
        Положите бизнес <span className="hl">на этот стол</span>
      </h2>
      <p className="mx-auto mt-[30px] mb-10 max-w-[46ch] text-[17px] leading-[1.6] text-ink-muted" data-rv>
        AI-аудит: разбираю ваши процессы и отдаю карту автоматизации с расчётом экономии в деньгах.
      </p>
      <div data-rv>
        <Link href="/audit" className="desk-btn desk-btn--lime no-underline">
          Пройти AI-аудит
        </Link>
      </div>
    </section>
  );
}
