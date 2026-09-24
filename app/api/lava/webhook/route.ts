import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Приёмник вебхуков lava.top. Ради него всё и затевалось: оплата происходит
 * на чужом домене, и без этого запроса сайт про неё не узнаёт вообще.
 *
 * Аутентификация — заголовок X-Api-Key со значением, которое задаётся в
 * кабинете lava (Интеграции -> Public API -> Добавить Webhook). Это наш
 * собственный секрет, а не ключ lava. Подписи HMAC у lava.top нет.
 *
 * Отвечать надо 2xx на любое событие, включая незнакомое: иначе lava будет
 * долбиться до двадцати раз (1с, 5с, 15с, потом 10 раз в минуту, потом 5 раз
 * в час). Исходящий IP lava — 158.160.60.174.
 *
 * Форматы у событий разные и это не опечатка в коде: payment.* и
 * subscription.* приходят плоскими в camelCase, refund.success и
 * chargeback.initiated — в обёртке data со snake_case.
 */

interface PaymentEvent {
  eventType?: string;
  product?: { id?: string; title?: string };
  buyer?: { email?: string };
  contractId?: string;
  amount?: number;
  currency?: string;
  status?: string;
  timestamp?: string;
  clientUtm?: Record<string, string>;
  errorMessage?: string;
}

interface WrappedEvent {
  event_type?: string;
  event_id?: string;
  created_at?: string;
  data?: Record<string, unknown>;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Отправляет событие в PostHog с сервера. distinct_id берётся из utm_content:
 * туда фронт кладёт свой distinct_id, поэтому оплата приклеивается к тому же
 * человеку, что кликнул кнопку, и воронка "клик -> оплата" считается одним
 * отчётом.
 */
async function toPostHog(event: string, distinctId: string, props: Record<string, unknown>) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY || process.env.POSTHOG_KEY;
  if (!key) return;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";
  try {
    await fetch(`${host}/i/v0/e/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: key,
        event,
        distinct_id: distinctId,
        properties: { ...props, $lib: "lvmn-site-server" },
        timestamp: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch (e) {
    console.error("[lava-webhook] posthog failed", e);
  }
}

async function notify(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN || process.env.AUDIT_BOT_TOKEN;
  const chat = process.env.PAYMENT_NOTIFY_CHAT_ID || process.env.AUDIT_NOTIFY_CHAT_ID;
  if (!token || !chat) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text, disable_web_page_preview: true }),
      signal: AbortSignal.timeout(5000),
    });
  } catch (e) {
    console.error("[lava-webhook] telegram failed", e);
  }
}

export async function POST(request: Request) {
  const secret = process.env.LAVA_WEBHOOK_SECRET;
  const given = request.headers.get("x-api-key") || "";
  if (!secret || !timingSafeEqual(given, secret)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let body: PaymentEvent & WrappedEvent;
  try {
    body = (await request.json()) as PaymentEvent & WrappedEvent;
  } catch {
    // 2xx даже на мусор: ретраи ничего не починят, а очередь забьют.
    return NextResponse.json({ ok: true });
  }

  const type = body.eventType || body.event_type || "unknown";
  const wrapped = (body.data ?? {}) as Record<string, unknown>;
  const utm = (body.clientUtm ?? (wrapped.client_utm as Record<string, string>) ?? {}) as Record<
    string,
    string
  >;

  const amount = body.amount ?? (wrapped.amount as number | undefined) ?? null;
  const currency = body.currency ?? (wrapped.currency as string | undefined) ?? "RUB";
  const contractId = body.contractId ?? (wrapped.contract_id as string | undefined) ?? "";
  const title = body.product?.title ?? "";
  const email = body.buyer?.email ?? "";
  const clickId = utm.utm_term || "";
  const distinctId = utm.utm_content || clickId || contractId || "lava-unknown";

  const props = {
    lava_event: type,
    product_title: title,
    lava_product_id: body.product?.id ?? "",
    contract_id: contractId,
    amount,
    currency,
    status: body.status ?? (wrapped.status as string | undefined) ?? "",
    click_id: clickId,
    traffic_source: utm.utm_source || "",
    checkout_section: utm.utm_medium || "",
    traffic_campaign: utm.utm_campaign || "",
  };

  if (type === "payment.success" || type === "subscription.recurring.payment.success") {
    await toPostHog("purchase", distinctId, props);
    await notify(
      `Оплата: ${title || "продукт"}\n` +
        `${amount ?? "?"} ${currency}\n` +
        `Источник: ${utm.utm_source || "не определён"} / ${utm.utm_medium || "-"}\n` +
        `Почта: ${email || "-"}`,
    );
  } else if (type === "payment.failed" || type === "subscription.recurring.payment.failed") {
    await toPostHog("purchase_failed", distinctId, {
      ...props,
      error: body.errorMessage ?? "",
    });
  } else if (type === "refund.success" || type === "chargeback.initiated") {
    await toPostHog(type === "refund.success" ? "refund" : "chargeback", distinctId, props);
    await notify(`${type === "refund.success" ? "Возврат" : "Чарджбек"}: ${title}, ${amount ?? "?"} ${currency}`);
  }

  return NextResponse.json({ ok: true });
}
