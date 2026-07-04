import { Reveal } from "@/components/motion/Reveal";
import { TELEGRAM_URL } from "@/lib/products";

const nodes = [
  { label: "Заявка", caption: "клиент пишет в любом канале" },
  { label: "AI-бот", caption: "отвечает, уточняет, квалифицирует" },
  { label: "CRM", caption: "сделка и история — сами по местам" },
  { label: "Отчёт", caption: "вы видите цифры, а не хаос" },
];

const teaching = [
  {
    name: "Web3nity",
    desc: "авторский курс по внедрению AI для предпринимателей и продактов",
  },
  {
    name: "Дмитрий Румянцев",
    desc: "AI-модуль в программе для 500+ маркетологов",
  },
  {
    name: "ТИТАНЫ · Никита Корытин",
    desc: "приглашённый AI-эксперт закрытого клуба маркетологов",
  },
];

/**
 * Chapter 2 «Система»: the particle stream from the hero portrait assembles
 * a pipeline scheme here. The DOM diagram below is always visible, so the
 * section is complete without the canvas. Absorbs the copy of the former
 * TeachingStrip and DarkBusiness sections.
 */
export function SystemSection() {
  return (
    <section className="border-b border-line">
      <Reveal className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
        <p data-reveal className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted">
          01 — Система
        </p>
        <h2
          data-reveal
          className="mt-3 max-w-2xl font-heading text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] text-ink md:text-[42px]"
        >
          Из хаоса инструментов я собираю{" "}
          <span className="lime-mark">систему</span>.
        </h2>
        <p data-reveal className="mt-3.5 font-hand text-[22px] font-semibold text-ink-muted">
          ↳ один поток: от заявки до отчёта — без ручной рутины
        </p>

        {/* Pipeline scheme. Node boxes are particle anchors (data-stage-node). */}
        <div
          data-stage="scheme"
          className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-stretch md:gap-4"
        >
          {nodes.map((node, i) => (
            <div key={node.label} className="contents">
              {i > 0 && (
                <div
                  aria-hidden="true"
                  className="hidden items-center justify-center font-mono text-lg text-ink-muted md:flex"
                >
                  →
                </div>
              )}
              <div
                data-stage-node
                data-reveal
                className="border border-ink bg-paper px-5 py-6"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-muted">
                  0{i + 1}
                </div>
                <div className="mt-2 font-heading text-xl font-bold tracking-[-0.02em] text-ink">
                  {node.label}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {node.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Copy migrated from DarkBusiness. */}
        <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-14">
          <div data-reveal>
            <h3 className="max-w-[480px] font-heading text-2xl font-extrabold leading-[1.12] tracking-[-0.02em] text-ink">
              Нужно, чтобы AI заработал у всей команды, а не один созвон?
            </h3>
            <p className="mt-4 max-w-[480px] text-base leading-[1.55] text-ink-muted">
              Внедряю AI-системы под ключ, учу команду работать с ними и
              остаюсь на связи. Начинаем с 30-минутного разговора о задаче.
            </p>
            <div className="mt-6 h-[3px] w-16 bg-lime" aria-hidden="true" />
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center gap-2 bg-ink px-6 py-3.5 text-[13px] font-bold tracking-tight text-paper transition-colors duration-200 hover:bg-ink/85"
            >
              Рассказать о задаче
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
            <p className="mt-3.5 font-hand text-[22px] font-semibold text-ink-muted">
              ↳ ответ в течение рабочего дня
            </p>
          </div>

          {/* Teaching proof migrated from TeachingStrip. */}
          <div data-reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted">
              Преподаю и консультирую
            </p>
            <p className="mt-3 max-w-[440px] text-base leading-[1.55] text-ink">
              Меня зовут вести AI там, где за результат отвечают репутацией:
            </p>
            <ul className="mt-5 space-y-4">
              {teaching.map((t) => (
                <li key={t.name} className="border-t border-line pt-4">
                  <span className="font-heading text-base font-bold tracking-[-0.01em] text-ink">
                    {t.name}
                  </span>
                  <span className="text-sm text-ink-muted"> — {t.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
