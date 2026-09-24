import type { Metadata } from "next";
import Link from "next/link";
import { TELEGRAM_URL } from "@/lib/products";
import { Accordion, Crosshair } from "@/components/kalka/Interactive";
import { Rulers } from "@/components/kalka/Rulers";

export const metadata: Metadata = {
  title: "Лаборатория — растим соцсети вместе с нейросетями",
  description:
    "Закрытый канал и чат, где растим свои аккаунты вместе. Созвон раз в неделю на полтора-два часа, вопросы в любой момент, открытые цифры. Первый набор на десять мест, 4 500 ₽ в месяц.",
};

// Standalone landing for the paid community «Лаборатория».
// Visual: white engineering tracing paper (lab.css). Copy passed
// ~/.tov/tovlint.mjs — keep edits in Влад's voice (ты, no «!», AI helps,
// never «пишет за тебя»).

const inside = [
  {
    n: "01",
    title: "Закрытый канал",
    body: "Мои разборы, находки с готовыми файлами, стройка своих аккаунтов с цифрами и провалы с ценой в часах или рублях.",
    note: "материалы копятся",
  },
  {
    n: "02",
    title: "Чат участников",
    body: "Вопрос задаёшь, когда он возник, ждать созвона не нужно. Отвечаю я, подключаются участники.",
    note: "открыт всегда",
  },
  {
    n: "03",
    title: "Созвон раз в неделю",
    body: "Живой разговор: обсуждаем, что у кого вышло, разбираем аккаунты и публикации, отвечаю на вопросы голосом. Запись остаётся в канале.",
    dim: "1,5–2 часа",
  },
  {
    n: "04",
    title: "Общая таблица роста",
    body: "Раз в неделю каждый вписывает своих подписчиков и охваты, я вписываю свои. Плохую неделю видно так же, как хорошую.",
    chart: true,
  },
];

const topics = [
  {
    title: "Темы",
    body: "Где брать темы из своего опыта, историй и вопросов клиентов, чтобы банк не пустел. Нейросеть помогает раскопать то, что ты сам считаешь очевидным.",
  },
  {
    title: "Голос",
    body: "Как сделать, чтобы черновик от нейросети звучал как ты, без интонации пресс-релиза. Разбираем шаблон голоса и проверку текста.",
  },
  {
    title: "Форматы",
    body: "Одна мысль раскладывается в рилс, тред, карусель и пост. Смотрим, какой формат работает у тебя.",
  },
  {
    title: "Регулярность",
    body: "Как публиковаться без подвигов: очередь публикаций, отложенный постинг, неделя контента за один вечер.",
  },
  {
    title: "Цифры",
    body: "Что замерять, где смотреть охваты и как понять, какая тема сработала. Здесь же общая таблица.",
  },
];

const stats = [
  { value: "287", label: "подписчиков в Threads, с которых я начал" },
  { value: "727", label: "человек читают меня в Telegram" },
  { value: "112", label: "своих рилсов разобрал по замерам" },
];

const faq = [
  { title: "Какие соцсети?", body: "Instagram, Threads и Telegram. Работаем с теми, где ты уже есть." },
  {
    title: "Нейросеть будет писать посты за меня?",
    body: "Писать будешь ты. Нейросеть помогает найти тему, собрать черновик и проверить, что текст звучит как ты.",
  },
  { title: "Когда можно зайти?", body: "В любой день. Записи прошлых созвонов и материалы лежат в канале." },
  { title: "Я пропущу созвон, что тогда?", body: "Запись появится в канале, а вопросы можно задать в чате." },
  {
    title: "Нужен ли опыт с нейросетями?",
    body: "Опыт не нужен. В канале есть чек-лист, как настроить доступ из России и начать.",
  },
  {
    title: "Сколько подписчиков я наберу?",
    body: "Не знаю и не обещаю. Знаю, что рядом будут люди на том же пути и мои открытые цифры.",
  },
  {
    title: "Как оплатить?",
    body: "Напиши мне в Telegram, пришлю ссылку. Принимаю карты российских и иностранных банков.",
  },
];

const H2 =
  "font-heading mt-5 max-w-3xl text-balance text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] md:text-5xl";

function Cta({ label }: { label: string }) {
  return (
    <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="rz-btn rz-btn--solid">
      {label}
      <span aria-hidden="true">&rarr;</span>
    </a>
  );
}

