"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";

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
            {listItems.map((item, idx) => (
              <li key={idx}>{renderInline(item)}</li>
            ))}
          </ul>
        );
        i = j - 1;
        continue;
      }

      if (line.trim() === "") {
        result.push(<br key={i} />);
        continue;
      }

      result.push(<p key={i}>{renderInline(line)}</p>);
    }

    return result;
  }, [text]);

  return <>{elements}</>;
}

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\))/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push(<strong key={match.index}>{match[2]}</strong>);
    } else if (match[3] && match[4]) {
      parts.push(
        <a key={match.index} href={match[4]} target="_blank" rel="noopener noreferrer">
          {match[3]}
        </a>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export default function ChatPage() {
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

    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages([...newMessages, assistantMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.filter((_, i) => i > 0),
        }),
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
            const json = JSON.parse(data);
            if (json.token) {
              fullText += json.token;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: fullText };
                return updated;
              });
            }
          } catch {}
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
    <div className="chat-page">
      <header className="chat-header">
        <div className="chat-header-inner">
          <div className="chat-header-left">
            <Link href="/blog" className="chat-header-link">Блог</Link>
            <Link href="/audit" className="chat-header-link">AI-аудит</Link>
          </div>
          <span className="chat-logo">LVMN</span>
          <div className="chat-header-right">
            <a href="https://swipely.ru" target="_blank" rel="noopener noreferrer" className="chat-header-link">Swipely</a>
            <a href="https://vsolo.tech" target="_blank" rel="noopener noreferrer" className="chat-header-link">Vsolo</a>
          </div>
        </div>
      </header>

      <main className="chat-messages">
        <div className="chat-messages-inner">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-msg ${msg.role}`}>
              {msg.role === "assistant" && (
                <div className="chat-avatar">V</div>
              )}
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
      </main>

      <footer className="chat-input-area">
        <div className="chat-input-inner">
          <textarea
            ref={inputRef}
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Спросите о Владе, кейсах, услугах..."
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
      </footer>
    </div>
  );
}
