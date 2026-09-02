import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { jsonLd } from "@/lib/json-ld";
import { getProduct, TELEGRAM_URL } from "@/lib/products";
import { RzFaq } from "@/components/rz/RzFaq";

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  title: "Обо мне: личная система работы на Claude",
  description:
    "Влад Лямин. Четвёртый год работаю с Claude каждый день: гайды, консультации и аудит для тех, кто собирает личную систему работы вместо команды.",
  alternates: { canonical: `${siteUrl}/about` },
  openGraph: {
    title: "Обо мне — Влад Лямин",
    description:
      "Влад Лямин. Четвёртый год работаю с Claude каждый день: гайды, консультации и аудит для тех, кто собирает личную систему работы вместо команды.",
    type: "profile",
    url: `${siteUrl}/about`,
    locale: "ru_RU",
    images: [{ url: `${siteUrl}/portrait.jpg`, width: 880, height: 1100, alt: "Влад Лямин" }],
  },
};

const facts = [
  { n: "2022", text: "с этого года AI стал основной рабочей средой" },
  { n: "40+", text: "систем собрал руками на своих и чужих данных" },
  { n: "50+", text: "человек научил работать с Claude" },
  { n: "1", text: "человек в команде. Это я, других нет" },
];

const timeline = [
  {
    year: "2022",
    title: "Первые системы",
    text: "Бот на Claude API, контентные процессы, личные помощники. AI стал рабочей средой, а не игрушкой.",
    now: false,
  },
  {
    year: "2023–24",
    title: "От промптов к процессам",
    text: "Разрозненные инструменты превратились в связки: база знаний, автоматизации по расписанию, голос бренда.",
    now: false,
  },
  {
    year: "2025",
    title: "40+ систем, 50+ учеников",
    text: "Продажи, маркетинг, поддержка, контент. Стало видно, что держится без меня, а что нет.",
    now: false,
  },
  {
    year: "Сейчас",
    title: "Личная система на Claude",
    text: "Гайды, консультации и аудит для тех, кто хочет закрывать одному задачи, под которые обычно нанимают людей.",
    now: true,
  },
] as const;

const principles = [
  {
    title: "Сначала замер, потом инструмент",
    text: "Пока не названа цифра, которую меняем, обсуждать нечего. Часы, заявки, рубли.",
  },
  {
    title: "Первый результат за день",
    text: "Рабочий сценарий на твоих данных за 1–3 дня, а не курс на три месяца.",
  },
  {
    title: "Всё остаётся у тебя",
    text: "Подписки, доступы и знания твои. Система должна работать, когда меня рядом нет.",
  },
  {
    title: "Проверяю на себе",
    text: "Не советую то, чем не пользуюсь сам. Каждый приём из гайдов стоит в моей ежедневной работе.",
  },
];

const stack = ["Claude", "Claude Code", "Codex", "Supabase", "Node.js", "Telegram Bot API", "Apify", "Obsidian"];

