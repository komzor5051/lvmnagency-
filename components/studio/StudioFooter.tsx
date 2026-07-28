import Link from "next/link";

export default function StudioFooter() {
  return (
    <footer className="studio-footer">
      <div className="studio-frame studio-footer-grid">
        <div>
          <p className="studio-footer-title">Есть процесс, который пора перестать делать руками?</p>
          <Link className="studio-button studio-button--lime" href="/audit">
            Разобрать процесс <b aria-hidden="true">↗</b>
          </Link>
        </div>
        <div className="studio-footer-links">
          <p className="studio-mono">НАВИГАЦИЯ</p>
          <Link href="/products">Форматы работы</Link>
          <Link href="/about">Обо мне</Link>
          <Link href="/blog">Блог</Link>
          <a href="https://telegram.me/lyaminvl" target="_blank" rel="noreferrer">
            Telegram ↗
          </a>
        </div>
        <div className="studio-footer-meta">
          <span>VL / AI SYSTEMS</span>
          <span>© {new Date().getFullYear()}</span>
          <span>Работаю лично</span>
        </div>
      </div>
    </footer>
  );
}
