"use client";

import { useRef, useState, useCallback, useEffect } from "react";

const cases = [
  {
    tag: "Гос. проект",
    title: "AI-система психологической реабилитации",
    task: "Масштабируемая система поддержки участников СВО с ПТСР",
    solution: "Telegram-бот с AI-психологом, 10 уроков, анкетирование, оценка рисков",
    result: "10 воркфлоу, AI-диагностика 24/7",
  },
  {
    tag: "Кибербез",
    title: "SaaS-платформа анализа безопасности кода",
    task: "Быстрый автоматический аудит кода на уязвимости",
    solution: "Анализ по OWASP Top 10, классификация, рекомендации с кодом",
    result: "Score 0-100, мульти-LLM, RU/EN",
  },
  {
    tag: "E-commerce",
    title: "Реферальная система для магазина косметики",
    task: "Нет привлечения через рекомендации — весь трафик платный",
    solution: "Telegram-бот с 2-уровневой реферальной программой + AmoCRM",
    result: "Автоматическая реферальная система",
  },
  {
    tag: "Недвижимость",
    title: "AI-ассистент для краткосрочной аренды",
    task: "Менеджеры часами отвечали на однотипные вопросы гостей",
    solution: "AI-ассистент с контекстом бронирований",
    result: "Скорость ответа x4, нагрузка -60%",
  },
  {
    tag: "Монетизация",
    title: "Бот монетизации Telegram-канала",
    task: "Автоматическая монетизация закрытого канала",
    solution: "Бот с воронкой подписки, YooKassa, автопроверка подписок",
    result: "Платежи 3 500 \u20BD/мес на автопилоте",
  },
  {
    tag: "Рестораны",
    title: "Автоматизация закупок для сети ресторанов",
    task: "3-4 часа ежедневно на ручное оформление закупок",
    solution: "Telegram-бот + iiko: автозаявки, перемещения, контроль остатков",
    result: "Время на закупки -80%",
  },
  {
    tag: "Образование",
    title: "AI-куратор для школы на 400+ студентов",
    task: "350 000 \u20BD/мес на кураторов, ответ 6-8 часов",
    solution: "AI-куратор 24/7: вопросы, домашки, прогресс, отток",
    result: "Затраты -50%, доходимость +22%",
  },
  {
    tag: "Медицина",
    title: "AI-администратор для стоматологии",
    task: "30% обращений без ответа, особенно вечером",
    solution: "AI-бот: запись, напоминания, подбор слотов врачей",
    result: "0 потерянных, загрузка +25%",
  },
  {
    tag: "HR",
    title: "AI-скрининг кандидатов для агентства",
    task: "5 часов/день на резюме, 80% не подходят",
    solution: "AI парсит HH.ru, ранжирует, отправляет TOP-10",
    result: "Скрининг -85%, подбор +40%",
  },
  {
    tag: "Юристы",
    title: "AI-анализ договоров для юрфирмы",
    task: "2-3 часа на каждый договор, 15-20 в неделю",
    solution: "AI анализирует за 2 минуты: риски, условия, отчёт",
    result: "3 часа \u2192 15 минут, риски -90%",
  },
  {
    tag: "Маркетинг",
    title: "AI-генератор контента для SMM",
    task: "12 клиентов — 70% времени на контент",
    solution: "Бот генерации каруселей: тексты, визуал, PNG",
    result: "Контент x5, себестоимость -70%",
  },
  {
    tag: "Логистика",
    title: "Автоматизация диспетчерской доставки",
    task: "80+ заказов/день вручную между 12 курьерами",
    solution: "AI распределяет по зонам, маршруты, уведомления",
    result: "2 часа \u2192 5 минут, опоздания -65%",
  },
  {
    tag: "Финансы",
    title: "AI-ассистент финучёта для сети магазинов",
    task: "Неделя на сверку по 5 точкам вручную",
    solution: "AI распознаёт чеки и накладные, формирует сводки",
    result: "5 дней \u2192 4 часа, ошибки — 0",
  },
];

