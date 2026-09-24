import type { Metadata } from "next";
import Link from "next/link";
import { WaitlistForm } from "@/components/products/WaitlistForm";
import { Accordion, Crosshair } from "@/components/kalka/Interactive";
import { Rulers } from "@/components/kalka/Rulers";

export const metadata: Metadata = {
  title: "Курс по вайбкодингу — свой продукт с нуля до запуска",
  description:
    "8-недельный поток: с нуля собираешь свой работающий продукт — с базой данных, входом для пользователей и публикацией в интернете. Не туториал и не конструктор сайтов, а инженерный подход к работе с AI.",
};

// Standalone landing — White + Lime kalka DS (app/kalka.css, components/kalka/*).
// Global StudioFooter (app/layout.tsx) covers the footer, so no page-level one here.
// Content lives inline: one page, one source of truth. Copy is written for a
// mixed-beginner audience — no engineering jargon.

const principles = [
  {
    n: "01",
    title: "Контекст — это всё",
    body: "AI настолько хорош, насколько хорошо ты объяснил задачу: что собираем, как и по каким правилам. Учим не «кидать запросы», а ставить задачу так, чтобы получался нужный результат.",
  },
  {
    n: "02",
    title: "Ты проверяешь, а не наблюдаешь",
    body: "Работа с AI — это не слепое «согласен на всё». Учим проверять, что он сделал, замечать ошибки и чинить их — иначе AI тихо закопает проект.",
  },
  {
    n: "03",
    title: "Запуск — это не «выложил и забыл»",
    body: "Доступы и пароли, рабочая и тестовая версии, ошибки, стоимость, наблюдение за работой. Готовый продукт — это то, что реально работает у пользователей, а не картинка.",
  },
];

const weeks = [
  {
    w: "Неделя 1",
    title: "Старт и первая публикация",
    body: "Как устроена работа с AI-помощником и из чего собирается продукт. Настраиваем рабочее место. Каждый выкладывает первую страницу в интернет в первый же день — чтобы снять страх перед публикацией.",
    out: "первая страница в интернете",
  },
  {
    w: "Неделя 2",
    title: "План и структура до сборки",
    body: "Главный навык: не «сделай мне CRM», а сначала описание и структура будущего продукта. AI собирает каркас приложения, делаем таблицу и форму.",
    out: "описание + рабочий вид",
  },
  {
    w: "Неделя 3",
    title: "Данные, вход и проверка",
    body: "Подключаем базу данных: добавление и хранение записей, вход для пользователей, доступы и пароли. Ключевой блок про проверку — смотрим, что сделал AI, ловим ошибки, чиним.",
    out: "продукт с базой и входом",
  },
  {
    w: "Неделя 4",
    title: "Умная функция и публикация",
    body: "Подключаем функцию на основе AI, разбираем безопасность ключей, стоимость запросов и обработку ошибок. Выкладываем готовый продукт в интернет.",
    out: "первый готовый продукт",
  },
  {
    w: "Неделя 5",
    title: "Своя идея и план",
    body: "Выбираешь свой продукт — для клиента или своего бизнеса. Учим не раздувать задачу (главная причина, почему новички тонут). Согласуем план перед сборкой.",
    out: "описание и план проекта",
  },
  {
    w: "Неделя 6",
    title: "Основа продукта",
    body: "Собираем основной функционал на уже отработанном подходе. Фокус — как держать большой проект под контролем.",
    out: "работающая основа",
  },
  {
    w: "Неделя 7",
    title: "Готовность к запуску",
    body: "Вход для пользователей, нестандартные ситуации, реальные данные, доработка и разбор сложных ошибок.",
    out: "продукт, готовый к публикации",
  },
  {
    w: "Неделя 8",
    title: "Запуск и защита проектов",
    body: "Выкладываем продукт в интернет, показываем проекты группе, разбираем итоги. Что дальше — поддержка, развитие, как это продавать и применять.",
    out: "твой продукт в интернете",
  },
];

const tiers = [
  {
    n: "01",
    name: "Базовый",
    price: "10000 ₽",
    featured: false,
    items: [
      "Доступ к материалам потока",
      "Чат участников и дедлайны",
      "Разбор работ между участниками",
      "Без личной проверки работ",
    ],
  },
  {
    n: "02",
    name: "Стандарт",
    price: "25000 ₽",
    featured: true,
    items: [
      "Всё из базового",
      "Еженедельные живые разборы",
      "Проверка твоих работ куратором",
      "Доступ к записям навсегда",
    ],
  },
  {
    n: "03",
    name: "Премиум",
    price: "40000 ₽",
    featured: false,
    items: ["Всё из стандарта", "2 личные встречи 1:1 по проекту", "Личный разбор твоего проекта"],
  },
];

