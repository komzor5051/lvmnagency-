import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import "../../products/products.css";

const siteUrl = SITE_URL;
const guideBase = "/guides/codex-content-os";

export const metadata: Metadata = {
  title: "Content OS — читать, скачать, содержание",
  description:
    "Гайд «Content OS: конвейер Reels на Codex или Claude Code» — читать онлайн, скачать PDF или стартовый код, полное содержание по разделам.",
  alternates: { canonical: `${siteUrl}${guideBase}` },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Content OS — читать, скачать, содержание",
    description:
      "Гайд «Content OS: конвейер Reels на Codex или Claude Code» — читать онлайн, скачать PDF или стартовый код, полное содержание по разделам.",
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
      { n: "05", title: "Архитектура системы" },
      { n: "06", title: "Технологическая основа" },
      { n: "07", title: "Структура рабочего пространства" },
    ],
  },
  {
    group: "Конвейер и инструменты",
    sections: [
      { n: "08", title: "Монтажный конвейер" },
      { n: "09", title: "Разговорные ролики и аватар" },
      { n: "10", title: "Какие skills подключить" },
      { n: "11", title: "Как вы будете пользоваться системой" },
      { n: "12", title: "Сервисы и роли" },
      { n: "13", title: "Codex и Claude Code: два интерфейса" },
      { n: "14", title: "ChatPlace: что именно настраивать" },
      { n: "15", title: "Автопубликация" },
      { n: "16", title: "Контентная логика по направлениям" },
    ],
  },
  {
    group: "Внедрение и сопровождение",
    sections: [
      { n: "17", title: "Семидневный план внедрения" },
      { n: "18", title: "Как будет устроено сопровождение" },
      { n: "19", title: "Критерии готовности" },
      { n: "20", title: "Метрики" },
      { n: "21", title: "Безопасность и приватность" },
      { n: "22", title: "Ответы на частые вопросы" },
      { n: "23", title: "Что нужно согласовать до старта" },
      { n: "24", title: "Актуальные официальные источники" },
      { n: "25", title: "Итоговая модель работы" },
      { n: "26", title: "С чего начинается работа" },
      { n: "27", title: "Технический стартовый пакет" },
    ],
  },
  {
    group: "Установка и техническая спецификация",
    sections: [
      { n: "28", title: "Установка Codex и Claude Code" },
      { n: "29", title: "Установка монтажных зависимостей" },
      { n: "30", title: "Готовый каркас AGENTS.md / CLAUDE.md" },
      { n: "31", title: "Готовый каркас $reel-skill" },
      { n: "32", title: "Остальные skills: минимальные спецификации" },
      { n: "33", title: "Техническое ТЗ на развитие pipeline" },
      { n: "34", title: "Первая тестовая задача" },
      { n: "35", title: "Практические команды по дням" },
      { n: "36", title: "Итог семи рабочих дней" },
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
    href: `${guideBase}/codex_content_os_guide.pdf`,
    cta: "Скачать PDF",
  },
  {
    label: "Стартовый код",
    meta: "content-os-starter.zip — рабочий ingest/render/qa",
    href: `${guideBase}/content-os-starter.zip`,
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
              <p className="bento-mono">Content OS · материалы гайда</p>
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
            <p className="bento-mono">36 разделов</p>
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
