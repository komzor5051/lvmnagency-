import type { TabId } from "./PillSwitcher";
import { PillSwitcher } from "./PillSwitcher";

interface HeroSectionProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function HeroSection({ activeTab, onTabChange }: HeroSectionProps) {
  return (
    <section className="l-hero">
      <a href="https://t.me/lyaminvl" target="_blank" rel="noopener noreferrer" className="l-hero-badge">
        <span className="l-hero-badge-dot" />
        2 слота в мае · Написать в Telegram
      </a>
      <h1 className="l-hero-h1">
        AI-first специалист<br />
        для <em>бизнеса и карьеры</em>
      </h1>
      <p className="l-hero-sub">
        <strong>Без агентства, без субподрядчиков — работаю напрямую.</strong>{" "}
        Помогаю бизнесу автоматизировать процессы и сотрудникам опережать коллег с правильными инструментами.
      </p>
      <div className="l-hero-switcher">
        <PillSwitcher value={activeTab} onChange={onTabChange} />
      </div>
    </section>
  );
}
