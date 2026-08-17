import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { jsonLd } from "@/lib/json-ld";
import { FaqSection } from "@/components/FaqSection";

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  title: "Обо мне: помогаю бизнесу освоить AI",
  description:
    "С 2022 года помогаю предпринимателям и небольшим командам встраивать AI в ежедневную работу: 40+ внедрений, 50+ обученных. Работаю лично.",
  alternates: { canonical: `${siteUrl}/about` },
  openGraph: {
    title: "Обо мне — Влад Лямин",
    description:
      "С 2022 года помогаю предпринимателям и небольшим командам освоить AI без технической перегрузки. 40+ внедрений и 50+ обученных.",
    type: "profile",
    url: `${siteUrl}/about`,
    locale: "ru_RU",
    images: [{ url: `${siteUrl}/portrait.jpg`, width: 880, height: 1100, alt: "Влад Лямин" }],
  },
};

// Цифры сверены с главной и lib/products.ts; стек — из CLAUDE.md проекта.
const faq = [
  {
    q: "С кем вы работаете?",
    a: "С фаундерами, соло-предпринимателями и командами до 15 человек — теми, кто сам принимает решения и отвечает за деньги. Не беру проекты, где нужно согласовывать внедрение через три уровня менеджмента.",
  },
  {
    q: "Чем вы отличаетесь от агентства?",
    a: "Агентства нет — я работаю один. Вы разговариваете с тем же человеком, который разбирает процессы и собирает систему: без аккаунт-менеджеров, брифов через посредника и передачи джуниорам.",
  },
  {
    q: "Вы разработчик?",
    a: "Нет, я не позиционирую себя разработчиком. Моя сильная сторона — разобраться в рабочем процессе, подобрать понятные AI-инструменты и помочь встроить их в ежедневную работу. Если задаче нужна отдельная разработка, я обозначаю это до старта.",
  },
  {
    q: "Сколько проектов ведёте одновременно?",
    a: "Не больше двух одновременно. Это ограничение формата: в каждом проекте я лично на всех этапах.",
  },
  {
    q: "Можно задать вопрос, не покупая внедрение?",
    a: "Да. Бесплатный AI-аудит на сайте — 7 вопросов и карта точек роста без оплаты. Если нужен разбор конкретной задачи, есть часовая консультация за 5 000 ₽.",
  },
  {
    q: "Работаете ли вы с зарубежными компаниями?",
    a: "Да, вся работа идёт онлайн и не зависит от вашего часового пояса. Веду проекты на русском и английском.",
  },
];

const timeline = [
  ["2022", "Первые проекты с AI", "Контентные процессы, личные помощники и первые автоматизации — ещё до того, как AI стал обязательной темой в бизнесе."],
  ["2023–24", "От инструментов к работе", "Фокус сместился с отдельных промптов на понятные процессы, качество результата и обучение команды."],
  ["2025", "40+ внедрений", "Практика в разных задачах — от продаж и маркетинга до внутренних операций и продуктов."],
  ["Сейчас", "AI в ежедневной работе", "Помогаю предпринимателям и небольшим командам встроить AI в привычный ритм без технической перегрузки."],
] as const;

