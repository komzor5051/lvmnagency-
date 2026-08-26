/**
 * Classifies where a visit came from, so "пришли из поиска" can be separated
 * from "пришли по ссылке из Телеги" without reading Metrika by hand.
 *
 * Pure and dependency-free on purpose: the same function classifies a browser
 * visit (document.referrer) and a line из nginx-логов, and it is trivially
 * testable.
 *
 * Известные пределы, которые нельзя починить кодом:
 *  - Ответы Яндекс Нейро и Google AI Overviews приходят с реферером самого
 *    поисковика. Они попадут в "search", а не в "ai" — отличить их нельзя.
 *  - Telegram Desktop и приложение Instagram часто не шлют реферер вообще.
 *    Такой визит выглядит как "direct". Единственное лекарство — UTM-метки на
 *    собственных ссылках, поэтому utm_source имеет приоритет над реферером.
 */

export type TrafficChannel = "ai" | "search" | "social" | "referral" | "direct";

export interface TrafficSource {
  /** Канал верхнего уровня — то, ради чего всё это считается. */
  channel: TrafficChannel;
  /** Конкретный источник: "chatgpt.com", "yandex", "telegram", "(none)". */
  source: string;
  /** utm_campaign, если был. */
  campaign?: string;
  /** Реферер как есть — на случай разбора спорных случаев. */
  referrerHost?: string;
}

/**
 * Ответные машины: переход отсюда означает, что контент процитировали в ответе.
 * Матчинг по хосту, не по URL: браузеры по умолчанию режут кросс-доменный
 * реферер до origin, пути там всё равно не будет.
 */
const AI_HOSTS = [
  "chatgpt.com",
  "chat.openai.com",
  "openai.com",
  "perplexity.ai",
  "claude.ai",
  "gemini.google.com",
  "copilot.microsoft.com",
  "you.com",
  "poe.com",
  "phind.com",
  "kagi.com",
  "chat.mistral.ai",
  "chat.deepseek.com",
  "grok.com",
  "x.ai",
  "chat.qwen.ai",
  "gigachat.ru",
  "alice.yandex.ru",
];

const SEARCH_HOSTS = [
  "google.",
  "yandex.",
  "ya.ru",
  "bing.com",
  "duckduckgo.com",
  "mail.ru",
  "rambler.ru",
  "ecosia.org",
  "baidu.com",
  "brave.com",
];

const SOCIAL_HOSTS = [
  "t.me",
  "telegram.me",
  "telegram.org",
  "web.telegram.org",
  "instagram.com",
  "threads.net",
  "threads.com",
  "linkedin.com",
  "lnkd.in",
  "vk.com",
  "vk.ru",
  "youtube.com",
  "youtu.be",
  "facebook.com",
  "x.com",
  "twitter.com",
  "t.co",
  "dzen.ru",
  "habr.com",
  "pikabu.ru",
];

/** utm_source → канал. Задаёт, как размечать собственные ссылки. */
const UTM_SOURCE_CHANNEL: Record<string, TrafficChannel> = {
  telegram: "social",
  tg: "social",
  instagram: "social",
  ig: "social",
  threads: "social",
  linkedin: "social",
  vk: "social",
  youtube: "social",
  email: "referral",
  newsletter: "referral",
};

function hostOf(referrer: string): string {
  try {
    return new URL(referrer).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function matches(host: string, patterns: string[]): string | null {
  for (const p of patterns) {
    // Шаблон с точкой на конце — префикс: "google." ловит google.com,
    // google.ru и любой другой TLD одним правилом. Остальные шаблоны
    // сравниваются точно или как суффикс домена, чтобы "vk.com" не поймал
    // "notvk.com".
    const hit = p.endsWith(".")
      ? host === p.slice(0, -1) || host.startsWith(p)
      : host === p || host.endsWith("." + p);
    if (hit) return p.replace(/\.$/, "");
  }
  return null;
}

export interface ClassifyInput {
  /** document.referrer или заголовок Referer. Пустая строка = его не было. */
  referrer?: string | null;
  /** Строка запроса текущей страницы, "?utm_source=telegram&..." или объект. */
  search?: string | URLSearchParams | null;
  /** Хост самого сайта — переходы внутри него не считаются источником. */
  selfHost?: string;
}

export function classifyTraffic({
  referrer,
  search,
  selfHost,
}: ClassifyInput): TrafficSource {
  const params =
    typeof search === "string"
      ? new URLSearchParams(search)
      : search instanceof URLSearchParams
        ? search
        : new URLSearchParams();

  const utmSource = params.get("utm_source")?.trim().toLowerCase();
  const utmMedium = params.get("utm_medium")?.trim().toLowerCase();
  const campaign = params.get("utm_campaign")?.trim() || undefined;
  const host = referrer ? hostOf(referrer) : "";

  // Собственная разметка выигрывает у реферера: она проставлена руками и
  // переживает то, что Telegram Desktop реферер не шлёт.
  if (utmSource) {
    const channel =
      UTM_SOURCE_CHANNEL[utmSource] ??
      (utmMedium === "organic"
        ? "search"
        : utmMedium === "ai"
          ? "ai"
          : utmMedium === "social"
            ? "social"
            : "referral");
    return { channel, source: utmSource, campaign, referrerHost: host || undefined };
  }

  if (!host) return { channel: "direct", source: "(none)", campaign };

  // Переход между страницами самого сайта источником не является.
  const self = (selfHost ?? "").replace(/^www\./, "").toLowerCase();
  if (self && (host === self || host.endsWith("." + self))) {
    return { channel: "direct", source: "(internal)", campaign, referrerHost: host };
  }

  const ai = matches(host, AI_HOSTS);
  if (ai) return { channel: "ai", source: ai, campaign, referrerHost: host };

  const searchEngine = matches(host, SEARCH_HOSTS);
  if (searchEngine)
    return { channel: "search", source: searchEngine, campaign, referrerHost: host };

  const social = matches(host, SOCIAL_HOSTS);
  if (social) return { channel: "social", source: social, campaign, referrerHost: host };

  return { channel: "referral", source: host, campaign, referrerHost: host };
}
