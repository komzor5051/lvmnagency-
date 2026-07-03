import { Reveal } from "@/components/motion/Reveal";

type NotItem = { not: string; text: string };

const items: NotItem[] = [
  {
    not: "Не агентство",
    text: "Работаете со мной напрямую. Без менеджеров и пересылок: задачу делает и отвечает за неё один человек.",
  },
  {
    not: "Не очередной курс",
    text: "Не продаю «изучите AI за 30 дней». Берём ваши реальные задачи и доводим до работающего результата.",
  },
  {
    not: "Не разовый проект",
    text: "Подрядчик уходит — система умирает. Я остаюсь, пока вы и команда не сможете работать с AI без меня.",
  },
];

/** Positioning by negation: three short rebuttals to the usual objections. */
export function NotStrip() {
  return (
    <section className="border-b border-line">
      <Reveal className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <p data-reveal className="font-mono text-[11px] tracking-[0.15em] text-ink-muted uppercase">
          Чем я не являюсь
        </p>
        <ul className="mt-8 grid gap-x-12 gap-y-8 sm:grid-cols-3">
          {items.map((item) => (
            <li key={item.not} data-reveal className="border-t border-ink pt-5">
              <div className="font-heading text-xl font-bold tracking-[-0.02em] text-ink">
                {item.not}
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                {item.text}
              </p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
