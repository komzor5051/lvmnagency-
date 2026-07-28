"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const NICHES = [
  "Юридическая компания",
  "Клиника / медцентр",
  "E-commerce / интернет-магазин",
  "Ресторан / HoReCa",
  "Онлайн-образование",
  "Логистика / доставка",
  "Салон красоты / студия",
  "Строительство / инженерные системы",
  "IT-компания / стартап",
  "Другое",
];

const TEAM_SIZES = [
  "1–3 человека",
  "4–10 человек",
  "11–30 человек",
  "30+ человек",
];

const ROUTINES = [
  "Ответы на однотипные вопросы клиентов",
  "Ручной ввод данных в CRM / таблицы",
  "Обработка заявок и заказов",
  "Составление отчётов",
  "Запись клиентов / бронирование",
  "Рассылки и уведомления",
  "Согласование документов",
  "Мониторинг цен / конкурентов",
  "Обработка входящих звонков / сообщений",
  "Управление закупками / складом",
];

const TOOLS = [
  "Excel / Google Таблицы",
  "WhatsApp",
  "Telegram",
  "1C",
  "AmoCRM / Bitrix24",
  "iiko / R-Keeper",
  "Tilda / сайт",
  "Почта (email)",
  "Телефония (Мегафон, Mango и т.д.)",
  "Ничего из перечисленного",
];

const TRIED_AI = [
  "Нет, не пробовали",
  "Потыкали ChatGPT, но не внедрили",
  "Есть какие-то автоматизации",
  "Активно используем AI",
];

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Automation {
  title: string;
  description: string;
  timeSaved: string;
  complexity: "simple" | "medium" | "complex";
  priority: number;
}

