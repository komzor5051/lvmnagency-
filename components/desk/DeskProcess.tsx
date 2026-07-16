const STEPS = [
  {
    title: "Аудит",
    text: "Смотрю, как устроен ваш бизнес: где рутина съедает часы и что можно передать машине.",
    note: "начинаем здесь",
  },
  {
    title: "Прототип",
    text: "Собираю рабочий прототип на ваших данных. Вы видите результат до того, как платите за внедрение.",
  },
  {
    title: "Система",
    text: "Внедряю, обучаю вас и команду. Система остаётся у вас и работает без меня.",
    note: "работает без меня",
  },
];

export default function DeskProcess() {
  return (
    <section className="py-[130px] max-md:py-[84px]">
      <div className="mx-auto max-w-[1240px] px-8 max-md:px-4">
        <div className="mb-16 max-w-[720px]">
          <h2 className="desk-display text-[clamp(32px,3.6vw,52px)] text-ink" data-rv>
            От аудита <span className="hl">до системы</span>
          </h2>
        </div>

        <div className="relative" data-desk-proc>
          <svg
            className="pointer-events-none absolute top-[30px] left-[4%] h-[120px] w-[92%] overflow-visible max-md:hidden"
            viewBox="0 0 1100 120"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              id="desk-proc-path"
              d="M 20 90 C 200 20, 380 110, 550 60 S 900 20, 1080 80"
              className="fill-none stroke-ink"
              strokeWidth="1.6"
              strokeDasharray="7 7"
            />
          </svg>
          <div className="grid grid-cols-3 gap-11 pt-[150px] max-md:grid-cols-1 max-md:gap-12 max-md:pt-10">
            {STEPS.map((s, i) => (
              <div
                key={s.title}
                className={`desk-sheet--low relative border border-line bg-white px-[30px] py-[34px] ${
                  i % 2 ? "rotate-[1.2deg]" : "-rotate-[1deg]"
                }`}
                data-rv
              >
                <span className="desk-pin" aria-hidden />
                <h3 className="mb-[10px] font-tektur text-[24px] font-bold text-ink">{s.title}</h3>
                <p className="text-[15px] leading-[1.58] text-ink-muted">{s.text}</p>
                {s.note && (
                  <span className="desk-note mt-[14px] inline-block text-[17px] text-ink">
                    {s.note}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
