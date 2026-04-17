import Link from "next/link";

const SERVICE_CARDS = [
  { label: "AI-аудит", text: "Карта процессов, roadmap на 90 дней, оценка ROI каждой автоматизации" },
  { label: "Стратегия", text: "Где AI даст реальный результат, а где только потратит бюджет" },
  { label: "Внедрение", text: "Строю и запускаю под ключ: n8n, Claude, Telegram, CRM — любой стек" },
  { label: "Сопровождение", text: "Поддержка и развитие системы после запуска" },
] as const;

const PROCESS_STEPS = [
  { num: "1", title: "AI-аудит", desc: "Анализирую процессы, нахожу где теряется время и деньги, расставляю приоритеты по ROI" },
  { num: "2", title: "Внедрение", desc: "Строю и запускаю автоматизацию под ключ. Без лишних совещаний — рабочий результат" },
  { num: "3", title: "Система работает", desc: "Передаю управление, обучаю команду и остаюсь на связи для поддержки" },
] as const;

const CASES = [
  { niche: "Ресторанная сеть", result: "40 ч/мес", desc: "Автоматизация закупок и перемещений через Telegram-бот + интеграция с iiko POS. Менеджеры перестали вручную вносить заявки." },
  { niche: "Онлайн-образование", result: "80% задач", desc: "AI-контент фабрика: автоматическая генерация и публикация статей. Редактор занимается стратегией, не рутиной." },
  { niche: "Сервисный бизнес", result: "−70% обращений", desc: "AI-бот поддержки с базой знаний на pgvector. Закрывает 70% вопросов без участия операторов." },
] as const;

export function BizPanel() {
  return (
    <div className="l-tab-panel">
      <div className="l-pitch">
        <div className="l-pitch-left">
          <p className="l-eyebrow">Для владельцев бизнеса</p>
          <h2 className="l-pitch-title">Не ChatGPT. Не консалтинг ради консалтинга. Автоматизация, которая окупается.</h2>
          <p className="l-pitch-desc">Большинство компаний теряют 30–50% времени сотрудников на задачи, которые AI решает автоматически. Нахожу эти точки и запускаю решения — один, без бюрократии и месяцев согласований.</p>
          <div className="l-method-box">
            <p className="l-method-title">Подход: анализ → приоритеты → результат</p>
            <p className="l-method-text">Анализирую процессы, нахожу где AI даёт реальный ROI, внедряю. Без лишних презентаций и совещаний — фокус на том, что работает.</p>
          </div>
        </div>
        <div className="l-pitch-right">
          <div className="l-service-cards">
            {SERVICE_CARDS.map((c) => (
              <div key={c.label} className="l-service-card">
                <p className="l-card-label">{c.label}</p>
                <p className="l-card-text">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="l-process-section">
        <div className="l-section-header">
          <p className="l-eyebrow">Как это работает</p>
          <h2 className="l-section-title">От первого контакта до работающей автоматизации</h2>
          <p className="l-section-subtitle">Простой процесс без лишних шагов</p>
        </div>
        <div className="l-steps">
          {PROCESS_STEPS.map((s) => (
            <div key={s.num} className="l-step">
              <div className="l-step-num">{s.num}</div>
              <p className="l-step-title">{s.title}</p>
              <p className="l-step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="l-cases-section">
        <div className="l-section-header">
          <p className="l-eyebrow">Кейсы</p>
          <h2 className="l-section-title">Реальные результаты</h2>
          <p className="l-section-subtitle">Конкретные числа по реальным проектам</p>
        </div>
        <div className="l-cases-grid">
          {CASES.map((c) => (
            <div key={c.niche} className="l-case-card">
              <p className="l-case-niche">{c.niche}</p>
              <p className="l-case-result">{c.result}</p>
              <p className="l-case-desc">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="l-panel-ctas">
        <Link href="/ai-audit" className="l-btn-primary">
          AI-аудит как услуга
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
        <Link href="/audit" className="l-btn-outline">
          Бесплатный автоаудит
        </Link>
      </div>
    </div>
  );
}
