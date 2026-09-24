import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";

const siteUrl = SITE_URL;
const guideBase = "/guides/codex-content-os";

export const metadata: Metadata = {
  title: "ContentOS — читать, скачать, содержание",
  description:
    "Гайд «ContentOS: конвейер Reels на Codex или Claude Code» — читать онлайн, скачать PDF или стартовый код, полное содержание по разделам.",
  alternates: { canonical: `${siteUrl}${guideBase}` },
  robots: { index: false, follow: true },
  openGraph: {
    title: "ContentOS — читать, скачать, содержание",
    description:
      "Гайд «ContentOS: конвейер Reels на Codex или Claude Code» — читать онлайн, скачать PDF или стартовый код, полное содержание по разделам.",
    type: "website",
    url: `${siteUrl}${guideBase}`,
    locale: "ru_RU",
  },
};

// White + Lime kalka DS (app/kalka.css). Global StudioFooter (app/layout.tsx)
// covers the footer, so no page-level one here.

type Section = { n: string; title: string };

const contents: { group: string; sections: Section[] }[] = [
  {
    group: "Стратегия и архитектура",
    sections: [
      { n: "01", title: "Ваша цель и итоговая система" },
      { n: "02", title: "Исходная точка и задачи" },
      { n: "03", title: "Аккаунты и направления" },
      { n: "04", title: "Результат первой недели" },
      { n: "05", title: "Архитектура системы" },
      { n: "06", title: "Технологическая основа" },
      { n: "07", title: "Структура вашего рабочего пространства" },
      { n: "08", title: "Источники материалов: Apple Notes и Apple Photos" },
    ],
  },
  {
    group: "Конвейер и инструменты",
    sections: [
      { n: "09", title: "Монтажный конвейер" },
      { n: "10", title: "Разговорные ролики и аватар" },
      { n: "11", title: "Какие skills подключить" },
      { n: "12", title: "Как вы будете пользоваться системой" },
      { n: "13", title: "Сервисы и роли" },
      { n: "14", title: "ChatGPT Desktop и Codex CLI: два интерфейса" },
      { n: "15", title: "ChatPlace: что именно настраивать" },
      { n: "16", title: "ChatPlace в Codex и Claude Code: подключение MCP" },
      { n: "17", title: "Автопубликация" },
      { n: "18", title: "Контентная логика по направлениям" },
      { n: "19", title: "Качественные посты" },
      { n: "20", title: "Качественные карусели" },
    ],
  },
  {
    group: "Внедрение и результат",
    sections: [
      { n: "21", title: "Ваш семидневный план внедрения" },
      { n: "22", title: "Как будет устроено сопровождение" },
      { n: "23", title: "Критерии готовности" },
      { n: "24", title: "Метрики" },
      { n: "25", title: "Безопасность и приватность" },
      { n: "26", title: "Ответы на ваши вопросы" },
      { n: "27", title: "Что нужно согласовать до старта" },
      { n: "28", title: "Актуальные официальные источники" },
      { n: "29", title: "Итоговая модель работы" },
      { n: "30", title: "С чего начинается работа" },
      { n: "31", title: "Технический стартовый пакет" },
    ],
  },
  {
    group: "Техническая часть",
    sections: [
      { n: "32", title: "Установка агента: Codex или Claude Code" },
      { n: "33", title: "Установка монтажных зависимостей" },
      { n: "34", title: "Готовый каркас AGENTS.md" },
      { n: "35", title: "Готовый каркас $reel-skill" },
      { n: "36", title: "Остальные skills: минимальные спецификации" },
      { n: "37", title: "Техническое ТЗ на развитие стартового reels-pipeline" },
      { n: "38", title: "Первая тестовая задача для нового pipeline" },
      { n: "39", title: "Практические команды по дням" },
      { n: "40", title: "Итог семи рабочих дней" },
    ],
  },
];

