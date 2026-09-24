import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { jsonLd } from "@/lib/json-ld";
import { getProduct, TELEGRAM_URL } from "@/lib/products";
import { Crosshair } from "@/components/kalka/Interactive";
import { Rulers } from "@/components/kalka/Rulers";
import { AboutFaq } from "@/components/about-kalka/AboutFaq";

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  title: "Обо мне: личная система работы на Claude/Codex",
  description:
    "Влад Лямин. Четвёртый год работаю с нейросетями каждый день: гайды, консультации и аудит для тех, кто собирает личную систему работы вместо команды.",
  alternates: { canonical: `${siteUrl}/about` },
  openGraph: {
    title: "Обо мне — Влад Лямин",
    description:
      "Влад Лямин. Четвёртый год работаю с нейросетями каждый день: гайды, консультации и аудит для тех, кто собирает личную систему работы вместо команды.",
    type: "profile",
    url: `${siteUrl}/about`,
    locale: "ru_RU",
    images: [{ url: `${siteUrl}/portrait.jpg`, width: 880, height: 1100, alt: "Влад Лямин" }],
  },
};

const facts = [
  { n: "2022", text: "с этого года AI стал основной рабочей средой" },
  { n: "40+", text: "систем собрал руками на своих и чужих данных" },
  { n: "200+", text: "человек научил работать с Claude/Codex" },
  { n: "1", text: "человек в команде. Это я, других нет" },
];

