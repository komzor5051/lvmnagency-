import type { Metadata } from "next";
import LandingInteractivity from "@/components/landing/LandingInteractivity";

export const metadata: Metadata = {
  title: "LVMN — Продуктовое AI-агентство | AI-продукты для бизнеса",
  description:
    "Строим AI-продукты для бизнеса: боты, автоматизации, MVP-сервисы — за 3-5 дней. 6 кейсов с цифрами. Telegram-бот вместо менеджера. С гарантией результата.",
  openGraph: {
    title: "LVMN — AI-продукты для бизнеса за дни, не за месяцы",
    description:
      "Строим Telegram-ботов, автоматизации и AI-сервисы для малого бизнеса. 3-5 дней до результата. С гарантией.",
    type: "website",
    url: "https://lvmn.vercel.app/",
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    title: "LVMN — AI-продукты для бизнеса",
    description:
      "Строим AI-продукты для малого бизнеса: боты, автоматизации, MVP-сервисы. 3-5 дней до результата.",
  },
};

/* Reusable checkmark SVG for package features and about chips */
function CheckIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

/* FAQ plus icon */
function PlusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

/* Arrow icon for CTAs */
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

      {/* Background effects */}
      <div className="grid-bg" />
      <div className="grain-overlay" />

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
              Написать в Telegram
            </a>
          </div>
          <a
            href="https://t.me/lyaminvl"
            className="nav-cta desktop-only"
            target="_blank"
            rel="noopener noreferrer"
          >
            Написать в Telegram
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
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge anim-fade-up">
              <span className="hero-badge-dot" />
              Продуктовое AI-агентство
            </div>
            <h1 className="anim-fade-up d1">
              AI-продукты для бизнеса.
              <br />
              <em>За дни, не за месяцы.</em>
            </h1>
            <p className="hero-sub anim-fade-up d2">
              Строим ботов, автоматизации и AI-сервисы, которые работают за
              ваших сотрудников 24/7.
            </p>
            <div className="hero-ctas anim-fade-up d3">
              <a
                href="https://t.me/lyaminvl"
                className="btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Обсудить проект
                <ArrowIcon />
              </a>
              <a href="#cases" className="btn-ghost">
                Смотреть кейсы
              </a>
            </div>
            <div className="hero-stats anim-fade-up d4">
              <div>
                <div className="hero-stat-num">6</div>
                <div className="hero-stat-label">Продуктов построено</div>
              </div>
              <div>
                <div className="hero-stat-num">3-5</div>
                <div className="hero-stat-label">Дней до результата</div>
              </div>
              <div>
                <div className="hero-stat-num">60%</div>
                <div className="hero-stat-label">Экономия времени</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PAINS ===== */}
      <section className="pains">
        <div className="container">
          <div className="reveal">
            <span className="section-label">Знакомо?</span>
            <h2 className="section-title">
              Если вы здесь — значит, <em>пора</em>
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
                Менеджеры тратят 4-5 часов в день на копипаст между таблицами,
                CRM и мессенджерами. А вы платите им за это 40 000 &#8381;/мес
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
                Заявка пришла в 22:00 — менеджер увидел в 10:00. Клиент уже
                купил у конкурента, который ответил за 30 секунд
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
                Пробовали ChatGPT, но дальше пары промптов не пошло — непонятно,
                как встроить AI в реальные процессы
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
                Знаете, что AI нужен, но между «знать» и «внедрить» — пропасть
                из непонятных терминов и завышенных ценников
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NICHES ===== */}
      <section className="niches">
        <div className="container">
          <div className="reveal">
            <span className="section-label">Для кого</span>
            <h2 className="section-title">
              Работаю с <em>разными</em> нишами
            </h2>
            <p className="section-subtitle">
              Опыт в 8+ отраслях — от медицины до логистики. Знаю специфику
              каждой.
            </p>
          </div>
          <div className="niches-grid">
            <div className="niche-card reveal">
              <div className="niche-icon">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <h3>Юридические компании</h3>
              <p>
                Анализ договоров, обработка обращений, подготовка документов
              </p>
            </div>
            <div className="niche-card reveal">
              <div className="niche-icon">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <h3>Клиники и медцентры</h3>
              <p>AI-запись 24/7, напоминания, обработка входящих обращений</p>
            </div>
            <div className="niche-card reveal">
              <div className="niche-icon">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
              <h3>E-commerce и торговля</h3>
              <p>
                Реферальные программы, обработка заказов, аналитика продаж
              </p>
            </div>
            <div className="niche-card reveal">
              <div className="niche-icon">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                  <line x1="6" y1="1" x2="6" y2="4" />
                  <line x1="10" y1="1" x2="10" y2="4" />
                  <line x1="14" y1="1" x2="14" y2="4" />
                </svg>
              </div>
              <h3>Рестораны и HoReCa</h3>
              <p>Закупки, управление поставщиками, контроль остатков</p>
            </div>
            <div className="niche-card reveal">
              <div className="niche-icon">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <h3>Онлайн-образование</h3>
              <p>AI-кураторы, проверка домашек, аналитика студентов</p>
            </div>
            <div className="niche-card reveal">
              <div className="niche-icon">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="1" y="3" width="15" height="13" rx="2" />
                  <polyline points="16 8 20 8 23 11 23 16 20 16" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <h3>Логистика и доставка</h3>
              <p>
                Автораспределение заказов, маршруты, уведомления курьерам
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PACKAGES ===== */}
      <section className="packages" id="services">
        <div className="container">
          <div className="reveal">
            <span className="section-label">Продукты</span>
            <h2 className="section-title">
              Выберите свой <em>AI-продукт</em>
            </h2>
            <p className="section-subtitle">
              От первого бота до полной продуктовой экосистемы для бизнеса.
            </p>
            <div
              className="guarantee-banner"
              style={{
                marginTop: "24px",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 20px",
                background: "var(--green-subtle)",
                border: "1px solid rgba(61,214,140,0.2)",
                borderRadius: "10px",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--green)"
                strokeWidth="2"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span
                style={{
                  fontSize: "14px",
                  color: "var(--green)",
                  fontWeight: 500,
                }}
              >
                Гарантия результата — не увидите эффект за первый месяц, вернём
                деньги
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
                Один AI-продукт под ключ. Бот, автоматизация или интеграция.
              </div>
              <ul className="pkg-features">
                <li>
                  <CheckIcon /> Аудит бизнес-процессов
                </li>
                <li>
                  <CheckIcon /> 1 AI-продукт под ключ
                </li>
                <li>
                  <CheckIcon /> Документация и инструкция
                </li>
                <li>
                  <CheckIcon /> Срок: 3-5 дней
                </li>
                <li>
                  <CheckIcon /> Первый результат через 3-5 дней
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
                Выбрать Старт
              </a>
            </div>

            {/* РОСТ */}
            <div className="pkg-card featured reveal">
              <span className="pkg-badge">Популярный</span>
              <div className="pkg-name">Рост</div>
              <div className="pkg-price">
                120 000 <span>&#8381;</span>
              </div>
              <div className="pkg-desc">
                Комплекс AI-продуктов для ключевых процессов.
              </div>
              <ul className="pkg-features">
                <li>
                  <CheckIcon /> Полный аудит процессов
                </li>
                <li>
                  <CheckIcon /> 3 AI-продукта под ключ
                </li>
                <li>
                  <CheckIcon /> Обучение команды
                </li>
                <li>
                  <CheckIcon /> 2 недели поддержки
                </li>
                <li>
                  <CheckIcon /> Срок: 1-2 недели
                </li>
                <li>
                  <CheckIcon /> Первый результат через 5-7 дней
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
                Выбрать Рост
              </a>
            </div>

            {/* ТРАНСФОРМАЦИЯ */}
            <div className="pkg-card reveal">
              <div className="pkg-name">Трансформация</div>
              <div className="pkg-price">
                250 000 <span>&#8381;</span>
              </div>
              <div className="pkg-desc">
                Полная продуктовая экосистема для бизнеса.
              </div>
              <ul className="pkg-features">
                <li>
                  <CheckIcon /> Глубокий аудит + стратегия
                </li>
                <li>
                  <CheckIcon /> 5+ AI-продуктов под ключ
                </li>
                <li>
                  <CheckIcon /> Обучение всей команды
                </li>
                <li>
                  <CheckIcon /> 1 месяц поддержки
                </li>
                <li>
                  <CheckIcon /> Стратегия масштабирования
                </li>
                <li>
                  <CheckIcon /> Первый результат через 5-7 дней
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
                Обсудить проект
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
              Реальные проекты, <em>реальные</em> результаты
            </h2>
            <p className="section-subtitle">
              Не теория — живые внедрения, которые работают прямо сейчас.
            </p>
          </div>
          <div className="cases-grid">
            {/* Case 1 */}
            <div className="case-card reveal">
              <div className="case-inner">
                <div className="case-top">
                  <span className="case-tag">Гос. проект</span>
                </div>
                <h3>AI-система психологической реабилитации</h3>
                <div className="case-cols">
                  <div className="case-col">
                    <div className="case-col-label">Задача</div>
                    <p>
                      Масштабируемая система поддержки участников СВО с ПТСР —
                      без зависимости от количества психологов
                    </p>
                  </div>
                  <div className="case-col">
                    <div className="case-col-label">Решение</div>
                    <p>
                      Telegram-бот с AI-психологом, 10 уроков курса,
                      анкетирование из 32 вопросов, автоматическая оценка рисков
                    </p>
                  </div>
                  <div className="case-col">
                    <div className="case-result-box">
                      <div className="case-col-label">Результат</div>
                      <p>
                        10 автоматизированных воркфлоу, AI-диагностика 24/7,
                        эскалация кризисных ситуаций
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Case 2 */}
            <div className="case-card reveal">
              <div className="case-inner">
                <div className="case-top">
                  <span className="case-tag">Кибербезопасность</span>
                </div>
                <h3>SaaS-платформа анализа безопасности кода</h3>
                <div className="case-cols">
                  <div className="case-col">
                    <div className="case-col-label">Задача</div>
                    <p>
                      Разработчикам нужен быстрый автоматический аудит кода на
                      уязвимости без ручной проверки
                    </p>
                  </div>
                  <div className="case-col">
                    <div className="case-col-label">Решение</div>
                    <p>
                      Анализ по OWASP Top 10, классификация уязвимостей,
                      рекомендации с исправленным кодом
                    </p>
                  </div>
                  <div className="case-col">
                    <div className="case-result-box">
                      <div className="case-col-label">Результат</div>
                      <p>
                        Security Score 0-100, мульти-LLM (GPT-4o + Claude +
                        Gemini), поддержка RU/EN
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Case 3 */}
            <div className="case-card reveal">
              <div className="case-inner">
                <div className="case-top">
                  <span className="case-tag">E-commerce</span>
                </div>
                <h3>
                  Реферальная система для магазина натуральной косметики
                </h3>
                <div className="case-cols">
                  <div className="case-col">
                    <div className="case-col-label">Задача</div>
                    <p>
                      Нет системы привлечения клиентов через рекомендации — весь
                      трафик платный
                    </p>
                  </div>
                  <div className="case-col">
                    <div className="case-col-label">Решение</div>
                    <p>
                      Telegram-бот с 2-уровневой реферальной программой
                      (L1=15%, L2=5%) и синхронизацией с AmoCRM
                    </p>
                  </div>
                  <div className="case-col">
                    <div className="case-result-box">
                      <div className="case-col-label">Результат</div>
                      <p>
                        Полностью автоматическая реферальная система, интеграция
                        с CRM, трекинг балансов
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Case 4 */}
            <div className="case-card reveal">
              <div className="case-inner">
                <div className="case-top">
                  <span className="case-tag">Недвижимость</span>
                </div>
                <h3>AI-ассистент для сервиса краткосрочной аренды</h3>
                <div className="case-cols">
                  <div className="case-col">
                    <div className="case-col-label">Задача</div>
                    <p>
                      Менеджеры тратили часы на однотипные ответы гостям, время
                      реакции страдало
                    </p>
                  </div>
                  <div className="case-col">
                    <div className="case-col-label">Решение</div>
                    <p>
                      AI-ассистент с контекстом бронирований — отвечает
                      моментально и по существу
                    </p>
                  </div>
                  <div className="case-col">
                    <div className="case-result-box">
                      <div className="case-col-label">Результат</div>
                      <p>Скорость ответа x4, нагрузка на менеджеров -60%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Case 5 */}
            <div className="case-card reveal">
              <div className="case-inner">
                <div className="case-top">
                  <span className="case-tag">Монетизация</span>
                </div>
                <h3>Бот монетизации закрытого Telegram-канала</h3>
                <div className="case-cols">
                  <div className="case-col">
                    <div className="case-col-label">Задача</div>
                    <p>
                      Эксперту нужна автоматическая монетизация закрытого канала
                      без ручного контроля подписок
                    </p>
                  </div>
                  <div className="case-col">
                    <div className="case-col-label">Решение</div>
                    <p>
                      Telegram-бот с воронкой подписки, интеграция YooKassa,
                      автопроверка истечения подписок
                    </p>
                  </div>
                  <div className="case-col">
                    <div className="case-result-box">
                      <div className="case-col-label">Результат</div>
                      <p>
                        Автоприём платежей 3 500 &#8381;/мес, управление
                        доступом, напоминания — всё на автопилоте
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Case 6 */}
            <div className="case-card reveal">
              <div className="case-inner">
                <div className="case-top">
                  <span className="case-tag">Ресторанный бизнес</span>
                </div>
                <h3>
                  Автоматизация закупок и перемещений для сети ресторанов
                </h3>
                <div className="case-cols">
                  <div className="case-col">
                    <div className="case-col-label">Задача</div>
                    <p>
                      Управляющие тратили 3-4 часа ежедневно на ручное
                      оформление закупок и перемещений между точками
                    </p>
                  </div>
                  <div className="case-col">
                    <div className="case-col-label">Решение</div>
                    <p>
                      Telegram-бот интегрированный с iiko: автозаявки на
                      закупку, перемещения между складами, контроль остатков в
                      реальном времени
                    </p>
                  </div>
                  <div className="case-col">
                    <div className="case-result-box">
                      <div className="case-col-label">Результат</div>
                      <p>
                        Время на закупки -80%, ноль потерянных заявок,
                        автоматический контроль по 3 точкам
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Case 7 */}
            <div className="case-card reveal">
              <div className="case-inner">
                <div className="case-top">
                  <span className="case-tag">Онлайн-образование</span>
                </div>
                <h3>AI-куратор для онлайн-школы на 400+ студентов</h3>
                <div className="case-cols">
                  <div className="case-col">
                    <div className="case-col-label">Задача</div>
                    <p>
                      Школа тратила 350 000 &#8381;/мес на кураторов, при этом
                      студенты ждали ответа по 6-8 часов
                    </p>
                  </div>
                  <div className="case-col">
                    <div className="case-col-label">Решение</div>
                    <p>
                      AI-куратор с базой знаний курса: отвечает на вопросы 24/7,
                      проверяет домашки, отслеживает прогресс и предупреждает
                      отток
                    </p>
                  </div>
                  <div className="case-col">
                    <div className="case-result-box">
                      <div className="case-col-label">Результат</div>
                      <p>
                        Затраты на кураторов -50%, доходимость курса +22%, время
                        ответа — мгновенно
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Case 8 */}
            <div className="case-card reveal">
              <div className="case-inner">
                <div className="case-top">
                  <span className="case-tag">Медицина</span>
                </div>
                <h3>AI-администратор для стоматологической клиники</h3>
                <div className="case-cols">
                  <div className="case-col">
                    <div className="case-col-label">Задача</div>
                    <p>
                      Администраторы не справлялись с потоком звонков и
                      сообщений — 30% обращений оставались без ответа, особенно
                      вечером
                    </p>
                  </div>
                  <div className="case-col">
                    <div className="case-col-label">Решение</div>
                    <p>
                      AI-бот в Telegram и WhatsApp: запись на приём,
                      напоминания, ответы на типовые вопросы, подбор свободных
                      слотов врачей
                    </p>
                  </div>
                  <div className="case-col">
                    <div className="case-result-box">
                      <div className="case-col-label">Результат</div>
                      <p>
                        0 потерянных обращений, запись 24/7, загрузка врачей
                        +25%, no-show -40%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Case 9 */}
            <div className="case-card reveal">
              <div className="case-inner">
                <div className="case-top">
                  <span className="case-tag">HR / Рекрутинг</span>
                </div>
                <h3>AI-скрининг кандидатов для кадрового агентства</h3>
                <div className="case-cols">
                  <div className="case-col">
                    <div className="case-col-label">Задача</div>
                    <p>
                      HR-менеджер тратил 5 часов в день на просмотр резюме и
                      первичный скрининг — 80% кандидатов не подходили
                    </p>
                  </div>
                  <div className="case-col">
                    <div className="case-col-label">Решение</div>
                    <p>
                      AI-система парсит отклики с HH.ru, оценивает соответствие
                      вакансии, ранжирует кандидатов и отправляет TOP-10
                      рекрутеру
                    </p>
                  </div>
                  <div className="case-col">
                    <div className="case-result-box">
                      <div className="case-col-label">Результат</div>
                      <p>
                        Время на скрининг -85%, точность подбора +40%, закрытие
                        вакансий быстрее на 2 недели
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Case 10 */}
            <div className="case-card reveal">
              <div className="case-inner">
                <div className="case-top">
                  <span className="case-tag">Юриспруденция</span>
                </div>
                <h3>AI-анализ договоров для юридической фирмы</h3>
                <div className="case-cols">
                  <div className="case-col">
                    <div className="case-col-label">Задача</div>
                    <p>
                      Юристы тратили 2-3 часа на анализ каждого договора и
                      выявление рисков — при 15-20 договорах в неделю это съедало
                      весь ресурс
                    </p>
                  </div>
                  <div className="case-col">
                    <div className="case-col-label">Решение</div>
                    <p>
                      AI-система анализирует договор за 2 минуты: выделяет
                      ключевые условия, находит риски, сравнивает с шаблонами и
                      формирует отчёт
                    </p>
                  </div>
                  <div className="case-col">
                    <div className="case-result-box">
                      <div className="case-col-label">Результат</div>
                      <p>
                        Анализ договора: 3 часа &#8594; 15 минут, пропущенные
                        риски -90%, пропускная способность x4
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Case 11 */}
            <div className="case-card reveal">
              <div className="case-inner">
                <div className="case-top">
                  <span className="case-tag">Маркетинг</span>
                </div>
                <h3>AI-генератор контента для SMM-агентства</h3>
                <div className="case-cols">
                  <div className="case-col">
                    <div className="case-col-label">Задача</div>
                    <p>
                      Агентство ведёт 12 клиентов — на создание каруселей,
                      постов и сториз уходило 70% времени всей команды
                    </p>
                  </div>
                  <div className="case-col">
                    <div className="case-col-label">Решение</div>
                    <p>
                      Telegram-бот для генерации готовых каруселей: AI пишет
                      тексты, подбирает визуал, рендерит в PNG — 15+ шаблонов
                      дизайна
                    </p>
                  </div>
                  <div className="case-col">
                    <div className="case-result-box">
                      <div className="case-col-label">Результат</div>
                      <p>
                        Производство контента x5, себестоимость поста -70%,
                        агентство взяло ещё 8 клиентов без найма
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Case 12 */}
            <div className="case-card reveal">
              <div className="case-inner">
                <div className="case-top">
                  <span className="case-tag">Логистика</span>
                </div>
                <h3>Автоматизация диспетчерской для службы доставки</h3>
                <div className="case-cols">
                  <div className="case-col">
                    <div className="case-col-label">Задача</div>
                    <p>
                      Диспетчер вручную распределял 80+ заказов в день между 12
                      курьерами — ошибки, задержки, хаос
                    </p>
                  </div>
                  <div className="case-col">
                    <div className="case-col-label">Решение</div>
                    <p>
                      AI-система автоматически распределяет заказы по зонам,
                      рассчитывает оптимальные маршруты, уведомляет курьеров
                      через Telegram
                    </p>
                  </div>
                  <div className="case-col">
                    <div className="case-result-box">
                      <div className="case-col-label">Результат</div>
                      <p>
                        Время распределения 2 часа &#8594; 5 минут, опоздания
                        -65%, диспетчер высвобожден на другие задачи
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Case 13 */}
            <div className="case-card reveal">
              <div className="case-inner">
                <div className="case-top">
                  <span className="case-tag">Финансы</span>
                </div>
                <h3>
                  AI-ассистент финансового учёта для сети магазинов
                </h3>
                <div className="case-cols">
                  <div className="case-col">
                    <div className="case-col-label">Задача</div>
                    <p>
                      Бухгалтер тратил неделю на сверку данных по 5 точкам —
                      ручной ввод чеков, накладных и отчётов
                    </p>
                  </div>
                  <div className="case-col">
                    <div className="case-col-label">Решение</div>
                    <p>
                      AI распознаёт фото чеков и накладных, автоматически заносит
                      в таблицы, формирует сводку по точкам и алертит об
                      отклонениях
                    </p>
                  </div>
                  <div className="case-col">
                    <div className="case-result-box">
                      <div className="case-col-label">Результат</div>
                      <p>
                        Сверка: 5 дней &#8594; 4 часа, ошибки ручного ввода — 0,
                        еженедельная аналитика на автопилоте
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="testimonials" id="testimonials">
        <div className="container">
          <div className="reveal">
            <span className="section-label">Отзывы</span>
            <h2 className="section-title">
              Что говорят <em>клиенты</em>
            </h2>
            <p className="section-subtitle">
              Реальные отзывы от людей, которые уже внедрили AI в свой бизнес.
            </p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card reveal">
              <div className="testimonial-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <p className="testimonial-text">
                «Менеджеры тратили 5 часов на обработку заявок. Сейчас — 40
                минут. За 2 недели Влад сделал то, что мы пытались решить
                полгода.»
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="Алексей К."
                  />
                </div>
                <div>
                  <div className="testimonial-name">Алексей К.</div>
                  <div className="testimonial-role">
                    Сеть ресторанов, Новосибирск
                  </div>
                </div>
              </div>
            </div>
            <div className="testimonial-card reveal">
              <div className="testimonial-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <p className="testimonial-text">
                «Раньше теряли 30% обращений вечером. Теперь бот записывает
                пациентов 24/7. Загрузка врачей выросла на 25% за первый
                месяц.»
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="Марина С."
                  />
                </div>
                <div>
                  <div className="testimonial-name">Марина С.</div>
                  <div className="testimonial-role">
                    Стоматологическая клиника
                  </div>
                </div>
              </div>
            </div>
            <div className="testimonial-card reveal">
              <div className="testimonial-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <p className="testimonial-text">
                «AI-скрининг кандидатов сэкономил нам 85% времени рекрутера.
                Закрываем вакансии на 2 недели быстрее. Окупилось за первый
                месяц.»
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  <img
                    src="https://randomuser.me/api/portraits/men/75.jpg"
                    alt="Дмитрий В."
                  />
                </div>
                <div>
                  <div className="testimonial-name">Дмитрий В.</div>
                  <div className="testimonial-role">Кадровое агентство</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card reveal">
              <div className="testimonial-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <p className="testimonial-text">
                «Самое ценное — Влад объясняет всё по-человечески. Без
                технического жаргона. Мы за 10 дней запустили AI-куратора для
                400 студентов.»
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  <img
                    src="https://randomuser.me/api/portraits/women/68.jpg"
                    alt="Елена Н."
                  />
                </div>
                <div>
                  <div className="testimonial-name">Елена Н.</div>
                  <div className="testimonial-role">Онлайн-школа</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROCESS ===== */}
      <section className="process" id="process">
        <div className="container">
          <div className="reveal">
            <span className="section-label">Процесс</span>
            <h2 className="section-title">
              Четыре шага до <em>результата</em>
            </h2>
            <p className="section-subtitle">
              Без технического жаргона. Без сложных интеграций на вашей стороне.
            </p>
          </div>
          <div className="process-steps">
            <div className="process-step reveal">
              <div className="process-num">1</div>
              <h3>Заявка</h3>
              <p>
                Опишите бизнес и задачу в Telegram — буквально пару предложений
              </p>
            </div>
            <div className="process-step reveal">
              <div className="process-num">2</div>
              <h3>Созвон</h3>
              <p>
                Уточняем цели, рисуем карту возможностей AI для вашей ситуации
              </p>
            </div>
            <div className="process-step reveal">
              <div className="process-num">3</div>
              <h3>Проект</h3>
              <p>
                Фокус на 1-2 быстрых победах — чтобы вы увидели эффект сразу
              </p>
            </div>
            <div className="process-step reveal">
              <div className="process-num">4</div>
              <h3>Развитие</h3>
              <p>
                Масштабируем удачные решения, подключаем новые сценарии
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
              <span className="section-label">Обо мне</span>
              <h2>
                Влад Лямин — предприниматель и{" "}
                <em>создатель AI-продуктов</em>
              </h2>
              <p>
                Строю AI-продукты для бизнеса — от Telegram-ботов до
                полноценных SaaS-сервисов. Не верю в хайп — верю в работающие
                решения с измеримым результатом.
              </p>
              <p>
                Основатель продуктового AI-агентства LVMN. В портфеле — от
                цветочного магазина в Дубае до системы реабилитации для
                Минобороны. Автор курса по n8n + AI автоматизации.
              </p>
              <div className="about-chips">
                <span className="about-chip">
                  <CheckIcon size={14} />6 продуктов с реальными цифрами
                </span>
                <span className="about-chip">
                  <CheckIcon size={14} />
                  Собственные AI-продукты
                </span>
                <span className="about-chip">
                  <CheckIcon size={14} />
                  Без техножаргона
                </span>
                <span className="about-chip">
                  <CheckIcon size={14} />
                  Продуктовый подход
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
              Частые <em>вопросы</em>
            </h2>
          </div>
          <div className="faq-grid">
            <div className="faq-item reveal">
              <div className="faq-q">
                <h3>Если я вообще не понимаю в ИИ — это нормально?</h3>
                <div className="faq-toggle">
                  <PlusIcon />
                </div>
              </div>
              <div className="faq-a">
                <p>
                  Абсолютно. Моя задача — объяснить всё на понятном языке и
                  взять техническую часть на себя. Вам не нужно разбираться в
                  промптах и нейросетях.
                </p>
              </div>
            </div>
            <div className="faq-item reveal">
              <div className="faq-q">
                <h3>Сколько времени занимает создание продукта?</h3>
                <div className="faq-toggle">
                  <PlusIcon />
                </div>
              </div>
              <div className="faq-a">
                <p>
                  От 3 до 7 дней для стандартного продукта. Сложные проекты (5+
                  продуктов) — до 2-3 недель. Начинаем с быстрых побед, чтобы
                  результат был виден сразу.
                </p>
              </div>
            </div>
            <div className="faq-item reveal">
              <div className="faq-q">
                <h3>Нужны ли программисты на моей стороне?</h3>
                <div className="faq-toggle">
                  <PlusIcon />
                </div>
              </div>
              <div className="faq-a">
                <p>
                  Нет. Все решения делаю сам. От вас нужен только доступ к
                  нужным сервисам и время на обсуждение задач.
                </p>
              </div>
            </div>
            <div className="faq-item reveal">
              <div className="faq-q">
                <h3>Можно начать с маленького пилота?</h3>
                <div className="faq-toggle">
                  <PlusIcon />
                </div>
              </div>
              <div className="faq-a">
                <p>
                  Да, и это рекомендуемый путь. Пакет &quot;Старт&quot; именно
                  для этого — одно решение, быстрый результат, минимальный риск.
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
                  Гарантия результата: если за первый месяц вы не увидите
                  измеримой экономии времени — верну деньги. Без вопросов. За
                  20+ проектов этим не воспользовался никто.
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
                  Зависит от процессов, но в среднем: бизнес с 3 менеджерами
                  экономит 50-90 тыс. &#8381;/мес на рутинных операциях. Пакет
                  «Старт» за 50k обычно окупается за 3-4 недели.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="final-cta">
        <div className="final-cta-orb" />
        <div className="container">
          <div className="final-cta-content reveal">
            <h2>
              Какой AI-продукт нужен <em>вашему</em> бизнесу?
            </h2>
            <p className="final-cta-sub">
              Напишите в Telegram — за 15 минут покажу, какие процессы можно
              заменить AI-продуктом и сколько это сэкономит. Бесплатно, без
              обязательств.
            </p>
            <a
              href="https://t.me/lyaminvl?text=%D0%90%D1%83%D0%B4%D0%B8%D1%82"
              className="btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Написать «Аудит» в Telegram
              <ArrowIcon />
            </a>
            <p className="final-cta-note">
              Без обязательств. Без продаж. Просто диагностика вашего бизнеса.
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
