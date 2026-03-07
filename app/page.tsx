import type { Metadata } from "next";
import LandingInteractivity from "@/components/landing/LandingInteractivity";
import { HeroBadge } from "@/components/landing/HeroBadge";
import { HeroTitle } from "@/components/landing/HeroTitle";
import { HeroStats } from "@/components/landing/HeroStats";
import { NicheCards } from "@/components/landing/NicheCards";
import { FeaturedPricingBeam } from "@/components/landing/FeaturedPricing";
import { TestimonialsMarquee } from "@/components/landing/TestimonialsMarquee";
import { ScrollProgressBar } from "@/components/landing/ScrollProgressBar";
import { ShimmerCTA } from "@/components/landing/ShimmerCTA";
import { CasesCarousel } from "@/components/landing/CasesCarousel";

export const metadata: Metadata = {
  title: "LVMN — AI-автоматизация для бизнеса за дни, не за месяцы",
  description:
    "Делаю ботов и автоматизации, которые берут рутину на себя. 13 проектов с цифрами. 3-5 дней до результата. Гарантия возврата денег.",
  openGraph: {
    title: "LVMN — AI-автоматизация для бизнеса за дни, не за месяцы",
    description:
      "Боты и автоматизации для малого бизнеса. 3-5 дней до результата. 13 кейсов. Гарантия возврата.",
    type: "website",
    url: "https://lvmn.vercel.app/",
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    title: "LVMN — AI-автоматизация для бизнеса",
    description:
      "Боты и автоматизации для малого бизнеса. 13 проектов с цифрами. 3-5 дней до результата.",
  },
};

function CheckIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ArrowIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="landing">
      <LandingInteractivity />
      <ScrollProgressBar />

      <div className="grain" />

      {/* ===== NAV ===== */}
      <nav className="landing-nav">
        <div className="container">
          <a href="#" className="logo">
            LVMN
          </a>
          <div className="nav-links">
            <a href="#services">Продукты</a>
            <a href="#cases">Кейсы</a>
            <a href="#process">Процесс</a>
            <a href="#about">Обо мне</a>
            <a href="/blog">Блог</a>
            <a
              href="https://t.me/lyaminvl"
              className="nav-cta mobile-only"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "none" }}
            >
              Написать Владу
            </a>
          </div>
          <a
            href="https://t.me/lyaminvl"
            className="nav-cta desktop-only"
            target="_blank"
            rel="noopener noreferrer"
          >
            Написать Владу
            <ArrowIcon size={14} />
          </a>
          <button className="nav-burger" aria-label="Меню">
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <HeroBadge />
            <HeroTitle />
            <p className="hero-sub anim-fade-up d2">
              Я делаю ботов и автоматизации, которые берут рутину на себя —
              чтобы ваша команда занималась тем, что приносит деньги.
            </p>
            <div className="hero-ctas anim-fade-up d3">
              <ShimmerCTA href="https://t.me/lyaminvl">
                Написать Владу
                <ArrowIcon />
              </ShimmerCTA>
              <a href="#cases" className="btn-ghost">
                Посмотреть, что уже сделал
              </a>
            </div>
            <HeroStats />
          </div>
        </div>
      </section>

      {/* ===== PAINS ===== */}
      <section className="pains">
        <div className="container">
          <div className="reveal">
            <span className="section-label">Узнаёте себя?</span>
            <h2 className="section-title">
              Эти штуки <em>съедают</em> ваши деньги
            </h2>
          </div>
          <div className="pains-grid">
            <div className="pain-card reveal">
              <div className="pain-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <p>
                Менеджер 4 часа копирует данные из таблицы в CRM и обратно.
                Вы платите ему 40 000 &#8381;/мес — за работу робота
              </p>
            </div>
            <div className="pain-card reveal">
              <div className="pain-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 2a10 10 0 1 0 10 10" />
                  <path d="M12 12l6-6" />
                  <path d="M16 6h6v6" />
                </svg>
              </div>
              <p>
                Клиент написал в 22:00. Ваш менеджер увидел в 10 утра.
                А конкурент ответил за 30 секунд — и забрал заказ
              </p>
            </div>
            <div className="pain-card reveal">
              <div className="pain-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 9h6v6H9z" />
                </svg>
              </div>
              <p>
                Потыкали ChatGPT, написали пару промптов — и на этом всё.
                Непонятно, как прикрутить это к реальной работе
              </p>
            </div>
            <div className="pain-card reveal">
              <div className="pain-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M21 12a9 9 0 1 1-9-9" />
                  <path d="M12 8v4" />
                  <circle cx="12" cy="16" r="0.5" />
                </svg>
              </div>
              <p>
                Понимаете, что AI — это важно. Но студии просят миллион,
                фрилансеры пропадают, а сами разобраться — нет времени
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NICHES ===== */}
      <section className="niches">
        <div className="container">
          <div className="reveal">
            <span className="section-label">Кому подходит</span>
            <h2 className="section-title">
              Если у вас есть <em>люди и рутина</em> — я помогу
            </h2>
            <p className="section-subtitle">
              13 проектов в 8 отраслях. Везде одно и то же — люди делают
              работу, которую давно пора отдать машине.
            </p>
          </div>
          <NicheCards />
        </div>
      </section>

      {/* ===== PACKAGES ===== */}
      <section className="packages" id="services">
        <div className="container">
          <div className="reveal">
            <span className="section-label">Тарифы</span>
            <h2 className="section-title">
              Три варианта — <em>выбирайте под задачу</em>
            </h2>
            <p className="section-subtitle">
              Можно начать с одного бота за неделю. А можно автоматизировать
              всё разом.
            </p>
            <div className="guarantee-banner" style={{ marginTop: "24px" }}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#10B981"
                strokeWidth="2"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span
                style={{
                  fontSize: "14px",
                  color: "#059669",
                  fontWeight: 600,
                }}
              >
                Если за месяц не увидите результат — верну деньги. Без вопросов
              </span>
            </div>
          </div>
          <div className="packages-grid">
            {/* СТАРТ */}
            <div className="pkg-card reveal">
              <div className="pkg-name">Старт</div>
              <div className="pkg-price">
                50 000 <span>&#8381;</span>
              </div>
              <div className="pkg-desc">
                Один бот или автоматизация. Попробовать, как это работает.
              </div>
              <ul className="pkg-features">
                <li>
                  <CheckIcon /> Разберёмся, что автоматизировать
                </li>
                <li>
                  <CheckIcon /> Сделаю одного бота или интеграцию
                </li>
                <li>
                  <CheckIcon /> Напишу инструкцию для команды
                </li>
                <li>
                  <CheckIcon /> Готово за 3-5 дней
                </li>
                <li>
                  <CheckIcon /> Результат видно сразу
                </li>
              </ul>
              <div
                style={{
                  textAlign: "center",
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  marginBottom: "14px",
                }}
              >
                Средняя окупаемость: 3-4 недели
              </div>
              <a
                href="https://t.me/lyaminvl"
                className="pkg-btn pkg-btn-ghost"
                target="_blank"
                rel="noopener noreferrer"
              >
                Начать с малого
              </a>
            </div>

            {/* РОСТ */}
            <div className="pkg-card featured reveal">
              <FeaturedPricingBeam />
              <span className="pkg-badge">Популярный</span>
              <div className="pkg-name">Рост</div>
              <div className="pkg-price">
                120 000 <span>&#8381;</span>
              </div>
              <div className="pkg-desc">
                Автоматизирую 2-3 ключевых процесса + обучу команду.
              </div>
              <ul className="pkg-features">
                <li>
                  <CheckIcon /> Аудит всех процессов — найду, где теряете
                </li>
                <li>
                  <CheckIcon /> 3 бота или автоматизации под ключ
                </li>
                <li>
                  <CheckIcon /> Покажу команде, как пользоваться
                </li>
                <li>
                  <CheckIcon /> 2 недели на связи после запуска
                </li>
                <li>
                  <CheckIcon /> Готово за 1-2 недели
                </li>
                <li>
                  <CheckIcon /> Первый эффект через 5-7 дней
                </li>
              </ul>
              <div
                style={{
                  textAlign: "center",
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  marginBottom: "14px",
                }}
              >
                Средняя окупаемость: 2-3 недели
              </div>
              <a
                href="https://t.me/lyaminvl"
                className="pkg-btn pkg-btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Хочу этот
              </a>
            </div>

            {/* ТРАНСФОРМАЦИЯ */}
            <div className="pkg-card reveal">
              <div className="pkg-name">Трансформация</div>
              <div className="pkg-price">
                250 000 <span>&#8381;</span>
              </div>
              <div className="pkg-desc">
                Перестраиваю процессы целиком. Максимум автоматизации.
              </div>
              <ul className="pkg-features">
                <li>
                  <CheckIcon /> Глубокий аудит + план на полгода
                </li>
                <li>
                  <CheckIcon /> 5+ ботов и автоматизаций
                </li>
                <li>
                  <CheckIcon /> Обучу всю команду
                </li>
                <li>
                  <CheckIcon /> Месяц поддержки после запуска
                </li>
                <li>
                  <CheckIcon /> Помогу масштабировать дальше
                </li>
                <li>
                  <CheckIcon /> Первый эффект через 5-7 дней
                </li>
              </ul>
              <div
                style={{
                  textAlign: "center",
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  marginBottom: "14px",
                }}
              >
                Средняя окупаемость: 2 недели
              </div>
              <a
                href="https://t.me/lyaminvl"
                className="pkg-btn pkg-btn-ghost"
                target="_blank"
                rel="noopener noreferrer"
              >
                Обсудить масштаб
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CASES ===== */}
      <section className="cases" id="cases">
        <div className="container">
          <div className="reveal">
            <span className="section-label">Кейсы</span>
            <h2 className="section-title">
              Вот что я уже <em>сделал</em>
            </h2>
            <p className="section-subtitle">
              Каждый проект — рабочий. Не макет в Figma, а штука, которая
              прямо сейчас экономит людям время и деньги.
            </p>
          </div>
          <CasesCarousel />
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="testimonials" id="testimonials">
        <div className="container">
          <div className="reveal">
            <span className="section-label">Отзывы</span>
            <h2 className="section-title">
              Люди, которым я уже <em>помог</em>
            </h2>
            <p className="section-subtitle">
              Не анонимные цитаты — реальные предприниматели, которые
              запустили AI у себя.
            </p>
          </div>
          <TestimonialsMarquee />
        </div>
      </section>

      {/* ===== PROCESS ===== */}
      <section className="process" id="process">
        <div className="container">
          <div className="reveal">
            <span className="section-label">Как это работает</span>
            <h2 className="section-title">
              От «привет» до <em>работающего бота</em> — 4 шага
            </h2>
            <p className="section-subtitle">
              Вам не нужно ничего настраивать. Просто расскажите, что болит.
            </p>
          </div>
          <div className="process-steps">
            <div className="process-step reveal">
              <div className="process-num">1</div>
              <h3>Напишите мне</h3>
              <p>
                Пара предложений в Telegram — что за бизнес и что хотите автоматизировать
              </p>
            </div>
            <div className="process-step reveal">
              <div className="process-num">2</div>
              <h3>Разберёмся</h3>
              <p>
                Созвонимся на 15 минут — пойму задачу и скажу, что можно сделать
              </p>
            </div>
            <div className="process-step reveal">
              <div className="process-num">3</div>
              <h3>Делаю</h3>
              <p>
                Начну с того, что даст эффект быстрее всего — увидите результат за дни
              </p>
            </div>
            <div className="process-step reveal">
              <div className="process-num">4</div>
              <h3>Растём</h3>
              <p>
                Если зашло — подключаем новые процессы. Если нет — верну деньги
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="about" id="about">
        <div className="container">
          <div className="about-layout">
            <div className="about-visual reveal">
              <div className="about-visual-box">
                <img
                  src="/founder.jpg"
                  alt="Влад Лямин — основатель LVMN"
                  className="about-photo"
                />
              </div>
            </div>
            <div className="about-text reveal">
              <span className="section-label">Кто делает</span>
              <h2>
                Привет, я Влад.{" "}
                <em>Делаю AI-штуки для бизнеса</em>
              </h2>
              <p>
                Не продаю хайп про «нейросети изменят мир». Просто нахожу
                в вашем бизнесе рутину, которую можно отдать боту — и делаю
                этого бота. За дни, не за месяцы.
              </p>
              <p>
                В портфеле — от цветочного магазина в Дубае до системы
                реабилитации для Минобороны. Веду курс по AI-автоматизации.
                Объясняю сложное простым языком — это мой принцип.
              </p>
              <div className="about-chips">
                <span className="about-chip">
                  <CheckIcon size={14} />13 проектов с цифрами
                </span>
                <span className="about-chip">
                  <CheckIcon size={14} />
                  Свои AI-продукты
                </span>
                <span className="about-chip">
                  <CheckIcon size={14} />
                  Говорю по-человечески
                </span>
                <span className="about-chip">
                  <CheckIcon size={14} />
                  Гарантия результата
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="faq" id="faq">
        <div className="container">
          <div className="reveal">
            <span className="section-label">Вопросы</span>
            <h2 className="section-title">
              Вас наверняка <em>интересует</em>
            </h2>
          </div>
          <div className="faq-grid">
            <div className="faq-item reveal">
              <div className="faq-q">
                <h3>Я вообще ничего не понимаю в AI — это ок?</h3>
                <div className="faq-toggle">
                  <PlusIcon />
                </div>
              </div>
              <div className="faq-a">
                <p>
                  Конечно. Большинство моих клиентов не отличают GPT от
                  Claude — и это нормально. Я всё объясню простыми словами
                  и сделаю техническую часть сам.
                </p>
              </div>
            </div>
            <div className="faq-item reveal">
              <div className="faq-q">
                <h3>Как быстро будет готово?</h3>
                <div className="faq-toggle">
                  <PlusIcon />
                </div>
              </div>
              <div className="faq-a">
                <p>
                  Один бот или автоматизация — 3-5 дней. Комплексный
                  проект на 5+ штук — 2-3 недели. Но первый результат вы
                  увидите уже в первую неделю.
                </p>
              </div>
            </div>
            <div className="faq-item reveal">
              <div className="faq-q">
                <h3>Мне нужно нанимать программиста?</h3>
                <div className="faq-toggle">
                  <PlusIcon />
                </div>
              </div>
              <div className="faq-a">
                <p>
                  Нет. Я и есть ваш программист на этом проекте. От вас —
                  только доступы к нужным сервисам и 15 минут на созвон.
                </p>
              </div>
            </div>
            <div className="faq-item reveal">
              <div className="faq-q">
                <h3>Хочу сначала попробовать на чём-то маленьком</h3>
                <div className="faq-toggle">
                  <PlusIcon />
                </div>
              </div>
              <div className="faq-a">
                <p>
                  Отличная идея — так и советую. Тариф «Старт» за 50к:
                  один бот, быстрый результат, минимальный риск. Понравится —
                  масштабируем.
                </p>
              </div>
            </div>
            <div className="faq-item reveal">
              <div className="faq-q">
                <h3>А если не сработает — что тогда?</h3>
                <div className="faq-toggle">
                  <PlusIcon />
                </div>
              </div>
              <div className="faq-a">
                <p>
                  Верну деньги, если за месяц не будет измеримого результата.
                  Без мелкого шрифта. За 13 проектов этой гарантией не
                  воспользовался никто.
                </p>
              </div>
            </div>
            <div className="faq-item reveal">
              <div className="faq-q">
                <h3>Сколько я сэкономлю в деньгах?</h3>
                <div className="faq-toggle">
                  <PlusIcon />
                </div>
              </div>
              <div className="faq-a">
                <p>
                  Зависит от процессов. Но вот ориентир: бизнес с 3
                  менеджерами обычно экономит 50-90 тыс. &#8381;/мес на рутине.
                  Тариф «Старт» за 50к окупается за 3-4 недели.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="final-cta">
        <div className="container">
          <div className="final-cta-content reveal">
            <h2>
              Давайте посмотрим, где у вас <em>утекают деньги</em>
            </h2>
            <p className="final-cta-sub">
              Напишите мне — за 15 минут разберём ваши процессы и я покажу,
              что можно автоматизировать и сколько это сэкономит. Бесплатно.
            </p>
            <ShimmerCTA href="https://t.me/lyaminvl?text=%D0%90%D1%83%D0%B4%D0%B8%D1%82">
              Написать Владу в Telegram
              <ArrowIcon />
            </ShimmerCTA>
            <p className="final-cta-note">
              Это не продажа. Просто разговор — покажу, что возможно.
            </p>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-logo">LVMN</div>
            <div className="footer-links">
              <a
                href="https://t.me/lyaminvl"
                target="_blank"
                rel="noopener noreferrer"
              >
                Telegram
              </a>
              <a href="#services">Продукты</a>
              <a href="#cases">Кейсы</a>
              <a href="#about">Обо мне</a>
              <a href="/blog">Блог</a>
            </div>
            <div className="footer-copy">
              &copy; 2026 LVMN. Все права защищены.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
