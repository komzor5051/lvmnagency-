import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";

type CaseRow = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  description: string;
  tag: string;
};

const cases: CaseRow[] = [
  {
    value: 38,
    prefix: "−",
    suffix: "%",
    description:
      "Агент для закупок в retail-сети — минус 38% времени менеджера на заказы",
    tag: "АГЕНТ · 2025 · НДА",
  },
  {
    value: 1.7,
    prefix: "×",
    decimals: 1,
    description:
      "AI-скоринг заявок в медклинике — конверсия в запись выросла в 1.7 раза",
    tag: "СКОРИНГ · 2025",
  },
  {
    value: 33,
    suffix: "×",
    description:
      "Генерация учебного контента для EdTech — 400 часов превратились в 12",
    tag: "ПАЙПЛАЙН · 2024",
  },
  {
    value: 4.8,
    decimals: 1,
    description: "AI-саппорт в B2B — CSAT 4.8 из 5 при ответах за минуты, не часы",
    tag: "САППОРТ · 2024",
  },
  {
    value: 6,
    suffix: " мин",
    description: "Комплаенс-проверка документов в банке — с двух дней до 6 минут",
    tag: "КОМПЛАЕНС · 2024",
  },
];

/** Case table: rows reveal sequentially, numbers count up odometer-style. */
export function CasesSection() {
  return (
    <section id="cases" className="scroll-mt-20">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
          03 — КЕЙСЫ
        </p>
        <h2 className="mt-3 font-heading text-3xl font-bold tracking-[-0.03em] text-ink md:text-[42px] md:leading-tight">
          Цифры из реальных проектов
        </h2>

        <Reveal className="mt-8 border-t border-line" stagger={0.15}>
          {cases.map((c) => (
            <div
              key={c.tag}
              data-reveal
              className="grid grid-cols-[96px_1fr] items-baseline gap-x-5 gap-y-2 border-b border-line py-6 md:grid-cols-[120px_1fr_200px]"
            >
              <CountUp
                value={c.value}
                prefix={c.prefix}
                suffix={c.suffix}
                decimals={c.decimals}
                duration={1.1}
                className="font-heading text-3xl font-bold tracking-[-0.03em] text-accent"
              />
              <p className="text-[17px] font-medium leading-snug text-ink">
                {c.description}
              </p>
              <p className="col-start-2 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-muted md:col-start-auto md:text-right">
                {c.tag}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
