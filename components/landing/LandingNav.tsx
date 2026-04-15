import Link from "next/link";

export function LandingNav() {
  return (
    <nav className="l-nav">
      <div className="l-nav-links">
        <Link href="/blog" className="l-nav-link">Блог</Link>
        <Link href="/audit" className="l-nav-link">AI-аудит</Link>
      </div>
      <span className="l-nav-logo">LVMN</span>
      <div className="l-nav-links">
        <a href="https://swipely.ru" target="_blank" rel="noopener noreferrer" className="l-nav-link">Swipely</a>
        <a href="https://vsolo.tech" target="_blank" rel="noopener noreferrer" className="l-nav-link">Vsolo</a>
        <a href="https://t.me/lyaminvl" target="_blank" rel="noopener noreferrer" className="l-nav-cta">
          Написать в Telegram
        </a>
      </div>
    </nav>
  );
}