const faq = [
  {
    title: "Я никогда не писал код — потяну?",
    body: "Группа смешанная, и первая неделя выравнивает всех на общую базу. Дальше идём единым темпом, с проверкой и поддержкой на дедлайнах.",
  },
  {
    title: "Чем это отличается от курсов про конструкторы сайтов?",
    body: "Те учат тыкать в конструктор. Здесь — инженерный подход к работе с AI: настоящий продукт, настоящие инструменты, публикация в интернете. AI пишет код, но ты держишь структуру и понимаешь каждое решение.",
  },
  {
    title: "Что останется на руках в конце?",
    body: "Работающий продукт в интернете — с базой данных и входом для пользователей — и навык, который переносится на любой следующий проект. Не учебная игрушка, а твоя собственная идея.",
  },
  {
    title: "Сколько времени нужно в неделю?",
    body: "Ориентир — 5–7 часов: материал, практика на своём экране и сдача работы к концу недели. Поток держит ритм, поэтому не получится откладывать на потом.",
  },
  {
    title: "Нужно ли платить за инструменты?",
    body: "Да, но немного: подписка на AI-инструмент и размещение продукта в интернете. На старте бесплатных тарифов хватает. Все расходы проговариваем заранее.",
  },
];

const H2 =
  "font-heading mt-5 max-w-3xl text-balance text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] md:text-5xl";

function WaitBlock({ note }: { note: string }) {
  return (
    <div className="mt-9 max-w-md">
      <p className="k-mono mb-3 inline-block bg-white pr-2 !text-[#15161a]">Лист ожидания первого потока</p>
      <WaitlistForm />
      <p className="k-mono mt-3 !normal-case !tracking-normal">{note}</p>
    </div>
  );
}