// Линия роста: сплошная до «мы здесь», пунктир до «?».
function GrowthLine() {
  const point = "k-point absolute flex items-center gap-2 font-mono text-[11px] tracking-[0.06em]";
  return (
    <div className="pointer-events-none absolute inset-0 left-[28px] top-[28px] opacity-30 md:opacity-100" aria-hidden="true">
      <svg className="k-diagonal k-draw absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M58 92 L77 58" vectorEffect="non-scaling-stroke" />
      </svg>
      <svg className="k-diagonal k-draw k-draw--late absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path className="k-diagonal--ghost" d="M77 58 L96 10" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className={point} style={{ left: "58%", top: "92%", transform: "translate(-4px,-4px)", animationDelay: ".4s" }}>
        <span className="block h-2 w-2 bg-[#15161a]" />
        <span className="hidden bg-white px-1 md:inline">старт · 287</span>
      </div>
      <div className={point} style={{ left: "77%", top: "58%", transform: "translate(-4px,-4px)", animationDelay: "2.1s" }}>
        <span className="block h-2 w-2 bg-[#15161a]" />
        <span className="hidden bg-white px-1 md:inline">мы здесь</span>
      </div>
      <div className={point} style={{ left: "96%", top: "10%", transform: "translate(-6px,-6px)", animationDelay: "2.6s" }}>
        <span className="block h-3 w-3 border border-[#15161a] bg-[#c8f04c]" />
        <span className="hidden -translate-x-[calc(100%+32px)] bg-white px-1 md:inline">?</span>
      </div>
    </div>
  );
}

