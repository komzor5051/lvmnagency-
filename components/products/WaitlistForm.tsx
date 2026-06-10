"use client";

import { useState, type FormEvent } from "react";
import { TELEGRAM_URL } from "@/lib/products";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type FormState = "idle" | "loading" | "success" | "error";

/**
 * Course waitlist: email input + black submit button.
 * Inline validation; on API failure degrades to the manual Telegram channel.
 */
export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [invalid, setInvalid] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    setState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      setState("success");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <p className="text-sm font-bold text-ink">
        Вы в списке. Напишу, как только курс будет готов.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          placeholder="ваш@email.ru"
          aria-label="Email для листа ожидания"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (invalid) setInvalid(false);
          }}
          className="w-full min-w-0 border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 outline-none transition-colors focus:border-ink"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="shrink-0 cursor-pointer bg-ink px-5 py-2.5 text-sm font-bold text-paper transition-colors hover:bg-black disabled:cursor-default disabled:opacity-60"
        >
          {state === "loading" ? "Секунду" : "Жду"}
        </button>
      </div>
      {invalid && (
        <p className="text-xs text-accent" role="alert">
          Похоже, в email опечатка. Проверьте адрес.
        </p>
      )}
      {state === "error" && (
        <p className="text-xs text-ink-muted" role="alert">
          Не получилось отправить. Напишите в Telegram{" "}
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-accent font-bold text-ink"
          >
            @lyaminvl
          </a>
        </p>
      )}
    </form>
  );
}
