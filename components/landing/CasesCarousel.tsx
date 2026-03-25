"use client";

import { useRef, useState, useCallback, useEffect } from "react";

const cases = [
  {
    tag: "Недвижимость",
    title: "OneTwoPrime: AI-платформа генерации материалов",
    task: "Агентству нужно создавать фото, тексты и видео по объектам — вручную это занимало дни",
    solution: "FastAPI + aiogram: AI-генерация фото, описаний, видеопрезентаций, оплата YooKassa, реферальная система для агентов",
    result: "Полный цикл создания материалов автоматизирован, реферальная программа работает без участия команды",
  },
  {
    tag: "Гос. проект",
    title: "PTSD Bot: AI-реабилитация участников СВО",
    task: "Масштабируемая система поддержки при ПТСР без зависимости от количества психологов",
    solution: "Telegram-бот с AI-психологом, 10 уроков курса, анкетирование из 32 вопросов, автооценка рисков и эскалация кризисов",
    result: "10 автоматизированных воркфлоу, AI-диагностика 24/7, нагрузка на психологов -70%",
  },
  {
    tag: "Рестораны",
    title: "ШРМ: автоматизация закупок и перемещений",
    task: "Управляющие тратили 3-4 часа ежедневно на ручное оформление закупок между тремя точками",
    solution: "Telegram-бот интегрирован с iiko POS: автозаявки, перемещения между складами, контроль остатков в реальном времени",
    result: "Время на закупки -80%, ноль потерянных заявок, 3 точки под контролем",
  },
  {
    tag: "Монетизация",
    title: "Зырянов: монетизация закрытого Telegram-канала",
    task: "Эксперту нужна автоматическая монетизация канала без ручного контроля подписок",
    solution: "Telegram-бот с воронкой подписки, интеграция YooKassa, автопроверка истечения, Mini App с библиотекой материалов",
    result: "Автоприём платежей, управление доступом и напоминания — полностью на автопилоте",
  },
  {
    tag: "Поддержка",
    title: "Sabka Support Bot: AI-поддержка на pgvector",
    task: "Команда перегружена однотипными запросами из Telegram Business API диалогов",
    solution: "Telegraf.js + pgvector: парсинг диалогов @sabka_help, векторная база знаний, AI отвечает на запросы мгновенно",
    result: "~80% обращений закрывает бот без участия человека",
  },
  {
    tag: "Онлайн-образование",
    title: "Контент-завод EdSy: n8n автогенерация статей",
    task: "Образовательная платформа вручную создавала учебные материалы — 5-7 часов на единицу контента",
    solution: "n8n pipeline: автопарсинг тем → AI-написание статей → редактура → публикация на сайте через Supabase",
    result: "Производство контента x10, ручного труда на создание статей — 0",
  },
  {
    tag: "Оптовая торговля",
    title: "Парсер цен Сафронов: мониторинг 11 поставщиков",
    task: "Менеджер вручную обходил 11 сайтов поставщиков ежедневно — 3 часа на мониторинг цен",
    solution: "n8n + Apify Web Scraper (~45 нод): автопарсинг 11 сайтов, нормализация данных, запись в MySQL",
    result: "Мониторинг 11 поставщиков на автопилоте, 3 часа/день → 0, отклонения цен — в уведомление",
  },
  {
    tag: "SaaS / Маркетинг",
    title: "Swipely: SaaS-генератор каруселей для SMM",
    task: "SMM-специалисты тратили 1-2 часа на создание одной карусели в дизайн-редакторах",
    solution: "Telegram-бот + веб-редактор: AI пишет тексты, выбирает шаблон, рендерит PNG — 15+ дизайнов",
    result: "Карусель за 2 минуты вместо 2 часов, работающая SaaS с платной подпиской",
  },
  {
    tag: "Реклама / CRM",
    title: "Altegio + Facebook Pixel: трекинг записей из рекламы",
    task: "Салон красоты не мог отслеживать конверсии записей из рекламы Facebook — ROAS неизмерим",
    solution: "Интеграция Altegio CRM с Facebook Conversions API через webhook: событие записи → пиксель",
    result: "Точный трекинг записей из рекламы, ROAS стал измеримым, бюджет оптимизирован",
  },
  {
    tag: "AI-сервис",
    title: "idphotoby.ai: фото на документы через AI",
    task: "Срочное фото на паспорт — очереди в фотосалонах, жёсткие требования разных стран к формату",
    solution: "AI-сервис: загружаешь селфи → нейросеть обрезает и обрабатывает под стандарты страны → скачиваешь",
    result: "3 минуты вместо поездки в фотосалон, поддержка стандартов 30+ стран",
  },
  {
    tag: "AI-медиа",
    title: "Signum: AI-новостной агрегатор с авторерайтом",
    task: "Редакция тратила дни на мониторинг AI-новостей, написание, перевод и публикацию материалов",
    solution: "Astro 5 + Vercel Cron: RSS-парсинг → AI-рерайт → перевод RU/EN → публикация → Telegram-анонс",
    result: "2 статьи в день без редактора, двуязычное покрытие AI-новостей 24/7",
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
