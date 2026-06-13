import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { DrawLine } from "@/components/motion/DrawLine";
import { getProduct, isBuyable, TELEGRAM_URL } from "@/lib/products";

export const metadata: Metadata = {
  title: "Обо мне — Влад Лямин",
  description:
    "Я не агентство. Я инженер, который отвечает лично. С 2022 года внедряю AI-системы: 40+ внедрений, 50+ обученных. Принципы скучного AI и мой стек.",
  alternates: { canonical: "/about" },
};

const TIMELINE: { years: string; text: string }[] = [
  {
    years: "до 2022",
    text: "Работа с клиентами и собственный SaaS. Научился главному: продукт никому не нужен, если он не экономит деньги или время. Этот фильтр я с тех пор прикладываю ко всему.",
  },
  {
    years: "2022",
    text: "Ушёл в AI. Первые внедрения — боты и автоматизации, которые заменяли рутину, а не людей. Понял, что рынок завален демо и пуст на работающие системы.",
  },
  {
    years: "2023–2024",
    text: "Собрал стек, который не подводит: n8n, Supabase, Claude API. Перевёл десятки процессов с ручного труда на пайплайны. Внедрений стало 40+.",
  },
  {
    years: "2025",
    text: "Обучил 50+ человек работать с AI руками, а не на словах. Сместил фокус на фаундеров и владельцев бизнеса — тех, кто принимает решения и считает деньги.",
  },
  {
    years: "сейчас",
    text: "Внедряю, обучаю, консультирую. Лично — без менеджеров, передаточных звеньев и слайдов вместо результата.",
  },
];

const EXPERTISE: { label: string; name: string; text: string; href?: string; hrefLabel?: string }[] = [
  {
    label: "сейчас",
    name: "Web3nity",
    text: "Курирую AI-курсы: разбираю работы учеников, помогаю довести автоматизации до рабочего состояния, а не до демо.",
    href: "https://www.youtube.com/@Web3nity",
    hrefLabel: "youtube",
  },
  {
    label: "курсы",
    name: "Дмитрий Румянцев",
    text: "Был куратором на курсах — у одного из самых известных в рунете преподавателей маркетинга.",
  },
  {
    label: "клуб",
    name: "Никита Корытин · ТИТАНЫ",
    text: "Пишу экспертный AI-контент для закрытого клуба ТИТАНЫ — для аудитории, которая принимает решения и платит за конкретику.",
    href: "https://nkorytin.ru/",
    hrefLabel: "nkorytin.ru",
  },
];

const PRINCIPLES: { title: string; text: string }[] = [
  {
    title: "AI — это не магия",
    text: "Это софт. У него есть стоимость, задержки, процент ошибок и место в вашем процессе. Кто продаёт магию — продаёт презентацию.",
  },
  {
    title: "Сначала метрика, потом модель",
    text: "Пока не названа цифра, которую меняем — часы, заявки, конверсия — обсуждать нечего. Модель выбирается под метрику, а не наоборот.",
  },
  {
    title: "Скучная автоматизация выигрывает у красивых агентов",
    text: "Парсер, который год работает без сбоев, приносит больше, чем впечатляющий агент, который падает раз в неделю. Я строю скучное и надёжное.",
  },
  {
    title: "Обучение важнее внедрения",
    text: "Система, в которой разбираетесь только вы — это зависимость, а не актив. Я передаю команде понимание, как это работает и как это менять.",
  },
];

const STACK = ["n8n", "Supabase", "JavaScript / Node.js", "Telegram Bot API", "Claude API"];

function consultationHref(): string {
  const c = getProduct("consultation");
  if (c && isBuyable(c) && c.buy.kind !== "waitlist") return c.buy.url;
  return TELEGRAM_URL;
}