export default function VibecodingPage() {
  return (
    <div className="k-page">
      <Crosshair />
      <main>
        {/* Hero — лист с линейками */}
        <section className="relative min-h-[min(90vh,840px)] overflow-hidden border-b border-[#15161a]">
          <Rulers />

          <div className="relative z-[2] mx-auto max-w-7xl px-5 pb-20 pl-10 pt-24 md:px-14 md:pt-28">
            <nav aria-label="Хлебные крошки">
              <Link href="/products" className="k-mono -my-3 inline-block bg-white py-3 pr-2 hover:text-[#15161a]">
                &larr; Все продукты
              </Link>
            </nav>

            <div className="pt-10 md:pt-16">
              <p className="k-mono inline-block bg-white pr-2">8 недель · от идеи до запуска</p>

              <h1
                data-m="lines"
                data-m-hero
                className="font-heading mt-6 max-w-[16ch] text-balance text-[38px] font-extrabold leading-[1.03] tracking-[-0.04em] sm:text-[48px] lg:text-[62px]"
              >
                Доведи свой продукт до <span className="rz-mark">запуска</span> — не написав код вручную
              </h1>

              <div data-m="reveal" data-m-delay="0.5" className="mt-8 max-w-xl bg-white/85 py-1">
                <p className="text-[17px] leading-[1.6] text-[#6b6e78] md:text-[18px]">
                  Не туториал и не конструктор сайтов. За 8 недель ты с нуля собираешь свой работающий продукт — с
                  базой данных, входом для пользователей и публикацией в интернете — управляя AI как
                  помощником-разработчиком и понимая каждое решение.
                </p>
              </div>

              <WaitBlock note="участники потока узнают о старте первыми и получат стартовую цену" />
            </div>
          </div>
        </section>

        {/* Для кого / не для кого */}
        <section className="border-b border-[#15161a]">
          <div data-m="stagger" className="grid md:grid-cols-2">
            <div data-m-item className="border-b border-[#15161a] px-5 py-14 md:border-b-0 md:border-r md:px-14 md:py-20">
              <p className="k-mono inline-block bg-white pr-2">Для кого</p>
              <ul className="mt-8 space-y-4 text-[16px] leading-relaxed text-[#15161a]">
                {[
                  "Фаундеры и соло-предприниматели, которым нужен свой продукт или внутренний инструмент",
                  "Те, кто хочет научиться доводить идею до запуска, а не собирать демо «для галочки»",
                  "Готовые разбираться: проверять, что сделал AI, замечать и чинить ошибки",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <span className="mt-2 inline-block h-[7px] w-[7px] shrink-0 bg-[#c8f04c] ring-1 ring-[#15161a]" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div data-m-item className="px-5 py-14 md:px-14 md:py-20">
              <p className="k-mono inline-block bg-white pr-2">Не для кого</p>
              <ul className="mt-8 space-y-4 text-[16px] leading-relaxed text-[#6b6e78]">
                {[
                  "Кто ищет «приложение за 10 минут» и кнопку «сделать красиво»",
                  "Кто хочет навсегда остаться внутри конструктора сайтов",
                  "Кто не готов вкладывать 5–7 часов в неделю и сдавать работы к дедлайну",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <span className="mt-2 inline-block h-[7px] w-[7px] shrink-0 border border-[#6b6e78]" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Принципы — три листа */}
        <section className="border-b border-[#15161a]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
            <p className="k-mono inline-block bg-white pr-2">Что отличает профессионала</p>
            <h2 data-m="lines" className={H2}>
              Три принципа, на которых стоит весь курс
            </h2>

            <div data-m="stagger" className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
              {principles.map((p) => (
                <article key={p.n} data-m-item className="k-sheet p-7 pt-9 md:p-8">
                  <span className="k-sheet-index">{p.n}</span>
                  <h3 className="font-heading text-xl font-bold tracking-[-0.02em]">{p.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#6b6e78]">{p.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Программа — негатив кальки */}
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
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/50">Программа · 8 недель</p>
            <h2
              data-m="lines"
              className="font-heading mt-5 max-w-3xl text-balance text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] md:text-5xl"
            >
              Первые 4 недели — общий продукт. Дальше — твой проект до запуска
            </h2>
            <p data-m="reveal" className="mt-6 max-w-2xl text-[16px] leading-relaxed text-white/65">
              Сначала ведём всех по одному продукту — простой CRM, которая сама находит информацию о клиентах через
              AI, чтобы пройти весь путь от идеи до публикации. Затем каждый берёт свою идею и доводит её до запуска
              на отработанном подходе.
            </p>

            <div data-m="stagger" className="mt-14 border-t border-white/20">
              {weeks.map((week) => (
                <div
                  key={week.w}
                  data-m-item
                  className="grid gap-2 border-b border-white/20 py-7 md:grid-cols-[140px_1fr_220px] md:gap-8"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-white/45">{week.w}</p>
                  <div>
                    <h3 className="font-heading text-lg font-bold tracking-[-0.02em] text-white">{week.title}</h3>
                    <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-white/65">{week.body}</p>
                  </div>
                  <div className="md:text-right">
                    <span className="k-mono inline-flex items-center gap-2 !text-white/70 md:justify-end">
                      <span className="inline-block h-2 w-2 bg-[#c8f04c]" aria-hidden="true" />
                      Сдача: {week.out}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Тарифы */}
        <section className="border-b border-[#15161a]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
            <p className="k-mono inline-block bg-white pr-2">Тарифы</p>
            <h2 data-m="lines" className={H2}>
              Разница только в глубине сопровождения
            </h2>

            <div data-m="stagger" className="mt-14 grid gap-6 lg:grid-cols-3 lg:gap-8">
              {tiers.map((tier) => (
                <article
                  key={tier.name}
                  data-m-item
                  className={`k-sheet p-8 pt-9 ${tier.featured ? "ring-1 ring-inset ring-[#15161a]" : ""}`}
                >
                  <span className="k-sheet-index">{tier.featured ? "★" : tier.n}</span>
                  <p className="font-heading text-lg font-bold tracking-[-0.02em]">{tier.name}</p>
                  <p className="font-heading mt-4 text-4xl font-extrabold tracking-[-0.03em]">{tier.price}</p>
                  <ul className="mt-7 space-y-3 text-[15px] leading-relaxed text-[#15161a]">
                    {tier.items.map((it) => (
                      <li key={it} className="flex gap-3">
                        <span className="mt-2 inline-block h-[7px] w-[7px] shrink-0 bg-[#c8f04c] ring-1 ring-[#15161a]" aria-hidden="true" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <p data-m="reveal" className="mt-8 max-w-2xl bg-white/85 text-[15px] leading-relaxed text-[#6b6e78]">
              На тарифы 25000 и 40000 ₽ доступна рассрочка на два платежа. Гарантия: довёл продукт до запуска или
              возврат — дедлайны и проверка не дадут отвалиться молча.
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
                  Частые вопросы
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
              Первый поток <span className="rz-mark">ограничен</span>
            </h2>
            <p data-m="reveal" className="mt-6 max-w-xl bg-white/85 text-[17px] leading-[1.6] text-[#6b6e78]">
              Оставь ник — напишу о старте лично.
            </p>
            <WaitBlock note="без спама — одно сообщение, когда откроются места" />
          </div>
        </section>
      </main>
    </div>
  );
}
