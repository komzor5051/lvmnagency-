// Серверная обёртка над Public API lava.top (gate.lava.top, spec 1.22.0).
//
// Зачем вообще создавать счёт через API, если у каждого продукта есть готовая
// ссылка app.lava.top/products/<uuid>. Прямая ссылка ничего не возвращает
// обратно: у неё нет адреса возврата после оплаты и нет гарантии, что UTM
// доедут до заказа. Счёт, созданный через POST /api/v3/invoice, умеет и то и
// другое: clientUtm приезжает в вебхук payment.success, а
// successful_return_url возвращает человека на /thanks. Только так клик по
// кнопке и оплата оказываются одной записью, а не двумя цифрами из разных мест.

import { LAVA_OFFERS } from "@/lib/lava-offers";

const API = "https://gate.lava.top";


export interface ClientUtm {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export interface CreatedInvoice {
  id: string;
  paymentUrl: string | null;
  status?: string;
}

export { LAVA_OFFERS };

export function lavaOfferId(productId: string): string | null {
  return LAVA_OFFERS[productId] ?? null;
}

export async function createInvoice(params: {
  offerId: string;
  email: string;
  clientUtm?: ClientUtm;
  successUrl: string;
  failureUrl: string;
}): Promise<CreatedInvoice> {
  const key = process.env.LAVA_API_KEY;
  if (!key) throw new Error("LAVA_API_KEY is not set");

  // Пустые строки в clientUtm lava принимает, но в отчётах они выглядят как
  // потерянные данные. Отправляем только заполненное.
  const utm = Object.fromEntries(
    Object.entries(params.clientUtm ?? {}).filter(([, v]) => typeof v === "string" && v.length > 0),
  );

  const res = await fetch(`${API}/api/v3/invoice`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Api-Key": key },
    body: JSON.stringify({
      email: params.email,
      offerId: params.offerId,
      currency: "RUB",
      buyerLanguage: "RU",
      ...(Object.keys(utm).length ? { clientUtm: utm } : {}),
      // Адреса возврата: только https и не длиннее 512 символов, иначе счёт
      // не создастся вовсе (400, частичного сохранения нет).
      successful_return_url: params.successUrl,
      failure_return_url: params.failureUrl,
      cancel_return_url: params.failureUrl,
    }),
    // Чекаут стоит в клике человека: ждать минуту нельзя, лучше упасть на
    // прямую ссылку.
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`lava invoice ${res.status}: ${text.slice(0, 300)}`);
  }

  return (await res.json()) as CreatedInvoice;
}
