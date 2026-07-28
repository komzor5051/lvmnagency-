import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vladlyamin.ru";

export const metadata: Metadata = {
  title: "Обо мне",
  description:
    "С 2022 года помогаю фаундерам строить и масштабировать системы с помощью AI. 40+ внедрений, принципы скучного AI.",
  alternates: { canonical: `${siteUrl}/about` },
  openGraph: {
    title: "Обо мне — Влад Лямин",
    description:
      "С 2022 года помогаю фаундерам строить и масштабировать системы с помощью AI. 40+ внедрений, принципы скучного AI.",
    type: "profile",
    url: `${siteUrl}/about`,
    locale: "ru_RU",
    images: [{ url: `${siteUrl}/portrait.jpg`, width: 880, height: 1100, alt: "Влад Лямин" }],
  },
};

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: "Влад Лямин",
  alternateName: "Vladislav Lyamin",
  url: siteUrl,
  image: {
    "@type": "ImageObject",
    url: `${siteUrl}/portrait.jpg`,
    width: 880,
    height: 1100,
  },
  description:
    "Помогаю фаундерам строить и масштабировать системы с помощью AI. 40+ внедрений, 50+ обученных с 2022 года.",
  knowsAbout: [
    "AI-автоматизация бизнеса",
    "Business Process Automation",
    "LLM Integration",
  ],
  sameAs: ["https://telegram.me/lyaminvl"],
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${siteUrl}/about`,
  },
};

export default function AboutPage() {
  return (
    <main className="studio-main studio-about">
      <section className="studio-about-hero">
        <div className="studio-frame studio-about-hero-grid">
          <div data-studio-reveal>
            <p className="studio-eyebrow">ОБО МНЕ / VL 2026</p>
            <h1>Строю системы,<br />в которых AI<br /><em>делает работу.</em></h1>
            <p className="studio-about-lead">
              Я Влад Лямин. Помогаю фаундерам превращать разрозненные AI-инструменты
              в понятные процессы, которые экономят время и дают измеримый результат.
            </p>
            <Link className="studio-button studio-button--lime" href="/audit">
              Разобрать мой бизнес <b aria-hidden="true">↗</b>
            </Link>
          </div>
          <div className="studio-about-portrait" data-studio-reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/portrait.jpg" alt="Влад Лямин" />
            <div><span>AI ENGINEER</span><span>40+ ВНЕДРЕНИЙ</span></div>
          </div>
        </div>
      </section>

      <section className="studio-about-story">
        <div className="studio-frame studio-about-story-grid">
          <p className="studio-eyebrow studio-eyebrow--dark" data-studio-reveal>КОНТЕКСТ / НЕ БИОГРАФИЯ</p>
          <div data-studio-reveal>
            <h2>Не продаю «нейросети».<br />Исправляю <em>процессы.</em></h2>
            <p>
              В 2022 году AI стал моей основной рабочей средой. С тех пор я прошёл путь
              от точечных ботов и контентных сценариев до систем, которые связывают данные,
              решения и действия команды.
            </p>
            <p>
              Мне важен скучный хороший результат: меньше ручной работы, быстрее цикл,
              яснее ответственность. Поэтому начинаю не с выбора модели, а с того, где
              бизнес теряет время и деньги.
            </p>
          </div>
        </div>
      </section>

      <section className="studio-about-timeline">
        <div className="studio-frame">
          <header className="studio-section-head studio-section-head--light" data-studio-reveal>
            <p className="studio-eyebrow">ТРАЕКТОРИЯ</p>
            <h2>Опыт, собранный<br />в <em>систему.</em></h2>
          </header>
          <div className="studio-timeline">
            {[
              ["2022", "Первые AI-системы", "Автоматизации, контентные процессы и работа с LLM до того, как это стало отдельной строкой в стратегии."],
              ["2023–24", "От инструментов к процессам", "Фокус сместился с промптов на архитектуру: данные, контроль качества, интеграции и обучение команды."],
              ["2025", "40+ внедрений", "Практика в разных задачах — от продаж и маркетинга до внутренних операций и продуктов."],
              ["Сейчас", "AI Operating Systems", "Строю целостные рабочие контуры для фаундеров и небольших команд, где AI встроен в ежедневный ритм."],
            ].map(([year, title, text]) => (
              <article key={year} data-studio-reveal>
                <span>{year}</span><h3>{title}</h3><p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="studio-principles">
        <div className="studio-frame">
          <header className="studio-section-head" data-studio-reveal>
            <p className="studio-eyebrow studio-eyebrow--dark">ПРИНЦИПЫ</p>
            <h2>Как я принимаю<br /><em>решения.</em></h2>
          </header>
          <div className="studio-principle-grid">
            {[
              ["01", "Сначала эффект", "Если нельзя объяснить, что станет быстрее, дешевле или точнее, внедрение не нужно."],
              ["02", "Прототип до масштаба", "Проверяем сценарий на реальных данных до большой разработки и долгого контракта."],
              ["03", "Человек контролирует", "AI делает рутину и предлагает решения, но критические точки остаются прозрачными."],
              ["04", "Всё остаётся у вас", "Доступы, документация и знания передаются команде. Никакой искусственной зависимости."],
            ].map(([n, title, text]) => (
              <article key={n} data-studio-reveal><span>{n}</span><h3>{title}</h3><p>{text}</p></article>
            ))}
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
    </main>
  );
}
