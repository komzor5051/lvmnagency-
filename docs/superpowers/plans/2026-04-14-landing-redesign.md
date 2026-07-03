# Landing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the chat-only homepage with a full landing page featuring an animated pill switcher between "Бизнесу" and "Сотрудникам" directions, plus a new `/employees` page.

**Architecture:** `app/page.tsx` becomes a client component holding `activeTab` state, rendering composed section components. The existing chat logic is extracted into `ChatSection`. CSS terracotta tokens are added alongside existing teal (so audit/blog pages are unaffected). Tab switching drives both panel visibility and the shared dark CTA block.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS v4, shadcn/ui (base-nova), Inter font (already loaded as `--font-inter`), CSS cubic-bezier transitions for pill animation.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `app/globals.css` | Add terracotta CSS variables (`--terra-*`) and section styles |
| Modify | `app/layout.tsx` | Update metadata title/description |
| Rewrite | `app/page.tsx` | Landing page composition (client, holds `activeTab` state) |
| Create | `components/landing/LandingNav.tsx` | Sticky top navigation |
| Create | `components/landing/HeroSection.tsx` | Badge + H1 + subtitle + pill switcher |
| Create | `components/landing/PillSwitcher.tsx` | Animated pill toggle component |
| Create | `components/landing/ProofBar.tsx` | 4 proof stats row |
| Create | `components/landing/BizPanel.tsx` | "Бизнесу" tab: pitch + process + cases |
| Create | `components/landing/EmpPanel.tsx` | "Сотрудникам" tab: pitch + process + for-whom |
| Create | `components/landing/CtaSection.tsx` | Dark CTA block, props-driven content |
| Create | `components/landing/ChatSection.tsx` | Inline expandable chat (extracted from old page.tsx) |
| Create | `components/landing/LandingFooter.tsx` | Footer |
| Create | `app/employees/page.tsx` | Standalone employees landing page |

---

## Task 1: Add terracotta design tokens + all landing CSS

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add terracotta variables inside `:root` block**

Find the line `--amber: #D97706;` in `:root` and add after it:

```css
  /* Terracotta accent — landing page only (audit/blog keep --accent teal) */
  --terra: #c2410c;
  --terra-hover: #9a3412;
  --terra-light: #fff7ed;
  --terra-border: #fed7aa;
  --terra-dark-text: #7c2d12;
  --terra-dark-title: #9a3412;
```

- [ ] **Step 2: Append all landing CSS at the end of `globals.css`**

