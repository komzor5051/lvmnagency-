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
    value: 65,
    suffix: "%",
    description:
      "Бот заказа цветов на 3 языках с AI-парсингом — почти две трети заказов без участия человека",
    tag: "TELEGRAM-БОТ · ДУБАЙ · 2024",
  },
  {
    value: 35,
    prefix: "−",
    suffix: "%",
    description:
      "Мануальный терапевт: Altegio → Facebook Conversions API — стоимость привлечения клиента снизилась",
    tag: "ИНТЕГРАЦИЯ · ДУБАЙ · 2024",
  },
  {
    value: 4,
    prefix: "×",
    description:
      "Telegram AI-психолог для ПТСР-реабилитации — один бот закрыл работу 3-4 сотрудников, 500+ пользователей",
    tag: "AI-АГЕНТ · МЕДИЦИНА · 2024",
  },
  {
    value: 3,
    prefix: "−",
    suffix: " ч/день",
    description:
      "Мониторинг цен 11 поставщиков: автоматический парсинг вместо ручной сверки каждый день",
    tag: "АВТОМАТИЗАЦИЯ · 2025",
  },
  {
    value: 0,
    suffix: " мин",
    description:
      "Подписочная воронка с YooKassa — ручная обработка платежей полностью исчезла (было 2-3 ч/день)",
    tag: "ПАЙПЛАЙН · 2024",
  },
];

/** Case table: rows reveal sequentially, numbers count up odometer-style. */
export function CasesSection() {
  return (
    <section id="cases" className="scroll-mt-20">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted">
          03 — Кейсы
        </p>
        <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-[-0.03em] text-ink md:text-[42px] md:leading-tight">
          Цифры из <span className="lime-mark">реальных</span> проектов
        </h2>
        <p className="mt-3.5 font-hand text-[22px] font-semibold text-ink-muted">
          ↳ не презентаций — внедрений в продакшн
        </p>

        <Reveal className="mt-8 border-t border-ink" stagger={0.15}>
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
                className="font-heading text-3xl font-extrabold tracking-[-0.03em] text-ink"
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
