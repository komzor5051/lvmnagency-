"use client";

import { useState } from "react";

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
    solution: "Telegram-бот с AI-психологом, 10 уроков курса, анкетирование из 32 вопросов, автооценка рисков и эскалация кризисных ситуаций",
    result: "10 автоматизированных воркфлоу, AI-диагностика 24/7, нагрузка на психологов -70%",
  },
  {
    tag: "Ресторанный бизнес",
    title: "ШРМ: автоматизация закупок и перемещений",
    task: "Управляющие тратили 3-4 часа ежедневно на ручное оформление закупок и перемещений между тремя точками",
    solution: "Telegram-бот интегрирован с iiko POS: автозаявки на закупку, перемещения между складами, контроль остатков в реальном времени",
    result: "Время на закупки -80%, ноль потерянных заявок, автоматический контроль по 3 точкам",
  },
  {
    tag: "Монетизация",
    title: "Зырянов: монетизация закрытого Telegram-канала",
    task: "Эксперту нужна автоматическая монетизация закрытого канала без ручного контроля подписок",
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

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      style={{
        transition: "transform 0.3s ease",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        flexShrink: 0,
      }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function CasesAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="cases-accordion" style={{ marginTop: 44, display: "grid", gap: 8 }}>
      {cases.map((c, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="case-accordion-item"
            onClick={() => setOpenIndex(isOpen ? null : i)}
            style={{
              background: "var(--surface)",
              borderRadius: "var(--r-md)",
              boxShadow: isOpen ? "var(--sh-md)" : "var(--sh-xs)",
              cursor: "pointer",
              transition: "box-shadow 0.3s ease",
              overflow: "hidden",
            }}
          >
            {/* Header — always visible */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "18px 24px",
              }}
            >
              <span className="case-tag">{c.tag}</span>
              <span
                style={{
                  fontFamily: "var(--font-display), Outfit, sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--text)",
                  flex: 1,
                  lineHeight: 1.3,
                }}
              >
                {c.title}
              </span>
              <ChevronIcon open={isOpen} />
            </div>

            {/* Body — collapsible */}
            <div
              style={{
                maxHeight: isOpen ? 400 : 0,
                opacity: isOpen ? 1 : 0,
                overflow: "hidden",
                transition: "max-height 0.35s ease, opacity 0.25s ease",
              }}
            >
              <div
                style={{
                  padding: "0 24px 24px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 20,
                }}
                className="case-accordion-body"
              >
                <div>
                  <div className="case-col-label">Задача</div>
                  <p style={{ color: "var(--text-2)", fontSize: 14, lineHeight: 1.6 }}>
                    {c.task}
                  </p>
                </div>
                <div>
                  <div className="case-col-label">Решение</div>
                  <p style={{ color: "var(--text-2)", fontSize: 14, lineHeight: 1.6 }}>
                    {c.solution}
                  </p>
                </div>
                <div className="case-result-box">
                  <div className="case-col-label">Результат</div>
                  <p>{c.result}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
