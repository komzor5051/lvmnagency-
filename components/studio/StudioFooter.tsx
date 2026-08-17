import Link from "next/link";

export default function StudioFooter() {
  return (
    <footer className="bento-footer">
      <div className="studio-frame">
        <div className="bento-grid">
          <div className="bento-tile bento-col-8 bento-tile--carbon">
            <p className="bento-mono">Контакт</p>
            <p className="bento-footer-title">Есть процесс, который пора перестать делать руками?</p>
            <div className="bento-footer-cta">
              <Link className="bento-btn" href="/audit">
                Разобрать процесс <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="bento-tile bento-col-4">
            <p className="bento-mono">Навигация</p>
            <div className="bento-footer-links">
              <Link href="/products">Продукты</Link>
              <Link href="/about">Обо мне</Link>
              <Link href="/blog">Блог</Link>
              <a href="https://telegram.me/lyaminvl" target="_blank" rel="noreferrer">
                Telegram →
              </a>
            </div>
          </div>
        </div>
        <div className="bento-footer-meta">
          <span className="bento-mono">Влад Лямин / AI для бизнеса</span>
          <span className="bento-mono">© {new Date().getFullYear()}</span>
          <span className="bento-mono">Работаю лично</span>
        </div>
      </div>
    </footer>
  );
}
