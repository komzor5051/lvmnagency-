import { Reveal } from "@/components/motion/Reveal";

type Item = {
  name: string;
  role: string[];
  href?: string;
  hrefLabel?: string;
};

const items: Item[] = [
  {
    name: "Web3nity",
    role: ["куратор AI-курсов", "сейчас"],
    href: "https://www.youtube.com/@Web3nity",
    hrefLabel: "youtube",
  },
  {
    name: "Дмитрий Румянцев",
    role: ["куратор курсов", "маркетолога"],
  },
  {
    name: "Никита Корытин · ТИТАНЫ",
    role: ["экспертный AI-контент", "для закрытого клуба"],
    href: "https://nkorytin.ru/",
    hrefLabel: "nkorytin.ru",
  },
];

/** Named teaching/expertise proof: where I'm trusted to lead AI. */
export function TeachingStrip() {
  return (
    <section className="border-b border-line">
      <Reveal className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <p data-reveal className="font-mono text-xs tracking-[0.18em] text-accent uppercase">
          Преподаю и консультирую
        </p>
        <h2
          data-reveal
          className="mt-4 max-w-2xl font-heading text-2xl font-bold tracking-[-0.03em] sm:text-3xl"
        >
          Меня зовут вести AI там, где за результат отвечают репутацией.
        </h2>

        <ul className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-3">
          {items.map((item) => (
            <li key={item.name} data-reveal className="border-t border-line pt-5">
              <div className="font-heading text-lg font-bold tracking-[-0.02em] text-ink">
                {item.name}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {item.role.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </p>
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
