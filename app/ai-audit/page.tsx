import Link from "next/link";

const STEPS = [
  {
    num: "01",
    title: "Созвон 30 минут",
    desc: "Бесплатный экспресс-разбор. Находим боли и 3–5 точек роста.",
  },
  {
    num: "02",
    title: "Глубокий аудит",
    desc: "Интервью с командой, карта процессов, скоринг по отделам.",
  },
  {
    num: "03",
    title: "Отчёт и план",
    desc: "PDF с приоритетами, ROI-оценкой и дорожной картой на 90 дней.",
  },
  {
    num: "04",
    title: "Внедрение",
    desc: "Реализуем топ-приоритет. Отдельный договор, фиксированный срок.",
  },
];

const FREE_ITEMS = [
  "Созвон с разбором процессов",
  "3–5 конкретных точек автоматизации",
  "Итог голосовым или текстом в Telegram",
  "Без подготовки и обязательств",
];

const PAID_ITEMS = [
  "Интервью с руководством и ключевыми сотрудниками",
  "Карта процессов компании",
  "Скоринг-таблица: время / эффект / сложность",
  "Топ-3 приоритета с оценкой ROI",
  "Дорожная карта на 90 дней",
  "PDF-отчёт + презентация результатов",
];

export default function AiAuditPage() {
  return (
    <div className="aa-page">
      {/* Nav */}
      <nav className="aa-nav">
        <Link href="/" className="aa-logo">LVMN</Link>
        <a
          href="https://t.me/lyaminvl"
          target="_blank"
          rel="noopener noreferrer"
          className="aa-nav-cta"
        >
          Написать в Telegram
        </a>
      </nav>

      <main className="aa-main">
        {/* Hero */}
        <section className="aa-hero">
          <p className="aa-eyebrow">AI Аудит бизнеса</p>
          <h1 className="aa-title">
            Находим где теряется<br />
            <span className="aa-title-accent">время и деньги</span>
          </h1>
          <p className="aa-subtitle">
            За 30 минут разбираем ваши процессы и составляем конкретный список
            что автоматизировать первым — с оценкой эффекта по каждому пункту.
          </p>
          <a
            href="https://t.me/lyaminvl?text=Хочу+бесплатный+AI+аудит"
            target="_blank"
            rel="noopener noreferrer"
            className="aa-btn-primary"
          >
            Записаться на бесплатный разбор
          </a>
        </section>

        {/* Divider */}
        <div className="aa-rule" />

        {/* Pricing tiers */}
        <section className="aa-tiers">
          {/* Free */}
          <div className="aa-tier">
            <div className="aa-tier-header">
              <span className="aa-tier-label">Экспресс</span>
              <div className="aa-tier-price">Бесплатно</div>
              <div className="aa-tier-duration">30 минут</div>
            </div>
            <ul className="aa-tier-items">
              {FREE_ITEMS.map((item) => (
                <li key={item} className="aa-tier-item">
                  <span className="aa-dash">—</span>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="https://t.me/lyaminvl?text=Хочу+бесплатный+AI+аудит"
              target="_blank"
              rel="noopener noreferrer"
              className="aa-btn-outline"
            >
              Начать бесплатно
            </a>
          </div>

          {/* Paid */}
          <div className="aa-tier aa-tier--featured">
            <div className="aa-tier-header">
              <span className="aa-tier-label aa-tier-label--accent">Полный аудит</span>
              <div className="aa-tier-price">25 000 ₽</div>
              <div className="aa-tier-duration">3–5 рабочих дней</div>
            </div>
            <ul className="aa-tier-items">
              {PAID_ITEMS.map((item) => (
                <li key={item} className="aa-tier-item">
                  <span className="aa-dash aa-dash--accent">—</span>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="https://t.me/lyaminvl?text=Хочу+полный+AI+аудит"
              target="_blank"
              rel="noopener noreferrer"
              className="aa-btn-primary"
            >
              Обсудить аудит
            </a>
          </div>
        </section>

        <div className="aa-rule" />

        {/* Stats */}
        <section className="aa-stats">
          <div className="aa-stat">
            <div className="aa-stat-num">50–70%</div>
            <div className="aa-stat-label">экономии времени на рутине</div>
          </div>
          <div className="aa-stat-sep" />
          <div className="aa-stat">
            <div className="aa-stat-num">×2–5</div>
            <div className="aa-stat-label">ROI в первый месяц внедрения</div>
          </div>
          <div className="aa-stat-sep" />
          <div className="aa-stat">
            <div className="aa-stat-num">90</div>
            <div className="aa-stat-label">дней — дорожная карта по шагам</div>
          </div>
        </section>

        <div className="aa-rule" />

        {/* How it works */}
        <section className="aa-how">
          <h2 className="aa-section-title">Как проходит</h2>
          <div className="aa-steps">
            {STEPS.map((step, i) => (
              <div key={step.num} className="aa-step">
                <div className={`aa-step-num${i === 0 ? " aa-step-num--active" : ""}`}>
                  {step.num}
                </div>
                <div className="aa-step-title">{step.title}</div>
                <div className="aa-step-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="aa-rule" />

        {/* CTA */}
        <section className="aa-cta">
          <h2 className="aa-cta-title">Начните с бесплатного разбора</h2>
          <p className="aa-cta-sub">
            30 минут. Без подготовки. Уйдёте с конкретным списком точек роста.
          </p>
          <a
            href="https://t.me/lyaminvl?text=Хочу+бесплатный+AI+аудит"
            target="_blank"
            rel="noopener noreferrer"
            className="aa-btn-primary"
          >
            Написать в Telegram
          </a>
          <p className="aa-cta-note">
            или пройдите{" "}
            <Link href="/audit" className="aa-link">
              автоматический AI-аудит
            </Link>{" "}
            прямо сейчас
          </p>
        </section>
      </main>

      <footer className="aa-footer">
        <span>LVMN · AI-автоматизация для бизнеса · Новосибирск</span>
        <Link href="/" className="aa-link">На главную</Link>
      </footer>
    </div>
  );
}