const timeline = [
  {
    year: "2022",
    title: "Первые системы",
    text: "Бот на Claude/Codex API, контентные процессы, личные помощники. AI стал рабочей средой, а не игрушкой.",
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
    title: "40+ систем, 200+ учеников",
    text: "Продажи, маркетинг, поддержка, контент. Стало видно, что держится без меня, а что нет.",
    now: false,
  },
  {
    year: "Сейчас",
    title: "Личная система на Claude/Codex",
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
    a: "Пишу код, когда он нужен: Node.js, Supabase, Claude/Codex API. Но продаю не код, а понимание, как выстроить работу с Claude. Если задаче нужна отдельная разработка, скажу до старта.",
  },
  {
    q: "Можно задать вопрос, ничего не покупая?",
    a: "Да. Бесплатный аудит на сайте: 7 вопросов, 5 минут, карта точек, где Claude/Codex окупится. Если нужен разбор конкретной задачи, есть час один на один за 3 850 ₽.",
  },
  {
    q: "Работаешь с теми, кто не в России?",
    a: "Да, всё онлайн. Гайды и консультации на русском и английском, отдельное приложение в гайде разбирает доступ и оплату Claude/Codex из России.",
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
    "Помогаю собрать личную систему работы на Claude/Codex: гайды, консультации, аудит. 200+ человек обучил, 40+ систем собрал с 2022 года.",
  knowsAbout: [
    "Claude/Codex",
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
    <div className="k-page">
      <Crosshair />
      <main>
        {/* Hero — лист с линейками */}
        <section className="relative min-h-[min(88vh,820px)] overflow-hidden border-b border-[#15161a]">
          <Rulers />
          <div className="relative z-[2] mx-auto grid max-w-7xl gap-12 px-5 pb-16 pl-10 pt-24 md:grid-cols-[1.2fr_0.8fr] md:items-center md:px-14 md:pt-28">
            <div>
              <p className="k-mono inline-block bg-white pr-2">Обо мне</p>
              <h1
                data-m="lines"
                data-m-hero
                className="font-heading mt-6 max-w-[16ch] text-balance text-[40px] font-extrabold leading-[1.03] tracking-[-0.04em] sm:text-[52px] lg:text-[68px]"
              >
                Четвёртый год работаю с нейросетями <span className="rz-mark">каждый день</span>
              </h1>
              <div data-m="reveal" data-m-delay="0.5" className="mt-8 max-w-lg bg-white/85 py-1">
                <p className="text-[17px] leading-[1.6] text-[#6b6e78] md:text-[18px]">
                  Я Влад Лямин. Внедряю AI в бизнесы, обучаю команды, а также показываю, как одному
                  человеку собрать систему, которая работает без команды.
                </p>
              </div>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/products" className="k-btn k-btn--solid">Смотреть продукты</Link>
                <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="k-btn">
                  Написать в Telegram
                </a>
              </div>
            </div>
            <div className="k-sheet mx-auto w-full max-w-[320px] p-2 md:max-w-none">
              <span className="k-sheet-index">портрет</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/portrait-editorial.jpg" alt="Влад Лямин" width="1012" height="1350" className="block h-auto w-full" />
            </div>
          </div>
        </section>

        {/* Факты */}
        <section className="border-b border-[#15161a]">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-14 md:py-20">
            <div data-m="stagger" className="grid grid-cols-1 border border-[#15161a] bg-white sm:grid-cols-4">
              {facts.map((f, i) => (
                <div
                  key={f.n}
                  data-m-item
                  className={`p-7 md:p-9 ${
                    i > 0 ? "border-t border-[#15161a] sm:border-l sm:border-t-0" : ""
                  }`}
                >
                  <p data-m="count" className="font-heading text-5xl font-extrabold tracking-[-0.04em] md:text-6xl">
                    {f.n}
                  </p>
                  <p className="mt-3 max-w-[18rem] text-[15px] leading-relaxed text-[#6b6e78]">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* История — негатив кальки */}
        <section
          className="relative text-white"
          style={{
            backgroundColor: "#15161a",
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
            backgroundSize: "200px 200px",
          }}
        >
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/50">Как я к этому пришёл</p>
            <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-16">
              <div data-m="reveal">
                <p className="font-heading text-2xl font-bold leading-snug tracking-[-0.02em] md:text-3xl">
                  Начинал с ботов и автоматизаций для чужого бизнеса. Через три года понял,
                  что продаю не код, а способ думать.
                </p>
                <p className="mt-6 max-w-md text-[16px] leading-relaxed text-white/65">
                  В 2022 году собрал первого бота на Claude/Codex API и подключил его к Telegram.
                  Потом были воронки, парсеры, поддержка на трёх языках, контент-фабрика из
                  созвона в четыре артефакта.
                </p>
              </div>
              <div data-m="reveal">
                <p className="max-w-md text-[16px] leading-relaxed text-white/65">
                  Каждый раз повторялось одно. Система работала, а человек рядом с ней не
                  понимал, как её менять. Через месяц она стояла.
                </p>
                <p className="mt-6 max-w-md text-[16px] leading-relaxed text-white/65">
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
        <section className="border-b border-[#15161a]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
            <p className="k-mono inline-block bg-white pr-2">Траектория</p>
            <h2 data-m="lines" className="font-heading mt-5 max-w-3xl text-balance text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] md:text-5xl">
              Как менялся фокус: от инструментов к личной системе
            </h2>

            <div className="k-rows mt-14">
              {timeline.map((row) => (
                <div
                  key={row.year}
                  data-m="reveal"
                  className={`k-row grid-cols-[1fr] gap-3 sm:grid-cols-[140px_1fr] sm:gap-8 ${
                    row.now ? "bg-[#f6f7f2]" : ""
                  }`}
                >
                  <span data-m="count" className="k-mono flex items-start gap-2 !text-[#15161a]">
                    {row.now && <span className="mt-[3px] block h-2 w-2 shrink-0 bg-[#c8f04c] ring-1 ring-[#15161a]" aria-hidden="true" />}
                    {row.year}
                  </span>
                  <div>
                    <h3 className="font-heading text-lg font-bold tracking-[-0.02em] md:text-xl">{row.title}</h3>
                    <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-[#6b6e78]">{row.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Принципы */}
        <section className="border-b border-[#15161a]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
            <p className="k-mono inline-block bg-white pr-2">По каким правилам работаю</p>
            <div data-m="stagger" className="mt-10 grid gap-6 md:grid-cols-2 md:gap-8">
              {principles.map((p, i) => (
                <article key={p.title} data-m-item className="k-sheet p-7 pt-9 md:p-10">
                  <span className="k-sheet-index">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-heading text-2xl font-bold tracking-[-0.02em]">{p.title}</h3>
                  <p className="mt-3 max-w-md text-[16px] leading-relaxed text-[#6b6e78]">{p.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Вопросы */}
        <section className="border-b border-[#15161a]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
              <div>
                <p className="k-mono inline-block bg-white pr-2">Вопросы</p>
                <h2
                  data-m="lines"
                  className="font-heading mt-5 max-w-3xl text-balance text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] md:text-5xl"
                >
                  Кому подхожу и как со мной устроена работа
                </h2>
              </div>
              <div data-m="stagger">
                <AboutFaq items={faq} schemaId="/about#faq" />
              </div>
            </div>
          </div>
        </section>

        {/* Финальный CTA */}
        <section>
          <div className="mx-auto max-w-7xl px-5 py-24 md:px-14 md:py-32">
            <p className="k-mono inline-block bg-white pr-2" data-m="reveal">Первый шаг</p>
            <h2
              data-m="lines"
              className="font-heading mt-6 max-w-3xl text-balance text-4xl font-extrabold leading-[1.04] tracking-[-0.04em] md:text-6xl"
            >
              Начни с <span className="rz-mark">азов</span>
            </h2>
            <p data-m="reveal" className="mt-6 max-w-xl bg-white/85 text-[17px] leading-[1.6] text-[#6b6e78]">
              Самый дешёвый способ проверить, встроится ли Claude/Codex в твою работу.
            </p>
            <div data-m="reveal" className="mt-10">
              <Link href="/products/guide" className="k-btn k-btn--solid">Получить материал</Link>
            </div>
          </div>
        </section>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(aboutSchema) }}
      />
    </div>
  );
}
