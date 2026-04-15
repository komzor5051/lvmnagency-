import type { TabId } from "./PillSwitcher";
import Link from "next/link";

interface CtaSectionProps {
  activeTab: TabId;
}

const CTA_CONTENT = {
  biz: {
    title: "Узнайте, где AI поможет вашему бизнесу",
    sub: "Пройдите бесплатный AI-аудит или напишите напрямую — 30 минут, без обязательств.",
    primaryLabel: "Пройти бесплатный AI-аудит",
    primaryHref: "/audit",
    isExternalPrimary: false,
    secondaryLabel: "Написать в Telegram",
    secondaryHref: "https://t.me/lyaminvl",
    isExternalSecondary: true,
  },
  emp: {
    title: "Начните опережать коллег уже на этой неделе",
    sub: "Запишитесь на консультацию 1:1 или узнайте подробнее о программе обучения.",
    primaryLabel: "Записаться в Telegram",
    primaryHref: "https://t.me/lyaminvl",
    isExternalPrimary: true,
    secondaryLabel: "Узнать подробнее",
    secondaryHref: "/employees",
    isExternalSecondary: false,
  },
} as const;

export function CtaSection({ activeTab }: CtaSectionProps) {
  const c = CTA_CONTENT[activeTab];
  return (
    <section className="l-cta-section">
      <p className="l-cta-label">Начать</p>
      <h2 className="l-cta-title">{c.title}</h2>
      <p className="l-cta-sub">{c.sub}</p>
      <div className="l-cta-buttons">
        {c.isExternalPrimary ? (
          <a href={c.primaryHref} target="_blank" rel="noopener noreferrer" className="l-cta-btn-primary">
            {c.primaryLabel}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        ) : (
          <Link href={c.primaryHref} className="l-cta-btn-primary">
            {c.primaryLabel}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        )}
        {c.isExternalSecondary ? (
          <a href={c.secondaryHref} target="_blank" rel="noopener noreferrer" className="l-cta-btn-ghost">
            {c.secondaryLabel}
          </a>
        ) : (
          <Link href={c.secondaryHref} className="l-cta-btn-ghost">
            {c.secondaryLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