const principles = [
  ["01", "Сначала эффект", "Если нельзя объяснить, что станет быстрее, дешевле или точнее, внедрение не нужно."],
  ["02", "Прототип до масштаба", "Проверяем сценарий на реальных данных до большой разработки и долгого контракта."],
  ["03", "Человек контролирует", "AI делает рутину и предлагает решения, но критические точки остаются прозрачными."],
  ["04", "Всё остаётся у вас", "Доступы, документация и знания передаются команде. Никакой искусственной зависимости."],
] as const;

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
    "Помогаю предпринимателям и небольшим командам встраивать AI в ежедневную работу. 40+ внедрений, 50+ обученных с 2022 года.",
  knowsAbout: [
    "AI-автоматизация бизнеса",
    "Business Process Automation",
    "Обучение команд работе с AI",
  ],
  sameAs: ["https://telegram.me/lyaminvl"],
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${siteUrl}/about`,
  },
};

export default function AboutPage() {
  return (
    <main className="studio-main bento-page">
      {/* Hero: copy tile + photo tile. */}
      <section className="bento-section bento-section--hero">
        <div className="studio-frame">
          <div className="bento-grid">
            <div className="bento-tile bento-col-8 bento-tile--tall" data-studio-reveal>
              <p className="bento-mono">Обо мне / VL 2026</p>
              <h1 className="bento-hero-title">Кто я и чем помогу</h1>
              <p className="bento-lead">
                Я Влад Лямин, AI-консультант и практик. С 2022 года помог провести 40+
                внедрений и обучил 50+ человек: объясняю сложное простыми словами и
                превращаю разрозненные AI-инструменты в понятную ежедневную работу.
              </p>
              <div style={{ marginTop: "auto", paddingTop: "1.8rem" }}>
                <Link className="bento-btn" href="/audit">
                  Разобрать мой бизнес <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <div
              className="bento-tile bento-col-4 bento-photo"
              data-studio-reveal
              style={{ transitionDelay: "60ms" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/portrait.jpg" alt="Влад Лямин" width="1200" height="1600" />
              <p className="bento-mono">AI-консультант · 40+ внедрений</p>
            </div>
          </div>
        </div>
      </section>

      {/* Story: two text tiles. */}
      <section className="bento-section">
        <div className="studio-frame">
          <header className="bento-head" data-studio-reveal>
            <p className="bento-mono">Контекст / не биография</p>
            <h2>Чем это отличается от обычного внедрения?</h2>
          </header>
          <div className="bento-grid">
            <div className="bento-tile bento-col-6" data-studio-reveal>
              <p className="bento-lead" style={{ marginTop: 0 }}>
                Я не продаю «нейросети» и не подключаю модный инструмент к тому, что и так
                сломано. Начинаю с того, где бизнес теряет время и деньги, а модель выбираю
                последней — когда уже понятно, какой процесс чиним.
              </p>
            </div>
            <div
              className="bento-tile bento-col-6"
              data-studio-reveal
              style={{ transitionDelay: "60ms" }}
            >
              <p className="bento-lead" style={{ marginTop: 0 }}>
                В 2022 году AI стал моей основной рабочей средой: от личных помощников и
                контентных сценариев до процессов, которые связывают информацию, решения и
                действия команды. Мне важен спокойный практический результат: меньше рутины,
                быстрее работа, понятнее ответственность.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline: four tiles, the current stage in carbon. */}
      <section className="bento-section">
        <div className="studio-frame">
          <header className="bento-head" data-studio-reveal>
            <p className="bento-mono">Траектория</p>
            <h2>Какой у меня опыт?</h2>
            <p>
              С 2022 года: 40+ внедрений, 50+ обученных, задачи от продаж и маркетинга до
              внутренних операций. Ниже — как менялся мой фокус: от знакомства с
              инструментами к реальной работе команд.
            </p>
          </header>
          <div className="bento-grid">
            {timeline.map(([year, title, text], i) => (
              <article
                key={year}
                className={`bento-tile bento-col-3${i === timeline.length - 1 ? " bento-tile--carbon" : ""}`}
                data-studio-reveal
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <p className="bento-mono">{year}</p>
                <h3 style={{ fontSize: "1.25rem", lineHeight: 1.15 }}>{title}</h3>
                <p className="bento-lead" style={{ fontSize: ".88rem" }}>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Principles: four tiles. */}
      <section className="bento-section">
        <div className="studio-frame">
          <header className="bento-head" data-studio-reveal>
            <p className="bento-mono">Принципы</p>
            <h2>По каким правилам я работаю?</h2>
            <p>
              Четыре правила, по которым решаю, что внедрять, а что нет. Главное из них:
              если нельзя объяснить, что станет быстрее, дешевле или точнее, — внедрение
              не нужно.
            </p>
          </header>
          <div className="bento-grid">
            {principles.map(([n, title, text], i) => (
              <article
                key={n}
                className="bento-tile bento-col-3"
                data-studio-reveal
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <p className="bento-mono">Принцип {n}</p>
                <h3 style={{ fontSize: "1.25rem", lineHeight: 1.15 }}>{title}</h3>
                <p className="bento-lead" style={{ fontSize: ".88rem" }}>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FaqSection
        items={faq}
        eyebrow="Вопросы"
        heading={<>Что спрашивают обо мне</>}
        lead="Кому подхожу, чем отличаюсь от агентства и как со мной устроена работа."
        schemaId="/about#faq"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(aboutSchema) }}
      />
    </main>
  );
}