```css
/* =============================================================================
   LANDING — New redesign (l-* prefix)
   ============================================================================= */

/* Nav */
.l-nav {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 40px; height: 56px;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  position: sticky; top: 0; z-index: 100;
  font-family: var(--font-inter), Inter, sans-serif;
}
.l-nav-links { display: flex; gap: 24px; align-items: center; }
.l-nav-link { font-size: 13px; color: var(--text-3); text-decoration: none; transition: color 0.15s; }
.l-nav-link:hover { color: var(--text); }
.l-nav-logo { font-size: 15px; font-weight: 700; letter-spacing: 0.06em; color: var(--text); }
.l-nav-cta { background: var(--terra); color: #fff; font-size: 12px; font-weight: 600; padding: 7px 16px; border-radius: 6px; text-decoration: none; transition: background 0.15s; }
.l-nav-cta:hover { background: var(--terra-hover); }

/* Hero */
.l-hero {
  background: var(--surface); border-bottom: 1px solid var(--border);
  padding: 80px 40px 64px; text-align: center;
  font-family: var(--font-inter), Inter, sans-serif;
}
.l-hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--terra); background: var(--terra-light); border: 1px solid var(--terra-border);
  border-radius: 999px; padding: 5px 14px; margin-bottom: 28px;
  text-decoration: none; transition: background 0.15s;
}
.l-hero-badge:hover { background: #ffedd5; }
.l-hero-badge-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--terra); animation: terra-pulse 2s infinite; flex-shrink: 0;
}
@keyframes terra-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
.l-hero-h1 {
  font-size: 52px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.08;
  color: var(--text); margin-bottom: 20px;
  font-family: var(--font-inter), Inter, sans-serif;
}
.l-hero-h1 em { font-style: normal; color: var(--terra); }
.l-hero-sub { font-size: 17px; color: var(--text-2); max-width: 520px; margin: 0 auto 40px; line-height: 1.65; }
.l-hero-sub strong { color: var(--text); font-weight: 600; }
.l-hero-switcher { display: flex; justify-content: center; }

/* Pill Switcher */
.pill-switcher {
  display: inline-flex; background: #f5f5f4;
  border: 1px solid var(--border); border-radius: 12px; padding: 4px; position: relative;
}
.pill-switcher-pill {
  position: absolute; top: 4px; left: 4px; height: calc(100% - 8px);
  border-radius: 9px; background: var(--surface);
  box-shadow: 0 1px 4px rgba(28,25,23,0.12), 0 1px 2px rgba(28,25,23,0.08);
  transition: transform 0.24s cubic-bezier(0.4,0,0.2,1), width 0.24s cubic-bezier(0.4,0,0.2,1);
  pointer-events: none;
}
.pill-switcher-btn {
  position: relative; z-index: 1; padding: 10px 28px; font-size: 14px; font-weight: 500;
  color: var(--text-3); border: none; background: transparent; border-radius: 9px;
  cursor: pointer; transition: color 0.18s; white-space: nowrap; user-select: none;
  font-family: var(--font-inter), Inter, sans-serif;
}
.pill-switcher-btn.active { color: var(--text); font-weight: 600; }

/* Proof Bar */
.l-proof-bar {
  background: var(--surface); border-bottom: 1px solid var(--border);
  padding: 20px 40px; display: flex; align-items: center; justify-content: center; gap: 48px;
  font-family: var(--font-inter), Inter, sans-serif;
}
.l-proof-item { text-align: center; }
.l-proof-num { font-size: 22px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; }
.l-proof-label { font-size: 11px; color: var(--text-3); margin-top: 2px; }
.l-proof-sep { width: 1px; height: 32px; background: var(--border); flex-shrink: 0; }

/* Tab panel */
.l-tab-panel { font-family: var(--font-inter), Inter, sans-serif; }

/* Eyebrow */
.l-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--terra); margin-bottom: 12px; }

/* Pitch */
.l-pitch {
  padding: 72px 40px; max-width: 1100px; margin: 0 auto;
  display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start;
}
.l-pitch-title { font-size: 28px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.2; color: var(--text); margin-bottom: 14px; }
.l-pitch-desc { font-size: 15px; color: var(--text-2); line-height: 1.72; margin-bottom: 24px; }
.l-method-box { background: var(--terra-light); border: 1px solid var(--terra-border); border-radius: 10px; padding: 18px 20px; }
.l-method-title { font-size: 12px; font-weight: 700; color: var(--terra-dark-title); margin-bottom: 6px; }
.l-method-text { font-size: 13px; color: var(--terra-dark-text); line-height: 1.65; }

/* Service cards */
.l-service-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.l-service-card {
  background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 18px;
  box-shadow: var(--sh-xs); transition: box-shadow 0.15s, border-color 0.15s;
}
.l-service-card:hover { box-shadow: var(--sh-md); border-color: #d6d3d1; }
.l-card-label { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--terra); margin-bottom: 6px; }
.l-card-text { font-size: 13px; color: #44403c; line-height: 1.6; }
.l-card-full { grid-column: span 2; }

/* Process */
.l-process-section {
  background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
  padding: 72px 40px;
}
.l-section-header { text-align: center; max-width: 560px; margin: 0 auto 52px; }
.l-section-title { font-size: 28px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.2; color: var(--text); margin-bottom: 10px; }
.l-section-subtitle { font-size: 15px; color: var(--text-2); line-height: 1.6; }
.l-steps {
  max-width: 900px; margin: 0 auto;
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; position: relative;
}
.l-steps::before {
  content: ''; position: absolute; top: 20px; left: calc(16.66% + 8px); right: calc(16.66% + 8px);
  height: 1px; background: var(--border);
}
.l-step { text-align: center; padding: 0 24px; }
.l-step-num {
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--terra-light); border: 1px solid var(--terra-border);
  color: var(--terra); font-size: 14px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;
}
.l-step-title { font-size: 15px; font-weight: 600; color: var(--text); margin-bottom: 8px; }
.l-step-desc { font-size: 13px; color: var(--text-2); line-height: 1.6; }

/* Cases */
.l-cases-section { padding: 72px 40px; max-width: 1100px; margin: 0 auto; }
.l-cases-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 48px; }
.l-case-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; box-shadow: var(--sh-xs); }
.l-case-niche { font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-3); margin-bottom: 10px; }
.l-case-result { font-size: 28px; font-weight: 800; color: var(--terra); letter-spacing: -0.02em; line-height: 1; margin-bottom: 6px; }
.l-case-result-sm { font-size: 18px; font-weight: 800; color: var(--terra); letter-spacing: -0.02em; line-height: 1.2; margin-bottom: 6px; }
.l-case-desc { font-size: 13px; color: var(--text-2); line-height: 1.6; }

/* Panel CTAs */
.l-panel-ctas { display: flex; gap: 12px; padding: 0 40px 72px; max-width: 1100px; margin: 0 auto; flex-wrap: wrap; }
.l-btn-primary {
  background: var(--terra); color: #fff; font-size: 13px; font-weight: 600;
  padding: 11px 22px; border-radius: 7px; border: none; cursor: pointer;
  display: inline-flex; align-items: center; gap: 7px; text-decoration: none; transition: background 0.15s;
}
.l-btn-primary:hover { background: var(--terra-hover); }
.l-btn-outline {
  background: var(--surface); color: var(--text); font-size: 13px; font-weight: 500;
  padding: 11px 22px; border-radius: 7px; border: 1px solid var(--border);
  cursor: pointer; text-decoration: none; transition: border-color 0.15s;
}
.l-btn-outline:hover { border-color: #a8a29e; }

/* CTA Section */
.l-cta-section { background: var(--text); padding: 80px 40px; text-align: center; font-family: var(--font-inter), Inter, sans-serif; }
.l-cta-label { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #78716c; margin-bottom: 16px; }
.l-cta-title { font-size: 34px; font-weight: 800; letter-spacing: -0.025em; line-height: 1.12; color: #fff; margin-bottom: 14px; }
.l-cta-sub { font-size: 16px; color: #a8a29e; line-height: 1.6; max-width: 480px; margin: 0 auto 36px; }
.l-cta-buttons { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.l-cta-btn-primary {
  background: var(--terra); color: #fff; font-size: 14px; font-weight: 600;
  padding: 13px 28px; border-radius: 8px; border: none; cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px; text-decoration: none; transition: background 0.15s;
}
.l-cta-btn-primary:hover { background: var(--terra-hover); }
.l-cta-btn-ghost {
  background: transparent; color: #fff; font-size: 14px; font-weight: 500;
  padding: 13px 28px; border-radius: 8px; border: 1px solid #44403c;
  cursor: pointer; text-decoration: none; transition: border-color 0.15s;
}
.l-cta-btn-ghost:hover { border-color: #78716c; }

/* Chat (landing embedded) */
.landing-chat-section { background: var(--surface); border-top: 1px solid var(--border); padding: 40px 32px; }
.landing-chat-inner { max-width: 680px; margin: 0 auto; }
.landing-chat-label { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-3); margin-bottom: 16px; font-family: var(--font-inter), Inter, sans-serif; }
.landing-chat-messages { max-height: 400px; overflow-y: auto; margin-bottom: 16px; }
.landing-chat-input-row {
  display: flex; gap: 8px; align-items: flex-end;
  background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 10px 14px;
}

/* Footer */
.l-footer {
  border-top: 1px solid var(--border); padding: 28px 40px;
  display: flex; align-items: center; justify-content: space-between;
  background: var(--surface); font-family: var(--font-inter), Inter, sans-serif;
}
.l-footer-logo { font-size: 14px; font-weight: 700; letter-spacing: 0.06em; color: var(--text); }
.l-footer-links { display: flex; gap: 24px; }
.l-footer-link { font-size: 12px; color: var(--text-3); text-decoration: none; transition: color 0.15s; }
.l-footer-link:hover { color: var(--text); }
.l-footer-copy { font-size: 12px; color: var(--text-3); }
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -20
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "feat: add terracotta tokens and landing CSS (l-* prefix)"
```