function MiniChart() {
  return (
    <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="k-diagonal k-chart mt-6 h-16 w-full" aria-hidden="true">
      <path d="M0 52 L40 46 L80 49 L120 34 L160 30 L200 12" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export default function LabPage() {
  return (
    <div className="k-page">
      <Crosshair />
      <main>
        {/* Hero — лист с линейками */}
        <section className="relative min-h-[min(92vh,880px)] overflow-hidden border-b border-[#15161a]">
          <Rulers />
          <GrowthLine />

          <div className="relative z-[2] mx-auto max-w-7xl px-5 pb-20 pl-10 pt-24 md:px-14 md:pt-28">
            <nav aria-label="Хлебные крошки">
              <Link href="/products" className="k-mono -my-3 inline-block bg-white py-3 pr-2 hover:text-[#15161a]">
                &larr; Все продукты
              </Link>
            </nav>

            <div className="pt-10 md:pt-16">
              <p className="k-mono inline-block bg-white pr-2">Лаборатория · первый набор · 10 мест</p>

              <h1
                data-m="lines"
                data-m-hero
                className="font-heading mt-6 max-w-[15ch] text-balance text-[42px] font-black leading-[1.02] tracking-[-0.04em] sm:text-[56px] lg:max-w-[16ch] lg:text-[76px]"
              >
                Растим соцсети вместе, с нейросетями и <span className="rz-mark">открытыми цифрами</span>
              </h1>

              <div data-m="reveal" data-m-delay="0.5" className="mt-8 max-w-xl bg-white/85 py-1">
                <p className="text-[17px] leading-[1.6] text-[#6b6e78] md:text-[18px]">
                  Закрытый канал и чат, где каждый растит свой аккаунт, а спрашивать можно в любой момент. Раз в неделю
                  созваниваемся на полтора-два часа и разбираем, что получилось. Я расту рядом и показываю свои цифры,
                  включая провальные.
                </p>
              </div>

              <div className="k-point mt-10 flex flex-wrap items-center gap-x-6 gap-y-3" style={{ animationDelay: "0.9s" }}>
                <Cta label="Занять место" />
                <span className="k-mono bg-white px-1 !text-[#15161a]">4 500 ₽ / месяц</span>
              </div>
            </div>
          </div>
        </section>

        {/* Главная идея — негатив кальки */}
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
              className="font-heading mt-6 max-w-4xl text-balance text-3xl font-black leading-[1.08] tracking-[-0.03em] md:text-6xl"
            >
              Соцсети ведёшь ты. Нейросети рядом: подсказывают темы, держат твой голос в текстах и забирают рутину.
            </h2>
            <p data-m="reveal" className="mt-10 max-w-2xl text-[17px] leading-[1.65] text-white/65">
              Готовых постов за тебя никто писать не будет. Будет компания людей, которые идут тем же путём, и помощник,
              который экономит часы на каждой публикации.
            </p>
          </div>
        </section>

        {/* Что внутри — четыре листа */}
        <section className="border-b border-[#15161a]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
            <p className="k-mono inline-block bg-white pr-2">Что внутри</p>
            <h2 data-m="lines" className={H2}>
              Канал, чат, созвон и таблица, где видно, кто куда вырос
            </h2>

            <div data-m="stagger" className="mt-14 grid gap-6 md:grid-cols-2 md:gap-8">
              {inside.map((it) => (
                <article key={it.n} data-m-item className="k-sheet p-7 pt-9 md:p-10">
                  <span className="k-sheet-index">{it.n}</span>
                  <h3 className="font-heading text-2xl font-bold tracking-[-0.02em]">{it.title}</h3>
                  <p className="mt-3 max-w-md text-[16px] leading-relaxed text-[#6b6e78]">{it.body}</p>
                  {it.note && (
                    <p className="k-mono mt-7 flex items-center gap-2 !text-[#15161a]">
                      <span className="inline-block h-2 w-2 bg-[#c8f04c] ring-1 ring-[#15161a]" aria-hidden="true" />
                      {it.note}
                    </p>
                  )}
                  {it.dim && <p className="k-dim mt-8">{it.dim}</p>}
                  {it.chart && <MiniChart />}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* О чём говорим */}
        <section className="border-b border-[#15161a]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
              <div>
                <p className="k-mono inline-block bg-white pr-2">О чём говорим</p>
                <h2 data-m="lines" className={H2}>
                  Пять тем, к которым возвращаемся
                </h2>
                <p data-m="reveal" className="mt-6 max-w-sm bg-white/85 text-[16px] leading-relaxed text-[#6b6e78]">
                  Порядок задаёт чат. Нажми на тему, чтобы раскрыть.
                </p>
              </div>
              <div data-m="stagger">
                <Accordion items={topics} firstOpen />
              </div>
            </div>
          </div>
        </section>

        {/* Откуда я начинаю */}
        <section className="border-b border-[#15161a]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
            <p className="k-mono inline-block bg-white pr-2">Откуда я начинаю</p>
            <h2 data-m="lines" className={H2}>
              Миллиона подписчиков у меня нет. Иду этим путём рядом с тобой
            </h2>

            <div data-m="stagger" className="mt-14 grid border border-[#15161a] bg-white sm:grid-cols-3">
              {stats.map((s, i) => (
                <div
                  key={s.value}
                  data-m-item
                  className={`p-8 md:p-10 ${i > 0 ? "border-t border-[#15161a] sm:border-l sm:border-t-0" : ""}`}
                >
                  <p data-m="count" className="font-heading text-6xl font-black tracking-[-0.04em] md:text-7xl">
                    {s.value}
                  </p>
                  <p className="mt-4 max-w-[16rem] text-[15px] leading-relaxed text-[#6b6e78]">{s.label}</p>
                </div>
              ))}
            </div>

            <p data-m="reveal" className="mt-8 max-w-2xl bg-white/85 text-[16px] leading-relaxed text-[#6b6e78]">
              Знаю, какие приёмы у меня работают, и показываю каждый шаг, включая недели, когда охваты падают вдвое.
            </p>
          </div>
        </section>

        {/* Цена */}
        <section className="border-b border-[#15161a]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
            <div data-m="reveal" className="k-sheet grid gap-10 p-8 md:grid-cols-[1fr_1fr] md:gap-16 md:p-14">
              <span className="k-sheet-index">цена</span>
              <div>
                <p className="font-heading text-7xl font-black tracking-[-0.04em] md:text-8xl">4 500 ₽</p>
                <p className="k-dim mt-5 max-w-xs">в месяц</p>
                <div className="mt-10">
                  <Cta label="Занять место" />
                </div>
              </div>
              <div className="space-y-4 text-[16px] leading-relaxed text-[#6b6e78] md:pt-4">
                <p>
                  Час консультации со мной стоит 3 850 ₽. В месяце Лаборатории четыре созвона по полтора-два часа и
                  чат, где можно спросить в любой день.
                </p>
                <p>Роста в подписчиках не обещаю.</p>
                <p>Отменить можно перед любым следующим месяцем.</p>
                <p className="k-mono pt-4 !text-[#15161a]">10 мест в первом наборе</p>
              </div>
            </div>
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
              className="font-heading max-w-3xl text-balance text-4xl font-black leading-[1.04] tracking-[-0.04em] md:text-6xl"
            >
              Десять мест в <span className="rz-mark">первом наборе</span>
            </h2>
            <p data-m="reveal" className="mt-6 max-w-xl bg-white/85 text-[17px] leading-[1.6] text-[#6b6e78]">
              Напиши в Telegram слово «лаборатория», и я пришлю детали.
            </p>
            <div data-m="reveal" className="mt-10">
              <Cta label="Написать в Telegram" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
