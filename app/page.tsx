import type { Metadata } from "next";
import { CasesGrid } from "@/components/landing/CasesGrid";
import { TestimonialsMarquee } from "@/components/landing/TestimonialsMarquee";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LVMN — AI-автоматизация для бизнеса за дни, не за месяцы",
  description:
    "Строим ботов и автоматизации, которые берут рутину на себя. 13 проектов с цифрами. 3-5 дней до результата. Гарантия возврата денег.",
  alternates: { canonical: "https://lvmn.vercel.app/" },
  openGraph: {
    title: "LVMN — AI-автоматизация для бизнеса за дни, не за месяцы",
    description:
      "Боты и автоматизации для малого бизнеса. 3-5 дней до результата. 13 кейсов. Гарантия возврата.",
    type: "website",
    url: "https://lvmn.vercel.app/",
    locale: "ru_RU",
    images: [{ url: "/founder.jpg", width: 1200, height: 630, alt: "LVMN" }],
  },
};

function CheckIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function ArrowIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="v2">
      {/* ===== NAV ===== */}
      <nav className="v2-nav">
        <div className="v2-nav-inner v2-nav-centered">
          <div className="v2-nav-left">
            <a href="#cases">Кейсы</a>
            <a href="#services">Услуги</a>
          </div>
          <Link href="/" className="v2-logo-center">LVMN</Link>
          <div className="v2-nav-right">
            <a href="#about">О нас</a>
            <Link href="/blog">Блог</Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="v2-hero">
        <div className="v2-container">
          <h1 className="v2-hero-title">
            Убираем рутину<br />
            <em>из вашего бизнеса</em>
          </h1>
          <p className="v2-hero-sub">
            Строим ботов, автоматизации и AI-сервисы для малого бизнеса.
            За дни, не за месяцы. С гарантией результата.
          </p>
          <div className="v2-hero-actions">
            <a
              href="https://t.me/lyaminvl?text=%D0%90%D1%83%D0%B4%D0%B8%D1%82"
              target="_blank"
              rel="noopener noreferrer"
              className="v2-btn-primary"
            >
              Обсудить проект
            </a>
            <a href="#cases" className="v2-btn-ghost">
              Смотреть кейсы
            </a>
          </div>
          <div className="v2-hero-stats">
            <div className="v2-stat">
              <span className="v2-stat-num">13</span>
              <span className="v2-stat-label">проектов</span>
            </div>
            <div className="v2-stat-divider" />
            <div className="v2-stat">
              <span className="v2-stat-num">3-5</span>
              <span className="v2-stat-label">дней до результата</span>
            </div>
            <div className="v2-stat-divider" />
            <div className="v2-stat">
              <span className="v2-stat-num">60%</span>
              <span className="v2-stat-label">рутины убираем</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CASES ===== */}
      <section className="v2-section" id="cases">
        <div className="v2-container">
          <span className="v2-label">Кейсы</span>
          <h2 className="v2-title">Что мы уже построили</h2>
          <p className="v2-subtitle">
            Каждый проект — работающая система, не макет. Кликните для деталей.
          </p>
          <CasesGrid />
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="v2-section v2-section-alt" id="testimonials">
        <div className="v2-container">
          <span className="v2-label">Отзывы</span>
          <h2 className="v2-title">Что говорят клиенты</h2>
          <TestimonialsMarquee />
        </div>
      </section>

      {/* ===== PROCESS ===== */}
      <section className="v2-section" id="process">
        <div className="v2-container">
          <span className="v2-label">Процесс</span>
          <h2 className="v2-title">Как мы работаем</h2>
          <div className="v2-process">
            <div className="v2-step">
              <span className="v2-step-num">01</span>
              <h3>Напишите нам</h3>
              <p>Пара предложений в Telegram — что за бизнес и что хотите автоматизировать.</p>
            </div>
            <div className="v2-step">
              <span className="v2-step-num">02</span>
              <h3>Разберёмся</h3>
              <p>15-минутный созвон. Поймём задачу, предложим решение и назовём сроки.</p>
            </div>
            <div className="v2-step">
              <span className="v2-step-num">03</span>
              <h3>Строим</h3>
              <p>Начнём с того, что даст эффект быстрее всего. Результат за дни.</p>
            </div>
            <div className="v2-step">
              <span className="v2-step-num">04</span>
              <h3>Растём</h3>
              <p>Зашло — масштабируем. Нет — вернём деньги. Без вопросов.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="v2-section v2-section-alt" id="services">
        <div className="v2-container">
          <span className="v2-label">Что мы делаем</span>
          <h2 className="v2-title">Три направления</h2>
          <p className="v2-subtitle">
            Каждый проект рассчитываем индивидуально. Если за месяц не увидите результат — вернём деньги.
          </p>

          <div className="v2-services">
            <div className="v2-service">
              <span className="v2-service-num">01</span>
              <h3>Telegram-боты</h3>
              <p>
                Цифровой сотрудник 24/7. Приём заказов, запись клиентов,
                подписки, реферальные программы. Работает без выходных
                и больничных.
              </p>
              <span className="v2-service-timeline">3-5 дней</span>
            </div>
            <div className="v2-service">
              <span className="v2-service-num">02</span>
              <h3>Автоматизация процессов</h3>
              <p>
                Связываем CRM, оплату, рекламу, мессенджеры в одну систему.
                Данные передаются автоматически, без ручного ввода.
              </p>
              <span className="v2-service-timeline">1-2 недели</span>
            </div>
            <div className="v2-service">
              <span className="v2-service-num">03</span>
              <h3>AI-сервисы и MVP</h3>
              <p>
                От идеи до работающего продукта с пользователями и оплатой.
                Не прототип в Figma, а запущенный сервис.
              </p>
              <span className="v2-service-timeline">1-3 недели</span>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <a
              href="https://t.me/lyaminvl?text=%D0%9E%D0%B1%D1%81%D1%83%D0%B4%D0%B8%D1%82%D1%8C%20%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82"
              target="_blank"
              rel="noopener noreferrer"
              className="v2-btn-primary"
            >
              Обсудить проект
            </a>
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="v2-section" id="about">
        <div className="v2-container">
          <div className="v2-about">
            <div className="v2-about-photo">
              <img src="/founder.jpg" alt="Влад Лямин — основатель LVMN" />
            </div>
            <div className="v2-about-text">
              <span className="v2-label">Кто стоит за LVMN</span>
              <h2 className="v2-title" style={{ textAlign: "left" }}>Влад Лямин, основатель</h2>
              <p>
                Не продаём хайп про нейросети. Находим в бизнесе рутину, которую
                можно отдать боту — и строим этого бота. За дни, не за месяцы.
              </p>
              <p>
                В портфеле — от цветочного магазина в Дубае до системы реабилитации
                для Минобороны. Ведём курс по AI-автоматизации. Объясняем сложное
                простым языком.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== AUDIT LEAD MAGNET ===== */}
      <section className="v2-section v2-section-alt">
        <div className="v2-container">
          <div className="v2-audit-block">
            <span className="v2-label">Бесплатно</span>
            <h2 className="v2-title" style={{ textAlign: "left" }}>AI-аудит вашего бизнеса за 2 минуты</h2>
            <p>
              Ответьте на 6 вопросов — и AI покажет, какие процессы можно
              автоматизировать, сколько времени и денег это сэкономит.
            </p>
            <ul className="v2-audit-points">
              <li><CheckIcon size={14} /> Персональный разбор под вашу нишу</li>
              <li><CheckIcon size={14} /> 3-5 конкретных автоматизаций</li>
              <li><CheckIcon size={14} /> Расчёт экономии в часах и рублях</li>
            </ul>
            <Link href="/audit" className="v2-btn-primary">
              Пройти аудит <ArrowIcon size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="v2-cta-section">
        <div className="v2-container">
          <h2 className="v2-cta-title">
            Давайте посмотрим, где у вас<br /><em>утекают деньги</em>
          </h2>
          <p className="v2-cta-sub">
            Напишите нам — за 15 минут разберём ваши процессы и покажем,
            что можно автоматизировать. Бесплатно.
          </p>
          <a
            href="https://t.me/lyaminvl?text=%D0%90%D1%83%D0%B4%D0%B8%D1%82"
            target="_blank"
            rel="noopener noreferrer"
            className="v2-btn-primary v2-btn-lg"
          >
            Написать в Telegram <ArrowIcon />
          </a>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="v2-footer">
        <div className="v2-container">
          <div className="v2-footer-inner">
            <span className="v2-logo">LVMN</span>
            <div className="v2-footer-links">
              <a href="https://t.me/lyaminvl" target="_blank" rel="noopener noreferrer">Telegram</a>
              <a href="#cases">Кейсы</a>
              <a href="#services">Услуги</a>
              <Link href="/blog">Блог</Link>
              <Link href="/audit">Аудит</Link>
            </div>
            <span className="v2-footer-copy">&copy; 2026 LVMN</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
