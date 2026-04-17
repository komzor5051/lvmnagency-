"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const S = {
  bg: "#f6f2ea",
  fg: "#1a1815",
  muted: "#7a756c",
  line: "#cfc8bb",
  card: "#eeeadf",
  accent: "oklch(0.55 0.12 30)",
  serif: "var(--font-fraunces), 'Cormorant Garamond', Georgia, serif",
  sans: "var(--font-inter), 'Helvetica Neue', sans-serif",
  mono: "var(--font-mono), ui-monospace, monospace",
} as const;

// ─── Content ──────────────────────────────────────────────────────────────────
const STATUS = "Беру 2 новых проекта в мае";

const STATS = [
  { n: "40+", l: "внедрений" },
  { n: "7", l: "лет в продукте" },
  { n: "200+", l: "обученных людей" },
  { n: "2023", l: "в AI full-time" },
];

const BIO = [
  "Занимаюсь AI-консалтингом с 2023 года. До этого — 7 лет в операционных и продуктовых ролях.",
  "За это время провёл 40+ внедрений: от автоматизации поддержки до собственных агентов под конкретный бизнес-процесс.",
  "Работаю с LLM, агентными пайплайнами, retrieval, evals. Преподаю — курсы и корпоративное обучение.",
];

const SERVICES = [
  {
    num: "01",
    title: "AI-аудит бизнеса",
    summary:
      "За 2 недели нахожу 5–8 процессов, где ИИ реально сэкономит деньги, и показываю, сколько именно.",
    deliverables: ["Карта процессов", "ROI-модель", "План внедрения на 3 месяца"],
    price: "от 350 000 ₽",
    duration: "2 недели",
  },
  {
    num: "02",
    title: "Внедрение под ключ",
    summary:
      "Собираю агента, пайплайн или AI-модуль в вашу систему. От идеи до продакшена и метрик.",
    deliverables: ["Рабочий агент / пайплайн", "Интеграции", "Документация и evals"],
    price: "от 800 000 ₽",
    duration: "4–8 недель",
  },
  {
    num: "03",
    title: "Обучение команды",
    summary:
      "Корпоративный курс: как продакты, маркетологи, операционка используют LLM ежедневно. С практикой на ваших данных.",
    deliverables: ["6 модулей", "Практика на ваших кейсах", "Сертификация"],
    price: "от 250 000 ₽",
    duration: "3–4 недели",
  },
  {
    num: "04",
    title: "Advisory",
    summary:
      "Ежемесячная подписка: я на связи, разбираю ваши AI-гипотезы, помогаю не потратить бюджет в трубу.",
    deliverables: ["2 созвона в месяц", "Async-вопросы", "Ревью архитектуры"],
    price: "180 000 ₽ / мес",
    duration: "минимум 3 мес",
  },
];

const CASES = [
  {
    client: "Retail-сеть (НДА)",
    year: "2025",
    title: "Агент для закупок: −38% времени на заказы",
    metric: "−38%",
    metric_label: "времени менеджера",
    tag: "Агент",
    span: "span 4",
    ratio: "4/3",
  },
  {
    client: "Медицинская клиника",
    year: "2025",
    title: "AI-скоринг входящих заявок, конверсия ×1.7",
    metric: "×1.7",
    metric_label: "конверсия в запись",
    tag: "Classification",
    span: "span 2",
    ratio: "4/3",
  },
  {
    client: "EdTech-стартап",
    year: "2024",
    title: "Генерация учебного контента, 400 часов → 12",
    metric: "33×",
    metric_label: "скорость контента",
    tag: "Pipeline",
    span: "span 2",
    ratio: "4/3",
  },
  {
    client: "B2B-сервис",
    year: "2024",
    title: "Персональный ассистент для саппорта, CSAT 4.8",
    metric: "4.8",
    metric_label: "CSAT из 5",
    tag: "RAG",
    span: "span 4",
    ratio: "4/3",
  },
  {
    client: "Банк (пилот)",
    year: "2024",
    title: "Автоматизация комплаенс-проверок документов",
    metric: "6 мин",
    metric_label: "вместо 45",
    tag: "Enterprise",
    span: "span 6",
    ratio: "21/8",
  },
];

const PRINCIPLES = [
  "AI — это не магия. Если подрядчик не может объяснить, за что вы платите, — это не AI-проект.",
  "Сначала метрика, потом модель. Без ROI-модели любой проект превращается в демо.",
  "Скучная автоматизация выигрывает у красивых агентов в 8 случаях из 10.",
  "Обучение важнее внедрения. Система без людей, которые её понимают, умирает за квартал.",
];