const downloads = [
  {
    n: "01",
    label: "Читать онлайн",
    meta: "HTML · оглавление, поиск по разделам",
    href: `${guideBase}/index.html`,
    cta: "Открыть гайд",
  },
  {
    n: "02",
    label: "Скачать PDF",
    meta: "Для офлайн-чтения и печати",
    href: `${guideBase}/ContentOS.pdf`,
    cta: "Скачать PDF",
  },
  {
    n: "03",
    label: "Стартовый код",
    meta: "ContentOS-starter.zip — рабочий ingest/render/qa",
    href: `${guideBase}/ContentOS-starter.zip`,
    cta: "Скачать код",
  },
];

const H2 =
  "font-heading mt-5 max-w-3xl text-balance text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] md:text-5xl";

export default function GuideNavigationPage() {
  return (
    <div className="k-page">
      <main>
        {/* Hero */}
        <section className="border-b border-[#15161a]">
          <div className="mx-auto max-w-7xl px-5 pb-16 pt-24 md:px-14 md:pt-28">
            <nav aria-label="Хлебные крошки">
              <Link href="/products/codex-content-os" className="k-mono -my-3 inline-block bg-white py-3 pr-2 hover:text-[#15161a]">
                &larr; О продукте
              </Link>
            </nav>

            <div className="pt-10 md:pt-14">
              <p className="k-mono inline-block bg-white pr-2">ContentOS · материалы гайда</p>
              <h1
                data-m="lines"
                data-m-hero
                className="font-heading mt-6 max-w-3xl text-balance text-[34px] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[44px] lg:text-[52px]"
              >
                Читайте, скачивайте, смотрите содержание
              </h1>
              <p data-m="reveal" className="mt-6 max-w-2xl bg-white/85 text-[17px] leading-[1.55] text-[#6b6e78]">
                Один и тот же гайд в трёх форматах — выбирайте удобный. Ниже — полное содержание по разделам, чтобы
                сразу найти нужную тему.
              </p>
            </div>
          </div>
        </section>

        {/* Форматы */}
        <section className="border-b border-[#15161a]">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-14 md:py-20">
            <div data-m="stagger" className="grid gap-6 md:grid-cols-3 md:gap-8">
              {downloads.map((d) => (
                <a key={d.label} href={d.href} data-m-item className="k-sheet group block p-7 pt-9 md:p-8">
                  <span className="k-sheet-index">{d.n}</span>
                  <p className="k-mono !text-[#6b6e78]">{d.meta}</p>
                  <h3 className="font-heading mt-3 text-xl font-bold tracking-[-0.02em]">{d.label}</h3>
                  <span className="mt-6 inline-flex items-center gap-2 font-heading text-[15px] font-bold tracking-[-0.01em] text-[#15161a]">
                    {d.cta} <span aria-hidden="true">&rarr;</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Содержание */}
        <section>
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
            <p className="k-mono inline-block bg-white pr-2">40 разделов</p>
            <h2 data-m="lines" className={H2}>
              Что где смотреть
            </h2>

            <div data-m="stagger" className="mt-14 grid gap-6 md:grid-cols-2 md:gap-8">
              {contents.map((block) => (
                <div key={block.group} data-m-item className="k-sheet p-7 pt-8 md:p-8">
                  <p className="k-mono !text-[#15161a]">{block.group}</p>
                  <div className="mt-5 border-t border-[#15161a]">
                    {block.sections.map((s) => (
                      <div key={s.n} className="flex gap-4 border-b border-[#15161a] py-3 text-[15px] leading-relaxed">
                        <span className="font-mono text-[#6b6e78]">{s.n}</span>
                        <span className="text-[#15161a]">{s.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div data-m="reveal" className="k-dark mt-8 p-8 md:p-10">
              <p className="k-mono">Обновления</p>
              <h3 className="font-heading mt-3 text-xl font-bold tracking-[-0.02em] text-white">Гайд обновляется</h3>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/65">
                Ссылка на онлайн-версию остаётся той же — при выходе апдейта просто заходите заново. Форма подписки
                на уведомления есть прямо в начале гайда.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
