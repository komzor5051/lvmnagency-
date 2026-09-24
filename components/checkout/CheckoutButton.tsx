"use client";

import { useState, type FormEvent } from "react";
import { track } from "@/lib/analytics";
import { checkoutUtm, newClickId } from "@/lib/attribution";
import { LAVA_OFFERS } from "@/lib/lava-offers";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Кнопка оплаты и единственное место, где начинается платёжная воронка.
 *
 * Три события, по которым она и считается:
 *   checkout_click    — нажал кнопку оплаты
 *   checkout_redirect — ушёл на страницу оплаты lava
 *   purchase          — оплатил (стреляет /thanks и вебхук lava)
 *
 * Почта спрашивается на сайте, а не на lava, и это не лишний шаг: lava всё
 * равно требует её перед оплатой. Зато счёт создаётся через API, а значит у
 * него есть адрес возврата на /thanks и clientUtm с click_id. Без этого
 * оплата теряется на чужом домене, и «сколько нажали, но не оплатили» не
 * считается вообще никак.
 */
export function CheckoutButton({
  productId,
  fallbackUrl,
  section,
  label,
  className = "rz-btn rz-btn--solid",
}: {
  productId: string;
  fallbackUrl: string;
  section: string;
  label: string;
  className?: string;
}) {
  const [clickId, setClickId] = useState("");
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const viaApi = Boolean(LAVA_OFFERS[productId]);

  // Для продукта без оффера в lava остаётся прямая ссылка: клик посчитаем,
  // атрибуцию оплаты — нет.
  if (!viaApi) {
    return (
      <a
        href={fallbackUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={() => {
          const id = newClickId();
          track("checkout_click", { product: productId, section, click_id: id, mode: "direct" });
          track("checkout_redirect", { product: productId, section, click_id: id, mode: "direct" });
        }}
      >
        {label}
      </a>
    );
  }

  function start() {
    const id = newClickId();
    setClickId(id);
    setOpen(true);
    track("checkout_click", { product: productId, section, click_id: id, mode: "api" });
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!EMAIL_RE.test(value)) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    setBusy(true);

    const id = clickId || newClickId();
    const utm = checkoutUtm(section, id);
    let url = fallbackUrl;
    let mode = "fallback";

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: productId, email: value, utm }),
      });
      const data = (await res.json()) as { paymentUrl?: string | null; fallbackUrl?: string };
      if (data.paymentUrl) {
        url = data.paymentUrl;
        mode = "api";
      } else if (data.fallbackUrl) {
        url = data.fallbackUrl;
      }
    } catch {
      // Сеть отвалилась — уводим на прямую ссылку, продажа важнее метки.
    }

    track("checkout_redirect", { product: productId, section, click_id: id, mode });

    if (!url) {
      setBusy(false);
      setInvalid(true);
      return;
    }
    window.location.href = url;
  }

  if (!open) {
    return (
      <button type="button" className={className} onClick={start}>
        {label}
      </button>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="rz-wait">
      <div className="rz-wait-row">
        <input
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          autoFocus
          placeholder="почта для чека и доступа"
          aria-label="Почта для чека и доступа"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (invalid) setInvalid(false);
          }}
          className={"rz-wait-input" + (invalid ? " is-invalid" : "")}
        />
        <button type="submit" disabled={busy} className="rz-wait-btn">
          {busy ? "Секунду" : "К оплате"}
        </button>
      </div>
      {invalid && (
        <p className="rz-wait-error" role="alert">
          Проверь почту: на неё придёт чек и доступ к продукту.
        </p>
      )}
    </form>
  );
}
