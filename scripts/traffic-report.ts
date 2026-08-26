/**
 * Отчёт «откуда пришли люди» и «кто из AI-краулеров забирал статьи»,
 * посчитанный по nginx-логам VPS.
 *
 *   npx tsx scripts/traffic-report.ts            # последние 14 дней
 *   npx tsx scripts/traffic-report.ts --days 7
 *   npx tsx scripts/traffic-report.ts --raw log.txt   # разобрать локальный файл
 *   npx tsx scripts/traffic-report.ts --json > data.json   # машинный вывод
 *
 * Зачем лог, а если на сайте уже стоят Метрика и PostHog: счётчики видят
 * только тех, у кого выполнился JS и не сработал блокировщик. Лог видит
 * каждый запрос, включая краулеры, которые JS не исполняют вообще — то есть
 * весь GEO-слой в счётчики не попадает по определению.
 *
 * Предел глубины: logrotate на сервере держит 14 суток. Всё, что было раньше,
 * с сервера уже удалено — этот отчёт нельзя построить задним числом дальше.
 */

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { classifyTraffic, type TrafficChannel } from "../lib/traffic-source";

const HOST = process.env.LVMN_VPS ?? "root@5.42.111.39";
const SELF_HOST = "vladlyamin.ru";

/** UA известных ответных машин: их визит означает, что контент пошёл в ответ. */
const AI_CRAWLERS: [RegExp, string][] = [
  [/GPTBot/i, "GPTBot (обучение OpenAI)"],
  [/OAI-SearchBot/i, "OAI-SearchBot (индекс ChatGPT Search)"],
  [/ChatGPT-User/i, "ChatGPT-User (переход по ссылке в ответе)"],
  [/ClaudeBot/i, "ClaudeBot (индекс Anthropic)"],
  [/Claude-User/i, "Claude-User (запрос из чата)"],
  [/Claude-Web/i, "Claude-Web (legacy)"],
  [/PerplexityBot/i, "PerplexityBot (индекс)"],
  [/Perplexity-User/i, "Perplexity-User (запрос из чата)"],
  [/Google-Extended/i, "Google-Extended (Gemini / AI Overviews)"],
  [/Applebot-Extended/i, "Applebot-Extended"],
  [/CCBot/i, "CCBot (Common Crawl)"],
  [/Bytespider/i, "Bytespider (ByteDance)"],
  [/Amazonbot/i, "Amazonbot"],
  [/meta-externalagent|FacebookBot/i, "Meta AI"],
  [/YandexAdditional/i, "YandexAdditional (Нейро)"],
  [/cohere-ai/i, "Cohere"],
  [/Diffbot/i, "Diffbot"],
];

/** Классические поисковые роботы — считаются отдельно, это SEO, не GEO. */
const SEARCH_CRAWLERS: [RegExp, string][] = [
  [/Googlebot/i, "Googlebot"],
  [/YandexBot|YandexRenderResourcesBot|YandexImages/i, "YandexBot"],
  [/bingbot/i, "Bingbot"],
  [/DuckDuckBot/i, "DuckDuckBot"],
  [/AhrefsBot|SemrushBot|MJ12bot|DotBot|BLEXBot|PetalBot/i, "SEO-сканеры"],
];

/** Всё, что явно не человек — исключается из подсчёта людей. */
const NON_HUMAN =
  /bot|crawler|spider|slurp|scanner|monitor|curl|wget|python-requests|headless|okhttp|Go-http|libwww|Java\/|facebookexternalhit|TelegramBot|preview|zgrab|Expanse/i;

/** Ассеты и служебные пути: считаем страницы, а не запросы за шрифтами. */
const NOT_A_PAGE =
  /^\/(_next|api|favicon|apple-icon|og-|fonts?\/|.*\.(css|js|mjs|map|png|jpe?g|webp|avif|svg|ico|woff2?|ttf|xml|txt|json))/i;

