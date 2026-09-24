import type { Metadata } from "next";
import Link from "next/link";
import DeskFooter from "@/components/desk/DeskFooter";
import { TELEGRAM_URL } from "@/lib/products";

export const metadata: Metadata = {
  title: "Лаборатория — растим соцсети вместе с Claude",
  description:
    "Раз в неделю живая настройка в зуме: банк тем, голос, форматы и очередь публикаций на Claude. Общая таблица роста и открытые цифры. Первый набор на десять мест, 4 500 ₽ в месяц.",
};

// Standalone landing for the paid community «Лаборатория».
// Same structure and DS as /vibecoding: content inline, one source of truth.
// Copy passed ~/.tov/tovlint.mjs — keep edits in Влад's voice (ты, no «!»).

const principles = [
  {
    n: "01",
    title: "Система важнее вдохновения",
    body: "Темы лежат в банке, голос записан в шаблон, публикации стоят в очереди. Садишься за стол и выпускаешь пост, даже если сегодня ничего не хочется писать и в голове пусто с самого утра.",
  },
  {
    n: "02",
    title: "Цифры открыты",
    body: "Раз в неделю я пишу в общую таблицу своих подписчиков и охваты. Ты пишешь свои. Плохую неделю видно так же, как хорошую.",
  },
  {
    n: "03",
    title: "Делаем у тебя",
    body: "С четверга уходишь с настроенной частью системы в своём аккаунте. Конспекта мало, нужна работающая вещь.",
  },
];

const stats = [
  { value: "287", label: "подписчиков в Threads, с которых я начал" },
  { value: "727", label: "человек читают меня в Telegram" },
  { value: "112", label: "своих рилсов разобрал по замерам" },
];

const rhythm = [
  { when: "Четверг", what: "Живая настройка в зуме, 60 минут. Одна часть системы у каждого." },
  { when: "Пятница", what: "Запись встречи и пошаговый чек-лист." },
  { when: "Вторник", what: "Находка недели с готовым файлом из моих сессий." },
  { when: "Раз в 2 недели", what: "Стройка: что я делаю со своими аккаунтами и с какими цифрами." },
  { when: "Раз в месяц", what: "Факап с ценой в часах или рублях." },
  { when: "Вт и пт", what: "Чат участников с окном ответов." },
  { when: "Каждую неделю", what: "Общая таблица роста, куда каждый вписывает свои цифры." },
];

const weeks = [
  {
    w: "Неделя 1",
    title: "Распаковка",
    body: "Claude вытаскивает темы из твоего опыта, историй и вопросов клиентов.",
    out: "банк тем на месяц",
  },
  {
    w: "Неделя 2",
    title: "Голос",
    body: "Отдаёшь Claude свои тексты и получаешь шаблон голоса с проверкой.",
    out: "публикации звучат как ты",
  },
  {
    w: "Неделя 3",
    title: "Форматы",
    body: "Одну тему раскладываем в рилс, тред и карусель.",
    out: "три готовые публикации",
  },
  {
    w: "Неделя 4",
    title: "Конвейер и замер",
    body: "Ставим неделю публикаций в отложенный постинг и заводим таблицу охватов.",
    out: "неделя в очереди",
  },
];

const forWhom = [
  "Эксперт с опытом и своей практикой, который ведёт соцсети урывками или не ведёт совсем",
  "Тот, кто готов час в неделю сидеть в зуме и выпускать публикации между встречами",
  "Тот, кто хочет работать в Claude каждый день",
];

const notForWhom = [
  "Кто ищет накрутку и вирусность за неделю",
  "Кто хочет отдать аккаунт в чужие руки",
  "Кто ждёт гарантию на число подписчиков",
];

const faq = [
  {
    q: "Какие соцсети?",
    a: "Instagram, Threads и Telegram. Работаем с теми, где ты уже есть.",
  },
  {
    q: "Нужен ли опыт с Claude?",
    a: "Опыт не нужен. На первой встрече настраиваем доступ и профиль, для России есть отдельный чек-лист.",
  },
  {
    q: "Я не могу в четверг, что делать?",
    a: "В пятницу приходит запись и чек-лист, вопросы задаёшь в чате.",
  },
  {
    q: "Сколько подписчиков я наберу?",
    a: "Не знаю и не обещаю. Знаю, что через месяц у тебя будет банк тем, голос и очередь публикаций.",
  },
  {
    q: "Чем это отличается от консультации?",
    a: "Консультация идёт час один на один и стоит 3 850 ₽. В Лаборатории четыре часа в месяц в группе, общая таблица и чат.",
  },
  {
    q: "Как оплатить?",
    a: "Напиши мне в Telegram, пришлю ссылку. Принимаю карты российских и иностранных банков.",
  },
];

