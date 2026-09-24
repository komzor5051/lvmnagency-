"use client";

import posthog from "posthog-js";
import { classifyTraffic } from "@/lib/traffic-source";

/**
 * Атрибуция визита, которую надо донести до оплаты на lava.top.
 *
 * Оплата уходит на чужой домен, поэтому сессия аналитики там обрывается.
 * Единственный канал, по которому что-то возвращается обратно, — объект
 * clientUtm в заказе lava: пять строковых полей, которые приезжают в вебхук
 * payment.success. В них и упаковывается всё, что нужно для сшивки клика с
 * оплатой.
 *
 * Раскладка по полям (менять только вместе с app/api/lava/webhook):
 *   utm_source  — канал визита: telegram, yandex, direct
 *   utm_medium  — место клика: products_page, home_final, program_hero
 *   utm_campaign — исходный utm_campaign с посадочной, если был
 *   utm_term    — click_id: один клик по кнопке оплаты
 *   utm_content — distinct_id PostHog: сшивает оплату с человеком и его сессией
 */

const ATTR_KEY = "lvmn:attribution";

export interface StoredAttribution {
  source: string;
  channel: string;
  campaign: string;
  landing: string;
  ts: number;
}

export interface CheckoutUtm {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
}

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

/**
 * Записывает источник первого касания. Первое касание, а не последнее:
 * человек приходит из Телеги, через неделю возвращается по прямой ссылке и
 * платит. Продажу сделала Телега, и приписать её "direct" — соврать себе.
 */
export function rememberAttribution(): void {
  if (read<StoredAttribution>(ATTR_KEY)) return;

  const src = classifyTraffic({
    referrer: document.referrer,
    search: window.location.search,
    selfHost: window.location.hostname,
  });
  // Первую страницу визита мы не видели — приписывать нечего.
  if (src.source === "(internal)") return;

  const value: StoredAttribution = {
    source: src.source,
    channel: src.channel,
    campaign: src.campaign ?? "",
    landing: window.location.pathname,
    ts: Date.now(),
  };
  try {
    localStorage.setItem(ATTR_KEY, JSON.stringify(value));
  } catch {}
}

/** Идентификатор одного клика по кнопке оплаты. Новый на каждый клик. */
export function newClickId(): string {
  try {
    if (crypto?.randomUUID) return crypto.randomUUID();
  } catch {}
  return `c-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function distinctId(): string {
  try {
    if (posthog.__loaded) return posthog.get_distinct_id() || "";
  } catch {}
  return "";
}

/** Собирает clientUtm для конкретного клика по кнопке оплаты. */
export function checkoutUtm(section: string, clickId: string): CheckoutUtm {
  const a = read<StoredAttribution>(ATTR_KEY);
  return {
    utm_source: a?.source || "direct",
    utm_medium: section,
    utm_campaign: a?.campaign || "(none)",
    utm_term: clickId,
    utm_content: distinctId(),
  };
}