/**
 * Пути, по которым ходят только сканеры уязвимостей. Часть из них приходит с
 * подделанным UA известного AI-краулера — Bytespider и CCBot подделывают чаще
 * всех. Без этой отсечки запросы к /@fs/etc/passwd попадают в отчёт как
 * «ответная машина забрала страницу», и цифра GEO завышается.
 */
const PROBE = new RegExp(
  [
    // Служебные точки входа чужих стеков, которых на этом сайте нет вовсе.
    "^/(@fs|fetch|proxy|debug|download|read|actuator|vendor|config|graphql",
    "|redirect|wp-|wordpress|admin|phpmyadmin|server-status|cgi-bin|telescope",
    "|_ignition|solr|druid|hudson|jenkins|owa|autodiscover|login|s3|aws)",
    // Файлы с секретами — где угодно в пути.
    "|(^|/)\\.(env|git|aws|ssh|svn)",
    "|/(\\.env|env\\.js|credentials|secrets?)(\\.|$|/)",
  ].join(""),
  "i",
);

const LINE =
  /^(\S+) \S+ \S+ \[([^\]]+)\] "(\S+) ([^"]*?) [^"]*" (\d{3}) (\d+) "([^"]*)" "([^"]*)"/;

interface Hit {
  ip: string;
  day: string;
  path: string;
  status: number;
  referrer: string;
  ua: string;
}

function parse(raw: string): Hit[] {
  const out: Hit[] = [];
  for (const line of raw.split("\n")) {
    const m = LINE.exec(line);
    if (!m) continue;
    const [, ip, ts, , path, status, , referrer, ua] = m;
    // "26/Aug/2026:00:03:23 +0000" -> "26/Aug/2026"
    out.push({
      ip,
      day: ts.split(":")[0],
      path,
      status: Number(status),
      referrer: referrer === "-" ? "" : referrer,
      ua,
    });
  }
  return out;
}

function matchLabel(ua: string, table: [RegExp, string][]): string | null {
  for (const [re, label] of table) if (re.test(ua)) return label;
  return null;
}

let QUIET = false;

function table(rows: [string, ...(string | number)[]][], headers: string[]) {
  if (QUIET) return;
  const all = [headers, ...rows.map((r) => r.map(String))];
  const widths = headers.map((_, i) =>
    Math.max(...all.map((r) => [...(r[i] ?? "")].length)),
  );
  const line = (r: string[]) =>
    r.map((c, i) => (i === 0 ? c.padEnd(widths[i]) : c.padStart(widths[i]))).join("  ");
  console.log(line(headers));
  console.log(widths.map((w) => "-".repeat(w)).join("  "));
  for (const r of all.slice(1)) console.log(line(r));
}

function fetchLogs(): string {
  // zcat -f прозрачно читает и .gz, и обычный файл — один вызов вместо двух.
  const remote = `zcat -f $(ls -t /var/log/nginx/access.log*) 2>/dev/null`;
  return execFileSync("ssh", [HOST, remote], {
    encoding: "utf-8",
    maxBuffer: 256 * 1024 * 1024,
  });
}

const MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");

/** "26/Aug/2026" -> Date, чтобы отсечь всё старше запрошенного окна. */
function dayToDate(day: string): number {
  const [d, mon, y] = day.split("/");
  return Date.UTC(Number(y), MONTHS.indexOf(mon), Number(d));
}

function main() {
  const argv = process.argv.slice(2);
  const rawFlag = argv.indexOf("--raw");
  const daysFlag = argv.indexOf("--days");
  const days = daysFlag >= 0 ? Number(argv[daysFlag + 1]) : 14;
  // При --json ни одна таблица не печатается: вывод должен быть разбираемым
  // целиком, а не начинаться с человекочитаемой шапки.
  const asJson = argv.includes("--json");
  QUIET = asJson;
  const say = (...args: unknown[]) => {
    if (!asJson) console.log(...args);
  };

  const raw = rawFlag >= 0 ? readFileSync(argv[rawFlag + 1], "utf-8") : fetchLogs();
  const all = parse(raw);

  // Логи ротируются посуточно, поэтому окно режется по дате строки, а не по
  // числу файлов: последний файл почти всегда неполный день.
  const newest = Math.max(...all.map((h) => dayToDate(h.day)));
  const cutoff = newest - (days - 1) * 86_400_000;
  const hits = all.filter((h) => dayToDate(h.day) >= cutoff);

  const dayList = [...new Set(hits.map((h) => h.day))];
  say(
    `Окно: последние ${days} сут. Строк: ${hits.length} из ${all.length}. ` +
      `Суток с данными: ${dayList.length}.\n`,
  );

  // --- 1. AI-краулеры: сколько раз ответные машины забирали контент ---
  const aiBots = new Map<string, { hits: number; pages: Set<string> }>();
  const searchBots = new Map<string, number>();
  let spoofed = 0;
  for (const h of hits) {
    // Сканер с подделанным UA — не краулер. Считаем отдельно.
    if (PROBE.test(h.path)) {
      if (matchLabel(h.ua, AI_CRAWLERS)) spoofed++;
      continue;
    }
    const ai = matchLabel(h.ua, AI_CRAWLERS);
    if (ai) {
      const e = aiBots.get(ai) ?? { hits: 0, pages: new Set<string>() };
      e.hits++;
      if (!NOT_A_PAGE.test(h.path)) e.pages.add(h.path);
      aiBots.set(ai, e);
      continue;
    }
    const se = matchLabel(h.ua, SEARCH_CRAWLERS);
    if (se) searchBots.set(se, (searchBots.get(se) ?? 0) + 1);
  }

  say("AI-КРАУЛЕРЫ (GEO — кто забирал контент в ответные машины)");
  if (spoofed) {
    say(
      `  Отброшено ${spoofed} запросов с подделанным UA: они шли по путям ` +
        `сканеров уязвимостей, а не за контентом.`,
    );
  }
  if (aiBots.size === 0) {
    say("  Ни одного захода. Контент в ответные машины не попадал.\n");
  } else {
    table(
      [...aiBots.entries()]
        .sort((a, b) => b[1].hits - a[1].hits)
        .map(([bot, e]) => [bot, e.hits, e.pages.size] as [string, number, number]),
      ["Краулер", "запросов", "страниц"],
    );
    say();
  }

  say("ПОИСКОВЫЕ РОБОТЫ (SEO — обычная индексация)");
  table(
    [...searchBots.entries()].sort((a, b) => b[1] - a[1]),
    ["Робот", "запросов"],
  );
  say();

  // --- 2. Люди по каналам ---
  // Настоящий браузер, открыв страницу, обязательно дотягивает бандлы из
  // /_next/. Сканер с подделанным UA запрашивает один URL и уходит. Поэтому
  // "браузером подтверждён" = с этого IP был хотя бы один запрос за ассетом.
  // Без этой отсечки доля прямых заходов раздувается сканерами втрое.
  const browserIps = new Set(
    hits.filter((h) => h.path.startsWith("/_next/")).map((h) => h.ip),
  );

  const humans = hits.filter(
    (h) =>
      !NON_HUMAN.test(h.ua) &&
      h.ua !== "-" &&
      !NOT_A_PAGE.test(h.path) &&
      (h.status === 200 || h.status === 304),
  );

  const byChannel = new Map<
    TrafficChannel,
    { hits: number; ips: Set<string>; browserIps: Set<string> }
  >();
  const bySource = new Map<string, number>();
  for (const h of humans) {
    const qs = h.path.includes("?") ? h.path.slice(h.path.indexOf("?")) : "";
    const src = classifyTraffic({
      referrer: h.referrer,
      search: qs,
      selfHost: SELF_HOST,
    });
    // Внутренние переходы не источник: это вторая и следующие страницы визита.
    if (src.source === "(internal)") continue;
    const e = byChannel.get(src.channel) ?? {
      hits: 0,
      ips: new Set<string>(),
      browserIps: new Set<string>(),
    };
    e.hits++;
    e.ips.add(h.ip);
    if (browserIps.has(h.ip)) e.browserIps.add(h.ip);
    byChannel.set(src.channel, e);
    const key = `${src.channel} / ${src.source}`;
    bySource.set(key, (bySource.get(key) ?? 0) + 1);
  }

  const NAMES: Record<TrafficChannel, string> = {
    search: "Поиск (SEO)",
    ai: "Ответные машины (GEO)",
    social: "Соцсети и Телега",
    referral: "Другие сайты",
    direct: "Прямые заходы",
  };

  const totalReal = [...byChannel.values()].reduce((s, e) => s + e.browserIps.size, 0);
  say("ЛЮДИ ПО КАНАЛАМ (входы на страницы, без ассетов и ботов)");
  table(
    [...byChannel.entries()]
      .sort((a, b) => b[1].browserIps.size - a[1].browserIps.size)
      .map(([ch, e]) => [
        NAMES[ch],
        e.browserIps.size,
        totalReal ? ((e.browserIps.size / totalReal) * 100).toFixed(1) + "%" : "0%",
        e.ips.size,
        e.hits,
      ]),
    ["Канал", "браузеры", "доля", "всего IP", "входов"],
  );
  say();

  // Посуточная динамика — отдельно люди и заходы ответных машин, чтобы было
  // видно, растёт ли цитирование и доходят ли из него клики.
  const daily = new Map<string, { humans: Set<string>; aiBot: number; seoBot: number }>();
  for (const h of hits) {
    const e = daily.get(h.day) ?? {
      humans: new Set<string>(),
      aiBot: 0,
      seoBot: 0,
    };
    if (PROBE.test(h.path)) {
      daily.set(h.day, e);
      continue;
    }
    if (matchLabel(h.ua, AI_CRAWLERS)) e.aiBot++;
    else if (matchLabel(h.ua, SEARCH_CRAWLERS)) e.seoBot++;
    else if (browserIps.has(h.ip) && !NOT_A_PAGE.test(h.path)) e.humans.add(h.ip);
    daily.set(h.day, e);
  }

  // Какие страницы ответные машины забирали чаще всего: это и есть список
  // материалов, которые реально попадают в ответы.
  const aiPages = new Map<string, number>();
  for (const h of hits) {
    if (!matchLabel(h.ua, AI_CRAWLERS)) continue;
    if (NOT_A_PAGE.test(h.path) || PROBE.test(h.path)) continue;
    const path = h.path.split("?")[0];
    aiPages.set(path, (aiPages.get(path) ?? 0) + 1);
  }

  if (asJson) {
    const payload = {
      generatedFor: { days, from: dayList[dayList.length - 1], to: dayList[0] },
      lines: { parsed: hits.length, total: all.length },
      channels: [...byChannel.entries()].map(([channel, e]) => ({
        channel,
        name: NAMES[channel],
        browsers: e.browserIps.size,
        allIps: e.ips.size,
        hits: e.hits,
      })),
      sources: [...bySource.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([source, hits]) => ({ source, hits })),
      aiCrawlers: [...aiBots.entries()]
        .sort((a, b) => b[1].hits - a[1].hits)
        .map(([bot, e]) => ({ bot, hits: e.hits, pages: e.pages.size })),
      searchCrawlers: [...searchBots.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([bot, hits]) => ({ bot, hits })),
      spoofedAiHits: spoofed,
      aiTopPages: [...aiPages.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 25)
        .map(([path, hits]) => ({ path, hits })),
      daily: [...daily.entries()]
        .sort((a, b) => dayToDate(a[0]) - dayToDate(b[0]))
        .map(([day, e]) => ({
          day,
          humans: e.humans.size,
          aiBot: e.aiBot,
          seoBot: e.seoBot,
        })),
    };
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  say("ТОП ИСТОЧНИКОВ");
  table(
    [...bySource.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20),
    ["Источник", "входов"],
  );
  say(
    "\nПрямые заходы завышены: Telegram Desktop и приложение Instagram не шлют\n" +
      "реферер, поэтому их переходы попадают сюда. Лечится только UTM-метками\n" +
      "на собственных ссылках — см. docs/utm-links.md.",
  );
}

main();