function CtaButton({ label }: { label: string }) {
  return (
    <a
      href={TELEGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 bg-ink px-7 py-4 font-heading text-[15px] font-bold tracking-[-0.01em] text-paper transition-transform hover:-translate-y-0.5"
    >
      {label}
      <span aria-hidden="true">&rarr;</span>
    </a>
  );
}

function Eyebrow({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <p
      data-m-item
      className={`font-mono text-xs uppercase tracking-[0.18em] ${muted ? "text-ink-muted" : "text-accent"}`}
    >
      {children}
    </p>
  );
}

export default function LabPage() {
  return (
    <div className="bg-paper text-ink">
      <main>
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-5 pb-16 pt-24 md:px-10 md:pt-28 lg:pb-24">
          <nav aria-label="Хлебные крошки">
            <Link
              href="/products"
              className="-my-3 inline-block py-3 font-mono text-xs tracking-[0.08em] text-ink-muted transition-colors hover:text-ink"
            >
              &larr; Все продукты
            </Link>
          </nav>

          <div data-m="stagger" className="pt-12 md:pt-16">
            <Eyebrow>Лаборатория · первый набор · 10 мест</Eyebrow>

            <h1
              data-m-item
              className="font-heading mt-6 max-w-4xl text-balance text-[40px] font-black leading-[1.04] tracking-[-0.04em] text-ink sm:text-[52px] lg:text-[64px]"
            >
              Растим соцсети вместе, с Claude и{" "}
              <span
                // Inset lime band, same technique as /vibecoding: a solid
                // lime-mark would bleed onto the line above at leading 1.04.
                style={{
                  background:
                    "linear-gradient(transparent 0.16em, #c8f04c 0.16em, #c8f04c 0.92em, transparent 0.92em)",
                  padding: "0 0.1em",
                  boxDecorationBreak: "clone",
                  WebkitBoxDecorationBreak: "clone",
                }}
              >
                открытыми цифрами
              </span>
            </h1>

            <p
              data-m-item
              className="mt-7 max-w-2xl text-[17px] leading-[1.55] text-ink-muted md:text-[18px]"
            >
              Раз в неделю созваниваемся в зуме на час. За этот час у тебя
              появляется одна рабочая часть контент-системы. Я расту
              параллельно и показываю свои цифры каждую неделю, включая
              провальные.
            </p>

            <div data-m-item className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              <CtaButton label="Занять место" />
              <p className="font-mono text-sm text-ink">4 500 ₽ / месяц</p>
            </div>
            <p
              data-m-item
              className="desk-script mt-4 font-hand text-[20px] font-semibold text-ink-muted"
            >
              ↳ напиши в Telegram слово «лаборатория»
            </p>
          </div>
        </section>

        {/* Big idea — inverted */}
        <section className="bg-ink text-paper">
          <div data-m="stagger" className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
            <p data-m-item className="font-mono text-xs uppercase tracking-[0.18em] text-paper/60">
              Главная идея
            </p>
            <h2
              data-m-item
              className="font-heading mt-6 max-w-4xl text-balance text-3xl font-black leading-[1.08] tracking-[-0.03em] md:text-5xl"
            >
              Соцсети эксперта ведёт система, которую он собрал сам.
              Вдохновение и контент-менеджер тут не нужны.
            </h2>
            <p
              data-m-item
              className="mt-8 max-w-2xl text-[17px] leading-[1.6] text-paper/70"
            >
              Банк тем, голос, сценарии и очередь публикаций собираются
              руками. У тебя, на твоём материале, пока я рядом. Через месяц
              пост выходит и в день без настроения.
            </p>
          </div>
        </section>

        {/* Principles */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
            <div data-m="stagger">
              <Eyebrow>Как мы работаем</Eyebrow>
              <h2
                data-m-item
                className="font-heading mt-5 max-w-2xl text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] text-ink md:text-4xl"
              >
                Три правила Лаборатории
              </h2>

              <div className="mt-12 grid gap-px bg-line md:grid-cols-3">
                {principles.map((p) => (
                  <div key={p.n} data-m-item className="bg-paper p-8">
                    <p className="font-mono text-sm text-accent">{p.n}</p>
                    <h3 className="font-heading mt-4 text-xl font-bold tracking-[-0.02em] text-ink">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{p.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Starting point */}
        <section className="border-t border-line bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
            <div data-m="stagger">
              <Eyebrow>Откуда я начинаю</Eyebrow>
              <h2
                data-m-item
                className="font-heading mt-5 max-w-3xl text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] text-ink md:text-4xl"
              >
                Миллиона подписчиков у меня нет. Иду этим путём рядом с тобой
              </h2>

              <div className="mt-12 grid gap-px bg-line sm:grid-cols-3">
                {stats.map((s) => (
                  <div key={s.value} data-m-item className="bg-paper p-8">
                    <p className="font-heading text-5xl font-black tracking-[-0.04em] text-ink md:text-6xl">
                      {s.value}
                    </p>
                    <p className="mt-3 max-w-[16rem] text-[15px] leading-relaxed text-ink-muted">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              <p data-m-item className="mt-8 max-w-2xl text-[16px] leading-relaxed text-ink-muted">
                Знаю, какие приёмы у меня работают, и показываю каждый шаг,
                включая недели, когда охваты падают вдвое.
              </p>
            </div>
          </div>
        </section>

        {/* For whom / not for whom */}
        <section className="border-t border-line">
          <div data-m="stagger" className="mx-auto grid max-w-7xl gap-px bg-line px-0 md:grid-cols-2">
            <div data-m-item className="bg-paper px-5 py-12 md:px-10">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">Для кого</p>
              <ul className="mt-6 space-y-4 text-[16px] leading-relaxed text-ink">
                {forWhom.map((t) => (
                  <li key={t} className="flex gap-3">
                    <span className="mt-2 inline-block h-[7px] w-[7px] shrink-0 bg-ink" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div data-m-item className="bg-paper px-5 py-12 md:px-10">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">Не для кого</p>
              <ul className="mt-6 space-y-4 text-[16px] leading-relaxed text-ink-muted">
                {notForWhom.map((t) => (
                  <li key={t} className="flex gap-3">
                    <span
                      className="mt-2 inline-block h-[7px] w-[7px] shrink-0 border border-ink-muted"
                      aria-hidden="true"
                    />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* What's inside */}
        <section className="border-t border-line bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
            <div data-m="stagger">
              <Eyebrow>Что внутри</Eyebrow>
              <h2
                data-m-item
                className="font-heading mt-5 max-w-2xl text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] text-ink md:text-4xl"
              >
                Ритм недели
              </h2>
              <div className="mt-12 border-t border-line">
                {rhythm.map((r) => (
                  <div
                    key={r.when}
                    data-m-item
                    className="grid gap-1 border-b border-line py-5 md:grid-cols-[200px_1fr] md:gap-8"
                  >
                    <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink-muted md:pt-1">
                      {r.when}
                    </p>
                    <p className="text-[16px] leading-relaxed text-ink">{r.what}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Program */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
            <div data-m="stagger">
              <Eyebrow>Программа · первый месяц</Eyebrow>
              <h2
                data-m-item
                className="font-heading mt-5 max-w-3xl text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] text-ink md:text-4xl"
              >
                Четыре четверга, четыре части системы
              </h2>

              <div className="mt-12 border-t border-line">
                {weeks.map((week) => (
                  <div
                    key={week.w}
                    data-m-item
                    className="grid gap-2 border-b border-line py-7 md:grid-cols-[160px_1fr_240px] md:gap-8"
                  >
                    <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink-muted">{week.w}</p>
                    <div>
                      <h3 className="font-heading text-lg font-bold tracking-[-0.02em] text-ink">{week.title}</h3>
                      <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-muted">{week.body}</p>
                    </div>
                    <div className="md:text-right">
                      <span className="lime-mark font-mono text-xs">Итог: {week.out}</span>
                    </div>
                  </div>
                ))}
              </div>

              <p data-m-item className="mt-8 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
                В конце месяца открытый разбор аккаунта одного участника.
              </p>
            </div>
          </div>
        </section>

        {/* Price */}
        <section className="border-t border-line bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
            <div data-m="stagger" className="grid gap-12 md:grid-cols-[1fr_1fr] md:gap-16">
              <div>
                <Eyebrow>Цена</Eyebrow>
                <p
                  data-m-item
                  className="font-heading mt-5 text-6xl font-black tracking-[-0.04em] text-ink md:text-7xl"
                >
                  4 500 ₽
                </p>
                <p data-m-item className="mt-2 font-mono text-sm text-ink-muted">
                  в месяц · 10 мест в первом наборе
                </p>
                <div data-m-item className="mt-9">
                  <CtaButton label="Занять место" />
                </div>
              </div>
              <div data-m-item className="space-y-4 text-[16px] leading-relaxed text-ink-muted md:pt-10">
                <p>
                  Час консультации со мной стоит 3 850 ₽. В месяце Лаборатории
                  четыре живых часа.
                </p>
                <p>
                  Роста в подписчиках не обещаю. Обещаю четыре настройки в
                  месяц и открытые цифры.
                </p>
                <p>Отменить можно перед любым следующим месяцем.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
            <div data-m="stagger">
              <h2
                data-m-item
                className="font-heading text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] text-ink md:text-4xl"
              >
                Вопросы
              </h2>
              <div className="mt-10 border-t border-line">
                {faq.map((item) => (
                  <div
                    key={item.q}
                    data-m-item
                    className="grid gap-2 border-b border-line py-7 md:grid-cols-[1fr_1.4fr] md:gap-12"
                  >
                    <h3 className="font-heading text-lg font-bold tracking-[-0.02em] text-ink">{item.q}</h3>
                    <p className="max-w-2xl text-[15px] leading-relaxed text-ink-muted">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-line bg-white">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
            <div data-m="stagger">
              <h2
                data-m-item
                className="font-heading max-w-3xl text-balance text-4xl font-black leading-[1.04] tracking-[-0.04em] text-ink md:text-5xl"
              >
                Десять мест в первом наборе
              </h2>
              <p data-m-item className="mt-5 max-w-xl text-[17px] leading-[1.55] text-ink-muted">
                Напиши в Telegram слово «лаборатория», и я пришлю детали.
              </p>
              <div data-m-item className="mt-9">
                <CtaButton label="Написать в Telegram" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <DeskFooter />
    </div>
  );
}
