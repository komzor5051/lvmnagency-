import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/posts";
import { getProduct } from "@/lib/products";
import { FaqSection } from "@/components/FaqSection";
import { ProductShowcase } from "@/components/bento/ProductShowcase";
import { TrackedLink } from "@/components/bento/TrackedLink";
import { StickyGuideCta } from "@/components/bento/StickyGuideCta";

// Canonical lives on the page, not the root layout: a layout-level canonical
// would leak "/" onto every page that doesn't set its own.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

const process = [
  {
    n: "01",
    label: "Разобрать",
    title: "Аудит",
    text: "Разбираю процесс, данные и узкие места. Считаем, что даст эффект, а что останется красивой игрушкой.",
    result: "Карта процессов + ROI",
  },
  {
    n: "02",
    label: "Проверить",
    title: "Прототип",
    text: "Собираю рабочий сценарий на ваших данных. Вы видите результат до большого внедрения.",
    result: "Результат за 1–3 дня",
  },
  {
    n: "03",
    label: "Встроить",
    title: "Система",
    text: "Встраиваю в работу команды, документирую и обучаю. Система остаётся у вас и работает без меня.",
    result: "Доступы и знания — ваши",
  },
];

const principles = [
  {
    n: "01",
    title: "Данные остаются у вас",
    text: "Работаю в ваших аккаунтах и на ваших доступах. Ничего не переношу в свои продукты и не переиспользую в других проектах.",
  },
  {
    n: "02",
    title: "Команда понимает, что происходит",
    text: "Сценарии, документация и обучение входят в проект. Никаких чёрных ящиков, которыми умеет пользоваться один подрядчик.",
  },
  {
    n: "03",
    title: "Система работает без меня",
    text: "Доступы, знания и право развивать систему — ваши. Привязки к подрядчику не возникает, это заложено с самого начала.",
  },
];

// Wording taken from what founders actually ask on first calls — price, time,
// data, and what happens when the contractor leaves — answered with the same
// numbers used on the product pages.
const faq = [
  {
    q: "Сколько стоит внедрение AI?",
    a: "От 15 000 ₽ за аудит с планом до 150 000 ₽ за внедрение системы в команду 3–15 человек. Цена зависит от числа процессов и глубины интеграции — точную сумму называю после аудита, а не до него.",
  },
  {
    q: "Сколько времени это занимает?",
    a: "Аудит — 2 недели, внедрение AI в работу команды — 4–6 недель. Рабочий сценарий на ваших данных вы видите за 1–3 дня, ещё до решения по основному объёму.",
  },
  {
    q: "У нас нет разработчиков. Это проблема?",
    a: "Нет, это обычная ситуация. Настройку веду сам и передаю готовые сценарии с понятными инструкциями — пользоваться ими может человек без технического опыта, я всё показываю на практике.",
  },
  {
    q: "Что будет с нашими данными?",
    a: "Работаю в ваших аккаунтах и на ваших доступах, данные остаются в вашем контуре. Ничего не переношу в свои продукты и не переиспользую в других проектах.",
  },
  {
    q: "Мы не уверены, что AI нам вообще нужен. С чего начать?",
    a: "С бесплатного AI-аудита на сайте: 7 вопросов, 5 минут, на выходе карта процессов, где автоматизация окупится. Если окупаемости не видно, я так и скажу — это дешевле, чем начинать проект.",
  },
  {
    q: "Что если вы пропадёте после внедрения?",
    a: "Система с самого начала строится так, чтобы работать без меня. У вас остаются доступы, сценарии и документация, команда проходит обучение — привязки к подрядчику не возникает.",
  },
  {
    q: "Вы работаете один или с командой?",
    a: "Один. Веду проект лично от аудита до передачи, без аккаунт-менеджеров и передачи джуниорам. Поэтому одновременно беру ограниченное число проектов.",
  },
];