function CaseCard({
  c,
  isActive,
  hasActive,
  onClick,
}: {
  c: (typeof cases)[number];
  isActive: boolean;
  hasActive: boolean;
  onClick: () => void;
}) {
  const dimmed = hasActive && !isActive;

  return (
    <div
      onClick={onClick}
      style={{
        width: 280,
        minWidth: 280,
        flexShrink: 0,
        cursor: "pointer",
        transition: "all 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
        transform: isActive ? "scale(1.06)" : dimmed ? "scale(0.95)" : "scale(1)",
        opacity: dimmed ? 0.45 : 1,
        filter: dimmed ? "blur(1px)" : "none",
        zIndex: isActive ? 10 : 1,
        position: "relative",
      }}
    >
      <div
        style={{
          background: "var(--surface)",
          borderRadius: "var(--r-lg)",
          border: isActive ? "2px solid var(--accent)" : "1.5px solid var(--border)",
          boxShadow: isActive
            ? "0 20px 50px rgba(13,148,136,0.15), 0 8px 20px rgba(28,25,23,0.08)"
            : "var(--sh-xs)",
          padding: 28,
          height: isActive ? "auto" : 240,
          minHeight: 240,
          display: "flex",
          flexDirection: "column",
          transition: "all 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
          overflow: "hidden",
        }}
      >
        {/* Tag */}
        <span className="case-tag" style={{ marginBottom: 16 }}>{c.tag}</span>

        {/* Title */}
        <h3
          style={{
            fontFamily: "var(--font-display), Outfit, sans-serif",
            fontSize: 17,
            fontWeight: 800,
            color: "var(--text)",
            lineHeight: 1.3,
            letterSpacing: "-0.02em",
            marginBottom: isActive ? 20 : "auto",
          }}
        >
          {c.title}
        </h3>

        {/* Expanded content */}
        <div
          style={{
            maxHeight: isActive ? 300 : 0,
            opacity: isActive ? 1 : 0,
            overflow: "hidden",
            transition: "max-height 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div>
            <div className="case-col-label">Задача</div>
            <p style={{ color: "var(--text-2)", fontSize: 13, lineHeight: 1.55, margin: 0 }}>
              {c.task}
            </p>
          </div>
          <div>
            <div className="case-col-label">Решение</div>
            <p style={{ color: "var(--text-2)", fontSize: 13, lineHeight: 1.55, margin: 0 }}>
              {c.solution}
            </p>
          </div>
          <div className="case-result-box">
            <div className="case-col-label">Результат</div>
            <p>{c.result}</p>
          </div>
        </div>

        {/* Hint when collapsed */}
        {!isActive && (
          <span
            style={{
              fontSize: 12,
              color: "var(--text-3)",
              fontWeight: 500,
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            Подробнее
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </span>
        )}
      </div>
    </div>
  );
}

export function CasesCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  const CARD_WIDTH = 280 + 16; // card width + gap

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    // Figure out which card to activate next
    const current = activeIndex ?? Math.round(el.scrollLeft / CARD_WIDTH);
    const next = dir === "right"
      ? Math.min(current + 1, cases.length - 1)
      : Math.max(current - 1, 0);

    setActiveIndex(null);

    // Scroll so the target card is centered in the container
    const PAD = 24; // horizontal padding of scroll track
    const cardLeft = next * CARD_WIDTH;
    const centerOffset = (el.clientWidth - 280) / 2 - PAD;
    el.scrollTo({ left: Math.max(0, cardLeft - centerOffset), behavior: "smooth" });

    setTimeout(() => {
      setActiveIndex(next);
    }, 350);
  };

  return (
    <div style={{ position: "relative", marginTop: 44 }}>
      {/* Arrows — fixed 240px from top (half of collapsed card height) so they don't jump */}
      <button
        onClick={() => scroll("left")}
        aria-label="Назад"
        style={{
          position: "absolute",
          left: -20,
          top: 240 / 2 + 16, // half collapsed card + track padding
          transform: "translateY(-50%)",
          zIndex: 20,
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "var(--surface)",
          border: "1.5px solid var(--border)",
          boxShadow: "var(--sh-md)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text)",
          opacity: canScrollLeft ? 1 : 0,
          pointerEvents: canScrollLeft ? "auto" : "none",
          transition: "opacity 0.25s, background 0.2s, color 0.2s",
        }}
        className="case-arrow"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <button
        onClick={() => scroll("right")}
        aria-label="Вперёд"
        style={{
          position: "absolute",
          right: -20,
          top: 240 / 2 + 16,
          transform: "translateY(-50%)",
          zIndex: 20,
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "var(--surface)",
          border: "1.5px solid var(--border)",
          boxShadow: "var(--sh-md)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text)",
          opacity: canScrollRight ? 1 : 0,
          pointerEvents: canScrollRight ? "auto" : "none",
          transition: "opacity 0.25s, background 0.2s, color 0.2s",
        }}
        className="case-arrow"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Scroll track */}
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: 16,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          padding: "16px 24px",
          WebkitOverflowScrolling: "touch",
        }}
        className="cases-scroll-track"
      >
        {cases.map((c, i) => (
          <div key={i} style={{ scrollSnapAlign: "center" }}>
            <CaseCard
              c={c}
              isActive={activeIndex === i}
              hasActive={activeIndex !== null}
              onClick={() => {
                if (activeIndex === i) {
                  setActiveIndex(null);
                } else {
                  setActiveIndex(i);
                  const el = scrollRef.current;
                  if (el) {
                    const PAD = 24;
                    const cardLeft = i * CARD_WIDTH;
                    const centerOffset = (el.clientWidth - 280) / 2 - PAD;
                    el.scrollTo({ left: Math.max(0, cardLeft - centerOffset), behavior: "smooth" });
                  }
                }
              }}
            />
          </div>
        ))}
      </div>

      {/* Fade edges */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: 40,
          background: "linear-gradient(to right, var(--bg), transparent)",
          pointerEvents: "none",
          zIndex: 5,
          opacity: canScrollLeft ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 40,
          background: "linear-gradient(to left, var(--bg), transparent)",
          pointerEvents: "none",
          zIndex: 5,
          opacity: canScrollRight ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />
    </div>
  );
}
