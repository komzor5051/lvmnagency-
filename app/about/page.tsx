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
    <main className="studio-main studio-about">
      <section className="studio-about-hero">
        <div className="studio-frame studio-about-hero-grid">
          <div data-studio-reveal>
            <p className="studio-eyebrow">ОБО МНЕ / VL 2026</p>
            <h1>Кто я<br />и чем <em>помогу.</em></h1>
            <p className="studio-about-lead">
              Я Влад Лямин, AI-консультант и практик. С 2022 года помог провести 40+
              внедрений и обучил 50+ человек: объясняю сложное простыми словами и
              превращаю разрозненные AI-инструменты в понятную ежедневную работу.
            </p>
            <Link className="studio-button studio-button--lime" href="/audit">
              Разобрать мой бизнес <b aria-hidden="true">→</b>
            </Link>
          </div>
          <div className="studio-about-portrait" data-studio-reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/portrait.jpg" alt="Влад Лямин" width="1200" height="1600" />
            <div><span>AI-КОНСУЛЬТАНТ</span><span>40+ ВНЕДРЕНИЙ</span></div>
          </div>
        </div>
      </section>

      <section className="studio-about-story">
        <div className="studio-frame studio-about-story-grid">
          <p className="studio-eyebrow studio-eyebrow--dark" data-studio-reveal>КОНТЕКСТ / НЕ БИОГРАФИЯ</p>
          <div data-studio-reveal>
            <h2>Чем это отличается<br />от <em>обычного</em> внедрения?</h2>
            <p>
              Я не продаю «нейросети» и не подключаю модный инструмент к тому, что и так
              сломано. Начинаю с того, где бизнес теряет время и деньги, а модель выбираю
              последней — когда уже понятно, какой процесс чиним.
            </p>
            <p>
              В 2022 году AI стал моей основной рабочей средой: от личных помощников и
              контентных сценариев до процессов, которые связывают информацию, решения и
              действия команды. Мне важен спокойный практический результат: меньше рутины,
              быстрее работа, понятнее ответственность.
            </p>
          </div>
        </div>
      </section>

      <section className="studio-about-timeline">
        <div className="studio-frame">
          <header className="studio-section-head studio-section-head--light" data-studio-reveal>
            <p className="studio-eyebrow">ТРАЕКТОРИЯ</p>
            <h2>Какой у меня<br /><em>опыт?</em></h2>
            <p>С 2022 года: 40+ внедрений, 50+ обученных, задачи от продаж и маркетинга до внутренних операций. Ниже — как менялся мой фокус: от знакомства с инструментами к реальной работе команд.</p>
          </header>
          <div className="studio-timeline">
            {[
              ["2022", "Первые проекты с AI", "Контентные процессы, личные помощники и первые автоматизации — ещё до того, как AI стал обязательной темой в бизнесе."],
              ["2023–24", "От инструментов к работе", "Фокус сместился с отдельных промптов на понятные процессы, качество результата и обучение команды."],
              ["2025", "40+ внедрений", "Практика в разных задачах — от продаж и маркетинга до внутренних операций и продуктов."],
              ["Сейчас", "AI в ежедневной работе", "Помогаю предпринимателям и небольшим командам встроить AI в привычный ритм без технической перегрузки."],
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
            <h2>По каким правилам<br />я <em>работаю?</em></h2>
            <p>Четыре правила, по которым решаю, что внедрять, а что нет. Главное из них: если нельзя объяснить, что станет быстрее, дешевле или точнее, — внедрение не нужно.</p>
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
      <FaqSection
        items={faq}
        eyebrow="ВОПРОСЫ"
        heading={<>Что спрашивают<br />обо <em>мне.</em></>}
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