export default async function HomePage() {
  const posts = (await getPublishedPosts()).slice(0, 3);
  const guide = getProduct("guide");
  const consultation = getProduct("consultation");

  return (
    <main className="studio-main bento-page">
      {/* 1. Hero — bento composition: big copy tile, photo tile, stat tiles. */}
      <section className="bento-section bento-section--hero" id="top">
        <div className="studio-frame">
          <div className="bento-grid">
            <div className="bento-tile bento-col-8 bento-tile--tall" data-studio-reveal>
              <p className="bento-mono">AI-консультант для предпринимателей и команд</p>
              <h1 className="bento-hero-title">
                Помогаю встроить AI в ежедневную работу
              </h1>
              <p className="bento-lead">
                Разбираю, где AI действительно сэкономит время, настраиваю понятный
                рабочий процесс и помогаю команде освоить его. Без технического языка
                и внедрения ради внедрения.
              </p>
              <div className="bento-hero-cta" style={{ marginTop: "auto", paddingTop: "1.8rem" }}>
                <TrackedLink href="#products" event="hero_cta_click" className="bento-btn">
                  Смотреть продукты
                </TrackedLink>
              </div>
            </div>

            <div
              className="bento-tile bento-col-4 bento-photo"
              data-studio-reveal
              style={{ transitionDelay: "60ms" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/portrait-editorial.jpg"
                alt="Влад Лямин за работой"
                width="1012"
                height="1350"
                fetchPriority="high"
              />
              <p className="bento-mono">Влад Лямин · работаю лично</p>
            </div>

            <div
              className="bento-tile bento-col-4 bento-stat"
              data-studio-reveal
              style={{ transitionDelay: "120ms" }}
            >
              <strong>40+</strong>
              <span>внедрений AI в рабочие процессы</span>
            </div>
            <div
              className="bento-tile bento-col-4 bento-stat"
              data-studio-reveal
              style={{ transitionDelay: "180ms" }}
            >
              <strong>50+</strong>
              <span>человек обучил работе с AI</span>
            </div>
            <div
              className="bento-tile bento-col-4 bento-stat"
              data-studio-reveal
              style={{ transitionDelay: "240ms" }}
            >
              <strong>с 2022</strong>
              <span>работаю с AI каждый день</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Product showcase — the main block of the page. */}
      <section className="bento-section" id="products">
        <div className="studio-frame">
          <header className="bento-head" data-studio-reveal>
            <p className="bento-mono">Продукты</p>
            <h2>С чего начать</h2>
            <p>
              От гайда за 990 ₽ до внедрения под ключ. Форматы не связаны между
              собой — начать можно с любого и остановиться на нём же.
            </p>
          </header>
          <ProductShowcase section="showcase" />
          <p className="bento-more">
            <Link href="/products" className="bento-text-link">
              Все форматы подробно
            </Link>
          </p>
        </div>
      </section>

      {/* 3. Case: before / after. */}
      <section className="bento-section" id="case">
        <div className="studio-frame">
          <header className="bento-head" data-studio-reveal>
            <p className="bento-mono">Реальный пример</p>
            <h2>Что меняется после внедрения</h2>
            <p>
              Контент-цикл сжался с 20 часов до 3, и эти 3 часа уходят на контроль,
              а не на производство: тема, исследование, черновик, фактчек, публикация.
            </p>
          </header>
          <div className="bento-grid">
            <div className="bento-tile bento-col-6" data-studio-reveal>
              <p className="bento-mono">Было · ручной процесс</p>
              <strong className="bento-case-num">
                20<span>ч</span>
              </strong>
              <h3>на один контент-цикл</h3>
              <ul className="bento-list">
                <li>6 ручных передач между людьми</li>
                <li>разъехавшийся tone of voice</li>
                <li>фактчек «когда успеем»</li>
              </ul>
            </div>
            <div
              className="bento-tile bento-col-6 bento-tile--carbon"
              data-studio-reveal
              style={{ transitionDelay: "60ms" }}
            >
              <p className="bento-mono">
                <span className="bento-marker" style={{ marginRight: ".55rem" }} />
                Стало · AI-система
              </p>
              <strong className="bento-case-num">
                3<span>ч</span>
              </strong>
              <h3>контроля вместо производства</h3>
              <ul className="bento-list">
                <li>единый голос бренда</li>
                <li>проверяемые источники</li>
                <li>масштаб без найма</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How the work goes — three process tiles. */}
      <section className="bento-section" id="systems">
        <div className="studio-frame">
          <header className="bento-head" data-studio-reveal>
            <p className="bento-mono">Как я работаю</p>
            <h2>Как проходит работа</h2>
            <p>
              Три этапа: аудит, прототип, система. Первый рабочий результат вы видите
              за 1–3 дня — до того, как соглашаетесь на большое внедрение.
            </p>
          </header>
          <div className="bento-grid">
            {process.map((item, i) => (
              <article
                key={item.n}
                className="bento-tile bento-col-4"
                data-studio-reveal
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <p className="bento-mono">
                  {item.n} · {item.label}
                </p>
                <h3>{item.title}</h3>
                <p className="bento-lead">{item.text}</p>
                <p className="bento-price" style={{ fontSize: ".78rem" }}>
                  {item.result}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. About + principles. */}
      <section className="bento-section" id="about">
        <div className="studio-frame">
          <header className="bento-head" data-studio-reveal>
            <p className="bento-mono">Принципы</p>
            <h2>Что останется у вас после</h2>
          </header>
          <div className="bento-grid">
            <div className="bento-tile bento-col-8" data-studio-reveal>
              <p className="bento-mono">Обо мне</p>
              <h3>Веду проект лично — от аудита до передачи</h3>
              <p className="bento-lead">
                Сценарии, документация, доступы и понимание, как всё устроено. Я не
                держу ключи от вашей системы: развивать её можно без меня, и это
                заложено в проект с самого начала. Работаю один, без
                аккаунт-менеджеров, поэтому одновременно беру ограниченное число
                проектов.
              </p>
              <p style={{ marginTop: "auto", paddingTop: "1.4rem" }}>
                <Link href="/about" className="bento-text-link">
                  Подробнее обо мне
                </Link>
              </p>
            </div>
            <div
              className="bento-tile bento-col-4 bento-photo"
              data-studio-reveal
              style={{ transitionDelay: "60ms" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/portrait.jpg" alt="Влад Лямин" loading="lazy" width="800" height="1000" />
              <p className="bento-mono">AI-инженер · практика с 2022</p>
            </div>
            {principles.map((item, i) => (
              <article
                key={item.n}
                className="bento-tile bento-col-4"
                data-studio-reveal
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <p className="bento-mono">Принцип {item.n}</p>
                <h3>{item.title}</h3>
                <p className="bento-lead">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Blog — three latest articles. */}
      {posts.length > 0 && (
        <section className="bento-section" id="notes">
          <div className="studio-frame">
            <header className="bento-head" data-studio-reveal>
              <p className="bento-mono">Практика и заметки</p>
              <h2>Как я решаю такие задачи</h2>
            </header>
            <div className="bento-grid">
              {posts.map((post, i) => (
                <Link
                  href={`/blog/${post.slug}`}
                  key={post.slug}
                  className="bento-tile bento-tile--link bento-col-4"
                  data-studio-reveal
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <p className="bento-mono">
                    {new Date(post.published_at).toLocaleDateString("ru-RU")} ·{" "}
                    {(post.tags ?? [])[0] ?? "AI"}
                  </p>
                  <h3 style={{ fontSize: "1.25rem", lineHeight: 1.15 }}>{post.title}</h3>
                  <p className="bento-price" style={{ fontSize: ".78rem" }}>
                    Читать
                  </p>
                </Link>
              ))}
            </div>
            <p className="bento-more">
              <Link href="/blog" className="bento-text-link">
                Все статьи
              </Link>
            </p>
          </div>
        </section>
      )}

      {/* 7. FAQ — existing component, kept as-is. */}
      <FaqSection
        items={faq}
        eyebrow="Вопросы"
        heading={<>Что спрашивают чаще всего</>}
        lead="То, что фаундеры спрашивают на первом созвоне: цена, сроки, данные и что остаётся после проекта."
        schemaId="/#faq"
      />

      {/* 8. Final CTA — wide carbon tile: start with the guide. */}
      <section className="bento-section bento-section--last">
        <div className="studio-frame">
          <div className="bento-tile bento-col-12 bento-tile--carbon" data-studio-reveal>
            <p className="bento-mono">Первый шаг</p>
            <h2 style={{ fontSize: "clamp(1.9rem, 6vw, 2.9rem)" }}>Начните с гайда</h2>
            <p className="bento-lead">
              {guide
                ? `«${guide.title}» — ${guide.meta.toLowerCase()}, ${guide.priceLabel}. Самый дешёвый способ проверить, как AI встроится в вашу работу.`
                : "Самый дешёвый способ проверить, как AI встроится в вашу работу."}
            </p>
            <div className="bento-final-actions">
              <TrackedLink
                href="/products/guide"
                event="product_tile_click"
                eventProps={{ product: "guide", position: 1, section: "final" }}
                className="bento-btn"
              >
                Получить гайд
              </TrackedLink>
              <TrackedLink
                href="/products/consultation"
                event="product_tile_click"
                eventProps={{ product: "consultation", position: 2, section: "final" }}
                className="bento-text-link"
              >
                {consultation
                  ? `или консультация — ${consultation.priceLabel}`
                  : "или консультация"}
              </TrackedLink>
            </div>
          </div>
        </div>
      </section>

      <StickyGuideCta />
    </main>
  );
}
