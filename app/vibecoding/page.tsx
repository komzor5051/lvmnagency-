import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/home/Footer";
import { Reveal } from "@/components/motion/Reveal";
import { WaitlistForm } from "@/components/products/WaitlistForm";

export const metadata: Metadata = {
  title: "Курс по вайбкодингу — свой продукт с нуля до запуска",
  description:
    "8-недельный поток: с нуля собираешь свой работающий продукт — с базой данных, входом для пользователей и публикацией в интернете. Не туториал и не конструктор сайтов, а инженерный подход к работе с AI.",
};

// Standalone landing — reuses the home Footer and the White + Lime DS; the
// global HUD (components/hud/HudFrame.tsx) replaces the old page-level Nav.
// Content lives inline: one page, one source of truth.
// Copy is written for a mixed-beginner audience — no engineering jargon.

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
    name: "Базовый",
    price: "10 000 ₽",
    featured: false,
    items: [
      "Доступ к материалам потока",
      "Чат участников и дедлайны",
      "Разбор работ между участниками",
      "Без личной проверки работ",
    ],
  },
  {
    name: "Стандарт",
    price: "25 000 ₽",
    featured: true,
    items: [
      "Всё из базового",
      "Еженедельные живые разборы",
      "Проверка твоих работ куратором",
      "Доступ к записям навсегда",
    ],
  },
  {
    name: "Премиум",
    price: "40 000 ₽",
    featured: false,
    items: [
      "Всё из стандарта",
      "2 личные встречи 1:1 по проекту",
      "Личный разбор твоего проекта",
    ],
  },
];

const faq = [
  {
    q: "Я никогда не писал код — потяну?",
    a: "Группа смешанная, и первая неделя выравнивает всех на общую базу. Дальше идём единым темпом, с проверкой и поддержкой на дедлайнах.",
  },
  {
    q: "Чем это отличается от курсов про конструкторы сайтов?",
    a: "Те учат тыкать в конструктор. Здесь — инженерный подход к работе с AI: настоящий продукт, настоящие инструменты, публикация в интернете. AI пишет код, но ты держишь структуру и понимаешь каждое решение.",
  },
  {
    q: "Что останется на руках в конце?",
    a: "Работающий продукт в интернете — с базой данных и входом для пользователей — и навык, который переносится на любой следующий проект. Не учебная игрушка, а твоя собственная идея.",
  },
  {
    q: "Сколько времени нужно в неделю?",
    a: "Ориентир — 5–7 часов: материал, практика на своём экране и сдача работы к концу недели. Поток держит ритм, поэтому не получится откладывать на потом.",
  },
  {
    q: "Нужно ли платить за инструменты?",
    a: "Да, но немного: подписка на AI-инструмент и размещение продукта в интернете. На старте бесплатных тарифов хватает. Все расходы проговариваем заранее.",
  },
];

