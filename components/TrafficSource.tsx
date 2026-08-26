"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { classifyTraffic } from "@/lib/traffic-source";
import { YM_COUNTER_ID } from "@/lib/metrika";

const SESSION_KEY = "lvmn:traffic-source";

/**
 * Определяет канал визита один раз на сессию и записывает его в PostHog и
 * Метрику, чтобы «сколько людей пришло из поиска и из AI-ответов» читалось
 * одним отчётом, а не сводилось руками.
 *
 * Один раз на сессию — принципиально. Реферер есть только у первой страницы:
 * после перехода внутри сайта document.referrer показывает сам сайт, и если
 * считать канал на каждом хите, все многостраничные визиты выродятся в
 * "direct/(internal)".
 *
 * Записывается тремя способами, и все три нужны:
 *  - posthog.register — суперсвойства, попадают во все последующие события
 *    сессии, поэтому по каналу можно резать любую воронку;
 *  - событие traffic_source — считает сами визиты по каналам;
 *  - ym 'params' — параметр визита в Метрике, чтобы тот же срез был там, где
 *    лежит вся историческая статистика.
 */
export function TrafficSource() {
  useEffect(() => {
    let already: string | null = null;
    try {
      already = sessionStorage.getItem(SESSION_KEY);
    } catch {
      // Приватный режим блокирует sessionStorage. Тогда канал определится
      // заново на каждой странице — шумно, но не сломано.
    }
    if (already) return;

    const src = classifyTraffic({
      referrer: document.referrer,
      search: window.location.search,
      selfHost: window.location.hostname,
    });

    // Внутренний переход без сохранённой сессии означает, что первую страницу
    // визита мы не видели. Приписывать такому визиту "direct" — врать в
    // сторону занижения соцсетей и поиска, поэтому просто пропускаем.
    if (src.source === "(internal)") return;

    try {
      sessionStorage.setItem(SESSION_KEY, src.channel);
    } catch {}

    const payload = {
      traffic_channel: src.channel,
      traffic_source: src.source,
      traffic_campaign: src.campaign ?? null,
      traffic_referrer_host: src.referrerHost ?? null,
      landing_path: window.location.pathname,
    };

    try {
      if (posthog.__loaded) {
        posthog.register(payload);
        posthog.capture("traffic_source", payload);
      }
    } catch {}

    // Тег Метрики грузится стратегией afterInteractive и на момент этого
    // эффекта может ещё не создать window.ym. Ждём его появления, иначе
    // параметр визита молча теряется на каждом первом заходе.
    let tries = 0;
    let timer: number | undefined;
    const sendToMetrika = () => {
      if (window.ym) {
        try {
          window.ym(YM_COUNTER_ID, "params", {
            traffic_channel: src.channel,
            traffic_source: src.source,
          });
        } catch {}
        return;
      }
      if (tries++ < 40) timer = window.setTimeout(sendToMetrika, 250);
    };
    timer = window.setTimeout(sendToMetrika, 0);
    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);

  return null;
}
