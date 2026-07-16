const TIMELINE = [
  {
    years: "до 2022",
    title: "Первый бизнес",
    text: "Работал с клиентами и вёл собственный SaaS. Понял главное: продукт стоит делать, только если он экономит деньги или время. Этот фильтр использую до сих пор.",
    note: "фильтр №1",
  },
  {
    years: "2022",
    title: "Переход в AI",
    text: "Ушёл в AI и сделал первые внедрения — боты и автоматизации, которые снимали рутину с людей. Стало ясно: рынок полон демонстраций и почти пуст на работающие системы.",
  },
  {
    years: "2023–2024",
    title: "Надёжный стек",
    text: "Собрал инструменты, которые не подводят, и перевёл десятки процессов с ручного труда на автоматические пайплайны. Внедрений стало больше сорока.",
    note: "40+ внедрений",
  },
  {
    years: "2025",
    title: "Обучение и фокус",
    text: "Обучил больше пятидесяти человек работать с AI на практике. Сместил фокус на фаундеров и владельцев бизнеса — тех, кто принимает решения и считает деньги.",
  },
  {
    years: "сейчас",
    title: "Всё сам",
    text: "Внедряю, обучаю и консультирую лично — без промежуточных звеньев между вами и результатом.",
    note: "вы говорите со мной",
  },
] as const;

export default function DeskAboutTimeline() {
  return (
    <section className="py-[110px] max-md:py-[72px]">
      <div className="mx-auto max-w-[1240px] px-8 max-md:px-4">
        <h2 className="desk-display max-w-[720px] text-[clamp(30px,3.4vw,48px)] text-ink" data-rv>
          Как я к этому <span className="hl">пришёл</span>
        </h2>

        <div
          className="desk-sheet relative mt-14 max-w-[860px] -rotate-[0.4deg] px-12 py-4 max-md:rotate-0 max-md:px-6"
          data-rv
        >
          <span className="desk-tape" aria-hidden />
          {TIMELINE.map((item) => (
            <div
              key={item.years}
              className="grid grid-cols-[110px_16px_1fr] items-start gap-8 border-t border-line py-8 first:border-t-0 max-sm:grid-cols-1 max-sm:gap-2"
            >
              <span className="font-tektur pt-1 text-[15px] font-semibold text-ink-muted">
                {item.years}
              </span>
              <span aria-hidden className="mt-2 hidden size-3 bg-lime sm:block" />
              <div>
                <h3 className="font-tektur text-[22px] font-bold text-ink max-md:text-[20px]">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-[56ch] text-[15.5px] leading-[1.6] text-ink-muted">
                  {item.text}
                </p>
                {"note" in item && item.note && (
                  <span className="desk-note mt-3 inline-block -rotate-1 text-[17px] text-ink">
                    {item.note}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
