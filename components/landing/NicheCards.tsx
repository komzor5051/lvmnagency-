"use client";

import { MagicCard } from "@/components/ui/magic-card";

const niches = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    title: "Юридические компании",
    desc: "Анализ договоров, обработка обращений, подготовка документов",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: "Клиники и медцентры",
    desc: "AI-запись 24/7, напоминания, обработка входящих обращений",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
    title: "E-commerce и торговля",
    desc: "Реферальные программы, обработка заказов, аналитика продаж",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
    title: "Рестораны и HoReCa",
    desc: "Закупки, управление поставщиками, контроль остатков",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    title: "Онлайн-образование",
    desc: "AI-кураторы, проверка домашек, аналитика студентов",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <polyline points="16 8 20 8 23 11 23 16 20 16" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    title: "Логистика и доставка",
    desc: "Автораспределение заказов, маршруты, уведомления курьерам",
  },
];

export function NicheCards() {
  return (
    <div className="niches-grid">
      {niches.map((niche, i) => (
        <MagicCard
          key={i}
          className="niche-card reveal !border-0"
          gradientColor="#D9D9D920"
          gradientSize={180}
        >
          <div className="niche-icon">{niche.icon}</div>
          <h3>{niche.title}</h3>
          <p>{niche.desc}</p>
        </MagicCard>
      ))}
    </div>
  );
}
