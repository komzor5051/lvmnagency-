"use client";

import { useState } from "react";

const cases = [
  {
    tag: "Гос. проект",
    title: "AI-реабилитация участников СВО",
    result: "Нагрузка на психологов -70%",
    task: "Масштабируемая система поддержки при ПТСР без зависимости от количества психологов",
    solution: "Telegram-бот с AI-психологом, 10 уроков курса, анкетирование, автооценка рисков и эскалация кризисов",
    detail: "10 автоматизированных воркфлоу, AI-диагностика 24/7",
    days: "14 дней",
  },
  {
    tag: "Рестораны",
    title: "Автоматизация закупок сети ресторанов",
    result: "Время на закупки -80%",
    task: "Управляющие тратили 3-4 часа ежедневно на ручное оформление закупок между тремя точками",
    solution: "Telegram-бот + iiko POS: автозаявки, перемещения между складами, контроль остатков",
    detail: "3 точки под контролем, ноль потерянных заявок",
    days: "10 дней",
  },
  {
    tag: "Недвижимость",
    title: "AI-платформа генерации материалов",
    result: "Полный цикл автоматизирован",
    task: "Агентству нужно создавать фото, тексты и видео по объектам — вручную это занимало дни",
    solution: "FastAPI + aiogram: AI-генерация фото, описаний, видеопрезентаций, оплата, реферальная система",
    detail: "Реферальная программа работает без участия команды",
    days: "21 день",
  },
  {
    tag: "Монетизация",
    title: "Монетизация закрытого Telegram-канала",
    result: "Подписки на полном автопилоте",
    task: "Эксперту нужна автоматическая монетизация канала без ручного контроля подписок",
    solution: "Telegram-бот с воронкой подписки, YooKassa, автопроверка истечения, Mini App",
    detail: "Автоприём платежей, управление доступом и напоминания",
    days: "3 дня",
  },
  {
    tag: "Поддержка",
    title: "AI-поддержка клиентов на pgvector",
    result: "80% обращений закрывает бот",
    task: "Команда перегружена однотипными запросами из Telegram",
    solution: "Telegraf.js + pgvector: парсинг диалогов, векторная база знаний, мгновенные ответы",
    detail: "Без участия человека",
    days: "7 дней",
  },
  {
    tag: "Оптовая торговля",
    title: "Мониторинг цен 11 поставщиков",
    result: "3 часа/день сэкономлено",
    task: "Менеджер вручную обходил 11 сайтов поставщиков ежедневно",
    solution: "n8n + Apify Web Scraper: автопарсинг, нормализация данных, запись в MySQL",
    detail: "Отклонения цен — в уведомление",
    days: "5 дней",
  },
];

export function CasesGrid() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="cases-grid">
      {cases.map((c, i) => (
        <div
          key={i}
          className={`case-block ${expanded === i ? "expanded" : ""}`}
          onClick={() => setExpanded(expanded === i ? null : i)}
        >
          <span className="case-block-tag">{c.tag}</span>
          <h3 className="case-block-title">{c.title}</h3>
          <div className="case-block-result">{c.result}</div>

          {expanded === i && (
            <div className="case-block-detail">
              <div className="case-block-row">
                <span className="case-block-label">Задача</span>
                <p>{c.task}</p>
              </div>
              <div className="case-block-row">
                <span className="case-block-label">Решение</span>
                <p>{c.solution}</p>
              </div>
              <div className="case-block-meta">
                <span>{c.detail}</span>
                <span className="case-block-days">{c.days}</span>
              </div>
            </div>
          )}

          {expanded !== i && (
            <span className="case-block-more">Подробнее</span>
          )}
        </div>
      ))}
    </div>
  );
}