const POSTS = [
  { date: "12 апр", title: "Почему 80% AI-проектов умирают на втором месяце", read: "7 мин", kicker: "Эссе" },
  { date: "28 мар", title: "Evals, про которые никто не говорит вслух", read: "11 мин", kicker: "Техническое" },
  { date: "09 мар", title: "Как продавать AI-проект финдиру, а не CTO", read: "5 мин", kicker: "Продажи" },
  { date: "22 фев", title: "Агенты — это не будущее, это 2024", read: "8 мин", kicker: "Эссе" },
];

const SOCIALS = [
  { label: "Telegram", href: "https://t.me/lvmn_ai", handle: "@lvmn_ai" },
  { label: "GitHub", href: "https://github.com/komzor5051", handle: "komzor5051" },
  { label: "Email", href: "mailto:komzor909@gmail.com", handle: "komzor909@gmail.com" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const label: CSSProperties = {
  fontFamily: S.mono,
  fontSize: 10,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: S.muted,
};

const rule: CSSProperties = {
  borderTop: `1px solid ${S.line}`,
};

function Placeholder({ ratio, text }: { ratio: string; text: string }) {
  return (
    <div
      style={{
        aspectRatio: ratio,
        width: "100%",
        background: `repeating-linear-gradient(45deg, ${S.card}, ${S.card} 10px, #e7e1d3 10px, #e7e1d3 20px)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: S.mono,
        fontSize: 11,
        color: S.muted,
        textTransform: "uppercase",
        letterSpacing: "0.15em",
      }}
    >
      {text}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function StudioPage() {
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = revealRef.current?.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!els) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "translateY(0)";
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    els.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
      el.style.transition = "opacity 0.55s ease, transform 0.55s ease";
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const wrap: CSSProperties = {
    background: S.bg,
    color: S.fg,
    fontFamily: S.sans,
    minHeight: "100vh",
  };

  return (
    <div style={wrap} ref={revealRef}>
      <style>{`
        .studio h1, .studio h2, .studio h3 {
          font-family: ${S.serif};
          font-weight: 300;
          letter-spacing: -0.02em;
        }
        .studio em { font-style: italic; font-family: ${S.serif}; }
        .studio a { color: inherit; text-decoration: none; }
        .studio .drop-cap::first-letter {
          font-family: ${S.serif};
          font-size: 4em;
          float: left;
          line-height: 0.9;
          padding: 8px 10px 0 0;
          color: ${S.accent};
          font-style: italic;
        }
        .studio .post-row:hover h3 {
          font-style: italic;
          color: ${S.accent};
          transition: color 0.2s, font-style 0.2s;
        }
        .studio .post-row h3 {
          transition: color 0.2s, font-style 0.2s;
        }
        .studio .svc-card:hover {
          background: ${S.card};
        }
        .studio .svc-card {
          transition: background 0.2s;
        }
        @media (max-width: 768px) {
          .studio .hero-grid { grid-template-columns: 1fr !important; }
          .studio .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .studio .about-grid { grid-template-columns: 1fr !important; }
          .studio .about-cols { column-count: 1 !important; }
          .studio .svc-grid { grid-template-columns: 1fr !important; }
          .studio .cases-grid { grid-template-columns: 1fr !important; }
          .studio .cases-grid > * { grid-column: span 1 !important; }
          .studio .principles-grid { grid-template-columns: 1fr !important; }
          .studio .blog-header-grid { grid-template-columns: 1fr !important; }
          .studio .post-row { grid-template-columns: 60px 1fr !important; gap: 12px !important; }
          .studio .post-row .post-kicker { display: none; }
          .studio .post-row .post-read { display: none; }
          .studio .masthead-nav { padding: 14px 20px !important; flex-wrap: wrap; }
          .studio .section-pad { padding: 48px 20px !important; }
          .studio .hero-section { padding: 48px 20px !important; }
          .studio .contact-h2 { font-size: clamp(48px, 18vw, 180px) !important; }
        }
      `}</style>

      <div className="studio">
        {/* ── MASTHEAD ──────────────────────────────────────────────── */}
        <header
          style={{
            padding: "32px 48px 16px",
            borderBottom: `1px solid ${S.line}`,
          }}
        >
          <div
            style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}
          >
            <span style={label}>Vol. iv · no. 12 · Апрель 2026</span>
            <span style={label}>Новосибирск · {STATUS}</span>
          </div>
          <div
            style={{
              fontFamily: S.serif,
              fontWeight: 300,
              fontSize: "clamp(56px, 9vw, 132px)",
              textAlign: "center",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              margin: "8px 0 4px",
            }}
          >
            Л<em>ями</em>н
          </div>
          <div style={{ ...label, textAlign: "center" }}>— личная студия AI-консалтинга —</div>
        </header>

        {/* ── NAV ───────────────────────────────────────────────────── */}
        <nav
          className="masthead-nav"
          style={{
            padding: "14px 48px",
            borderBottom: `1px solid ${S.line}`,
            display: "flex",
            justifyContent: "center",
            gap: 32,
            flexWrap: "wrap",
          }}
        >
          {["Обо мне", "Услуги", "Работы", "Принципы", "Блог", "Контакт"].map((l) => (
            <a key={l} href={`#${l}`} style={label}>
              {l}
            </a>
          ))}
        </nav>

        {/* ── HERO ──────────────────────────────────────────────────── */}
        <section
          className="hero-section"
          style={{
            padding: "72px 48px",
            display: "grid",
            gridTemplateColumns: "5fr 7fr",
            gap: 64,
            borderBottom: `1px solid ${S.line}`,
          }}
        >
          <div data-reveal>
            <div style={{ ...label, marginBottom: 20 }}>Эссе · выпуск 01</div>
            <h1
              style={{
                fontSize: "clamp(40px, 5.2vw, 96px)",
                margin: 0,
                lineHeight: 1.02,
              }}
            >
              Как я делаю <em>скучный AI</em>, который <em>работает</em>.
            </h1>
            <p
              className="drop-cap"
              style={{
                fontSize: 19,
                lineHeight: 1.7,
                marginTop: 36,
                maxWidth: 520,
                fontFamily: S.sans,
                margin: "36px 0 0",
              }}
            >
              Помогаю компаниям внедрять AI в операционку и обучаю команды работать с ИИ без
              магии. Пять лет в продукте, три года в AI full-time, сорок плюс внедрений и ни
              одного пилота, который бы остался пилотом.
            </p>
            <div style={{ marginTop: 32, display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
              <a
                href="#Контакт"
                style={{
                  padding: "14px 28px",
                  background: S.fg,
                  color: S.bg,
                  fontFamily: S.mono,
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  display: "inline-block",
                }}
              >
                Написать →
              </a>
              <a
                href="#Работы"
                style={{
                  fontFamily: S.serif,
                  fontSize: 19,
                  fontStyle: "italic",
                  borderBottom: `1px solid ${S.fg}`,
                  paddingBottom: 2,
                }}
              >
                посмотреть работы
              </a>
            </div>
          </div>
          <div data-reveal style={{ animationDelay: "0.1s" }}>
            <Placeholder ratio="4/5" text="[ портрет ]" />
            <div
              style={{ display: "flex", justifyContent: "space-between", marginTop: 12, ...label }}
            >
              <span>рис. 01 — автор</span>
              <span>Новосибирск · &apos;26</span>
            </div>
          </div>
        </section>

        {/* ── STATS ─────────────────────────────────────────────────── */}
        <section
          className="stats-grid"
          style={{
            padding: "32px 48px",
            borderBottom: `1px solid ${S.line}`,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 32,
          }}
        >
          {STATS.map((s, i) => (
            <div
              key={i}
              data-reveal
              style={{ borderLeft: `1px solid ${S.line}`, paddingLeft: 16 }}
            >
              <div
                style={{
                  fontFamily: S.serif,
                  fontSize: 64,
                  fontWeight: 300,
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                }}
              >
                {s.n}
              </div>
              <div style={{ ...label, marginTop: 6 }}>{s.l}</div>
            </div>
          ))}
        </section>

        {/* ── ABOUT ─────────────────────────────────────────────────── */}
        <section
          id="Обо мне"
          className="about-grid section-pad"
          style={{
            padding: "80px 48px",
            borderBottom: `1px solid ${S.line}`,
            display: "grid",
            gridTemplateColumns: "3fr 9fr",
            gap: 48,
          }}
        >
          <div data-reveal>
            <div style={label}>Гл. I</div>
            <h2 style={{ fontSize: 40, margin: "8px 0 0", lineHeight: 1.05 }}>Обо мне</h2>
          </div>
          <div
            className="about-cols"
            data-reveal
            style={{ columnCount: 2, columnGap: 48, fontSize: 18, lineHeight: 1.65 }}
          >
            {BIO.map((p, i) => (
              <p
                key={i}
                style={{ margin: "0 0 16px", breakInside: "avoid" }}
                className={i === 0 ? "drop-cap" : ""}
              >
                {p}
              </p>
            ))}
            <p
              style={{
                margin: "0 0 16px",
                breakInside: "avoid",
                color: S.muted,
                fontStyle: "italic",
                fontFamily: S.serif,
              }}
            >
              «AI — это не магия. Если не можешь объяснить, за что платит клиент, — это не
              AI-проект».
            </p>
          </div>
        </section>

        {/* ── SERVICES ──────────────────────────────────────────────── */}
        <section
          id="Услуги"
          className="section-pad"
          style={{ padding: "80px 48px", borderBottom: `1px solid ${S.line}` }}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "3fr 9fr", gap: 48, marginBottom: 48 }}
          >
            <div data-reveal>
              <div style={label}>Гл. II</div>
              <h2 style={{ fontSize: 40, margin: "8px 0 0", lineHeight: 1.05 }}>
                Форматы работы
              </h2>
            </div>
            <p
              data-reveal
              style={{
                fontFamily: S.serif,
                fontSize: 28,
                fontWeight: 300,
                lineHeight: 1.35,
                margin: 0,
                maxWidth: 640,
              }}
            >
              От <em>короткого аудита</em> на две недели до <em>постоянной подписки</em>, когда
              нужен ум под рукой. Выбираем вместе на первом созвоне.
            </p>
          </div>
          <div
            className="svc-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 1,
              background: S.line,
              border: `1px solid ${S.line}`,
            }}
          >
            {SERVICES.map((s) => (
              <article
                key={s.num}
                className="svc-card"
                data-reveal
                style={{
                  background: S.bg,
                  padding: 36,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  minHeight: 320,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", ...label }}>
                  <span>№ {s.num}</span>
                  <span>{s.duration}</span>
                </div>
                <h3 style={{ fontSize: 36, margin: 0, lineHeight: 1.05 }}>{s.title}</h3>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: S.muted }}>
                  {s.summary}
                </p>
                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: 16,
                    borderTop: `1px solid ${S.line}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <div style={{ fontSize: 13, color: S.muted, maxWidth: 260 }}>
                    {s.deliverables.join(" · ")}
                  </div>
                  <div
                    style={{
                      fontFamily: S.serif,
                      fontStyle: "italic",
                      fontSize: 22,
                    }}
                  >
                    {s.price}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── WORKS ─────────────────────────────────────────────────── */}
        <section
          id="Работы"
          className="section-pad"
          style={{ padding: "80px 48px", borderBottom: `1px solid ${S.line}` }}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "3fr 9fr", gap: 48, marginBottom: 48 }}
          >
            <div data-reveal>
              <div style={label}>Гл. III</div>
              <h2 style={{ fontSize: 40, margin: "8px 0 0", lineHeight: 1.05 }}>
                Избранные проекты
              </h2>
            </div>
            <p
              data-reveal
              style={{
                fontFamily: S.serif,
                fontSize: 24,
                fontWeight: 300,
                lineHeight: 1.4,
                margin: 0,
                fontStyle: "italic",
                color: S.muted,
              }}
            >
              Подробности по запросу — большая часть под NDA, рассказываю голосом.
            </p>
          </div>
          <div
            className="cases-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 32 }}
          >
            {CASES.map((c, i) => (
              <a
                key={i}
                href="#Контакт"
                data-reveal
                style={{
                  gridColumn: c.span,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <Placeholder ratio={c.ratio} text={`[ cover · ${c.client.toLowerCase()} ]`} />
                <div style={{ display: "flex", justifyContent: "space-between", ...label }}>
                  <span>
                    {c.client} · {c.year}
                  </span>
                  <span>{c.tag}</span>
                </div>
                <h3 style={{ fontSize: 28, margin: 0, lineHeight: 1.15 }}>{c.title}</h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 10,
                    color: S.accent,
                  }}
                >
                  <span
                    style={{
                      fontFamily: S.serif,
                      fontStyle: "italic",
                      fontSize: 32,
                    }}
                  >
                    {c.metric}
                  </span>
                  <span style={{ ...label, color: S.accent }}>{c.metric_label}</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── PRINCIPLES ────────────────────────────────────────────── */}
        <section
          id="Принципы"
          className="section-pad"
          style={{
            padding: "100px 48px",
            borderBottom: `1px solid ${S.line}`,
            background: S.card,
          }}
        >
          <div style={{ ...label, textAlign: "center", marginBottom: 16 }}>
            Гл. IV — принципы работы
          </div>
          <div
            className="principles-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 64,
              maxWidth: 1100,
              margin: "0 auto",
            }}
          >
            {PRINCIPLES.map((p, i) => (
              <blockquote
                key={i}
                data-reveal
                style={{
                  margin: 0,
                  fontFamily: S.serif,
                  fontSize: "clamp(20px, 2.2vw, 32px)",
                  lineHeight: 1.35,
                  fontWeight: 300,
                }}
              >
                <span style={{ color: S.accent, fontStyle: "italic", marginRight: 10 }}>«</span>
                {p}
                <span style={{ color: S.accent, fontStyle: "italic", marginLeft: 6 }}>»</span>
                <div style={{ ...label, marginTop: 14 }}>пр. 0{i + 1}</div>
              </blockquote>
            ))}
          </div>
        </section>

        {/* ── BLOG ──────────────────────────────────────────────────── */}
        <section
          id="Блог"
          className="section-pad"
          style={{ padding: "80px 48px", borderBottom: `1px solid ${S.line}` }}
        >
          <div
            className="blog-header-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "3fr 9fr",
              gap: 48,
              marginBottom: 48,
              alignItems: "end",
            }}
          >
            <div data-reveal>
              <div style={label}>Гл. V</div>
              <h2 style={{ fontSize: 40, margin: "8px 0 0", lineHeight: 1.05 }}>Записки</h2>
            </div>
            <a
              href="/blog"
              style={{
                fontFamily: S.serif,
                fontStyle: "italic",
                fontSize: 22,
                borderBottom: `1px solid ${S.fg}`,
                paddingBottom: 2,
                width: "fit-content",
              }}
            >
              весь архив →
            </a>
          </div>
          {POSTS.map((p, i) => (
            <a
              key={i}
              href="/blog"
              className="post-row"
              data-reveal
              style={{
                display: "grid",
                gridTemplateColumns: "80px 140px 1fr 80px",
                gap: 24,
                alignItems: "baseline",
                padding: "28px 0",
                borderTop: `1px solid ${S.line}`,
              }}
            >
              <span style={label}>{p.date}</span>
              <span className="post-kicker" style={{ ...label, color: S.accent }}>
                — {p.kicker}
              </span>
              <h3 style={{ margin: 0, fontSize: 32, lineHeight: 1.2 }}>{p.title}</h3>
              <span className="post-read" style={{ ...label, textAlign: "right" }}>
                {p.read}
              </span>
            </a>
          ))}
        </section>

        {/* ── CONTACT ───────────────────────────────────────────────── */}
        <section
          id="Контакт"
          className="section-pad"
          style={{
            padding: "120px 48px 80px",
            textAlign: "center",
            borderBottom: `1px solid ${S.line}`,
          }}
        >
          <div style={label}>Гл. VI — колофон</div>
          <h2
            className="contact-h2"
            data-reveal
            style={{
              fontSize: "clamp(64px, 11vw, 180px)",
              margin: "12px 0 32px",
              lineHeight: 0.95,
              fontWeight: 300,
            }}
          >
            <em>Напишите.</em>
          </h2>
          <p
            data-reveal
            style={{
              fontFamily: S.serif,
              fontSize: 24,
              lineHeight: 1.5,
              maxWidth: 560,
              margin: "0 auto 48px",
              fontWeight: 300,
            }}
          >
            Расскажите задачу в двух предложениях. Отвечу в течение суток и предложу тридцать
            минут, если это интересно обоим.
          </p>
          <div
            data-reveal
            style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}
          >
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                style={{
                  padding: "12px 22px",
                  border: `1px solid ${S.fg}`,
                  fontFamily: S.mono,
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  display: "inline-block",
                }}
              >
                {s.label} — {s.handle}
              </a>
            ))}
          </div>
        </section>

        {/* ── FOOTER ────────────────────────────────────────────────── */}
        <footer
          style={{
            padding: "28px 48px",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
            ...label,
          }}
        >
          <span>© 2026 Лямин Владислав · личная студия</span>
          <span>Fraunces · Inter · JetBrains Mono</span>
          <span>v.03 / studio</span>
        </footer>
      </div>
    </div>
  );
}