---

## Task 2: ChatSection component

**Files:**
- Create: `components/landing/ChatSection.tsx`

- [ ] **Step 1: Create `components/landing/ChatSection.tsx`**

```tsx
"use client";

import { useState, useRef, useEffect, useMemo } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const GREETING = `Привет! Я AI-ассистент Влада Лямина. Влад — AI-стратег для агентств и стартапов: помогает понять, где AI даст реальный ROI, и выстраивает систему внедрения.

Спросите что угодно — расскажу о подходе, кейсах, услугах. Или выберите вопрос ниже.`;

const QUICK_QUESTIONS = [
  "Чем Влад отличается от обычного подрядчика?",
  "Что такое AI-аудит?",
  "Покажи кейсы",
  "Для кого это подходит?",
  "Сколько стоит?",
  "Хочу записаться на разбор",
];

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\))/g;
  const allMatches = [...text.matchAll(regex)];
  let lastIndex = 0;

  for (const match of allMatches) {
    if (match.index! > lastIndex) parts.push(text.slice(lastIndex, match.index!));
    if (match[2]) {
      parts.push(<strong key={match.index}>{match[2]}</strong>);
    } else if (match[3] && match[4]) {
      parts.push(
        <a key={match.index} href={match[4]} target="_blank" rel="noopener noreferrer">
          {match[3]}
        </a>
      );
    }
    lastIndex = match.index! + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

function SafeMarkdown({ text }: { text: string }) {
  const elements = useMemo(() => {
    const lines = text.split("\n");
    const result: React.ReactNode[] = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith("- ")) {
        const listItems: string[] = [];
        let j = i;
        while (j < lines.length && lines[j].startsWith("- ")) {
          listItems.push(lines[j].slice(2));
          j++;
        }
        result.push(
          <ul key={i}>
            {listItems.map((item, idx) => <li key={idx}>{renderInline(item)}</li>)}
          </ul>
        );
        i = j - 1;
        continue;
      }
      if (line.trim() === "") { result.push(<br key={i} />); continue; }
      result.push(<p key={i}>{renderInline(line)}</p>);
    }
    return result;
  }, [text]);
  return <>{elements}</>;
}

export function ChatSection() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsStreaming(true);
    setMessages([...newMessages, { role: "assistant", content: "" }]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages.filter((_, i) => i > 0) }),
      });
      if (!res.ok) throw new Error("API error");
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.token) {
              fullText += parsed.token;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: fullText };
                return updated;
              });
            }
          } catch { /* skip malformed SSE line */ }
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Что-то пошло не так. Попробуйте ещё раз или напишите Владу напрямую в Telegram — @lyaminvl.",
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <section className="landing-chat-section">
      <div className="landing-chat-inner">
        <p className="landing-chat-label">Или спросите напрямую</p>
        <div className="landing-chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-msg ${msg.role}`}>
              {msg.role === "assistant" && <div className="chat-avatar">V</div>}
              <div className={`chat-bubble ${msg.role}`}>
                {msg.role === "assistant" ? (
                  <>
                    <SafeMarkdown text={msg.content} />
                    {isStreaming && i === messages.length - 1 && <span className="chat-cursor" />}
                  </>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          {messages.length === 1 && (
            <div className="chat-quick">
              {QUICK_QUESTIONS.map((q) => (
                <button key={q} className="chat-quick-btn" onClick={() => sendMessage(q)}>
                  {q}
                </button>
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="landing-chat-input-row">
          <textarea
            ref={inputRef}
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Спросите о подходе, кейсах, услугах..."
            rows={1}
            disabled={isStreaming}
          />
          <button
            className="chat-send"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isStreaming}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
        <p className="chat-footer-note">
          <a href="https://t.me/lyaminvl" target="_blank" rel="noopener noreferrer">Telegram @lyaminvl</a>
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
git add components/landing/ChatSection.tsx
git commit -m "feat: extract ChatSection component"
```

---

## Task 3: PillSwitcher component

**Files:**
- Create: `components/landing/PillSwitcher.tsx`

- [ ] **Step 1: Create `components/landing/PillSwitcher.tsx`**

```tsx
"use client";

import { useRef, useLayoutEffect, useState } from "react";

export type TabId = "biz" | "emp";

interface PillSwitcherProps {
  value: TabId;
  onChange: (value: TabId) => void;
}

const TABS: { id: TabId; label: string }[] = [
  { id: "biz", label: "Бизнесу" },
  { id: "emp", label: "Сотрудникам" },
];

export function PillSwitcher({ value, onChange }: PillSwitcherProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState({ width: 0, transform: "translateX(0px)" });

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const activeBtn = container.querySelector<HTMLButtonElement>(`[data-tabid="${value}"]`);
    if (!activeBtn) return;
    setPillStyle({
      width: activeBtn.offsetWidth,
      transform: `translateX(${activeBtn.offsetLeft}px)`,
    });
  }, [value]);

  return (
    <div className="pill-switcher" ref={containerRef}>
      <div
        className="pill-switcher-pill"
        style={{ width: pillStyle.width, transform: pillStyle.transform }}
      />
      {TABS.map((tab) => (
        <button
          key={tab.id}
          data-tabid={tab.id}
          className={`pill-switcher-btn${value === tab.id ? " active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
git add components/landing/PillSwitcher.tsx
git commit -m "feat: add animated PillSwitcher component"
```

---

## Task 4: LandingNav + HeroSection + ProofBar

**Files:**
- Create: `components/landing/LandingNav.tsx`
- Create: `components/landing/HeroSection.tsx`
- Create: `components/landing/ProofBar.tsx`

- [ ] **Step 1: Create `components/landing/LandingNav.tsx`**

```tsx
import Link from "next/link";

export function LandingNav() {
  return (
    <nav className="l-nav">
      <div className="l-nav-links">
        <Link href="/blog" className="l-nav-link">Блог</Link>
        <Link href="/audit" className="l-nav-link">AI-аудит</Link>
      </div>
      <span className="l-nav-logo">LVMN</span>
      <div className="l-nav-links">
        <a href="https://swipely.ru" target="_blank" rel="noopener noreferrer" className="l-nav-link">Swipely</a>
        <a href="https://vsolo.tech" target="_blank" rel="noopener noreferrer" className="l-nav-link">Vsolo</a>
        <a href="https://t.me/lyaminvl" target="_blank" rel="noopener noreferrer" className="l-nav-cta">
          Написать в Telegram
        </a>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Create `components/landing/HeroSection.tsx`**

```tsx
import type { TabId } from "./PillSwitcher";
import { PillSwitcher } from "./PillSwitcher";

interface HeroSectionProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function HeroSection({ activeTab, onTabChange }: HeroSectionProps) {
  return (
    <section className="l-hero">
      <a href="https://t.me/lyaminvl" target="_blank" rel="noopener noreferrer" className="l-hero-badge">
        <span className="l-hero-badge-dot" />
        2 слота в мае · Написать в Telegram
      </a>
      <h1 className="l-hero-h1">
        AI-first специалист<br />
        для <em>бизнеса и карьеры</em>
      </h1>
      <p className="l-hero-sub">
        <strong>Без агентства, без субподрядчиков — работаю напрямую.</strong>{" "}
        Помогаю бизнесу автоматизировать процессы и сотрудникам опережать коллег с правильными инструментами.
      </p>
      <div className="l-hero-switcher">
        <PillSwitcher value={activeTab} onChange={onTabChange} />
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `components/landing/ProofBar.tsx`**

```tsx
const STATS = [
  { num: "15+", label: "автоматизаций запущено" },
  { num: "Соло", label: "без агентства и субподрядчиков" },
  { num: "40 ч/мес", label: "экономия у клиентов" },
  { num: "3–5×", label: "ускорение рутинных задач" },
] as const;

export function ProofBar() {
  return (
    <div className="l-proof-bar">
      {STATS.map((s, i) => (
        <div key={s.num} style={{ display: "contents" }}>
          <div className="l-proof-item">
            <div className="l-proof-num">{s.num}</div>
            <div className="l-proof-label">{s.label}</div>
          </div>
          {i < STATS.length - 1 && <div className="l-proof-sep" />}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build 2>&1 | tail -20
```

- [ ] **Step 5: Commit**

```bash
git add components/landing/LandingNav.tsx components/landing/HeroSection.tsx components/landing/ProofBar.tsx
git commit -m "feat: add LandingNav, HeroSection, ProofBar"
```

---

## Task 5: BizPanel

**Files:**
- Create: `components/landing/BizPanel.tsx`

- [ ] **Step 1: Create `components/landing/BizPanel.tsx`**

```tsx
import Link from "next/link";

const SERVICE_CARDS = [
  { label: "AI-аудит", text: "Карта процессов, roadmap на 90 дней, оценка ROI каждой автоматизации" },
  { label: "Стратегия", text: "Где AI даст реальный результат, а где только потратит бюджет" },
  { label: "Внедрение", text: "Строю и запускаю под ключ: n8n, Claude, Telegram, CRM — любой стек" },
  { label: "Сопровождение", text: "Поддержка и развитие системы после запуска" },
] as const;

const PROCESS_STEPS = [
  { num: "1", title: "AI-аудит", desc: "Анализирую процессы, нахожу где теряется время и деньги, расставляю приоритеты по ROI" },
  { num: "2", title: "Внедрение", desc: "Строю и запускаю автоматизацию под ключ. Без лишних совещаний — рабочий результат" },
  { num: "3", title: "Система работает", desc: "Передаю управление, обучаю команду и остаюсь на связи для поддержки" },
] as const;

const CASES = [
  { niche: "Ресторанная сеть", result: "40 ч/мес", desc: "Автоматизация закупок и перемещений через Telegram-бот + интеграция с iiko POS. Менеджеры перестали вручную вносить заявки." },
  { niche: "Онлайн-образование", result: "80% задач", desc: "AI-контент фабрика: автоматическая генерация и публикация статей. Редактор занимается стратегией, не рутиной." },
  { niche: "Сервисный бизнес", result: "−70% обращений", desc: "AI-бот поддержки с базой знаний на pgvector. Закрывает 70% вопросов без участия операторов." },
] as const;

export function BizPanel() {
  return (
    <div className="l-tab-panel">
      <div className="l-pitch">
        <div className="l-pitch-left">
          <p className="l-eyebrow">Для владельцев бизнеса</p>
          <h2 className="l-pitch-title">Не ChatGPT. Не консалтинг ради консалтинга. Автоматизация, которая окупается.</h2>
          <p className="l-pitch-desc">Большинство компаний теряют 30–50% времени сотрудников на задачи, которые AI решает автоматически. Нахожу эти точки и запускаю решения — один, без бюрократии и месяцев согласований.</p>
          <div className="l-method-box">
            <p className="l-method-title">Подход: анализ → приоритеты → результат</p>
            <p className="l-method-text">Анализирую процессы, нахожу где AI даёт реальный ROI, внедряю. Без лишних презентаций и совещаний — фокус на том, что работает.</p>
          </div>
        </div>
        <div className="l-pitch-right">
          <div className="l-service-cards">
            {SERVICE_CARDS.map((c) => (
              <div key={c.label} className="l-service-card">
                <p className="l-card-label">{c.label}</p>
                <p className="l-card-text">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="l-process-section">
        <div className="l-section-header">
          <p className="l-eyebrow">Как это работает</p>
          <h2 className="l-section-title">От первого контакта до работающей автоматизации</h2>
          <p className="l-section-subtitle">Простой процесс без лишних шагов</p>
        </div>
        <div className="l-steps">
          {PROCESS_STEPS.map((s) => (
            <div key={s.num} className="l-step">
              <div className="l-step-num">{s.num}</div>
              <p className="l-step-title">{s.title}</p>
              <p className="l-step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="l-cases-section">
        <div className="l-section-header">
          <p className="l-eyebrow">Кейсы</p>
          <h2 className="l-section-title">Реальные результаты</h2>
          <p className="l-section-subtitle">Конкретные числа по реальным проектам</p>
        </div>
        <div className="l-cases-grid">
          {CASES.map((c) => (
            <div key={c.niche} className="l-case-card">
              <p className="l-case-niche">{c.niche}</p>
              <p className="l-case-result">{c.result}</p>
              <p className="l-case-desc">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="l-panel-ctas">
        <Link href="/audit" className="l-btn-primary">
          Пройти бесплатный AI-аудит
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
        <a href="https://t.me/lyaminvl" target="_blank" rel="noopener noreferrer" className="l-btn-outline">
          Написать в Telegram
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
git add components/landing/BizPanel.tsx
git commit -m "feat: add BizPanel with pitch, process, cases"
```

---

## Task 6: EmpPanel

**Files:**
- Create: `components/landing/EmpPanel.tsx`

- [ ] **Step 1: Create `components/landing/EmpPanel.tsx`**

```tsx
const PROCESS_STEPS = [
  { num: "1", title: "Диагностика задач", desc: "Разбираем чем вы занимаетесь, что занимает больше всего времени и где AI даст наибольший эффект" },
  { num: "2", title: "Практика на реальных задачах", desc: "Осваиваем конкретные инструменты на ваших задачах. После сессии — применяете сразу" },
  { num: "3", title: "Система в работе", desc: "Готовый набор инструментов и привычка их использовать. Остаюсь на связи для вопросов" },
] as const;

const FOR_WHOM = [
  { niche: "Маркетинг и контент", result: "Тексты, идеи, анализ рынка", desc: "Генерация контента, анализ конкурентов, написание брифов — в разы быстрее" },
  { niche: "Юристы и финансисты", result: "Документы, анализ, резюме", desc: "Составление и анализ договоров, подготовка отчётов, быстрый поиск по документам" },
  { niche: "Менеджеры", result: "Презентации, планирование", desc: "Подготовка презентаций, писем, протоколов. Структурирование задач и приоритизация" },
] as const;

export function EmpPanel() {
  return (
    <div className="l-tab-panel">
      <div className="l-pitch">
        <div className="l-pitch-left">
          <p className="l-eyebrow">Для сотрудников и специалистов</p>
          <h2 className="l-pitch-title">Коллега с AI делает за день то, что вы — за неделю.</h2>
          <p className="l-pitch-desc">Это не страшилка. Маркетологи, юристы, бухгалтеры, менеджеры — те, кто освоил AI первым, уже стали незаменимыми. Помогу разобраться конкретно под вашу работу, без воды и лишних терминов.</p>
          <div className="l-method-box">
            <p className="l-method-title">Формат "под вашу профессию"</p>
            <p className="l-method-text">Никаких курсов "введение в AI". На первой сессии выясняем ваши задачи — на второй вы уже применяете конкретные инструменты в работе.</p>
          </div>
        </div>
        <div className="l-pitch-right">
          <div className="l-service-cards">
            <div className="l-service-card l-card-full">
              <p className="l-card-label">Консультация 1:1</p>
              <p className="l-card-text">60 минут — разбираем AI-инструменты под вашу профессию и конкретные задачи. После: список инструментов и план внедрения.</p>
            </div>
            <div className="l-service-card l-card-full">
              <p className="l-card-label">Программа обучения</p>
              <p className="l-card-text">3–5 сессий — от первого знакомства до уверенного применения каждый день. Для тех, кто хочет системный подход.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="l-process-section">
        <div className="l-section-header">
          <p className="l-eyebrow">Как это работает</p>
          <h2 className="l-section-title">От нулевого знакомства до реальных результатов</h2>
          <p className="l-section-subtitle">Три шага без лишней теории</p>
        </div>
        <div className="l-steps">
          {PROCESS_STEPS.map((s) => (
            <div key={s.num} className="l-step">
              <div className="l-step-num">{s.num}</div>
              <p className="l-step-title">{s.title}</p>
              <p className="l-step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="l-cases-section">
        <div className="l-section-header">
          <p className="l-eyebrow">Для кого</p>
          <h2 className="l-section-title">Подойдёт, если вы работаете с информацией</h2>
          <p className="l-section-subtitle">Тексты, данные, документы, коммуникация — AI ускорит любую из этих задач</p>
        </div>
        <div className="l-cases-grid">
          {FOR_WHOM.map((c) => (
            <div key={c.niche} className="l-case-card">
              <p className="l-case-niche">{c.niche}</p>
              <p className="l-case-result-sm">{c.result}</p>
              <p className="l-case-desc">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="l-panel-ctas">
        <a href="https://t.me/lyaminvl" target="_blank" rel="noopener noreferrer" className="l-btn-primary">
          Записаться в Telegram
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
        <a href="/employees" className="l-btn-outline">Узнать подробнее</a>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
git add components/landing/EmpPanel.tsx
git commit -m "feat: add EmpPanel with pitch, process, for-whom sections"
```

---

## Task 7: CtaSection + LandingFooter

**Files:**
- Create: `components/landing/CtaSection.tsx`
- Create: `components/landing/LandingFooter.tsx`

- [ ] **Step 1: Create `components/landing/CtaSection.tsx`**

```tsx
import type { TabId } from "./PillSwitcher";
import Link from "next/link";

interface CtaSectionProps {
  activeTab: TabId;
}

const CTA_CONTENT = {
  biz: {
    title: "Узнайте, где AI поможет вашему бизнесу",
    sub: "Пройдите бесплатный AI-аудит или напишите напрямую — 30 минут, без обязательств.",
    primaryLabel: "Пройти бесплатный AI-аудит",
    primaryHref: "/audit",
    isExternalPrimary: false,
    secondaryLabel: "Написать в Telegram",
    secondaryHref: "https://t.me/lyaminvl",
    isExternalSecondary: true,
  },
  emp: {
    title: "Начните опережать коллег уже на этой неделе",
    sub: "Запишитесь на консультацию 1:1 или узнайте подробнее о программе обучения.",
    primaryLabel: "Записаться в Telegram",
    primaryHref: "https://t.me/lyaminvl",
    isExternalPrimary: true,
    secondaryLabel: "Узнать подробнее",
    secondaryHref: "/employees",
    isExternalSecondary: false,
  },
} as const;

export function CtaSection({ activeTab }: CtaSectionProps) {
  const c = CTA_CONTENT[activeTab];
  return (
    <section className="l-cta-section">
      <p className="l-cta-label">Начать</p>
      <h2 className="l-cta-title">{c.title}</h2>
      <p className="l-cta-sub">{c.sub}</p>
      <div className="l-cta-buttons">
        {c.isExternalPrimary ? (
          <a href={c.primaryHref} target="_blank" rel="noopener noreferrer" className="l-cta-btn-primary">
            {c.primaryLabel}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        ) : (
          <Link href={c.primaryHref} className="l-cta-btn-primary">
            {c.primaryLabel}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        )}
        {c.isExternalSecondary ? (
          <a href={c.secondaryHref} target="_blank" rel="noopener noreferrer" className="l-cta-btn-ghost">
            {c.secondaryLabel}
          </a>
        ) : (
          <Link href={c.secondaryHref} className="l-cta-btn-ghost">
            {c.secondaryLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `components/landing/LandingFooter.tsx`**

```tsx
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="l-footer">
      <span className="l-footer-logo">LVMN</span>
      <nav className="l-footer-links">
        <Link href="/blog" className="l-footer-link">Блог</Link>
        <Link href="/audit" className="l-footer-link">AI-аудит</Link>
        <a href="https://swipely.ru" target="_blank" rel="noopener noreferrer" className="l-footer-link">Swipely</a>
        <a href="https://vsolo.tech" target="_blank" rel="noopener noreferrer" className="l-footer-link">Vsolo</a>
        <a href="https://t.me/lyaminvl" target="_blank" rel="noopener noreferrer" className="l-footer-link">@lyaminvl</a>
      </nav>
      <span className="l-footer-copy">Влад Лямин · Новосибирск · 2026</span>
    </footer>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -20
```

- [ ] **Step 4: Commit**

```bash
git add components/landing/CtaSection.tsx components/landing/LandingFooter.tsx
git commit -m "feat: add CtaSection and LandingFooter"
```

---

## Task 8: Compose landing page + update metadata

**Files:**
- Rewrite: `app/page.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Rewrite `app/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import type { TabId } from "@/components/landing/PillSwitcher";
import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProofBar } from "@/components/landing/ProofBar";
import { BizPanel } from "@/components/landing/BizPanel";
import { EmpPanel } from "@/components/landing/EmpPanel";
import { CtaSection } from "@/components/landing/CtaSection";
import { ChatSection } from "@/components/landing/ChatSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<TabId>("biz");

  return (
    <>
      <LandingNav />
      <HeroSection activeTab={activeTab} onTabChange={setActiveTab} />
      <ProofBar />
      {activeTab === "biz" ? <BizPanel /> : <EmpPanel />}
      <CtaSection activeTab={activeTab} />
      <ChatSection />
      <LandingFooter />
    </>
  );
}
```

- [ ] **Step 2: Update metadata in `app/layout.tsx`**

Find the `export const metadata: Metadata = {` block and update only `title.default` and `description`:

```ts
  title: {
    default: "LVMN — AI-консалтинг и обучение",
    template: "%s | LVMN",
  },
  description:
    "Влад Лямин — AI-first специалист. Помогаю бизнесу внедрять AI-автоматизацию и сотрудникам осваивать AI-инструменты. Без агентства, без субподрядчиков — работаю напрямую.",
```

Leave all other metadata fields unchanged.

- [ ] **Step 3: Run dev server and verify visually**

```bash
npm run dev
```

Open http://localhost:3000 and verify:
- Nav sticky with all links
- Hero badge pulses, pill switcher animates
- Proof bar: 4 stats with separators
- "Бизнесу" tab shows pitch grid + process steps + 3 cases + 2 CTAs
- Switch to "Сотрудникам": pitch grid changes, process steps change, for-whom cards appear
- Dark CTA text changes on tab switch
- Chat section shows greeting + quick questions, chat works
- Footer present

Then verify existing routes:
- http://localhost:3000/audit — audit form unchanged
- http://localhost:3000/blog — blog unchanged

- [ ] **Step 4: Verify build**

```bash
npm run build 2>&1 | tail -20
```

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx app/layout.tsx
git commit -m "feat: compose landing page, replace chat-only homepage"
```

---

## Task 9: /employees page

**Files:**
- Create: `app/employees/page.tsx`

- [ ] **Step 1: Create `app/employees/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Обучение AI для сотрудников",
  description:
    "Консультации 1:1 и программа обучения AI-инструментам для специалистов — маркетологов, юристов, менеджеров. Влад Лямин, Новосибирск.",
};

const FORMATS = [
  {
    label: "Консультация 1:1",
    duration: "60 минут",
    desc: "Разбираем AI-инструменты конкретно под вашу профессию и текущие задачи. После сессии получаете список инструментов и пошаговый план внедрения в вашу работу.",
    suits: [
      "Хочу быстро попробовать",
      "Нет времени на долгие курсы",
      "Есть конкретная задача, нужно решение",
    ],
  },
  {
    label: "Программа обучения",
    duration: "3–5 сессий",
    desc: "Системный подход: от первого знакомства с AI до уверенного применения каждый день. Каждая сессия — практика на ваших реальных задачах.",
    suits: [
      "Хочу освоить AI основательно",
      "Нужна система, а не точечные советы",
      "Готов инвестировать время",
    ],
  },
] as const;

const FOR_WHOM = [
  { profession: "Маркетологи", tasks: "Тексты, брифы, анализ конкурентов, идеи для контента" },
  { profession: "Юристы", tasks: "Анализ договоров, подготовка документов, резюме дел" },
  { profession: "Финансисты", tasks: "Отчёты, анализ данных, автоматизация таблиц" },
  { profession: "Менеджеры", tasks: "Презентации, письма, протоколы встреч, планирование" },
  { profession: "HR-специалисты", tasks: "Описания вакансий, письма кандидатам, аналитика" },
  { profession: "Предприниматели", tasks: "Стратегические документы, коммуникация, исследования рынка" },
] as const;

export default function EmployeesPage() {
  return (
    <div style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}>
      <nav className="l-nav">
        <div className="l-nav-links">
          <Link href="/" className="l-nav-link">Главная</Link>
          <Link href="/blog" className="l-nav-link">Блог</Link>
        </div>
        <span className="l-nav-logo">LVMN</span>
        <div className="l-nav-links">
          <a href="https://t.me/lyaminvl" target="_blank" rel="noopener noreferrer" className="l-nav-cta">
            Записаться в Telegram
          </a>
        </div>
      </nav>

      <section className="l-hero" style={{ paddingBottom: "48px" }}>
        <p className="l-eyebrow" style={{ marginBottom: "16px" }}>Для сотрудников и специалистов</p>
        <h1 className="l-hero-h1" style={{ fontSize: "44px" }}>
          Коллега с AI делает за день<br />
          то, что вы — за <em>неделю.</em>
        </h1>
        <p className="l-hero-sub">
          Это не страшилка. Помогу разобраться с AI-инструментами конкретно под вашу работу — без воды и лишних терминов.
        </p>
        <a href="https://t.me/lyaminvl" target="_blank" rel="noopener noreferrer" className="l-btn-primary">
          Записаться на консультацию
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </section>

      <div className="l-process-section">
        <div className="l-section-header">
          <p className="l-eyebrow">Форматы</p>
          <h2 className="l-section-title">Выберите подходящий формат</h2>
        </div>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {FORMATS.map((f) => (
            <div key={f.label} className="l-service-card" style={{ padding: "28px" }}>
              <p className="l-card-label">{f.label}</p>
              <p style={{ fontSize: "13px", color: "var(--text-3)", marginBottom: "10px" }}>{f.duration}</p>
              <p className="l-card-text" style={{ marginBottom: "16px" }}>{f.desc}</p>
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
                {f.suits.map((s) => (
                  <p key={s} style={{ fontSize: "12px", color: "var(--text-2)", lineHeight: "1.8" }}>— {s}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="l-cases-section">
        <div className="l-section-header">
          <p className="l-eyebrow">Для кого</p>
          <h2 className="l-section-title">Подойдёт любому, кто работает с информацией</h2>
        </div>
        <div style={{ maxWidth: "900px", margin: "48px auto 0", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          {FOR_WHOM.map((f) => (
            <div key={f.profession} className="l-case-card">
              <p className="l-case-niche">{f.profession}</p>
              <p style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: "1.6" }}>{f.tasks}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="l-cta-section">
        <p className="l-cta-label">Записаться</p>
        <h2 className="l-cta-title">Начните опережать коллег уже на этой неделе</h2>
        <p className="l-cta-sub">Напишите в Telegram — обсудим формат и запишемся на удобное время.</p>
        <div className="l-cta-buttons">
          <a href="https://t.me/lyaminvl" target="_blank" rel="noopener noreferrer" className="l-cta-btn-primary">
            Написать в Telegram
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <Link href="/" className="l-cta-btn-ghost">На главную</Link>
        </div>
      </section>

      <footer className="l-footer">
        <span className="l-footer-logo">LVMN</span>
        <nav className="l-footer-links">
          <Link href="/" className="l-footer-link">Главная</Link>
          <Link href="/blog" className="l-footer-link">Блог</Link>
          <a href="https://t.me/lyaminvl" target="_blank" rel="noopener noreferrer" className="l-footer-link">@lyaminvl</a>
        </nav>
        <span className="l-footer-copy">Влад Лямин · Новосибирск · 2026</span>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Run dev server and verify `/employees`**

```bash
npm run dev
```

Open http://localhost:3000/employees and verify:
- Nav with "Главная" back link
- Hero with correct headline and terracotta CTA button
- 2 format cards side by side with suits lists
- 6 for-whom cards in 3-column grid
- Dark CTA block
- Footer

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -20
```

- [ ] **Step 4: Commit**

```bash
git add app/employees/page.tsx
git commit -m "feat: add /employees standalone landing page"
```

---

## Task 10: Deploy

- [ ] **Step 1: Final build check**

```bash
npm run build 2>&1 | tail -30
```

Expected: `Compiled successfully` with no TypeScript errors.

- [ ] **Step 2: Deploy**

```bash
npx vercel --prod
```

- [ ] **Step 3: Smoke test on production**

Open the deployed URL and verify:
- `/` — landing loads, pill switcher animates, tabs switch, chat works
- `/audit` — AI audit form unchanged
- `/blog` — blog unchanged
- `/employees` — employees page loads correctly