export default function AboutPage() {
  const ctaHref = consultationHref();
  const external = ctaHref.startsWith("http");

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Nav */}
      <header className="border-b border-line">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="text-[15px] font-bold tracking-[-0.02em]">
            Влад Лямин
          </Link>
          <div className="flex items-center gap-5 sm:gap-8">
            <Link
              href="/products"
              className="hidden text-sm text-ink-muted transition-colors hover:text-ink sm:block"
            >
              Продукты
            </Link>
            <Link href="/about" className="hidden text-sm font-semibold underline-accent sm:block">
              Обо мне
            </Link>
            <Link
              href="/blog"
              className="hidden text-sm text-ink-muted transition-colors hover:text-ink sm:block"
            >
              Блог
            </Link>
            <a
              href={ctaHref}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="bg-ink px-4 py-2 text-sm font-semibold text-paper transition-opacity hover:opacity-85"
            >
              Консультация
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <Reveal>
          <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div>
              <p data-reveal className="font-mono text-xs tracking-[0.18em] text-ink-muted uppercase">
                Обо мне · Влад Лямин · Новосибирск
              </p>
              <h1
                data-reveal
                className="mt-6 font-heading text-4xl leading-[1.05] font-bold tracking-[-0.035em] text-balance sm:text-5xl lg:text-6xl"
              >
                Я не агентство. Я инженер, который отвечает{" "}
                <span className="relative inline-block">
                  лично
                  <DrawLine className="absolute -bottom-1 left-0 h-[0.16em] w-full" delay={0.7} />
                </span>
                .
              </h1>
              <p data-reveal className="mt-7 max-w-xl text-lg leading-relaxed text-ink-muted">
                С 2022 года внедряю AI-системы в реальные бизнесы. Не презентации и не пилоты ради
                пилотов — пайплайны, которые работают каждый день и окупают себя цифрами. Каждый
                проект делаю сам и сам же за него отвечаю.
              </p>
              <div data-reveal className="mt-9 flex flex-wrap items-center gap-x-10 gap-y-4">
                <div>
                  <div className="font-heading text-2xl font-bold tracking-[-0.03em]">40+</div>
                  <div className="font-mono text-xs text-ink-muted">внедрений</div>
                </div>
                <div>
                  <div className="font-heading text-2xl font-bold tracking-[-0.03em]">50+</div>
                  <div className="font-mono text-xs text-ink-muted">обученных</div>
                </div>
                <div>
                  <div className="font-heading text-2xl font-bold tracking-[-0.03em]">2022</div>
                  <div className="font-mono text-xs text-ink-muted">в AI с этого года</div>
                </div>
              </div>
            </div>

            <div data-reveal className="mx-auto w-full max-w-xs lg:max-w-sm">
              <TiltCard maxTilt={6} className="overflow-hidden">
                <Image
                  src="/portrait.jpg"
                  alt="Влад Лямин, AI-инженер"
                  width={880}
                  height={1100}
                  priority
                  className="aspect-[4/5] w-full object-cover grayscale-[15%]"
                />
              </TiltCard>
            </div>
          </section>
        </Reveal>

        {/* Путь */}
        <Reveal>
          <section className="border-t border-line">
            <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
              <p data-reveal className="font-mono text-xs tracking-[0.18em] text-accent uppercase">
                01 / Путь
              </p>
              <h2
                data-reveal
                className="mt-4 max-w-2xl font-heading text-3xl font-bold tracking-[-0.03em] sm:text-4xl"
              >
                Короткая версия: от сервиса и SaaS — к AI-системам
              </h2>

              <div className="mt-12">
                {TIMELINE.map((item) => (
                  <div
                    key={item.years}
                    data-reveal
                    className="grid gap-3 border-t border-line py-7 last:border-b sm:grid-cols-[140px_48px_1fr] sm:items-baseline sm:gap-6"
                  >
                    <div className="font-mono text-sm font-medium whitespace-nowrap">
                      {item.years}
                    </div>
                    <div aria-hidden="true" className="hidden h-0.5 w-8 self-center bg-accent sm:block" />
                    <p className="max-w-2xl leading-relaxed text-ink-muted">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* Экспертиза */}
        <Reveal>
          <section className="border-t border-line">
            <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
              <p data-reveal className="font-mono text-xs tracking-[0.18em] text-accent uppercase">
                02 / Экспертиза
              </p>
              <h2
                data-reveal
                className="mt-4 max-w-2xl font-heading text-3xl font-bold tracking-[-0.03em] sm:text-4xl"
              >
                Меня зовут вести AI там, где за результат отвечают репутацией
              </h2>
              <p data-reveal className="mt-5 max-w-xl leading-relaxed text-ink-muted">
                «Обучил 50+» из таймлайна — это не абстракция. Вот площадки, где я
                курирую обучение и пишу экспертный контент.
              </p>

              <div className="mt-12">
                {EXPERTISE.map((item) => (
                  <div
                    key={item.name}
                    data-reveal
                    className="grid gap-3 border-t border-line py-7 last:border-b sm:grid-cols-[140px_48px_1fr] sm:items-baseline sm:gap-6"
                  >
                    <div className="font-mono text-sm font-medium whitespace-nowrap">
                      {item.label}
                    </div>
                    <div aria-hidden="true" className="hidden h-0.5 w-8 self-center bg-accent sm:block" />
                    <div className="max-w-2xl">
                      <h3 className="font-heading text-lg font-bold tracking-[-0.02em] text-ink">
                        {item.name}
                      </h3>
                      <p className="mt-2 leading-relaxed text-ink-muted">{item.text}</p>
                      {item.href && (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block font-mono text-xs underline-accent transition-opacity hover:opacity-70"
                        >
                          {item.hrefLabel} ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* Принципы скучного AI */}
        <Reveal>
          <section className="border-t border-line">
            <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
              <p data-reveal className="font-mono text-xs tracking-[0.18em] text-accent uppercase">
                03 / Принципы
              </p>
              <h2
                data-reveal
                className="mt-4 max-w-2xl font-heading text-3xl font-bold tracking-[-0.03em] sm:text-4xl"
              >
                Принципы <span className="marker-accent">скучного AI</span>
              </h2>
              <p data-reveal className="mt-5 max-w-xl leading-relaxed text-ink-muted">
                Четыре правила, по которым я беру и не беру проекты. Они скучные — поэтому и работают.
              </p>

              <ol className="mt-12 grid gap-x-12 gap-y-12 lg:grid-cols-2">
                {PRINCIPLES.map((p, i) => (
                  <li key={p.title} data-reveal className="flex gap-6">
                    <span
                      aria-hidden="true"
                      className="font-mono text-4xl leading-none font-bold text-accent sm:text-5xl"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-heading text-xl font-bold tracking-[-0.02em] sm:text-2xl">{p.title}</h3>
                      <p className="mt-3 leading-relaxed text-ink-muted">{p.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </Reveal>

        {/* Стек */}
        <Reveal>
          <section className="border-t border-line">
            <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
              <p data-reveal className="font-mono text-xs tracking-[0.18em] text-accent uppercase">
                04 / Стек
              </p>
              <h2 data-reveal className="mt-4 font-heading text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
                Инструменты, которые не подводят
              </h2>
              <p data-reveal className="mt-5 max-w-xl leading-relaxed text-ink-muted">
                Стек короткий специально. Я выбираю инструменты, которые переживут хайп-цикл, а не
                коллекционирую всё подряд.
              </p>
              <ul data-reveal className="mt-8 flex flex-wrap gap-3">
                {STACK.map((tool) => (
                  <li
                    key={tool}
                    className="border border-line bg-white px-4 py-2 font-mono text-sm"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </Reveal>

        {/* CTA */}
        <Reveal>
          <section className="border-t border-line">
            <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
              <h2
                data-reveal
                className="max-w-3xl font-heading text-3xl leading-[1.1] font-bold tracking-[-0.035em] sm:text-5xl"
              >
                Хотите понять, где AI окупится именно у вас?
              </h2>
              <p data-reveal className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
                Начнём с часа. Разберём вашу задачу и выйдем с конкретным планом — что
                автоматизировать, чем и за сколько.
              </p>
              <div data-reveal className="mt-10 flex flex-wrap items-center gap-6">
                <a
                  href={ctaHref}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="bg-ink px-7 py-4 text-base font-semibold text-paper transition-opacity hover:opacity-85"
                >
                  Консультация — 5 000 ₽
                </a>
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-medium underline-accent transition-opacity hover:opacity-70"
                >
                  или напишите в Telegram @lyaminvl
                </a>
              </div>
            </div>
          </section>
        </Reveal>
      </main>

      {/* Footer */}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-8 sm:px-8">
          <p className="font-mono text-xs text-ink-muted">
            Влад Лямин · AI-инженер · Новосибирск
          </p>
          <div className="flex items-center gap-6">
            <Link href="/products" className="text-sm text-ink-muted transition-colors hover:text-ink">
              Продукты
            </Link>
            <Link href="/blog" className="text-sm text-ink-muted transition-colors hover:text-ink">
              Блог
            </Link>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              Telegram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
