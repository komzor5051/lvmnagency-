import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";

const metrics = [
  ["40+", "внедрений"],
  ["50+", "обученных"],
  ["2022", "работаю с AI"],
  ["1:1", "лично в проекте"],
];

const process = [
  {
    n: "01",
    label: "DIAGNOSE",
    title: "Аудит",
    text: "Разбираю процесс, данные и узкие места. Считаем, что даст эффект, а что останется красивой игрушкой.",
    result: "Карта процессов + ROI",
  },
  {
    n: "02",
    label: "PROVE",
    title: "Прототип",
    text: "Собираю рабочий сценарий на ваших данных. Вы видите результат до большого внедрения.",
    result: "Результат за 1–3 дня",
  },
  {
    n: "03",
    label: "SCALE",
    title: "Система",
    text: "Встраиваю в работу команды, документирую и обучаю. Система остаётся у вас и работает без меня.",
    result: "Код и знания — ваши",
  },
];

function Button({ href, children, light = false }: { href: string; children: React.ReactNode; light?: boolean }) {
  return (
    <Link className={`studio-button ${light ? "studio-button--light" : "studio-button--lime"}`} href={href}>
      {children}<b aria-hidden="true">↗</b>
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
              Принимаю 2 проекта на август
            </p>
            <h1>
              <span>Превращаю AI</span>
              <span>в <em>работающие</em></span>
              <span>системы</span>
            </h1>
            <div className="studio-hero-bottom">
              <p>
                Я Влад. Лично разбираю процессы, собираю прототип на ваших данных и
                внедряю AI так, чтобы он каждый день снимал работу с людей.
              </p>
              <div>
                <Button href="/audit">Разобрать мой процесс</Button>
                <a className="studio-text-link" href="#case">Система в действии ↓</a>
              </div>
            </div>
          </div>

          <div className="studio-hero-visual">
            <div className="studio-portrait">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/portrait-editorial.jpg" alt="Влад Лямин — AI-инженер" fetchPriority="high" />
              <span className="studio-portrait-wash" aria-hidden="true" />
            </div>
            <div className="studio-portrait-caption">
              <span>Собственной персоной</span>
              <span>Алматы · worldwide</span>
            </div>
            <div className="studio-system-map" aria-label="Схема работающей AI-системы">
              <div className="studio-map-head"><span>LIVE SYSTEM</span><i /></div>
              <div className="studio-flow">
                <div><small>INPUT</small><b>Заявка</b></div>
                <span>→</span>
                <div><small>AI LAYER</small><b>Анализ</b></div>
                <span>→</span>
                <div><small>OUTPUT</small><b>Действие</b></div>
              </div>
              <div className="studio-map-log">
                <span>12:41:08</span><span>lead enriched</span><b>DONE</b>
                <span>12:41:10</span><span>CRM updated</span><b>DONE</b>
                <span>12:41:12</span><span>manager briefed</span><b>DONE</b>
              </div>
            </div>
          </div>
        </div>
        <div className="studio-ticker" aria-hidden="true">
          <div>AI-АУДИТ • ПРОТОТИП • АВТОМАТИЗАЦИЯ • ВНЕДРЕНИЕ • ОБУЧЕНИЕ • AI-АУДИТ • ПРОТОТИП • АВТОМАТИЗАЦИЯ • ВНЕДРЕНИЕ • ОБУЧЕНИЕ • </div>
        </div>
      </section>

      <section className="studio-metrics">
        <div className="studio-frame studio-metrics-grid">
          {metrics.map(([value, label]) => (
            <div key={label} data-studio-reveal>
              <strong>{value}</strong><span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="studio-case" id="case">
        <div className="studio-frame">
          <header className="studio-section-head" data-studio-reveal>
            <p className="studio-eyebrow studio-eyebrow--dark">01 / СИСТЕМА В ДЕЙСТВИИ</p>
            <h2>Не «AI ради AI».<br />Измеримое <em>после.</em></h2>
            <p>Пример системы контент-производства: от темы до готового материала с фактчеком и публикацией.</p>
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
            <p className="studio-eyebrow">02 / КАК РАБОТАЕМ</p>
            <h2>От хаоса<br />к системе.</h2>
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
            <h2>Начните с нужного<br /><em>масштаба.</em></h2>
          </header>
          <div className="studio-offer-grid">
            <Link href="/products/guide" className="studio-offer studio-offer--guide" data-studio-reveal>
              <span className="studio-mono">PDF · 54 СТРАНИЦЫ + AI-ВЕРСИЯ</span>
              <h3>Claude как<br />рабочий инструмент</h3>
              <p>Семь рабочих систем для фаундера — от профиля до автоматизаций и голоса бренда.</p>
              <strong>990 ₽</strong><b>Получить гайд ↗</b>
            </Link>
            <Link href="/products/audit" className="studio-offer studio-offer--audit" data-studio-reveal>
              <span className="studio-badge">РЕКОМЕНДУЮ</span>
              <span className="studio-mono">2 НЕДЕЛИ · ПЛАН С ЦИФРАМИ</span>
              <h3>AI-аудит<br />бизнеса</h3>
              <p>Нахожу процессы, где AI окупится, и отдаю понятный план внедрения с расчётом экономии.</p>
              <strong>15 000 ₽</strong><b>Разобрать бизнес ↗</b>
            </Link>
            <Link href="/products/consultation" className="studio-offer studio-offer--consult" data-studio-reveal>
              <span className="studio-mono">1:1 · 60 МИНУТ</span>
              <h3>Консультация</h3>
              <p>Один час на вашу задачу. На выходе — конкретный маршрут, инструменты и следующие действия.</p>
              <strong>5 000 ₽</strong><b>Забронировать ↗</b>
            </Link>
            <Link href="/products/ai-os" className="studio-offer studio-offer--os" data-studio-reveal>
              <span className="studio-mono">КОМАНДА 3–15 ЧЕЛ · 4–6 НЕДЕЛЬ</span>
              <h3>AI Operating<br />System</h3>
              <p>Перестраиваю ритм команды так, чтобы AI стал основой ключевых процессов.</p>
              <strong>от 150 000 ₽</strong><b>Обсудить проект ↗</b>
            </Link>
          </div>
          <div className="studio-all-products"><Button href="/products">Все форматы работы</Button></div>
        </div>
      </section>

      <section className="studio-notes" id="notes">
        <div className="studio-frame">
          <header className="studio-notes-head" data-studio-reveal>
            <div><p className="studio-eyebrow">04 / ЛАБОРАТОРНЫЕ ЗАМЕТКИ</p><h2>Пишу о том,<br />что <em>работает.</em></h2></div>
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
                <b>Читать ↗</b>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="studio-ownership">
        <div className="studio-frame studio-ownership-grid" data-studio-reveal>
          <div><p className="studio-eyebrow studio-eyebrow--dark">05 / ПРИНЦИП</p><h2>Система должна<br />принадлежать <em>вам.</em></h2></div>
          <div>
            <p>Никакой магии за закрытой дверью. После внедрения у вас остаются сценарии, документация, доступы и понимание, как всё устроено.</p>
            <ul><li>Ваши данные не уходят в чужой продукт</li><li>Команда понимает, что происходит</li><li>Систему можно развивать без привязки ко мне</li></ul>
            <Button href="/audit">Проверить мой процесс</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
