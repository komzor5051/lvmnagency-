import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Обучение AI для сотрудников",
  description:
    "Консультации 1:1 и программа обучения AI-инструментам для специалистов — маркетологов, юристов, менеджеров. Влад Лямин, Новосибирск.",
};

const FORMATS = [
  {
    label: "Консультация 1:1",
    duration: "60 минут",
    desc: "Разбираем AI-инструменты конкретно под вашу профессию и текущие задачи. После сессии получаете список инструментов и пошаговый план внедрения в вашу работу.",
    suits: [
      "Хочу быстро попробовать",
      "Нет времени на долгие курсы",
      "Есть конкретная задача, нужно решение",
    ],
  },
  {
    label: "Программа обучения",
    duration: "3–5 сессий",
    desc: "Системный подход: от первого знакомства с AI до уверенного применения каждый день. Каждая сессия — практика на ваших реальных задачах.",
    suits: [
      "Хочу освоить AI основательно",
      "Нужна система, а не точечные советы",
      "Готов инвестировать время",
    ],
  },
] as const;

const FOR_WHOM = [
  { profession: "Маркетологи", tasks: "Тексты, брифы, анализ конкурентов, идеи для контента" },
  { profession: "Юристы", tasks: "Анализ договоров, подготовка документов, резюме дел" },
  { profession: "Финансисты", tasks: "Отчёты, анализ данных, автоматизация таблиц" },
  { profession: "Менеджеры", tasks: "Презентации, письма, протоколы встреч, планирование" },
  { profession: "HR-специалисты", tasks: "Описания вакансий, письма кандидатам, аналитика" },
  { profession: "Предприниматели", tasks: "Стратегические документы, коммуникация, исследования рынка" },
] as const;

export default function EmployeesPage() {
  return (
    <div style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}>
      <nav className="l-nav">
        <div className="l-nav-links">
          <Link href="/" className="l-nav-link">Главная</Link>
          <Link href="/blog" className="l-nav-link">Блог</Link>
        </div>
        <span className="l-nav-logo">LVMN</span>
        <div className="l-nav-links">
          <a href="https://t.me/lyaminvl" target="_blank" rel="noopener noreferrer" className="l-nav-cta">
            Записаться в Telegram
          </a>
        </div>
      </nav>

      <section className="l-hero" style={{ paddingBottom: "48px" }}>
        <p className="l-eyebrow" style={{ marginBottom: "16px" }}>Для сотрудников и специалистов</p>
        <h1 className="l-hero-h1" style={{ fontSize: "44px" }}>
          Коллега с AI делает за день<br />
          то, что вы — за <em>неделю.</em>
        </h1>
        <p className="l-hero-sub">
          Это не страшилка. Помогу разобраться с AI-инструментами конкретно под вашу работу — без воды и лишних терминов.
        </p>
        <a href="https://t.me/lyaminvl" target="_blank" rel="noopener noreferrer" className="l-btn-primary">
          Записаться на консультацию
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </section>

      <div className="l-process-section">
        <div className="l-section-header">
          <p className="l-eyebrow">Форматы</p>
          <h2 className="l-section-title">Выберите подходящий формат</h2>
        </div>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {FORMATS.map((f) => (
            <div key={f.label} className="l-service-card" style={{ padding: "28px" }}>
              <p className="l-card-label">{f.label}</p>
              <p style={{ fontSize: "13px", color: "var(--text-3)", marginBottom: "10px" }}>{f.duration}</p>
              <p className="l-card-text" style={{ marginBottom: "16px" }}>{f.desc}</p>
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
                {f.suits.map((s) => (
                  <p key={s} style={{ fontSize: "12px", color: "var(--text-2)", lineHeight: "1.8" }}>— {s}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="l-cases-section">
        <div className="l-section-header">
          <p className="l-eyebrow">Для кого</p>
          <h2 className="l-section-title">Подойдёт любому, кто работает с информацией</h2>
        </div>
        <div style={{ maxWidth: "900px", margin: "48px auto 0", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          {FOR_WHOM.map((f) => (
            <div key={f.profession} className="l-case-card">
              <p className="l-case-niche">{f.profession}</p>
              <p style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: "1.6" }}>{f.tasks}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="l-cta-section">
        <p className="l-cta-label">Записаться</p>
        <h2 className="l-cta-title">Начните опережать коллег уже на этой неделе</h2>
        <p className="l-cta-sub">Напишите в Telegram — обсудим формат и запишемся на удобное время.</p>
        <div className="l-cta-buttons">
          <a href="https://t.me/lyaminvl" target="_blank" rel="noopener noreferrer" className="l-cta-btn-primary">
            Написать в Telegram
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <Link href="/" className="l-cta-btn-ghost">На главную</Link>
        </div>
      </section>

      <footer className="l-footer">
        <span className="l-footer-logo">LVMN</span>
        <nav className="l-footer-links">
          <Link href="/" className="l-footer-link">Главная</Link>
          <Link href="/blog" className="l-footer-link">Блог</Link>
          <a href="https://t.me/lyaminvl" target="_blank" rel="noopener noreferrer" className="l-footer-link">@lyaminvl</a>
        </nav>
        <span className="l-footer-copy">Влад Лямин · Новосибирск · 2026</span>
      </footer>
    </div>
  );
}
