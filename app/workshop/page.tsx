import type { Metadata } from "next";
import Link from "next/link";
import { TELEGRAM_URL } from "@/lib/products";
import { Accordion } from "@/components/kalka/Interactive";
import { Rulers } from "@/components/kalka/Rulers";
import { SEATS_TOTAL, seatsLabel } from "@/lib/workshop";

export const metadata: Metadata = {
  title: "Практикум «Система контента за 3 часа» — 11 октября",
  description:
    "Практикум для экспертов с практикой. За 3 часа в Zoom собираешь файл голоса, банк из 30 тем и 5 черновиков на своих материалах. 11 октября, 12:00 МСК, 4900 ₽.",
};

// Landing for the one-day workshop, same tracing-paper visual as /lab.
// Copy passed ~/.tov/tovlint.mjs — keep edits in Влад's voice (ты, no «!»,
// «ИИ» in public copy, never «пишет за тебя»).

// Ссылки lava.top. Пока продукты не созданы, кнопки ведут в Telegram.
const PAY_URL_BASE = "";
const PAY_URL_REVIEW = "";

const payBase = PAY_URL_BASE || TELEGRAM_URL;
const payReview = PAY_URL_REVIEW || TELEGRAM_URL;

const scenes = [
  {
    n: "01",
    title: "Пост пишется два часа",
    body: "Садишься писать, два часа подбираешь слова, а потом не публикуешь, потому что звучит не так.",
  },
  {
    n: "02",
    title: "Аккаунт живёт неделю",
    body: "Неделю публикуешь каждый день, потом пропадаешь на месяц. Темы кончились, а клиенты никуда не делись.",
  },
  {
    n: "03",
    title: "ИИ пишет не тобой",
    body: "Пробовал просить ИИ, получил текст как из пресс-релиза. Переписывать его дольше, чем писать самому.",
  },
];

const voiceRules = [
  "Первое предложение — факт, цифра или сцена. Ни одного вводного оборота.",
  "Медиана предложения — 8 слов. Треть предложений короче шести.",
  "Каждое утверждение о результате несёт число. Нет замера — утверждение вычёркивается.",
  "Ноль восклицательных знаков. В корпусе из 775 предложений нет ни одного.",
];

const tools = [
  {
    n: "01",
    title: "Компьютер",
    body: "Ноутбук или настольный. С телефона файлы не собрать: придётся работать с текстами и папками.",
  },
  {
    n: "02",
    title: "Claude или Codex",
    body: "Доступ с компьютера к одному из них. Лучше платная подписка: на бесплатной лимиты кончатся на середине.",
  },
  {
    n: "03",
    title: "Твои материалы",
    body: "5 старых постов или расшифровок голосовых. По ним собираем файл голоса.",
  },
];

