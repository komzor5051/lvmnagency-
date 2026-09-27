import type { Metadata } from "next";
import Link from "next/link";
import { TELEGRAM_URL } from "@/lib/products";
import { Accordion, Crosshair } from "@/components/kalka/Interactive";
import { Rulers } from "@/components/kalka/Rulers";

export const metadata: Metadata = {
  title: "Практикум «Система контента за 3 часа» — 11 октября",
  description:
    "Три часа в Zoom, группа до 15 человек. Уходишь с файлом голоса, банком из 30 тем и пятью черновиками. 11 октября, 12:00 МСК, 4900 ₽.",
};

// Landing for the one-day workshop, same tracing-paper visual as /lab.
// Copy passed ~/.tov/tovlint.mjs — keep edits in Влад's voice (ты, no «!»,
// «нейросети» in public copy, never «пишет за тебя»).

// Ссылки lava.top. Пока продукты не созданы, кнопки ведут в Telegram.
const PAY_URL_BASE = "";
const PAY_URL_REVIEW = "";

const payBase = PAY_URL_BASE || TELEGRAM_URL;
const payReview = PAY_URL_REVIEW || TELEGRAM_URL;

const files = [
  {
    n: "01",
    title: "Файл голоса",
    body: "Нейросеть читает твои старые посты или расшифровки. Получаем правила, по которым звучишь ты, и проверяем их на новом тексте.",
    dim: "40 минут",
  },
  {
    n: "02",
    title: "Банк из 30 тем",
    body: "Вытаскиваем темы из твоих случаев, историй и вопросов клиентов. То, что ты считаешь очевидным, обычно и есть лучшие темы.",
    dim: "50 минут",
  },
  {
    n: "03",
    title: "5 черновиков",
    body: "Голосовая на 3 минуты превращается в черновик поста, сценарий рилса или карусель. Остаётся дописать своими словами.",
    dim: "50 минут",
  },
];

const program = [
  { title: "0:00–0:20 · Доступ", body: "Настраиваем доступ к нейросети у всех, кто не успел. Это часть практикума, а не домашнее задание." },
  { title: "0:20–1:00 · Голос", body: "Собираем файл голоса по твоим постам и проверяем, похож ли черновик на тебя." },
  { title: "1:00–1:50 · Темы", body: "Банк из 30 тем из твоей практики. У каждой темы есть повод, с которого удобно начать." },
  { title: "1:50–2:40 · Конвейер", body: "Из голосовой в пост, рилс и карусель. На выходе 5 черновиков на человека." },
  { title: "2:40–3:00 · План", body: "Раскладываем черновики на две недели публикаций. Отвечаю на вопросы." },
];

const stats = [
  { value: "5 из 11", label: "моих клиентов пришли с одним запросом: экспертиза есть, соцсети не живут" },
  { value: "727", label: "человек читают мой Telegram, он держится на этих трёх файлах" },
  { value: "112", label: "своих рилсов я разобрал по замерам" },
];

const faq = [
  {
    title: "Я не разбираюсь в нейросетях",
    body: "Опыт не нужен. Первые 20 минут настраиваем доступ у каждого, дальше идём по шагам вместе.",
  },
  {
    title: "Нейросеть будет писать за меня?",
    body: "Писать будешь ты. Нейросеть подсказывает темы, собирает черновик и проверяет, что текст звучит как ты.",
  },
  {
    title: "У меня нет времени",
    body: "Практикум занимает 3 часа один раз. Без системы контент съедает по 2 часа каждую неделю, а потом бросается.",
  },
  {
    title: "Что подготовить?",
    body: "После оплаты пришлю форму из трёх вопросов: ниша, ссылка на аккаунт и 5 старых постов или расшифровок.",
  },
  {
    title: "Я не смогу быть вживую",
    body: "Запись остаётся у тебя. Но файлы собираются на твоих материалах, поэтому лучше быть в Zoom.",
  },
  {
    title: "Что за разбор за 9900 ₽?",
    body: "Через неделю после практикума 30 минут один на один: смотрю твой аккаунт и то, что ты опубликовал по новым файлам. Таких мест 5.",
  },
  {
    title: "А если не получится?",
    body: "Если за 3 часа у тебя не появились три файла, верну деньги.",
  },
];

