import type { Metadata } from "next";
import LandingInteractivity from "@/components/landing/LandingInteractivity";
import { HeroVideoSection } from "@/components/landing/HeroVideoSection";
import { NicheCards } from "@/components/landing/NicheCards";
import { FeaturedPricingBeam } from "@/components/landing/FeaturedPricing";
import { TestimonialsMarquee } from "@/components/landing/TestimonialsMarquee";
import { ScrollProgressBar } from "@/components/landing/ScrollProgressBar";
import { ShimmerCTA } from "@/components/landing/ShimmerCTA";
import { CasesCarousel } from "@/components/landing/CasesCarousel";

export const metadata: Metadata = {
  title: "LVMN — AI-автоматизация для бизнеса за дни, не за месяцы",
  description:
    "Строим ботов и автоматизации, которые берут рутину на себя. 13 проектов с цифрами. 3-5 дней до результата. Гарантия возврата денег.",
  alternates: {
    canonical: "https://lvmn.vercel.app/",
  },
  openGraph: {
    title: "LVMN — AI-автоматизация для бизнеса за дни, не за месяцы",
    description:
      "Боты и автоматизации для малого бизнеса. 3-5 дней до результата. 13 кейсов. Гарантия возврата.",
    type: "website",
    url: "https://lvmn.vercel.app/",
    locale: "ru_RU",
    images: [
      {
        url: "/founder.jpg",
        width: 1200,
        height: 630,
        alt: "LVMN — AI-автоматизация для бизнеса",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LVMN — AI-автоматизация для бизнеса",
    description:
      "Боты и автоматизации для малого бизнеса. 11 проектов с цифрами. 3-5 дней до результата.",
    images: ["/founder.jpg"],
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


      {/* ===== HERO ===== */}
      <HeroVideoSection />

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
              Если у вас есть <em>люди и рутина</em> — поможем
            </h2>
            <p className="section-subtitle">
              13 реальных проектов в разных нишах. Везде одно и то же — люди делают
              работу, которую давно пора отдать машине.
            </p>
          </div>
          <NicheCards />
        </div>
      </section>

      {/* ===== CASES (moved before packages) ===== */}
      <section className="cases" id="cases">
        <div className="container">
          <div className="reveal">
            <span className="section-label">Кейсы</span>
            <h2 className="section-title">
              Что мы уже <em>построили</em>
            </h2>
            <p className="section-subtitle">
              Каждый проект — рабочий. Не макет в Figma, а система, которая
              прямо сейчас экономит людям время и деньги.
            </p>
          </div>
          <CasesCarousel />
        </div>
      </section>

      {/* ===== TESTIMONIALS (moved before packages) ===== */}
      <section className="testimonials" id="testimonials">
        <div className="container">
          <div className="reveal">
            <span className="section-label">Отзывы</span>
            <h2 className="section-title">
              Что говорят <em>клиенты</em>
            </h2>
            <p className="section-subtitle">
              Не анонимные цитаты — реальные предприниматели, которые
              запустили AI у себя.
            </p>
          </div>
          <TestimonialsMarquee />
        </div>
      </section>

      {/* ===== WHY US ===== */}
      <section className="why-us">
        <div className="container">
          <div className="reveal">
            <span className="section-label">Почему мы</span>
            <h2 className="section-title">
              Чем LVMN <em>отличается</em>
            </h2>
          </div>
          <div className="why-us-grid">
            <div className="why-us-card reveal">
              <h3>3-5 дней, не 3 месяца</h3>
              <p>
                Первый результат за дни. Полное внедрение — 1-3 недели.
                Не затягиваем и не раздуваем scope.
              </p>
            </div>
            <div className="why-us-card reveal">
              <h3>Гарантия результата</h3>
              <p>
                Если за месяц не увидите измеримой экономии — вернём деньги.
                Без мелкого шрифта. За 13 проектов этим не воспользовался никто.
              </p>
            </div>
            <div className="why-us-card reveal">
              <h3>Всё под ключ</h3>
              <p>
                От аудита до запуска и обучения команды. Вам не нужно нанимать
                программиста или разбираться в технологиях.
              </p>
            </div>
            <div className="why-us-card reveal">
              <h3>13 проектов с цифрами</h3>
              <p>
                От цветочного магазина в Дубае до системы реабилитации
                для Минобороны. Каждый кейс — с измеримым результатом.
              </p>
            </div>
            <div className="why-us-card reveal">
              <h3>Говорим по-человечески</h3>
              <p>
                Без «имплементации AI-driven решений». Объясняем, что сделаем,
                зачем и сколько сэкономите — простым языком.
              </p>
            </div>
            <div className="why-us-card reveal">
              <h3>Поддержка после запуска</h3>
              <p>
                Не бросаем после сдачи. Обучаем команду, остаёмся на связи,
                помогаем масштабировать.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROCESS ===== */}
      <section className="process" id="process">
        <div className="container">
          <div className="reveal">
            <span className="section-label">Как это работает</span>
            <h2 className="section-title">
              От заявки до <em>работающей системы</em> — 4 шага
            </h2>
            <p className="section-subtitle">
              Вам не нужно ничего настраивать. Просто расскажите, что болит.
            </p>
          </div>
          <div className="process-steps">
            <div className="process-step reveal">
              <div className="process-num">1</div>
              <h3>Напишите нам</h3>
              <p>
                Пара предложений в Telegram — что за бизнес и что хотите автоматизировать
              </p>
            </div>
            <div className="process-step reveal">
              <div className="process-num">2</div>
              <h3>Разберёмся</h3>
              <p>
                Созвонимся на 15 минут — поймём задачу и скажем, что можно сделать
              </p>
            </div>
            <div className="process-step reveal">
              <div className="process-num">3</div>
              <h3>Строим</h3>
              <p>
                Начнём с того, что даст эффект быстрее всего — увидите результат за дни
              </p>
            </div>
            <div className="process-step reveal">
              <div className="process-num">4</div>
              <h3>Растём</h3>
              <p>
                Если зашло — подключаем новые процессы. Если нет — вернём деньги
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PACKAGES (moved after proof sections) ===== */}
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
                Если за месяц не увидите результат — вернём деньги. Без вопросов
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
                  <CheckIcon /> Один бот или интеграция под ключ
                </li>
                <li>
                  <CheckIcon /> Инструкция для команды
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
                Автоматизируем 2-3 ключевых процесса + обучим команду.
              </div>
              <ul className="pkg-features">
                <li>
                  <CheckIcon /> Аудит всех процессов — найдём, где теряете
                </li>
                <li>
                  <CheckIcon /> 3 бота или автоматизации под ключ
                </li>
                <li>
                  <CheckIcon /> Обучение команды
                </li>
                <li>
                  <CheckIcon /> 2 недели поддержки после запуска
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
                Выбрать
              </a>
            </div>

            {/* ТРАНСФОРМАЦИЯ */}
            <div className="pkg-card reveal">
              <div className="pkg-name">Трансформация</div>
              <div className="pkg-price">
                250 000 <span>&#8381;</span>
              </div>
              <div className="pkg-desc">
                Перестраиваем процессы целиком. Максимум автоматизации.
              </div>
              <ul className="pkg-features">
                <li>
                  <CheckIcon /> Глубокий аудит + план на полгода
                </li>
                <li>
                  <CheckIcon /> 5+ ботов и автоматизаций
                </li>
                <li>
                  <CheckIcon /> Обучение всей команды
                </li>
                <li>
                  <CheckIcon /> Месяц поддержки после запуска
                </li>
                <li>
                  <CheckIcon /> Помощь с масштабированием
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
              <span className="section-label">Кто стоит за LVMN</span>
              <h2>
                Влад Лямин, <em>основатель</em>
              </h2>
              <p>
                Не продаём хайп про «нейросети изменят мир». Находим
                в бизнесе рутину, которую можно отдать боту — и строим
                этого бота. За дни, не за месяцы.
              </p>
              <p>
                В портфеле — от цветочного магазина в Дубае до системы
                реабилитации для Минобороны. Ведём курс по AI-автоматизации.
                Объясняем сложное простым языком — это наш принцип.
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
                  Говорим по-человечески
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
                <h3>Мы ничего не понимаем в AI — это ок?</h3>
                <div className="faq-toggle">
                  <PlusIcon />
                </div>
              </div>
              <div className="faq-a">
                <p>
                  Конечно. Большинство наших клиентов не отличают GPT от
                  Claude — и это нормально. Мы всё объясним простыми словами
                  и возьмём техническую часть на себя.
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
                  проект на 5+ систем — 2-3 недели. Первый результат
                  увидите уже в первую неделю.
                </p>
              </div>
            </div>
            <div className="faq-item reveal">
              <div className="faq-q">
                <h3>Нужно нанимать программиста?</h3>
                <div className="faq-toggle">
                  <PlusIcon />
                </div>
              </div>
              <div className="faq-a">
                <p>
                  Нет. Мы и есть ваша техническая команда на этом проекте. От вас —
                  только доступы к нужным сервисам и 15 минут на созвон.
                </p>
              </div>
            </div>
            <div className="faq-item reveal">
              <div className="faq-q">
                <h3>Хотим сначала попробовать на чём-то маленьком</h3>
                <div className="faq-toggle">
                  <PlusIcon />
                </div>
              </div>
              <div className="faq-a">
                <p>
                  Отличная идея — так и рекомендуем. Тариф «Старт» за 50к:
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
                  Вернём деньги, если за месяц не будет измеримого результата.
                  Без мелкого шрифта. За 13 проектов этой гарантией не
                  воспользовался никто.
                </p>
              </div>
            </div>
            <div className="faq-item reveal">
              <div className="faq-q">
                <h3>Сколько мы сэкономим в деньгах?</h3>
                <div className="faq-toggle">
                  <PlusIcon />
                </div>
              </div>
              <div className="faq-a">
                <p>
                  Зависит от процессов. Ориентир: бизнес с 3
                  менеджерами обычно экономит 50-90 тыс. &#8381;/мес на рутине.
                  Тариф «Старт» за 50к окупается за 3-4 недели.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== AUDIT LEAD MAGNET ===== */}
      <section className="audit-magnet">
        <div className="container">
          <div className="audit-magnet-content reveal">
            <div className="audit-magnet-text">
              <span className="section-label">Бесплатно</span>
              <h2>
                AI-аудит вашего бизнеса <em>за 2 минуты</em>
              </h2>
              <p>
                Ответьте на 6 вопросов о вашем бизнесе — и AI покажет,
                какие процессы можно автоматизировать, сколько времени
                и денег это сэкономит.
              </p>
              <ul className="audit-magnet-points">
                <li>
                  <CheckIcon size={14} />
                  Персональный разбор под вашу нишу
                </li>
                <li>
                  <CheckIcon size={14} />
                  3-5 конкретных автоматизаций с приоритетами
                </li>
                <li>
                  <CheckIcon size={14} />
                  Расчёт экономии в часах и рублях
                </li>
              </ul>
              <a href="/audit" className="audit-magnet-btn">
                Пройти аудит
                <ArrowIcon size={16} />
              </a>
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
              Напишите нам — за 15 минут разберём ваши процессы и покажем,
              что можно автоматизировать и сколько это сэкономит. Бесплатно.
            </p>
            <ShimmerCTA href="https://t.me/lyaminvl?text=%D0%90%D1%83%D0%B4%D0%B8%D1%82">
              Написать в Telegram
              <ArrowIcon />
            </ShimmerCTA>
            <p className="final-cta-note">
              Это не продажа. Просто разговор — покажем, что возможно.
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
              <a href="#about">О нас</a>
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
