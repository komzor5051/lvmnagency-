import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="l-footer">
      <span className="l-footer-logo">LVMN</span>
      <nav className="l-footer-links">
        <Link href="/blog" className="l-footer-link">Блог</Link>
        <Link href="/audit" className="l-footer-link">AI-аудит</Link>
        <a href="https://swipely.ru" target="_blank" rel="noopener noreferrer" className="l-footer-link">Swipely</a>
        <a href="https://vsolo.tech" target="_blank" rel="noopener noreferrer" className="l-footer-link">Vsolo</a>
        <a href="https://t.me/lyaminvl" target="_blank" rel="noopener noreferrer" className="l-footer-link">@lyaminvl</a>
      </nav>
      <span className="l-footer-copy">Влад Лямин · Новосибирск · 2026</span>
    </footer>
  );
}