const H2 =
  "font-heading mt-5 max-w-3xl text-balance text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] md:text-5xl";

function Cta({ label, href = payBase, ghost = false }: { label: string; href?: string; ghost?: boolean }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={ghost ? "k-btn" : "rz-btn rz-btn--solid"}>
      {label}
      <span aria-hidden="true">&rarr;</span>
    </a>
  );
}

export default function WorkshopPage() {
  return (
    <div className="k-page">
      <Crosshair />
      <main>
        {/* Hero */}
        <section className="relative min-h-[min(92vh,880px)] overflow-hidden border-b border-[#15161a]">
          <Rulers />

          <div className="relative z-[2] mx-auto max-w-7xl px-5 pb-20 pl-10 pt-24 md:px-14 md:pt-28">
            <nav aria-label="Хлебные крошки">
              <Link href="/products" className="k-mono -my-3 inline-block bg-white py-3 pr-2 hover:text-[#15161a]">
                &larr; Все продукты
              </Link>
            </nav>

            <div className="pt-10 md:pt-16">
              <p className="k-mono inline-block bg-white pr-2">Практикум · 11 октября · 12:00 МСК · Zoom</p>

              <h1
                data-m="lines"
                data-m-hero
                className="font-heading mt-6 max-w-[15ch] text-balance text-[42px] font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-[56px] lg:max-w-[16ch] lg:text-[76px]"
              >
                Система контента <span className="rz-mark">за 3 часа</span>
              </h1>

              <div data-m="reveal" data-m-delay="0.5" className="mt-8 max-w-xl bg-white/85 py-1">
                <p className="text-[17px] leading-[1.6] text-[#6b6e78] md:text-[18px]">
                  Экспертиза есть, практика есть, а соцсети живут неделю и умирают. За 3 часа собираем вживую три файла,
                  на которых держится регулярный контент. Собираем на твоих материалах, в группе до 15 человек.
                </p>
              </div>

              <div className="k-point mt-10 flex flex-wrap items-center gap-x-6 gap-y-3" style={{ animationDelay: "0.9s" }}>
                <Cta label="Записаться" />
                <span className="k-mono bg-white px-1 !text-[#15161a]">4900 ₽ · запись остаётся</span>
              </div>
            </div>
          </div>
        </section>

        {/* Главная идея */}
        <section
          className="relative text-white"
          style={{
            backgroundColor: "#15161a",
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
            backgroundSize: "200px 200px",
          }}
        >
          <div className="mx-auto max-w-7xl px-5 py-24 md:px-14 md:py-32">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/50">Главная идея</p>
            <h2
              data-m="lines"
              className="font-heading mt-6 max-w-4xl text-balance text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] md:text-6xl"
            >
              Пишешь ты. Нейросети подсказывают темы и проверяют голос.
            </h2>
            <p data-m="reveal" className="mt-10 max-w-2xl text-[17px] leading-[1.65] text-white/65">
              Контент бросают, когда каждый раз приходится заново искать тему и подбирать слова. Три файла снимают обе
              задачи: темы лежат в банке, голос записан правилами.
            </p>
          </div>
        </section>

        {/* С чем уходишь */}
        <section className="border-b border-[#15161a]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
            <p className="k-mono inline-block bg-white pr-2">С чем уходишь</p>
            <h2 data-m="lines" className={H2}>
              Три файла, собранные на твоих постах и твоей практике
            </h2>

            <div data-m="stagger" className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
              {files.map((it) => (
                <article key={it.n} data-m-item className="k-sheet p-7 pt-9 md:p-10">
                  <span className="k-sheet-index">{it.n}</span>
                  <h3 className="font-heading text-2xl font-bold tracking-[-0.02em]">{it.title}</h3>
                  <p className="mt-3 max-w-md text-[16px] leading-relaxed text-[#6b6e78]">{it.body}</p>
                  <p className="k-dim mt-8">{it.dim}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Программа */}
        <section className="border-b border-[#15161a]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
              <div>
                <p className="k-mono inline-block bg-white pr-2">Программа</p>
                <h2 data-m="lines" className={H2}>
                  Три часа по минутам
                </h2>
                <p data-m="reveal" className="mt-6 max-w-sm bg-white/85 text-[16px] leading-relaxed text-[#6b6e78]">
                  Воскресенье, 11 октября, 12:00 по Москве. Нажми на блок, чтобы раскрыть.
                </p>
              </div>
              <div data-m="stagger">
                <Accordion items={program} firstOpen />
              </div>
            </div>
          </div>
        </section>

        {/* Откуда это */}
        <section className="border-b border-[#15161a]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
            <p className="k-mono inline-block bg-white pr-2">Откуда это</p>
            <h2 data-m="lines" className={H2}>
              Сам веду контент на этих трёх файлах
            </h2>

            <div data-m="stagger" className="mt-14 grid border border-[#15161a] bg-white sm:grid-cols-3">
              {stats.map((s, i) => (
                <div
                  key={s.value}
                  data-m-item
                  className={`p-8 md:p-10 ${i > 0 ? "border-t border-[#15161a] sm:border-l sm:border-t-0" : ""}`}
                >
                  <p className="font-heading text-6xl font-extrabold tracking-[-0.04em] md:text-7xl">{s.value}</p>
                  <p className="mt-4 max-w-[16rem] text-[15px] leading-relaxed text-[#6b6e78]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Цена */}
        <section className="border-b border-[#15161a]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
            <p className="k-mono inline-block bg-white pr-2">Цена</p>
            <div data-m="stagger" className="mt-10 grid gap-6 md:grid-cols-2 md:gap-8">
              <div data-m-item className="k-sheet p-8 md:p-12">
                <span className="k-sheet-index">участие</span>
                <p className="font-heading text-6xl font-extrabold tracking-[-0.04em] md:text-7xl">4900 ₽</p>
                <div className="mt-6 space-y-3 text-[16px] leading-relaxed text-[#6b6e78]">
                  <p>3 часа в Zoom, три файла на твоих материалах.</p>
                  <p>Запись остаётся у тебя.</p>
                </div>
                <div className="mt-10">
                  <Cta label="Записаться" />
                </div>
              </div>
              <div data-m-item className="k-sheet p-8 md:p-12">
                <span className="k-sheet-index">с разбором</span>
                <p className="font-heading text-6xl font-extrabold tracking-[-0.04em] md:text-7xl">9900 ₽</p>
                <div className="mt-6 space-y-3 text-[16px] leading-relaxed text-[#6b6e78]">
                  <p>Всё то же плюс 30 минут один на один через неделю.</p>
                  <p>Смотрю аккаунт и то, что ты опубликовал по новым файлам.</p>
                  <p className="k-mono pt-2 !text-[#15161a]">5 мест</p>
                </div>
                <div className="mt-10">
                  <Cta label="Записаться с разбором" href={payReview} />
                </div>
              </div>
            </div>
            <p data-m="reveal" className="mt-8 max-w-2xl bg-white/85 text-[16px] leading-relaxed text-[#6b6e78]">
              Если за 3 часа у тебя не появились три файла, верну деньги. Группа до 15 человек, запись закрываю 9
              октября.
            </p>
          </div>
        </section>

        {/* Вопросы */}
        <section className="border-b border-[#15161a]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
              <div>
                <p className="k-mono inline-block bg-white pr-2">Вопросы</p>
                <h2 data-m="lines" className={H2}>
                  Что обычно спрашивают
                </h2>
              </div>
              <div data-m="stagger">
                <Accordion items={faq} />
              </div>
            </div>
          </div>
        </section>

        {/* Финал */}
        <section>
          <div className="mx-auto max-w-7xl px-5 py-24 md:px-14 md:py-32">
            <h2
              data-m="lines"
              className="font-heading max-w-3xl text-balance text-4xl font-extrabold leading-[1.04] tracking-[-0.04em] md:text-6xl"
            >
              15 мест, запись до <span className="rz-mark">9 октября</span>
            </h2>
            <p data-m="reveal" className="mt-6 max-w-xl bg-white/85 text-[17px] leading-[1.6] text-[#6b6e78]">
              После оплаты напиши мне в Telegram. Пришлю ссылку на Zoom и форму из трёх вопросов.
            </p>
            <div data-m="reveal" className="mt-10 flex flex-wrap gap-4">
              <Cta label="Записаться" />
              <Cta label="Написать в Telegram" href={TELEGRAM_URL} ghost />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