const faq = [
  {
    q: "С кем ты работаешь?",
    a: "С фаундерами, соло-предпринимателями и экспертами, которые сами принимают решения и отвечают за деньги. Не с теми, кто «просто изучает AI».",
  },
  {
    q: "Ты агентство?",
    a: "Нет. Работаю один: пишу гайды, провожу консультации и аудит сам. Ты разговариваешь с тем же человеком, который это всё собрал.",
  },
  {
    q: "Ты разработчик?",
    a: "Пишу код, когда он нужен: Node.js, Supabase, Claude API. Но продаю не код, а понимание, как выстроить работу с Claude. Если задаче нужна отдельная разработка, скажу до старта.",
  },
  {
    q: "Можно задать вопрос, ничего не покупая?",
    a: "Да. Бесплатный аудит на сайте: 7 вопросов, 5 минут, карта точек, где Claude окупится. Если нужен разбор конкретной задачи, есть час один на один за 3 850 ₽.",
  },
  {
    q: "Работаешь с теми, кто не в России?",
    a: "Да, всё онлайн. Гайды и консультации на русском и английском, отдельное приложение в гайде разбирает доступ и оплату Claude из России.",
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
    "Помогаю собрать личную систему работы на Claude: гайды, консультации, аудит. 50+ человек обучил, 40+ систем собрал с 2022 года.",
  knowsAbout: [
    "Claude",
    "Claude Code",
    "Личная AI-система",
    "Обучение работе с AI",
    "AI-автоматизация для одного человека",
  ],
  sameAs: ["https://telegram.me/lyaminvl"],
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${siteUrl}/about`,
  },
};

export default function AboutPage() {
  const guide = getProduct("guide");

  return (
    <main className="rz">
      {/* Hero */}
      <header className="rz-about-hero">
        <div className="rz-wrap rz-about-hero-grid">
          <div>
            <p className="rz-mono" style={{ margin: "0 0 26px" }}>Обо мне</p>
            <h1 className="rz-h1">
              Четвёртый год работаю с Claude <span className="rz-mark">каждый день</span>
            </h1>
            <p className="rz-lead" style={{ marginBottom: "36px" }}>
              Я Влад Лямин. Не внедряю AI в чужие команды. Показываю одному человеку, как
              собрать систему, которая закрывает задачи без команды.
            </p>
            <div style={{ display: "flex", gap: "16px" }}>
              <Link href="/products" className="rz-btn rz-btn--solid">Смотреть продукты</Link>
              <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="rz-btn">
                Написать в Telegram
              </a>
            </div>
          </div>
          <div className="rz-portrait">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/portrait-editorial.jpg" alt="Влад Лямин" width="1012" height="1350" />
          </div>
        </div>
      </header>

      {/* Факты */}
      <section className="rz-section">
        <div className="rz-wrap rz-facts">
          {facts.map((f) => (
            <div key={f.n} data-studio-reveal>
              <strong>{f.n}</strong>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* История */}
      <section className="rz-section">
        <div className="rz-wrap">
          <div className="rz-sec-head" data-studio-reveal>
            <h2 className="rz-h2">Как я к этому пришёл</h2>
          </div>
          <div className="rz-story">
            <div data-studio-reveal>
              <p className="rz-thesis">
                Начинал с ботов и автоматизаций для чужого бизнеса. Через три года понял,
                что продаю не код, а способ думать.
              </p>
              <p>
                В 2022 году собрал первого бота на Claude API и подключил его к Telegram.
                Потом были воронки, парсеры, поддержка на трёх языках, контент-фабрика из
                созвона в четыре артефакта.
              </p>
            </div>
            <div data-studio-reveal>
              <p>
                Каждый раз повторялось одно. Система работала, а человек рядом с ней не
                понимал, как её менять. Через месяц она стояла.
              </p>
              <p>
                Поэтому сменил формат. Теперь не собираю системы за людей, а показываю, как
                собрать свою: гайды с готовым кодом, час один на один, аудит того, что уже
                есть. Всё, что советую, сначала проверяю на себе: этот сайт, блог и контент
                к нему собирает система, о которой я рассказываю.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Траектория */}
      <section className="rz-section">
        <div className="rz-wrap">
          <div className="rz-sec-head" data-studio-reveal>
            <h2 className="rz-h2">Траектория</h2>
            <p>Как менялся фокус: от инструментов к личной системе.</p>
          </div>
          <div className="rz-tl">
            {timeline.map((row) => (
              <div
                key={row.year}
                className={`rz-tl-row${row.now ? " is-now" : ""}`}
                data-studio-reveal
              >
                <span className="rz-tl-year">{row.year}</span>
                <h3>{row.title}</h3>
                <p>{row.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Принципы */}
      <section className="rz-section">
        <div className="rz-wrap">
          <div className="rz-sec-head" data-studio-reveal>
            <h2 className="rz-h2">По каким правилам работаю</h2>
          </div>
          <div className="rz-pr">
            {principles.map((p) => (
              <article key={p.title} data-studio-reveal>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Стек */}
      <section className="rz-section">
        <div className="rz-wrap">
          <div className="rz-sec-head" data-studio-reveal>
            <h2 className="rz-h2">Чем работаю</h2>
            <p>Инструменты, которые стоят в моей системе прямо сейчас.</p>
          </div>
          <div className="rz-stack" data-studio-reveal>
            {stack.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Вопросы */}
      <section className="rz-section">
        <div className="rz-wrap">
          <div className="rz-sec-head" data-studio-reveal>
            <h2 className="rz-h2">Вопросы</h2>
            <p>Кому подхожу и как со мной устроена работа.</p>
          </div>
          <div data-studio-reveal>
            <RzFaq items={faq} schemaId="/about#faq" />
          </div>
        </div>
      </section>

      {/* Финальный CTA */}
      <section className="rz-section rz-cta">
        <div className="rz-wrap">
          <p className="rz-mono" data-studio-reveal>Первый шаг</p>
          <h2 className="rz-h2 rz-cta-title" data-studio-reveal>
            Начни с гайда <span className="rz-mark">за {guide?.priceLabel ?? "990 ₽"}</span>
          </h2>
          <p className="rz-lead" data-studio-reveal>
            Самый дешёвый способ проверить, встроится ли Claude в твою работу.
          </p>
          <p data-studio-reveal>
            <Link href="/products/guide" className="rz-btn rz-btn--solid">Получить гайд</Link>
          </p>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(aboutSchema) }}
      />
    </main>
  );
}
