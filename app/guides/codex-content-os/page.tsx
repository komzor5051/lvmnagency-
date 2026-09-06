import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import "../../products/products.css";

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

type Section = { n: string; title: string };

const contents: { group: string; sections: Section[] }[] = [
  {
    group: "Стратегия и архитектура",
    sections: [
      { n: "01", title: "Ваша цель и итоговая система" },
      { n: "02", title: "Исходная точка и задачи" },
      { n: "03", title: "Аккаунты и направления" },
      { n: "04", title: "Результат первой недели" },
      { n: "05", title: "За что платят: продуктовая связка" },
      { n: "06", title: "Архитектура системы" },
      { n: "07", title: "Технологическая основа" },
      { n: "08", title: "Структура вашего рабочего пространства" },
      { n: "09", title: "Источники материалов: Apple Notes и Apple Photos" },
    ],
  },
  {
    group: "Конвейер и инструменты",
    sections: [
      { n: "10", title: "Монтажный конвейер" },
      { n: "11", title: "Монтаж-система: фирменный кадр" },
      { n: "12", title: "Разговорные ролики и аватар" },
      { n: "13", title: "Какие skills подключить" },
      { n: "14", title: "Как вы будете пользоваться системой" },
      { n: "15", title: "Сервисы и роли" },
      { n: "16", title: "ChatGPT Desktop и Codex CLI: два интерфейса" },
      { n: "17", title: "ChatPlace: что именно настраивать" },
      { n: "18", title: "ChatPlace в Codex и Claude Code: подключение MCP" },
      { n: "19", title: "Автопубликация" },
      { n: "20", title: "Контентная логика по направлениям" },
      { n: "21", title: "Качественные посты" },
      { n: "22", title: "Качественные карусели" },
    ],
  },
  {
    group: "Внедрение и результат",
    sections: [
      { n: "23", title: "Сайт и платёжка за вечер" },
      { n: "24", title: "Ваш десятидневный план внедрения" },
      { n: "25", title: "Как будет устроено сопровождение" },
      { n: "26", title: "Критерии готовности" },
      { n: "27", title: "Метрики" },
      { n: "28", title: "Безопасность и приватность" },
      { n: "29", title: "Ответы на ваши вопросы" },
      { n: "30", title: "Что нужно согласовать до старта" },
      { n: "31", title: "Актуальные официальные источники" },
      { n: "32", title: "Итоговая модель работы" },
      { n: "33", title: "С чего начинается работа" },
      { n: "34", title: "Технический стартовый пакет" },
    ],
  },
  {
    group: "Техническая часть",
    sections: [
      { n: "35", title: "Установка агента: Codex или Claude Code" },
      { n: "36", title: "Установка монтажных зависимостей" },
      { n: "37", title: "Готовый каркас AGENTS.md" },
      { n: "38", title: "Готовый каркас $reel-skill" },
      { n: "39", title: "Остальные skills: минимальные спецификации" },
      { n: "40", title: "Техническое ТЗ на развитие стартового reels-pipeline" },
      { n: "41", title: "Первая тестовая задача для нового pipeline" },
      { n: "42", title: "Практические команды по дням" },
      { n: "43", title: "Итог десяти рабочих дней" },
    ],
  },
];

const downloads = [
  {
    label: "Читать онлайн",
    meta: "HTML · оглавление, поиск по разделам",
    href: `${guideBase}/index.html`,
    cta: "Открыть гайд",
  },
  {
    label: "Скачать PDF",
    meta: "Для офлайн-чтения и печати",
    href: `${guideBase}/ContentOS.pdf`,
    cta: "Скачать PDF",
  },
  {
    label: "Стартовый код",
    meta: "ContentOS-starter.zip — рабочий ingest/render/qa",
    href: `${guideBase}/ContentOS-starter.zip`,
    cta: "Скачать код",
  },
];

export default function GuideNavigationPage() {
  return (
    <main className="studio-main bento-page">
      <section className="bento-section bento-section--hero">
        <div className="studio-frame">
          <nav aria-label="Хлебные крошки" data-studio-reveal>
            <Link href="/products/codex-content-os" className="bento-crumb">
              ← О продукте
            </Link>
          </nav>
          <div className="bento-grid">
            <header className="bento-tile bento-col-12" data-studio-reveal>
              <p className="bento-mono">ContentOS · материалы гайда</p>
              <h1 className="bento-product-title">
                Читайте, скачивайте, смотрите содержание
              </h1>
              <p className="bento-lead">
                Один и тот же гайд в трёх форматах — выбирайте удобный. Ниже — полное
                содержание по разделам, чтобы сразу найти нужную тему.
              </p>
            </header>
          </div>
        </div>
      </section>

      <section className="bento-section">
        <div className="studio-frame">
          <div className="bento-grid">
            {downloads.map((d, i) => (
              <a
                key={d.label}
                href={d.href}
                className="bento-tile bento-col-4 bento-tile--link"
                data-studio-reveal
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <p className="bento-mono">{d.meta}</p>
                <h3>{d.label}</h3>
                <span className="bento-text-link" style={{ marginTop: "1.1rem" }}>
                  {d.cta}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bento-section bento-section--last">
        <div className="studio-frame">
          <header className="bento-head" data-studio-reveal>
            <p className="bento-mono">43 раздела</p>
            <h2>Что где смотреть</h2>
          </header>
          <div className="bento-grid">
            {contents.map((block, i) => (
              <div
                key={block.group}
                className="bento-tile bento-col-6"
                data-studio-reveal
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <p className="bento-mono">{block.group}</p>
                <ul className="bento-list">
                  {block.sections.map((s) => (
                    <li key={s.n}>
                      {s.n}. {s.title}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="bento-tile bento-col-12 bento-tile--carbon" data-studio-reveal>
              <p className="bento-mono">Обновления</p>
              <h3>Гайд обновляется</h3>
              <p className="bento-lead">
                Ссылка на онлайн-версию остаётся той же — при выходе апдейта просто
                заходите заново. Форма подписки на уведомления есть прямо в начале
                гайда.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
