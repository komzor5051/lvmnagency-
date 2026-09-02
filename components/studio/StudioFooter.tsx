import Link from "next/link";

export default function StudioFooter() {
  return (
    <footer className="bento-footer">
      <div className="studio-frame">
        <div className="bento-grid">
          <div className="bento-tile bento-col-8 bento-tile--carbon">
            <p className="bento-mono">Контакт</p>
            <p className="bento-footer-title">Собери личную систему работы на Claude</p>
            <div className="bento-footer-cta">
              <Link className="bento-btn" href="/products/guide">
                Начать с гайда <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="bento-tile bento-col-4">
            <p className="bento-mono">Навигация</p>
            <div className="bento-footer-links">
              <Link href="/products">Продукты</Link>
              <Link href="/about">Обо мне</Link>
              <Link href="/blog">Блог</Link>
              <Link href="/audit">Аудит</Link>
              <a href="https://telegram.me/lyaminvl" target="_blank" rel="noreferrer">
                Telegram →
              </a>
            </div>
          </div>
        </div>
        <div className="bento-footer-meta">
          <span className="bento-mono">Влад Лямин / личная AI-система</span>
          <span className="bento-mono">© {new Date().getFullYear()}</span>
          <span className="bento-mono">Работаю лично</span>
        </div>
      </div>
    </footer>
  );
}
