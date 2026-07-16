import { TELEGRAM_URL } from "@/lib/products";

const PRINCIPLES = [
  {
    title: "AI — это не магия",
    text: "Это софт. У него есть стоимость, задержки и процент ошибок. Кто продаёт магию — продаёт презентацию.",
  },
  {
    title: "Сначала метрика, потом модель",
    text: "Пока не названа цифра, которую меняем — часы, заявки, конверсия — обсуждать нечего. Модель выбирается под метрику.",
  },
  {
    title: "Скучная автоматизация выигрывает у эффектных агентов",
    text: "Парсер, который год работает без сбоев, приносит больше, чем впечатляющий агент, который падает раз в неделю.",
  },
  {
    title: "Обучение важнее внедрения",
    text: "Система, в которой разбираетесь только вы — это зависимость. Я передаю команде понимание, как это работает и как это менять.",
  },
] as const;

export default function DeskAboutPrinciples() {
  return (
    <section className="py-[110px] max-md:py-[72px]">
      <div className="mx-auto max-w-[1240px] px-8 max-md:px-4">
        <h2 className="desk-display max-w-[820px] text-[clamp(30px,3.4vw,48px)] text-ink" data-rv>
          Скучный AI, который <span className="hl">работает</span>
        </h2>

        <ol className="mt-16 grid grid-cols-2 gap-x-10 gap-y-12 max-md:grid-cols-1 max-md:gap-y-10">
          {PRINCIPLES.map((p, i) => (
            <li
              key={p.title}
              className={`desk-sheet--low relative border border-line bg-white px-[30px] py-[32px] ${
                i % 2 ? "rotate-[0.8deg]" : "-rotate-[0.7deg]"
              }`}
              data-rv
            >
              <span className="desk-pin" aria-hidden />
              <span aria-hidden className="font-tektur text-[14px] font-semibold text-ink-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-tektur mt-2 text-[21px] font-bold leading-snug text-ink">
                {p.title}
              </h3>
              <p className="mt-3 max-w-[46ch] text-[15px] leading-[1.58] text-ink-muted">{p.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-20 flex flex-wrap items-center gap-8 border-t border-line pt-10" data-rv>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="desk-btn no-underline"
          >
            Написать в Telegram
          </a>
          <span className="desk-note -rotate-2 text-[19px] text-ink">отвечаю сам</span>
        </div>
      </div>
    </section>
  );
}
