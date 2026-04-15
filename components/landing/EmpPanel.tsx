const PROCESS_STEPS = [
  { num: "1", title: "Диагностика задач", desc: "Разбираем чем вы занимаетесь, что занимает больше всего времени и где AI даст наибольший эффект" },
  { num: "2", title: "Практика на реальных задачах", desc: "Осваиваем конкретные инструменты на ваших задачах. После сессии — применяете сразу" },
  { num: "3", title: "Система в работе", desc: "Готовый набор инструментов и привычка их использовать. Остаюсь на связи для вопросов" },
] as const;

const FOR_WHOM = [
  { niche: "Маркетинг и контент", result: "Тексты, идеи, анализ рынка", desc: "Генерация контента, анализ конкурентов, написание брифов — в разы быстрее" },
  { niche: "Юристы и финансисты", result: "Документы, анализ, резюме", desc: "Составление и анализ договоров, подготовка отчётов, быстрый поиск по документам" },
  { niche: "Менеджеры", result: "Презентации, планирование", desc: "Подготовка презентаций, писем, протоколов. Структурирование задач и приоритизация" },
] as const;

export function EmpPanel() {
  return (
    <div className="l-tab-panel">
      <div className="l-pitch">
        <div className="l-pitch-left">
          <p className="l-eyebrow">Для сотрудников и специалистов</p>
          <h2 className="l-pitch-title">Коллега с AI делает за день то, что вы — за неделю.</h2>
          <p className="l-pitch-desc">Это не страшилка. Маркетологи, юристы, бухгалтеры, менеджеры — те, кто освоил AI первым, уже стали незаменимыми. Помогу разобраться конкретно под вашу работу, без воды и лишних терминов.</p>
          <div className="l-method-box">
            <p className="l-method-title">Формат "под вашу профессию"</p>
            <p className="l-method-text">Никаких курсов "введение в AI". На первой сессии выясняем ваши задачи — на второй вы уже применяете конкретные инструменты в работе.</p>
          </div>
        </div>
        <div className="l-pitch-right">
          <div className="l-service-cards">
            <div className="l-service-card l-card-full">
              <p className="l-card-label">Консультация 1:1</p>
              <p className="l-card-text">60 минут — разбираем AI-инструменты под вашу профессию и конкретные задачи. После: список инструментов и план внедрения.</p>
            </div>
            <div className="l-service-card l-card-full">
              <p className="l-card-label">Программа обучения</p>
              <p className="l-card-text">3–5 сессий — от первого знакомства до уверенного применения каждый день. Для тех, кто хочет системный подход.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="l-process-section">
        <div className="l-section-header">
          <p className="l-eyebrow">Как это работает</p>
          <h2 className="l-section-title">От нулевого знакомства до реальных результатов</h2>
          <p className="l-section-subtitle">Три шага без лишней теории</p>
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
          <p className="l-eyebrow">Для кого</p>
          <h2 className="l-section-title">Подойдёт, если вы работаете с информацией</h2>
          <p className="l-section-subtitle">Тексты, данные, документы, коммуникация — AI ускорит любую из этих задач</p>
        </div>
        <div className="l-cases-grid">
          {FOR_WHOM.map((c) => (
            <div key={c.niche} className="l-case-card">
              <p className="l-case-niche">{c.niche}</p>
              <p className="l-case-result-sm">{c.result}</p>
              <p className="l-case-desc">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="l-panel-ctas">
        <a href="https://t.me/lyaminvl" target="_blank" rel="noopener noreferrer" className="l-btn-primary">
          Записаться в Telegram
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
        <a href="/employees" className="l-btn-outline">Узнать подробнее</a>
      </div>
    </div>
  );
}
