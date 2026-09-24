import Link from "next/link";
import "./footer.css";

// Общий футер сайта в стиле инженерной кальки: сетка, прямые углы,
// одна лаймовая кнопка, без движения при наведении.
const links = [
  { href: "/products", label: "Продукты" },
  { href: "/about", label: "Обо мне" },
  { href: "/blog", label: "Блог" },
  { href: "/audit", label: "Аудит" },
];

export default function StudioFooter() {
  return (
    <footer className="ft">
      <div className="ft-wrap">
        <div className="ft-grid">
          <div className="ft-cta">
            <p className="ft-mono ft-mono--light">Контакт</p>
            <p className="ft-title">Собери личную систему работы с нейросетями</p>
            <Link className="ft-btn" href="/products/guide">
              Начать с гайда <span aria-hidden="true">→</span>
            </Link>
          </div>
          <nav className="ft-nav" aria-label="Навигация в футере">
            <p className="ft-mono">Навигация</p>
            <ul>
              {links.map((l, i) => (
                <li key={l.href}>
                  <Link href={l.href}>
                    <span className="ft-mono">{String(i + 1).padStart(2, "0")}</span>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="https://telegram.me/lyaminvl" target="_blank" rel="noreferrer">
                  <span className="ft-mono">05</span>
                  Telegram <span aria-hidden="true">↗</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="ft-meta">
          <span className="ft-mono">Влад Лямин / личная AI-система</span>
          <span className="ft-mono">© {new Date().getFullYear()}</span>
          <span className="ft-mono">Работаю лично</span>
        </div>
      </div>
    </footer>
  );
}