const files = [
  {
    n: "01",
    title: "Файл голоса",
    body: "ИИ читает твои старые посты или расшифровки. Получаем правила, по которым звучишь ты, и проверяем их на новом тексте.",
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
  { title: "0:00–0:20 · Доступ", body: "Проверяем, что Claude или Codex открываются с компьютера у всех. У кого не открываются, настраиваем вместе." },
  { title: "0:20–1:00 · Голос", body: "Собираем файл голоса по твоим постам и проверяем, похож ли черновик на тебя." },
  { title: "1:00–1:50 · Темы", body: "Банк из 30 тем из твоей практики. У каждой темы есть повод, с которого удобно начать." },
  { title: "1:50–2:40 · Конвейер", body: "Из голосовой в пост, рилс и карусель. На выходе 5 черновиков на человека." },
  { title: "2:40–3:00 · План", body: "Раскладываем черновики на две недели публикаций. Отвечаю на вопросы." },
];

// Результаты клиентов: только замеренные цифры и дословные цитаты.
// Пока массив пуст, блок на странице не показывается.
const results: { who: string; value: string; label: string; quote?: string }[] = [];

const faq = [
  {
    title: "Я не разбираюсь в ИИ",
    body: "Опыт не нужен. Первые 20 минут настраиваем доступ у каждого, дальше идём по шагам вместе.",
  },
  {
    title: "ИИ будет писать за меня?",
    body: "Писать будешь ты. ИИ подсказывает темы, собирает черновик и проверяет, что текст звучит как ты.",
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
    title: "Что за разбор за 7900 ₽?",
    body: "Через неделю после практикума 60 минут один на один: смотрю твой аккаунт и то, что ты опубликовал по новым файлам. Таких мест 5.",
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
              <p className="k-mono inline-block bg-white pr-2">Практикум «Система контента» · 11 октября · 12:00 МСК · Zoom</p>

              <h1
                data-m="lines"
                data-m-hero
                className="font-heading mt-6 max-w-[15ch] text-balance text-[42px] font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-[56px] lg:max-w-[16ch] lg:text-[76px]"
              >
                Как внедрить ИИ в&nbsp;свой контент <span className="rz-mark">за 3&nbsp;часа</span>
              </h1>

              <div data-m="reveal" data-m-delay="0.5" className="mt-8 max-w-xl bg-white/85 py-1">
                <p className="text-[17px] leading-[1.6] text-[#6b6e78] md:text-[18px]">
                  Для экспертов с практикой: психологов, коучей, дизайнеров, нутрициологов. Вживую, на твоих старых
                  постах, собираем файл голоса, 30 тем и 5 черновиков. Группа до 15 человек.
                </p>
              </div>

              <div className="k-point mt-10 flex flex-wrap items-center gap-x-6 gap-y-3" style={{ animationDelay: "0.9s" }}>
                <Cta label="Записаться" />
                <span className="k-mono bg-white px-1 !text-[#15161a]">4900 ₽ · {seatsLabel}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Узнаёшь себя */}
        <section className="border-b border-[#15161a]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
            <p className="k-mono inline-block bg-white pr-2">Узнаёшь себя</p>
            <h2 data-m="lines" className={H2}>
              Экспертиза есть, а соцсети живут неделю и умирают
            </h2>

            <div data-m="stagger" className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
              {scenes.map((it) => (
                <article key={it.n} data-m-item className="k-sheet p-7 pt-9 md:p-10">
                  <span className="k-sheet-index">{it.n}</span>
                  <h3 className="font-heading text-2xl font-bold tracking-[-0.02em]">{it.title}</h3>
                  <p className="mt-3 max-w-md text-[16px] leading-relaxed text-[#6b6e78]">{it.body}</p>
                </article>
              ))}
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
              Пишешь ты. ИИ подсказывает темы и проверяет голос.
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

        {/* Пример файла голоса */}
        <section className="border-b border-[#15161a]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
              <div>
                <p className="k-mono inline-block bg-white pr-2">Пример</p>
                <h2 data-m="lines" className={H2}>
                  Так выглядит мой файл голоса
                </h2>
                <p data-m="reveal" className="mt-6 max-w-sm bg-white/85 text-[16px] leading-relaxed text-[#6b6e78]">
                  В нём 15 правил, по ним проверяется каждый мой пост. Твой соберём по твоим постам, правила будут другими.
                </p>
              </div>
              <div data-m="reveal" className="k-sheet p-7 pt-9 md:p-10">
                <span className="k-sheet-index">голос.md</span>
                <ol className="space-y-4 font-mono text-[14px] leading-relaxed text-[#15161a]">
                  {voiceRules.map((rule, i) => (
                    <li key={rule} className="flex gap-4">
                      <span className="text-[#6b6e78]">{String(i + 1).padStart(2, "0")}</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ol>
              </div>
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

        {/* Результаты клиентов */}
        {results.length > 0 && (
          <section className="border-b border-[#15161a]">
            <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
              <p className="k-mono inline-block bg-white pr-2">Результаты</p>
              <h2 data-m="lines" className={H2}>
                Что получилось у тех, кто собрал эти файлы
              </h2>

              <div data-m="stagger" className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
                {results.map((r) => (
                  <article key={r.who} data-m-item className="k-sheet p-7 pt-9 md:p-10">
                    <span className="k-sheet-index">{r.who}</span>
                    <p className="font-heading whitespace-nowrap text-5xl font-extrabold tracking-[-0.04em] lg:text-6xl">
                      {r.value}
                    </p>
                    <p className="mt-4 text-[15px] leading-relaxed text-[#6b6e78]">{r.label}</p>
                    {r.quote && <p className="mt-6 border-l-2 border-[#c8f04c] pl-4 text-[15px] leading-relaxed">«{r.quote}»</p>}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Что понадобится */}
        <section className="border-b border-[#15161a]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
            <p className="k-mono inline-block bg-white pr-2">Что понадобится</p>
            <h2 data-m="lines" className={H2}>
              Три вещи, которые нужны на встрече
            </h2>

            <div data-m="stagger" className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
              {tools.map((it) => (
                <article key={it.n} data-m-item className="k-sheet p-7 pt-9 md:p-10">
                  <span className="k-sheet-index">{it.n}</span>
                  <h3 className="font-heading text-2xl font-bold tracking-[-0.02em]">{it.title}</h3>
                  <p className="mt-3 max-w-md text-[16px] leading-relaxed text-[#6b6e78]">{it.body}</p>
                </article>
              ))}
            </div>
            <p data-m="reveal" className="mt-8 max-w-2xl bg-white/85 text-[16px] leading-relaxed text-[#6b6e78]">
              Если доступа к Claude или Codex нет, напиши мне после оплаты. Настроим до практикума или в первые 20 минут.
            </p>
          </div>
        </section>

        {/* Цена — тёмный лист, чтобы блок было видно при быстрой прокрутке */}
        <section
          id="price"
          className="relative text-white"
          style={{
            backgroundColor: "#15161a",
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
            backgroundSize: "200px 200px",
          }}
        >
          <div className="mx-auto max-w-7xl px-5 py-24 md:px-14 md:py-32">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/50">Цена</p>
            <h2
              data-m="lines"
              className="font-heading mt-5 max-w-3xl text-balance text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] md:text-6xl"
            >
              Два варианта участия
            </h2>

            <div data-m="stagger" className="mt-14 grid gap-6 text-[#15161a] md:grid-cols-2 md:gap-8">
              <div data-m-item className="k-sheet flex flex-col p-8 md:p-12">
                <span className="k-sheet-index">участие</span>
                <p className="font-heading text-6xl font-extrabold tracking-[-0.04em] md:text-7xl">4900 ₽</p>
                <div className="mt-6 space-y-3 text-[16px] leading-relaxed text-[#6b6e78]">
                  <p>3 часа в Zoom, три файла на твоих материалах.</p>
                  <p>Запись остаётся у тебя.</p>
                </div>
                <div className="mt-auto pt-10">
                  <Cta label="Записаться" />
                </div>
              </div>
              <div data-m-item className="k-sheet flex flex-col p-8 md:p-12" style={{ background: "#c8f04c" }}>
                <span className="k-sheet-index">с разбором</span>
                <p className="k-mono inline-block self-start border border-[#15161a] px-2 py-1 !text-[#15161a]">
                  выгоднее на 850 ₽
                </p>
                <p className="font-heading mt-4 text-6xl font-extrabold tracking-[-0.04em] md:text-7xl">7900 ₽</p>
                <div className="mt-6 space-y-3 text-[16px] leading-relaxed text-[#15161a]/80">
                  <p>Всё то же плюс 60 минут один на один через неделю.</p>
                  <p>Смотрю аккаунт и то, что ты опубликовал по новым файлам.</p>
                  <p>Отдельно практикум и час со мной стоят 8750 ₽.</p>
                  <p className="k-mono pt-2 !text-[#15161a]">5 мест</p>
                </div>
                <div className="mt-auto pt-10">
                  <Cta label="Записаться с разбором" href={payReview} />
                </div>
              </div>
            </div>
            <p data-m="reveal" className="mt-10 max-w-2xl text-[17px] leading-[1.65] text-white/65">
              Три часа со мной один на один стоят 11 550 ₽. На практикуме те же три часа, но в группе, поэтому 4900 ₽. Группа до {SEATS_TOTAL} человек, сейчас {seatsLabel}.
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
              Воскресенье, <span className="rz-mark">11 октября</span>, 12:00 МСК
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
