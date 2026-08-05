import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/posts";
import { FaqSection } from "@/components/FaqSection";

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

function Button({ href, children, light = false }: { href: string; children: React.ReactNode; light?: boolean }) {
  return (
    <Link className={`studio-button ${light ? "studio-button--light" : "studio-button--lime"}`} href={href}>
      {children}<b aria-hidden="true">→</b>
    </Link>
  );
}

export default async function HomePage() {
  const posts = (await getPublishedPosts()).slice(0, 3);

  return (
    <main className="studio-main">
      <section className="studio-hero" id="top">
        <div className="studio-frame studio-hero-grid">
          <div className="studio-hero-copy">
            <p className="studio-eyebrow">
              <span className="studio-status" />
              AI-консультант для предпринимателей и команд
            </p>
            <h1>
              Помогаю встроить <span>AI в ежедневную работу</span>
            </h1>
            <p className="studio-hero-lead">
              Разбираю, где AI действительно сэкономит время, настраиваю понятный
              рабочий процесс и помогаю команде освоить его. Без технического языка
              и внедрения ради внедрения.
            </p>
            <div className="studio-hero-actions">
              <Button href="/audit">Получить разбор</Button>
              <a className="studio-text-link" href="#case">Посмотреть пример</a>
            </div>
            <div className="studio-hero-proof" aria-label="Опыт Влада Лямина">
              <span><strong>40+</strong> внедрений</span>
              <span><strong>50+</strong> обученных</span>
              <span><strong>с 2022</strong> работаю с AI</span>
            </div>
          </div>

          <div className="studio-hero-visual">
            <div className="studio-portrait">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/portrait-editorial.jpg"
                alt="Влад Лямин за работой"
                width="1012"
                height="1350"
                fetchPriority="high"
              />
            </div>
            <div className="studio-portrait-caption">
              <span>Влад Лямин · работаю лично</span>
            </div>
          </div>
        </div>
      </section>

      <section className="studio-case" id="case">
        <div className="studio-frame">
          <header className="studio-section-head" data-studio-reveal>
            <p className="studio-eyebrow studio-eyebrow--dark">01 / РЕАЛЬНЫЙ ПРИМЕР</p>
            <h2>Что меняется<br />после <em>внедрения?</em></h2>
            <p>Контент-цикл сжался с 20 часов до 3, и эти 3 часа уходят на контроль, а не на производство. Ниже — тот самый процесс: тема, исследование, черновик, фактчек, публикация.</p>
          </header>
          <div className="studio-case-grid" data-studio-reveal>
            <div className="studio-case-card studio-case-card--before">
              <p className="studio-mono">БЫЛО / РУЧНОЙ ПРОЦЕСС</p>
              <strong>20<span>ч</span></strong>
              <h3>на один контент-цикл</h3>
              <ul><li>6 ручных передач</li><li>разъехавшийся tone of voice</li><li>фактчек «когда успеем»</li></ul>
            </div>
            <div className="studio-case-pipeline" aria-label="Автоматизированный процесс">
              {["Тема", "Исследование", "Черновик", "Фактчек", "Публикация"].map((item, i) => (
                <div key={item}><span>0{i + 1}</span><b>{item}</b><i /></div>
              ))}
            </div>
            <div className="studio-case-card studio-case-card--after">
              <p className="studio-mono">СТАЛО / AI-СИСТЕМА</p>
              <strong>3<span>ч</span></strong>
              <h3>контроля вместо производства</h3>
              <ul><li>единый голос бренда</li><li>проверяемые источники</li><li>масштаб без найма</li></ul>
            </div>
          </div>
        </div>
      </section>

      <section className="studio-process" id="systems">
        <div className="studio-frame">
          <header className="studio-section-head studio-section-head--light" data-studio-reveal>
            <p className="studio-eyebrow">02 / КАК Я РАБОТАЮ</p>
            <h2>Как проходит<br /><em>работа?</em></h2>
            <p>Три этапа: аудит, прототип, система. Первый рабочий результат вы видите за 1–3 дня — до того, как соглашаетесь на большое внедрение.</p>
          </header>
          <div className="studio-process-list">
            {process.map((item) => (
              <article key={item.n} data-studio-reveal>
                <span className="studio-process-number">{item.n}</span>
                <p className="studio-mono">{item.label}</p>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <b>{item.result}</b>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="studio-offers" id="products">
        <div className="studio-frame">
          <header className="studio-section-head" data-studio-reveal>
            <p className="studio-eyebrow studio-eyebrow--dark">03 / ТОЧКИ ВХОДА</p>
            <h2>Сколько это<br /><em>стоит?</em></h2>
            <p>От 990 ₽ за гайд до 150 000 ₽ за внедрение под ключ. Форматы не связаны между собой — начать можно с любого и остановиться на нём же.</p>
          </header>
          <div className="studio-offer-grid">
            <Link href="/products/guide" className="studio-offer studio-offer--guide" data-studio-reveal>
              <span className="studio-mono">PDF · 54 СТРАНИЦЫ + AI-ВЕРСИЯ</span>
              <h3>Claude как<br />рабочий инструмент</h3>
              <p>Семь рабочих систем для фаундера — от профиля до автоматизаций и голоса бренда.</p>
              <strong>990 ₽</strong><b>Получить гайд →</b>
            </Link>
            <Link href="/products/audit" className="studio-offer studio-offer--audit" data-studio-reveal>
              <span className="studio-badge">РЕКОМЕНДУЮ</span>
              <span className="studio-mono">2 НЕДЕЛИ · ПЛАН С ЦИФРАМИ</span>
              <h3>AI-аудит<br />бизнеса</h3>
              <p>Нахожу процессы, где AI окупится, и отдаю понятный план внедрения с расчётом экономии.</p>
              <strong>15 000 ₽</strong><b>Разобрать бизнес →</b>
            </Link>
            <Link href="/products/consultation" className="studio-offer studio-offer--consult" data-studio-reveal>
              <span className="studio-mono">1:1 · 60 МИНУТ</span>
              <h3>Консультация</h3>
              <p>Один час на вашу задачу. На выходе — конкретный маршрут, инструменты и следующие действия.</p>
              <strong>5 000 ₽</strong><b>Забронировать →</b>
            </Link>
            <Link href="/products/ai-os" className="studio-offer studio-offer--os" data-studio-reveal>
              <span className="studio-mono">КОМАНДА 3–15 ЧЕЛ · 4–6 НЕДЕЛЬ</span>
              <h3>AI в работе<br />команды</h3>
              <p>Помогаю встроить AI в повторяющиеся задачи так, чтобы команде было понятно и удобно им пользоваться.</p>
              <strong>от 150 000 ₽</strong><b>Обсудить проект →</b>
            </Link>
          </div>
          <div className="studio-all-products"><Button href="/products">Все форматы работы</Button></div>
        </div>
      </section>

      <section className="studio-notes" id="notes">
        <div className="studio-frame">
          <header className="studio-notes-head" data-studio-reveal>
            <div><p className="studio-eyebrow">04 / ПРАКТИКА И ЗАМЕТКИ</p><h2>Как я решаю<br />такие <em>задачи?</em></h2></div>
            <Button href="/blog" light>Все статьи</Button>
          </header>
          <div className="studio-notes-grid">
            {posts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.slug} className="studio-note-card" data-studio-reveal>
                {post.cover_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.cover_image} alt="" loading="lazy" />
                ) : <div className="studio-note-placeholder">VL / NOTE</div>}
                <span className="studio-mono">
                  {new Date(post.published_at).toLocaleDateString("ru-RU")} · {(post.tags ?? [])[0] ?? "AI"}
                </span>
                <h3>{post.title}</h3>
                <b>Читать →</b>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="studio-ownership">
        <div className="studio-frame studio-ownership-grid" data-studio-reveal>
          <div><p className="studio-eyebrow studio-eyebrow--dark">05 / ПРИНЦИП</p><h2>Что останется<br />у вас <em>после?</em></h2></div>
          <div>
            <p>Сценарии, документация, доступы и понимание, как всё устроено. Я не держу ключи от вашей системы: развивать её можно без меня, и это заложено в проект с самого начала.</p>
            <ul><li>Ваши данные не уходят в чужой продукт</li><li>Команда понимает, что происходит</li><li>Систему можно развивать без привязки ко мне</li></ul>
            <Button href="/audit">Проверить мой процесс</Button>
          </div>
        </div>
      </section>

      <FaqSection
        items={faq}
        eyebrow="06 / ВОПРОСЫ"
        heading={<>Что спрашивают<br />чаще <em>всего.</em></>}
        lead="То, что фаундеры спрашивают на первом созвоне: цена, сроки, данные и что остаётся после проекта."
        schemaId="/#faq"
      />
    </main>
  );
}
