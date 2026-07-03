import { Reveal } from "@/components/motion/Reveal";

type Item = {
  name: string;
  desc: string;
  audience?: string;
  href?: string;
  hrefLabel?: string;
};

const items: Item[] = [
  {
    name: "Web3nity",
    desc: "Образовательная платформа о Web3 и AI — веду авторский курс по внедрению AI в работу для их аудитории.",
    audience: "предприниматели и продакты",
    href: "https://www.youtube.com/@Web3nity",
    hrefLabel: "youtube",
  },
  {
    name: "Дмитрий Румянцев",
    desc: "Известный digital-маркетолог, автор книг и курсов для профессионалов рынка — провожу AI-модуль в его программе.",
    audience: "500+ маркетологов",
  },
  {
    name: "Никита Корытин · ТИТАНЫ",
    desc: "Закрытый клуб топовых маркетологов с отбором по invite — приглашённый AI-эксперт: контент и занятия внутри клуба.",
    audience: "закрытое сообщество",
    href: "https://nkorytin.ru/",
    hrefLabel: "nkorytin.ru",
  },
];

/** Named teaching/expertise proof: where I'm trusted to lead AI. */
export function TeachingStrip() {
  return (
    <section className="border-b border-line">
      <Reveal className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <p data-reveal className="font-mono text-[11px] tracking-[0.15em] text-ink-muted uppercase">
          Преподаю и консультирую
        </p>
        <h2
          data-reveal
          className="mt-3 max-w-2xl font-heading text-2xl font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-[34px]"
        >
          Меня зовут вести AI там, где за результат отвечают{" "}
          <span className="lime-mark">репутацией</span>.
        </h2>
        <p data-reveal className="mt-3.5 font-hand text-[22px] font-semibold text-ink-muted">
          ↳ где доверяют вести курс, а не просто выступить
        </p>

        <ul className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-3">
          {items.map((item) => (
            <li key={item.name} data-reveal className="border-t border-line pt-5">
              <div className="font-heading text-lg font-bold tracking-[-0.02em] text-ink">
                {item.name}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {item.desc}
              </p>
              {item.audience && (
                <p className="mt-2 font-mono text-[11px] text-ink-muted/70 uppercase tracking-[0.1em]">
                  {item.audience}
                </p>
              )}
              {item.href && (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block font-mono text-xs underline-accent transition-opacity hover:opacity-70"
                >
                  {item.hrefLabel} ↗
                </a>
              )}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