interface AuditResult {
  summary: string;
  automations: Automation[];
  totalTimeSaved: string;
  totalMoneySaved: string;
  firstStep: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AuditPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState("");

  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);

  // Step transition: anime.js vertical curtain (clip-path) on step change.
  // Reduced motion -> instant swap (no animation).
  useEffect(() => {
    const el = stageRef.current;
    if (!el || reduced) return;
    animate(el, {
      clipPath: ["inset(0 0 100% 0)", "inset(0 0 0% 0)"],
      opacity: [0, 1],
      duration: 500,
      ease: "outQuart",
    });
  }, [step, reduced]);

  // Form state
  const [niche, setNiche] = useState("");
  const [customNiche, setCustomNiche] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [routines, setRoutines] = useState<string[]>([]);
  const [tools, setTools] = useState<string[]>([]);
  const [biggestPain, setBiggestPain] = useState("");
  const [triedAI, setTriedAI] = useState("");
  const [telegram, setTelegram] = useState("");

  const toggleItem = (
    list: string[],
    setList: (v: string[]) => void,
    item: string
  ) => {
    setList(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item]
    );
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return niche !== "" && (niche !== "Другое" || customNiche.trim() !== "");
      case 1:
        return teamSize !== "";
      case 2:
        return routines.length > 0;
      case 3:
        return tools.length > 0;
      case 4:
        return biggestPain.trim().length > 10;
      case 5:
        return triedAI !== "";
      case 6:
        return telegram.trim().length >= 2;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche: niche === "Другое" ? customNiche : niche,
          teamSize,
          routines,
          tools,
          biggestPain,
          triedAI,
          telegram: telegram.trim(),
        }),
      });

      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch {
      setError("Что-то пошло не так. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const complexityLabel = (c: string) => {
    switch (c) {
      case "simple":
        return "3–5 дней";
      case "medium":
        return "1–2 недели";
      case "complex":
        return "2–4 недели";
      default:
        return c;
    }
  };

  const complexityColor = (c: string) => {
    switch (c) {
      case "simple":
        return "var(--emerald)";
      case "medium":
        return "var(--amber)";
      case "complex":
        return "var(--color-ink)";
      default:
        return "var(--text-2)";
    }
  };

  const TOTAL_STEPS = 7;
  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  /* ---------------------------------------------------------------- */
  /*  Results view                                                     */
  /* ---------------------------------------------------------------- */

  if (result) {
    return (
      <div className="audit-page">
        <div className="audit-container">
          <div className="audit-result">
            <div className="audit-result-header">
              <span className="audit-label">Ваш AI-аудит готов</span>
              <h1>Что можно автоматизировать в вашем бизнесе</h1>
              <p className="audit-summary">{result.summary}</p>
            </div>

            <div className="audit-stats-row">
              <div className="audit-stat">
                <span className="audit-stat-value">
                  {result.totalTimeSaved}
                </span>
                <span className="audit-stat-label">экономия времени</span>
              </div>
              <div className="audit-stat">
                <span className="audit-stat-value">
                  {result.totalMoneySaved}
                </span>
                <span className="audit-stat-label">экономия в месяц</span>
              </div>
              <div className="audit-stat">
                <span className="audit-stat-value">
                  {result.automations.length}
                </span>
                <span className="audit-stat-label">автоматизаций</span>
              </div>
            </div>

            <div className="audit-automations">
              {result.automations
                .sort((a, b) => a.priority - b.priority)
                .map((auto, i) => (
                  <div key={i} className="audit-auto-card">
                    <div className="audit-auto-head">
                      <span className="audit-auto-priority">#{i + 1}</span>
                      <h3>{auto.title}</h3>
                    </div>
                    <p>{auto.description}</p>
                    <div className="audit-auto-meta">
                      <span className="audit-auto-time">
                        {auto.timeSaved} экономии
                      </span>
                      <span
                        className="audit-auto-complexity"
                        style={{ color: complexityColor(auto.complexity) }}
                      >
                        {complexityLabel(auto.complexity)}
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            <div className="audit-first-step">
              <h3>С чего начать</h3>
              <p>{result.firstStep}</p>
            </div>

            <div className="audit-cta-block">
              <h3>Хотите разобраться детально?</h3>
              <p>
                Это автоматический анализ — он показывает направления. Полный AI-аудит занимает две недели и включает встречи, карту процессов и план внедрения с оценкой окупаемости по каждому шагу. Напишите в Telegram — обсудим, подходит ли формат для вашей ситуации. 30 минут, без обязательств.
              </p>
              <a
                href="https://telegram.me/lyaminvl?text=%D0%9F%D1%80%D0%BE%D1%88%D1%91%D0%BB+AI-%D0%B0%D1%83%D0%B4%D0%B8%D1%82%2C+%D1%85%D0%BE%D1%87%D1%83+%D0%BE%D0%B1%D1%81%D1%83%D0%B4%D0%B8%D1%82%D1%8C+%D0%BF%D0%BE%D0%BB%D0%BD%D1%8B%D0%B9+%D0%B0%D1%83%D0%B4%D0%B8%D1%82"
                target="_blank"
                rel="noopener noreferrer"
                className="audit-cta-btn"
              >
                Обсудить полный аудит
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Loading view                                                     */
  /* ---------------------------------------------------------------- */

  if (loading) {
    return (
      <div className="audit-page">
        <div className="audit-container">
          <div className="audit-loading">
            <div className="audit-spinner" />
            <h2>Разбираю ваши ответы</h2>
            <p>AI ищет в ваших процессах места, где автоматизация окупится. Обычно это занимает 10–15 секунд.</p>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Form steps                                                       */
  /* ---------------------------------------------------------------- */

  return (
    <div className="audit-page">
      <div className="audit-container audit-container--stage">
        <div
          className="audit-progress"
          role="progressbar"
          aria-label="Шаг анкеты"
          aria-valuemin={1}
          aria-valuemax={7}
          aria-valuenow={Math.min(step + 1, 7)}
        >
          <div
            className="audit-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="audit-step" ref={stageRef}>
          {step === 0 && (
            <>
              <span className="audit-step-num">1 из 7</span>
              <h2>В какой нише работает ваш бизнес?</h2>
              <div className="audit-options">
                {NICHES.map((n) => (
                  <button
                    key={n}
                    className={`audit-option ${niche === n ? "selected" : ""}`}
                    aria-pressed={niche === n}
                    onClick={() => setNiche(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
              {niche === "Другое" && (
                <input
                  type="text"
                  className="audit-input"
                  placeholder="Опишите вашу нишу"
                  value={customNiche}
                  onChange={(e) => setCustomNiche(e.target.value)}
                  autoFocus
                />
              )}
            </>
          )}

          {step === 1 && (
            <>
              <span className="audit-step-num">2 из 7</span>
              <h2>Сколько человек в команде?</h2>
              <div className="audit-options">
                {TEAM_SIZES.map((s) => (
                  <button
                    key={s}
                    className={`audit-option ${teamSize === s ? "selected" : ""}`}
                    aria-pressed={teamSize === s}
                    onClick={() => setTeamSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <span className="audit-step-num">3 из 7</span>
              <h2>Какие задачи отнимают больше всего времени?</h2>
              <p className="audit-hint">Выберите все подходящие</p>
              <div className="audit-options multi">
                {ROUTINES.map((r) => (
                  <button
                    key={r}
                    className={`audit-option ${routines.includes(r) ? "selected" : ""}`}
                    aria-pressed={routines.includes(r)}
                    onClick={() => toggleItem(routines, setRoutines, r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <span className="audit-step-num">4 из 7</span>
              <h2>Какие инструменты используете?</h2>
              <p className="audit-hint">Выберите все подходящие</p>
              <div className="audit-options multi">
                {TOOLS.map((t) => (
                  <button
                    key={t}
                    className={`audit-option ${tools.includes(t) ? "selected" : ""}`}
                    aria-pressed={tools.includes(t)}
                    onClick={() => toggleItem(tools, setTools, t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <span className="audit-step-num">5 из 7</span>
              <h2>Что болит больше всего?</h2>
              <p className="audit-hint">
                Опишите главную проблему, которую хотите решить
              </p>
              <textarea
                className="audit-textarea"
                placeholder="Например: менеджеры тратят полдня на ответы в WhatsApp, а новые заявки теряются…"
                value={biggestPain}
                onChange={(e) => setBiggestPain(e.target.value)}
                rows={4}
                autoFocus
              />
            </>
          )}

          {step === 5 && (
            <>
              <span className="audit-step-num">6 из 7</span>
              <h2>Пробовали использовать AI?</h2>
              <div className="audit-options">
                {TRIED_AI.map((t) => (
                  <button
                    key={t}
                    className={`audit-option ${triedAI === t ? "selected" : ""}`}
                    aria-pressed={triedAI === t}
                    onClick={() => setTriedAI(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 6 && (
            <>
              <span className="audit-step-num">7 из 7</span>
              <h2>Куда прислать результат?</h2>
              <p className="audit-hint">
                Укажите ваш Telegram — пришлю подробный разбор и свяжусь, если будут вопросы
              </p>
              <input
                type="text"
                className="audit-input"
                placeholder="@username или номер телефона"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                autoFocus
              />
            </>
          )}

          {error && <p className="audit-error">{error}</p>}

          <div className="audit-nav-buttons">
            {step > 0 && (
              <button
                className="audit-btn-back"
                onClick={() => setStep(step - 1)}
              >
                Назад
              </button>
            )}
            <button
              className="audit-btn-next"
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {step === 6 ? "Получить аудит" : "Далее"}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