export default function VibecodingPage() {
  return (
    <div className="bg-paper text-ink">
      <main>
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-5 pb-16 pt-12 md:px-10 md:pt-[72px] lg:pb-24">
          <nav aria-label="Хлебные крошки">
            <Link
              href="/products"
              className="font-mono text-xs tracking-[0.08em] text-ink-muted transition-colors hover:text-ink"
            >
              &larr; Все продукты
            </Link>
          </nav>

          <Reveal className="pt-12 md:pt-16">
            <p
              data-reveal
              className="font-mono text-xs uppercase tracking-[0.18em] text-accent"
            >
              8-недельный онлайн-поток · от идеи до запуска
            </p>

            <h1
              data-reveal
              className="font-heading mt-6 max-w-4xl text-[40px] font-black leading-[1.0] tracking-[-0.04em] text-ink sm:text-[52px] lg:text-[64px]"
            >
              Доведи свой продукт до{" "}
              <span
                // Inset lime band confined to its own line — a solid lime-mark
                // would fill the full (tight, leading-1.0) line box and bleed
                // up onto the line above. Gradient keeps it behind the word.
                style={{
                  background:
                    "linear-gradient(transparent 0.16em, #c8f04c 0.16em, #c8f04c 0.92em, transparent 0.92em)",
                  padding: "0 0.1em",
                  boxDecorationBreak: "clone",
                  WebkitBoxDecorationBreak: "clone",
                }}
              >
                запуска
              </span>{" "}
              — не написав код вручную
            </h1>

            <p
              data-reveal
              className="mt-7 max-w-2xl text-[17px] leading-[1.55] text-ink-muted md:text-[18px]"
            >
              Не туториал и не конструктор сайтов. За 8 недель ты с нуля
              собираешь свой работающий продукт — с базой данных, входом для
              пользователей и публикацией в интернете — управляя AI как
              помощником-разработчиком и понимая каждое решение.
            </p>

            <div data-reveal className="mt-9 max-w-md">
              <p className="mb-2 text-sm font-bold text-ink">
                Записаться в лист ожидания первого потока
              </p>
              <WaitlistForm />
              <p className="mt-3 font-hand text-[20px] font-semibold text-ink-muted">
                ↳ участники потока узнают о старте первыми и получат стартовую цену
              </p>
            </div>
          </Reveal>
        </section>

        {/* For whom / not for whom */}
        <section className="border-t border-line">
          <Reveal className="mx-auto grid max-w-7xl gap-px bg-line px-0 md:grid-cols-2">
            <div data-reveal className="bg-paper px-5 py-12 md:px-10">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
                Для кого
              </p>
              <ul className="mt-6 space-y-4 text-[16px] leading-relaxed text-ink">
                {[
                  "Фаундеры и соло-предприниматели, которым нужен свой продукт или внутренний инструмент",
                  "Те, кто хочет научиться доводить идею до запуска, а не собирать демо «для галочки»",
                  "Готовые разбираться: проверять, что сделал AI, замечать и чинить ошибки",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <span
                      className="mt-2 inline-block h-[7px] w-[7px] shrink-0 bg-ink"
                      aria-hidden="true"
                    />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div data-reveal className="bg-paper px-5 py-12 md:px-10">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
                Не для кого
              </p>
              <ul className="mt-6 space-y-4 text-[16px] leading-relaxed text-ink-muted">
                {[
                  "Кто ищет «приложение за 10 минут» и кнопку «сделать красиво»",
                  "Кто хочет навсегда остаться внутри конструктора сайтов",
                  "Кто не готов вкладывать 5–7 часов в неделю и сдавать работы к дедлайну",
                ].map((t) => (
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
          </Reveal>
        </section>

        {/* Principles */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
            <Reveal>
              <p
                data-reveal
                className="font-mono text-xs uppercase tracking-[0.18em] text-accent"
              >
                Что отличает профессионала
              </p>
              <h2
                data-reveal
                className="font-heading mt-5 max-w-2xl text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] text-ink md:text-4xl"
              >
                Три принципа, на которых стоит весь курс
              </h2>

              <div className="mt-12 grid gap-px bg-line md:grid-cols-3">
                {principles.map((p) => (
                  <div key={p.n} data-reveal className="bg-paper p-8">
                    <p className="font-mono text-sm text-accent">{p.n}</p>
                    <h3 className="font-heading mt-4 text-xl font-bold tracking-[-0.02em] text-ink">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
                      {p.body}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Program */}
        <section className="border-t border-line bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
            <Reveal>
              <p
                data-reveal
                className="font-mono text-xs uppercase tracking-[0.18em] text-accent"
              >
                Программа · 8 недель
              </p>
              <h2
                data-reveal
                className="font-heading mt-5 max-w-3xl text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] text-ink md:text-4xl"
              >
                Первые 4 недели — общий продукт. Дальше — твой проект до запуска
              </h2>
              <p
                data-reveal
                className="mt-5 max-w-2xl text-[16px] leading-relaxed text-ink-muted"
              >
                Сначала ведём всех по одному продукту — простой CRM, которая сама
                находит информацию о клиентах через AI, чтобы пройти весь путь от
                идеи до публикации. Затем каждый берёт свою идею и доводит её до
                запуска на отработанном подходе.
              </p>

              <div className="mt-12 border-t border-line">
                {weeks.map((week) => (
                  <div
                    key={week.w}
                    data-reveal
                    className="grid gap-2 border-b border-line py-7 md:grid-cols-[160px_1fr_220px] md:gap-8"
                  >
                    <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink-muted">
                      {week.w}
                    </p>
                    <div>
                      <h3 className="font-heading text-lg font-bold tracking-[-0.02em] text-ink">
                        {week.title}
                      </h3>
                      <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-muted">
                        {week.body}
                      </p>
                    </div>
                    <div className="md:text-right">
                      <span className="lime-mark font-mono text-xs">
                        Сдача: {week.out}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Pricing */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
            <Reveal>
              <p
                data-reveal
                className="font-mono text-xs uppercase tracking-[0.18em] text-accent"
              >
                Тарифы
              </p>
              <h2
                data-reveal
                className="font-heading mt-5 max-w-2xl text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] text-ink md:text-4xl"
              >
                Разница только в глубине сопровождения
              </h2>

              <div className="mt-12 grid gap-px bg-line lg:grid-cols-3">
                {tiers.map((tier) => (
                  <div
                    key={tier.name}
                    data-reveal
                    className={
                      tier.featured
                        ? "relative bg-paper p-8 ring-2 ring-inset ring-ink"
                        : "bg-paper p-8"
                    }
                  >
                    {tier.featured && (
                      <span className="lime-mark absolute right-8 top-8 font-mono text-[11px] font-bold uppercase tracking-[0.1em]">
                        Рекомендуем
                      </span>
                    )}
                    <p className="font-heading text-lg font-bold tracking-[-0.02em] text-ink">
                      {tier.name}
                    </p>
                    <p className="font-heading mt-4 text-4xl font-black tracking-[-0.03em] text-ink">
                      {tier.price}
                    </p>
                    <ul className="mt-7 space-y-3 text-[15px] leading-relaxed text-ink">
                      {tier.items.map((it) => (
                        <li key={it} className="flex gap-3">
                          <span
                            className="mt-2 inline-block h-[7px] w-[7px] shrink-0 bg-ink"
                            aria-hidden="true"
                          />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <p
                data-reveal
                className="mt-8 max-w-2xl text-[15px] leading-relaxed text-ink-muted"
              >
                На тарифы 25 000 и 40 000 ₽ доступна рассрочка на два платежа.
                Гарантия: довёл продукт до запуска или возврат — дедлайны и
                проверка не дадут отвалиться молча.
              </p>
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-line bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
            <Reveal>
              <h2
                data-reveal
                className="font-heading text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] text-ink md:text-4xl"
              >
                Частые вопросы
              </h2>
              <div className="mt-10 border-t border-line">
                {faq.map((item) => (
                  <div
                    key={item.q}
                    data-reveal
                    className="grid gap-2 border-b border-line py-7 md:grid-cols-[1fr_1.4fr] md:gap-12"
                  >
                    <h3 className="font-heading text-lg font-bold tracking-[-0.02em] text-ink">
                      {item.q}
                    </h3>
                    <p className="max-w-2xl text-[15px] leading-relaxed text-ink-muted">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
            <Reveal>
              <h2
                data-reveal
                className="font-heading max-w-3xl text-4xl font-black leading-[1.0] tracking-[-0.04em] text-ink md:text-5xl"
              >
                Первый поток ограничен. Оставь ник — напишу о старте лично
              </h2>
              <div data-reveal className="mt-9 max-w-md">
                <WaitlistForm />
              </div>
              <p
                data-reveal
                className="mt-4 font-hand text-[22px] font-semibold text-ink-muted"
              >
                ↳ без спама — одно сообщение, когда откроются места
              </p>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
