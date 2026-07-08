# Claude Content Pivot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Repoint the lvmn-site blog content-factory pipeline from general AI-business-automation topics to a Claude / Claude Code content series across 4 pillars, with a new guide-product CTA.

**Architecture:** No new files, no schema changes, no new dependencies. Six existing pipeline files get their prompt strings and one helper function rewritten; one file (`lib/wordstat.ts`) is deleted because its only caller stops using it.

**Tech Stack:** TypeScript, Next.js, Gemini (`lib/gemini.ts`), Exa search (`lib/researcher.ts`), Supabase.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-08-claude-content-pivot-design.md`
- This is a full replacement of blog topic, not a parallel stream — no old automation-topic language should remain in prompts after this plan.
- No test framework exists in this repo (no jest/vitest/playwright unit tests). Verification per task uses: (a) `npx tsc --noEmit` for type-check, (b) deterministic `grep` assertions against the file content (these substitute for unit tests on prompt-string files), and (c) `npm run lint` as a final gate. There is no mocked or live pipeline test in this plan — running the actual pipeline requires paid API calls (Gemini, Exa) and a valid `EXA_API_KEY`, which `CLAUDE.md` notes is currently expired; that is out of scope for automated verification here.
- Do not touch: `lib/lvmn-features.ts`, `lib/pipeline/publisher.ts`, `lib/pipeline/image-generator.ts`, `lib/pipeline/telegram.ts`, Supabase schema, cron schedule, `/blog` frontend, `lib/products.ts`.
- CTA in every article links to `https://vladlyamin.ru/products/guide` (the "AI вместо команды" guide, 990 ₽) — content of that product is not changed.
- Technical terms that stay untranslated in Russian copy: `MCP`, `hook`, `skill`, `subagent`, `slash command`, `agent`, `prompt`, `CLI`.

---

### Task 1: Retire Wordstat and rewrite topic-miner for Claude pillars

**Files:**
- Modify: `lib/pipeline/topic-miner.ts` (full rewrite)
- Delete: `lib/wordstat.ts`

**Interfaces:**
- Consumes: `generatePro` from `@/lib/gemini` (unchanged signature: `(prompt: string) => Promise<string>`), `searchSources` from `@/lib/researcher` (unchanged signature: `(query: string, numResults?: number) => Promise<Source[]>`), `supabase` from `@/lib/supabase`.
- Produces: `mineTopics(): Promise<GeneratedTopic[]>` — same exported name and shape as before (`{ title, angle, keywords, score }[]`), consumed by `scripts/run-pipeline.ts` / `app/api/cron/mine-topics` (not modified in this plan, so the signature must not change).

- [ ] **Step 1: Rewrite `lib/pipeline/topic-miner.ts` in full**

Replace the entire file content with:

```ts
import { generatePro } from "@/lib/gemini";
import { searchSources } from "@/lib/researcher";
import { supabase } from "@/lib/supabase";

interface GeneratedTopic {
  title: string;
  angle: string;
  keywords: string[];
  score: number;
}

const RESEARCH_QUERIES = [
  "Claude Code фичи обновления",
  "Claude.ai use cases советы",
  "Anthropic release notes новые модели",
  "Claude tips workflow продуктивность",
];

async function fetchAnthropicUpdates(): Promise<string> {
  const urls = [
    "https://docs.claude.com/en/release-notes/claude-code",
    "https://www.anthropic.com/news",
  ];

  const chunks: string[] = [];
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) continue;
      const html = await res.text();
      const text = html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 3000);
      if (text.length > 200) {
        chunks.push(`Источник ${url}:\n${text}`);
      }
    } catch (err) {
      console.warn(`[topic-miner] Failed to fetch ${url}:`, err);
    }
  }
  return chunks.join("\n\n");
}

export async function mineTopics(): Promise<GeneratedTopic[]> {
  // 1. Research current Claude/Anthropic trends across multiple angles
  const trendResults = await Promise.all(
    RESEARCH_QUERIES.map((q) => searchSources(q, 2))
  );
  const trends = trendResults.flat();
  const trendSummary = trends.map((t) => `- ${t.title}: ${t.summary}`).join("\n");

  // 2. Fetch official Anthropic release notes / news as a second research source
  let officialUpdates = "";
  try {
    console.log("[topic-miner] Fetching Anthropic official updates...");
    officialUpdates = await fetchAnthropicUpdates();
    if (officialUpdates) {
      console.log("[topic-miner] Got official updates content");
    }
  } catch (err) {
    console.warn("[topic-miner] Official updates unavailable, continuing without:", err);
  }
  const officialContext = officialUpdates
    ? `\nОФИЦИАЛЬНЫЕ ОБНОВЛЕНИЯ ANTHROPIC:\n${officialUpdates}\n`
    : "";

  // 3. Get existing topics to avoid duplicates
  const { data: existing } = await supabase
    .from("lvmn_blog_topics")
    .select("title")
    .order("created_at", { ascending: false })
    .limit(50);

  const existingTitles = (existing ?? []).map((t) => t.title).join("\n");

  // 4. Generate new topics
  const prompt = `Ты контент-стратег блога Влада Лямина — практика, который помогает фаундерам и разработчикам реально использовать Claude и Claude Code в работе.

Тренды:
${trendSummary}
${officialContext}
Уже опубликованные (НЕ повторяй):
${existingTitles || "Пока нет публикаций"}

Сгенерируй 10 тем для блога, распределив их примерно поровну (2-3 темы на каждое) по 4 направлениям:

1. Claude.ai для нетехнических — Projects, Artifacts, стили ответов, голосовой ввод, работа с документами
2. Claude Code для разработчиков — skills, hooks, MCP, субагенты, workflow, конкретные конфиги
3. AI-автоматизация бизнеса через Claude — API, агенты, интеграция с ботами/n8n
4. Сравнения и новости — Claude vs ChatGPT/Gemini, разборы обновлений и релизов Anthropic

СТИЛЬ ЗАГОЛОВКОВ — разговорный, как пост в Telegram. Примеры ХОРОШИХ тем:
- "Claude Code сам чинит баги — вот как я это настроил"
- "Artifacts вместо десяти вкладок: как я веду проекты в Claude"
- "MCP-сервер за 20 минут: подключил Claude к своей базе данных"
- "Claude vs ChatGPT: что реально лучше для работы с документами"
- "5 skills для Claude Code, которые экономят мне часы в неделю"
- "Голосом вместо клавиатуры: как я веду Claude.ai с телефона"

Примеры ПЛОХИХ тем (НЕ ДЕЛАЙ ТАК):
- "Обзор возможностей Claude" — размыто
- "Инновационные подходы к работе с ИИ" — AI-слоп
- "Как Claude трансформирует индустрию" — клише
- "Тренды AI-инструментов 2026" — скучно

КЛЮЧЕВЫЕ СЛОВА:
- Используй реальные термины из ресерча (названия фич, команд, инструментов)
- Не выдумывай ключевые слова, которых нет в источниках

ЗАПРЕЩЁННЫЕ ТЕМЫ (не генерируй):
- Инструкции по обходу блокировок
- Обзоры VPN-сервисов
- Политические темы
- Не выдумывай несуществующие фичи Claude/Anthropic — только то, что подтверждено источниками выше

Каждая тема должна:
- Быть практичной (как сделать X, приём Y, сравнение Z vs W)
- Иметь конкретный угол, отличающий от типичных статей
- Заголовок ≤ 55 символов
- Читатель должен суметь применить что-то из статьи сразу после прочтения

Ответь СТРОГО в JSON-формате (массив объектов):
[{
  "title": "Заголовок статьи",
  "angle": "Уникальный угол раскрытия",
  "keywords": ["ключ1", "ключ2", "ключ3"],
  "score": 1-10
}]

Только JSON, без markdown-обёрток.`;

  const raw = await generatePro(prompt);
  const cleaned = raw.replace(/\`\`\`json?\n?/g, "").replace(/\`\`\`/g, "").trim();
  const topics: GeneratedTopic[] = JSON.parse(cleaned);

  // 5. Save to Supabase
  const rows = topics.map((t) => ({
    title: t.title,
    angle: t.angle,
    keywords: t.keywords,
    source: "trend",
    score: t.score,
    search_volume: 0,
    status: "pending",
  }));

  const { error } = await supabase.from("lvmn_blog_topics").insert(rows);
  if (error) throw new Error(`Failed to save topics: ${error.message}`);

  return topics;
}
```

- [ ] **Step 2: Delete the now-unused Wordstat module**

```bash
rm lib/wordstat.ts
```

- [ ] **Step 3: Verify no remaining Wordstat references**

Run: `grep -rn "wordstat\|Wordstat\|WORDSTAT" lib/ scripts/ app/ 2>/dev/null`
Expected: no output (empty — command exits with no matches)

- [ ] **Step 4: Verify the 4 pillars are present in the new prompt**

Run: `grep -c "Claude.ai для нетехнических\|Claude Code для разработчиков\|AI-автоматизация бизнеса через Claude\|Сравнения и новости" lib/pipeline/topic-miner.ts`
Expected: `4`

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors mentioning `topic-miner.ts` or `wordstat.ts` (pre-existing unrelated errors, if any, are not introduced by this change — compare against a run on the pre-change tree if unsure)

- [ ] **Step 6: Commit**

```bash
git add lib/pipeline/topic-miner.ts lib/wordstat.ts
git commit -m "feat(blog): retire Wordstat, rewrite topic-miner for Claude content pillars"
```

---

### Task 2: Broaden style guide audience and add technical-term exceptions

**Files:**
- Modify: `lib/pipeline/style-guide.ts:1-27`

**Interfaces:**
- Consumes: nothing (pure string constant).
- Produces: `LVMN_STYLE_GUIDE` (exported `string` constant, same name) — consumed as-is by `lib/pipeline/writer.ts` via `${LVMN_STYLE_GUIDE}` interpolation. Content changes only; the export name and type must not change.

- [ ] **Step 1: Replace the opening block (persona, audience, pains, terminology) in `lib/pipeline/style-guide.ts`**

Old string (lines 1-27):

```ts
export const LVMN_STYLE_GUIDE = `
## Стайл-гайд блога Влада Лямина

Ты пишешь как практик, который помогает фаундерам и предпринимателям реально использовать AI в работе. Не как теоретик. Не как копирайтер из 2015-го. Как человек, который каждый день строит AI-системы для бизнеса и видит, что реально работает, а что красиво выглядит только на демо.

**Аудитория статей**: фаундеры, соло-предприниматели, руководители — люди, которые принимают решения и отвечают за деньги. Им не нужна теория. Им нужно знать: как это помогает зарабатывать больше или тратить меньше времени?

Главные боли аудитории (пиши об этом):
- Всё держат в голове — нет системы, нет второго мозга
- Хотят расти, но не могут нанять ещё людей
- Принимают решения медленно, потому что нет нужных данных под рукой
- Знают, что AI нужен — но не внедрили, потому что непонятно с чего начать

Ориентиры стиля: Ильяхов (ясность) + практичность Хабра + конкретика бизнес-блога.
Уровень языка: фаундер должен понять. Если непонятно — перепиши проще.

---

### ТЕРМИНОЛОГИЯ (СТРОГО)

- Пиши "ИИ", НИКОГДА "AI" (по-русски пишем по-русски, кроме "AI-система", "AI-инструмент" — это устоявшиеся термины)
- Пиши "нейросеть/нейросети", не "искусственный интеллект" (слишком пафосно)
- Пиши "AI-система", "AI-помощник", не "AI-автоматизация" (фаундер думает о системах и результатах, не об автоматизации ради автоматизации)
- Пиши "строим", не "настраиваем" (мы создаём, а не ковыряемся)
- Пиши "второй мозг", "AI-ассистент", "система принятия решений" — это язык фаундера
- ЗАПРЕЩЕНО: "AI-автоматизация процессов", "роботизация", "оптимизация процессов" — звучит как для IT-директора, не для владельца бизнеса
```

New string:

```ts
export const LVMN_STYLE_GUIDE = `
## Стайл-гайд блога Влада Лямина

Ты пишешь как практик, который помогает фаундерам, предпринимателям и разработчикам реально использовать Claude и Claude Code в работе. Не как теоретик. Не как копирайтер из 2015-го. Как человек, который каждый день строит AI-системы и пишет код вместе с Claude и видит, что реально работает, а что красиво выглядит только на демо.

**Аудитория статей**: фаундеры, соло-предприниматели, руководители — и разработчики, которые интегрируют Claude в свою работу. Всех объединяет одно: не нужна теория, нужно знать — как это применить прямо сейчас.

Главные боли аудитории (пиши об этом):
- Всё держат в голове — нет системы, нет второго мозга
- Хотят расти, но не могут нанять ещё людей
- Принимают решения медленно, потому что нет нужных данных под рукой
- Знают, что Claude умеет больше, чем они используют — но не разобрались, что именно
- Разработчики: тратят время на рутину в коде, которую Claude Code мог бы забрать

Ориентиры стиля: Ильяхов (ясность) + практичность Хабра + конкретика бизнес-блога.
Уровень языка: фаундер должен понять нетехническую статью, разработчик — техническую. Если непонятно целевому читателю статьи — перепиши проще.

---

### ТЕРМИНОЛОГИЯ (СТРОГО)

- Пиши "ИИ", НИКОГДА "AI" (по-русски пишем по-русски, кроме "AI-система", "AI-инструмент" — это устоявшиеся термины)
- Пиши "нейросеть/нейросети", не "искусственный интеллект" (слишком пафосно)
- Пиши "AI-система", "AI-помощник", не "AI-автоматизация" (фаундер думает о системах и результатах, не об автоматизации ради автоматизации)
- Пиши "строим", не "настраиваем" (мы создаём, а не ковыряемся)
- Пиши "второй мозг", "AI-ассистент", "система принятия решений" — это язык фаундера
- ЗАПРЕЩЕНО: "AI-автоматизация процессов", "роботизация", "оптимизация процессов" — звучит как для IT-директора, не для владельца бизнеса
- ИСКЛЮЧЕНИЯ (технические термины НЕ переводятся): MCP, hook, skill, subagent, slash command, agent, prompt, CLI — устоявшиеся термины Claude Code, оставляй их на английском
```

- [ ] **Step 2: Verify the exceptions list and broadened audience landed**

Run: `grep -c "разработчиков" lib/pipeline/style-guide.ts && grep -c "MCP, hook, skill, subagent" lib/pipeline/style-guide.ts`
Expected: both commands print a number `>= 1`

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors mentioning `style-guide.ts`

- [ ] **Step 4: Commit**

```bash
git add lib/pipeline/style-guide.ts
git commit -m "feat(blog): broaden style guide audience to include developers, add tech-term exceptions"
```

---

### Task 3: Update writer.ts — structure, CTA, and technical-language rules

**Files:**
- Modify: `lib/pipeline/writer.ts:29-132` (the `writeArticle` function body — imports and `getExistingArticles` are unchanged)

**Interfaces:**
- Consumes: `LVMN_STYLE_GUIDE` from `./style-guide` (unchanged export), `LVMN_FEATURES` from `@/lib/lvmn-features` (unchanged, not modified in this plan).
- Produces: `writeArticle(input: WriterInput): Promise<string>` — same signature, same `WriterInput` shape (`{ title, angle, keywords, sources }`). Consumed by `scripts/run-pipeline.ts` / cron generate route (not touched here).

- [ ] **Step 1: Replace the `writeArticle` function body in `lib/pipeline/writer.ts`**

Replace everything from `export async function writeArticle(input: WriterInput): Promise<string> {` (line 29) to the closing `}` at the end of the file (line 132) with:

```ts
export async function writeArticle(input: WriterInput): Promise<string> {
  const sourcesContext = input.sources
    .map((s) => `[${s.title}](${s.url}): ${s.summary}`)
    .join("\n\n");

  const existingArticles = await getExistingArticles();

  const today = new Date().toLocaleDateString("ru-RU", {
    year: "numeric", month: "long", day: "numeric",
  });

  const internalLinksBlock = existingArticles
    ? `\nВНУТРЕННИЕ ССЫЛКИ (ОБЯЗАТЕЛЬНО):
Вот список уже опубликованных статей в нашем блоге:
${existingArticles}

Правила внутренней перелинковки:
- Вставь 2-4 ссылки на релевантные статьи из списка выше ЕСТЕСТВЕННО по тексту
- Ссылки должны быть органичными: "как мы писали в статье [название](url)" или "подробнее об этом — в [название](url)"
- НЕ ссылайся на статью, если она не связана с темой
- НЕ вставляй все ссылки в одно место — распредели по тексту
- Используй ТОЧНЫЕ URL из списка, не выдумывай\n`
    : "";

  const currentYear = new Date().getFullYear();

  const prompt = `Ты ведёшь блог Влада Лямина — практика, который помогает фаундерам, предпринимателям и разработчикам реально использовать Claude и Claude Code в работе. Пишешь от его лица живым русским языком, как человек, который каждый день сам работает с Claude — и разговаривает то с владельцами бизнеса, то с разработчиками. СТРОГО: всегда пишешь "я", никогда "мы". Это личный блог одного человека, не агентства.

Дата: ${today}
Текущий год: ${currentYear}. Все упоминания года в статье должны быть актуальными (${currentYear}). Не пиши "в 2024 году" или "в 2025 году" — пиши "в ${currentYear} году". Если ссылаешься на прогнозы или тренды — это тренды ${currentYear} года.

Напиши статью на тему: "${input.title}"
Угол раскрытия: ${input.angle}
SEO-ключевые слова (встрой естественно): ${input.keywords.join(", ")}

Источники для фактов и ссылок:
${sourcesContext}

${LVMN_STYLE_GUIDE}

О ВЛАДЕ И ЕГО ФОРМАТАХ РАБОТЫ (используй ТОЛЬКО эту информацию, НЕ выдумывай услуги):
${LVMN_FEATURES}

СТРУКТУРА ЗАГОЛОВКОВ (СТРОГО):
- Заголовок статьи НЕ НУЖЕН (он будет добавлен отдельно как H1)
- Используй ## (H2) для основных секций
- Используй ### (H3) для подсекций внутри H2
- НИКОГДА не пропускай уровни (нет H3 без родительского H2)
- Каждый H2 должен быть информативным, содержать ключевое слово
- Для пошаговых инструкций используй формат "## Шаг 1: Название шага" (не "Этап")
${internalLinksBlock}
КАРТИНКИ (ОБЯЗАТЕЛЬНО):
Вставляй 2-3 кинематографичных изображения по всей статье в формате:
![IMG: подробное описание метафоричной сцены на русском](placeholder)

Стиль картинок — кинематографичная редакторская обложка (как newsletter a16z): фотореалистично, атмосферно, приглушённый кино-грейдинг (teal + amber), низкий ключ, один тёплый источник света. Метафора — человек, работающий с Claude/терминалом/кодом (без буквальных скриншотов интерфейса). БЕЗ текста на картинке, БЕЗ мемов, БЕЗ гротеска и мультяшности.

Правила:
- Первая картинка — сразу после первого абзаца (будет обложкой). В описании ЯВНО укажи: главный объект/герой СПРАВА, левая часть кадра — тёмная и пустая (туда ляжет заголовок).
- Вторая — примерно в середине статьи. Третья (если есть) — ближе к концу, перед CTA.
- Описание — это визуальная МЕТАФОРА мысли раздела: одинокая человеческая фигура в выразительной среде ИЛИ один сильный объект/сцена. Конкретно: кто/что, где, какой свет и настроение. БЕЗ всякого текста в кадре.
- НЕ БОЛЬШЕ 3 картинок!

ПРОМПТЫ И КОМАНДЫ (ВАЖНО):
- Когда приводишь примеры промптов, команд, конфигов или текстов для копирования — оформляй их в блоках кода (тройные бэктики \`\`\`)
- НЕ используй инлайн-код (одинарные бэктики) для длинных промптов/команд

ОБЯЗАТЕЛЬНЫЕ ССЫЛКИ:
- Ссылка на сайт: [Влад Лямин](https://vladlyamin.ru) — вставь естественно, когда к месту
- CTA-ссылка на гайд: [AI вместо команды](https://vladlyamin.ru/products/guide)

СТРУКТУРА СТАТЬИ:
1. Хук — 1-2 цепляющих предложения. Проблема, которую читатель прямо сейчас переживает.
2. Краткий пересказ — сразу после хука напиши 2-3 предложения "В этой статье: ..." чтобы человек понял, стоит ли читать
3. Основная часть — пошагово, с конкретными примерами, командами и промптами. Каждый шаг — через вопрос читателя: "зачем мне это?" или "как это применить прямо сейчас?"
4. Секция "Как это работает на практике" — гибкая по формату:
   - Если статья бизнес-ориентированная (автоматизация, интеграции, ROI) — конкретный кейс с цифрами.
   - Если статья техническая (Claude Code, MCP, skills, hooks) — конкретный воркфлоу или приём с результатом ("настроил так — получил вот это"), цифры не обязательны.
5. FAQ — секция "Часто задаваемые вопросы" (ОБЯЗАТЕЛЬНО, см. ниже)
6. CTA: мягкий переход к гайду, без продажи консультации. Например: "Если хотите системно разобраться в работе с AI и Claude — у меня есть гайд [«AI вместо команды»](https://vladlyamin.ru/products/guide): готовые системы и команды, которые настраиваются за вечер." Адаптируй формулировку под тему статьи — но продукт, цену и содержание гайда бери из блока про Влада выше, не выдумывай.

FAQ (ОБЯЗАТЕЛЬНО — последняя секция перед CTA):
Добавь раздел ## Часто задаваемые вопросы с 4-5 вопросами. Вопросы должны звучать как реальные поисковые запросы (что люди вводят в Google). Формат СТРОГО такой:

**Вопрос в виде поискового запроса?**

Ответ: 2-4 предложения конкретного ответа с цифрами, если уместно.

Пример:
**Сколько стоит Claude Code?**

Ответ: Claude Code входит в подписку Claude Pro и выше — от 20$ в месяц. Есть бесплатный тариф с ограниченным количеством запросов в день, достаточным, чтобы попробовать основные фичи.

Требования:
- 1500-2500 слов
- Формат Markdown
- Ссылки на источники в тексте
- Язык — простой, живой, экспертный. Объясняй на пальцах, с конкретными примерами.
- Пиши "ИИ", не "AI" (кроме устоявшихся терминов вроде "AI-система", "AI-инструмент") и кроме технических терминов Claude Code (MCP, hook, skill, subagent, slash command, agent, prompt, CLI) — их оставляй на английском.
- Если статья для нетехнической аудитории (Claude.ai, бизнес-автоматизация) — объясняй термины на пальцах. Если статья техническая (Claude Code для разработчиков) — можно использовать профессиональный жаргон без расшифровки.
- Угол всегда через практическую пользу: что читатель может сделать по-другому сразу после прочтения.

Напиши ТОЛЬКО статью в Markdown, без вступления от себя.`;

  return generatePro(prompt);
}
```

- [ ] **Step 2: Verify the guide CTA link replaced the old Telegram consultation CTA**

Run: `grep -c "vladlyamin.ru/products/guide" lib/pipeline/writer.ts && grep -c "разберём вашу задачу и выйдем с конкретным планом" lib/pipeline/writer.ts`
Expected: first command prints a number `>= 1`; second command prints `0` (old CTA phrase fully removed)

- [ ] **Step 3: Verify the hard-technical-language restriction was softened**

Run: `grep -c "Аудитория — фаундеры, не технари. Никаких" lib/pipeline/writer.ts`
Expected: `0`

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors mentioning `writer.ts`

- [ ] **Step 5: Commit**

```bash
git add lib/pipeline/writer.ts
git commit -m "feat(blog): writer CTA points to guide product, flexible practice section, tech-audience rules"
```

---

### Task 4: Update editors.ts factcheck prompt for Claude/Anthropic accuracy

**Files:**
- Modify: `lib/pipeline/editors.ts:74-94` (the `factcheck` entry in `EDITOR_PROMPTS`)

**Interfaces:**
- Consumes: `IMAGE_PRESERVATION` constant (unchanged, defined at top of file).
- Produces: `EDITOR_PROMPTS.factcheck` (string) — consumed by `editArticle`/`runAllEditors`, whose signatures are unchanged.

- [ ] **Step 1: Replace the `factcheck` prompt entry in `lib/pipeline/editors.ts`**

Old string (lines 74-94):

```ts
  factcheck: `Ты фактчекер и юридический редактор. Проверь статью:

ФАКТЧЕК:
1. Утверждения соответствуют источникам (ссылки в тексте)?
2. Даты актуальны?
3. Нет ли выдуманных фактов, продуктов, функций?
4. Числа и проценты правдоподобны?

ПРОВЕРКА УСЛУГ:
5. Упоминаются ТОЛЬКО реальные услуги Влада: Telegram-боты с AI, автоматизация бизнес-процессов, AI-сервисы, n8n-воркфлоу.
6. НЕ упоминаются услуги, которых Влад не оказывает (SEO, контекстная реклама, CRM-настройка, разработка сайтов, консалтинг без внедрения). Если нашёл — удали.

ЮРИДИЧЕСКАЯ ПРОВЕРКА:
7. Нет инструкций по обходу блокировок Роскомнадзора
8. Нет прямой рекламы VPN-сервисов
9. Нет политических высказываний, критики госорганов
10. Нет нарушений закона о рекламе (ложные обещания, гарантии дохода)

Если нашёл проблему — исправь или убери утверждение.
${IMAGE_PRESERVATION}
Верни ИСПРАВЛЕННУЮ статью целиком в Markdown. Без комментариев.`,
```

New string:

```ts
  factcheck: `Ты фактчекер и юридический редактор. Проверь статью:

ФАКТЧЕК:
1. Утверждения соответствуют источникам (ссылки в тексте)?
2. Даты актуальны?
3. Нет ли выдуманных фактов, продуктов, функций?
4. Числа и проценты правдоподобны?

ПРОВЕРКА ФАКТОВ ПРО CLAUDE/ANTHROPIC:
5. Названия моделей, фич, инструментов (Claude Code, MCP, skills, hooks, Projects, Artifacts) существуют и названы правильно — не выдуманы?
6. Цены, лимиты, доступность фич (какие есть в каких тарифах) не выдуманы, а взяты из источников?
7. Если дата релиза/обновления упоминается — она соответствует источникам, а не придумана?

ЮРИДИЧЕСКАЯ ПРОВЕРКА:
8. Нет инструкций по обходу блокировок Роскомнадзора
9. Нет прямой рекламы VPN-сервисов
10. Нет политических высказываний, критики госорганов
11. Нет нарушений закона о рекламе (ложные обещания, гарантии дохода)

Если нашёл проблему — исправь или убери утверждение.
${IMAGE_PRESERVATION}
Верни ИСПРАВЛЕННУЮ статью целиком в Markdown. Без комментариев.`,
```

- [ ] **Step 2: Verify the service-list checks were replaced with Claude/Anthropic fact checks**

Run: `grep -c "ПРОВЕРКА ФАКТОВ ПРО CLAUDE/ANTHROPIC" lib/pipeline/editors.ts && grep -c "ПРОВЕРКА УСЛУГ" lib/pipeline/editors.ts`
Expected: first command prints `1`; second command prints `0`

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors mentioning `editors.ts`

- [ ] **Step 4: Commit**

```bash
git add lib/pipeline/editors.ts
git commit -m "feat(blog): factcheck editor verifies Claude/Anthropic facts instead of Vlad's service list"
```

---

### Task 5: Update cover-style.ts prompt subject line

**Files:**
- Modify: `lib/pipeline/cover-style.ts:48`, `lib/pipeline/cover-style.ts:79`

**Interfaces:**
- Consumes: nothing new.
- Produces: `buildCoverPrompt(concept: string): string` and `buildInlinePrompt(scene: string): string` — signatures unchanged, consumed by `lib/pipeline/image-generator.ts` (not modified in this plan).

- [ ] **Step 1: Update the subject line in `buildCoverPrompt`**

Old string:

```ts
  return `Создай кинематографичную редакторскую обложку для статьи в блоге об AI и автоматизации бизнеса. Стиль — как обложки newsletter a16z: премиально, атмосферно, фотореалистично.
```

New string:

```ts
  return `Создай кинематографичную редакторскую обложку для статьи в блоге про Claude и AI-инструменты. Стиль — как обложки newsletter a16z: премиально, атмосферно, фотореалистично.
```

- [ ] **Step 2: Update the subject line in `buildInlinePrompt`**

Old string:

```ts
  return `Создай кинематографичное редакторское изображение для статьи в блоге об AI и автоматизации бизнеса. Стиль — как обложки newsletter a16z: премиально, атмосферно, фотореалистично.
```

New string:

```ts
  return `Создай кинематографичное редакторское изображение для статьи в блоге про Claude и AI-инструменты. Стиль — как обложки newsletter a16z: премиально, атмосферно, фотореалистично.
```

- [ ] **Step 3: Verify both prompts were updated and the old subject line is gone**

Run: `grep -c "про Claude и AI-инструменты" lib/pipeline/cover-style.ts && grep -c "об AI и автоматизации бизнеса" lib/pipeline/cover-style.ts`
Expected: first command prints `2`; second command prints `0`

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors mentioning `cover-style.ts`

- [ ] **Step 5: Commit**

```bash
git add lib/pipeline/cover-style.ts
git commit -m "feat(blog): cover-art prompts reference Claude instead of business automation"
```

---

### Task 6: Update lvmn-site CLAUDE.md documentation

**Files:**
- Modify: `CLAUDE.md` (Architecture section's cron description, Environment Variables section)

**Interfaces:** none (documentation only).

- [ ] **Step 1: Update the cron pipeline description in the Architecture section**

Old string:

```
System cron (server crontab, CRON_TZ=UTC — replaces the old Vercel Cron)
  scripts/cron-runner.sh curls each endpoint with CRON_SECRET; log: /var/log/lvmn/cron.log
  vercel.json crons are kept for reference only and do NOT run anywhere.
  ├── /api/cron/mine-topics  (every 3 days, 04:00 UTC)
  │     └── Exa trends → Wordstat search demand → Gemini → validate keywords → save topics
  │
  └── /api/cron/generate     (daily, 05:00 UTC = 08:00 MSK)
```

New string:

```
System cron (server crontab, CRON_TZ=UTC — replaces the old Vercel Cron)
  scripts/cron-runner.sh curls each endpoint with CRON_SECRET; log: /var/log/lvmn/cron.log
  vercel.json crons are kept for reference only and do NOT run anywhere.
  ├── /api/cron/mine-topics  (every 3 days, 04:00 UTC)
  │     └── Exa trends + docs.claude.com/anthropic.com scrape → Gemini → save topics
  │         (4 pillars: Claude.ai, Claude Code, business automation via Claude, comparisons/news)
  │
  └── /api/cron/generate     (daily, 05:00 UTC = 08:00 MSK)
```

- [ ] **Step 2: Remove `WORDSTAT_TOKEN` from the Environment Variables block**

Old string:

```
CRON_SECRET                # cron endpoint auth (used by scripts/cron-runner.sh)
BLOG_URL                   # https://vladlyamin.ru
WORDSTAT_TOKEN             # Yandex Wordstat API OAuth token
```

New string:

```
CRON_SECRET                # cron endpoint auth (used by scripts/cron-runner.sh)
BLOG_URL                   # https://vladlyamin.ru
```

- [ ] **Step 3: Remove the leftover mention of `EXA_API_KEY`/Wordstat refresh note tied to the old pipeline description**

Old string:

```
On Vercel these were managed in the dashboard; now they live in
`/var/www/lvmn-site/.env.local` on the server. EXA_API_KEY currently returns 403
(expired) — refresh it for blog autogeneration to work.
```

New string:

```
On Vercel these were managed in the dashboard; now they live in
`/var/www/lvmn-site/.env.local` on the server. EXA_API_KEY currently returns 403
(expired) — refresh it for blog autogeneration to work. `WORDSTAT_TOKEN` is no
longer used (Wordstat validation was dropped when the blog pivoted to Claude
content) — remove it from the server `.env.local` too if present.
```

- [ ] **Step 4: Update `lib/wordstat.ts` reference under Key Files (remove the line)**

Check if `CLAUDE.md`'s "Key Files" section lists `lib/wordstat.ts`. Based on the current file it does not (only pipeline files under `lib/pipeline/` and `lib/wordstat.ts` is referenced only in the Environment Variables comment already handled in Step 2) — run the check below to confirm before skipping further edits.

Run: `grep -n "lib/wordstat" CLAUDE.md`
Expected: no output (the file isn't separately listed under Key Files; if this prints a match, remove that specific line using the same old-string/new-string approach before continuing)

- [ ] **Step 5: Verify Wordstat is gone from the docs and the pillars are mentioned**

Run: `grep -c "Wordstat\|WORDSTAT" CLAUDE.md && grep -c "4 pillars" CLAUDE.md`
Expected: first command prints `0`; second command prints `1`

- [ ] **Step 6: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update lvmn-site CLAUDE.md for Claude content pivot, drop WORDSTAT_TOKEN"
```

---

### Task 7: Final integration check

**Files:** none (verification only, no changes).

- [ ] **Step 1: Full type-check**

Run: `npx tsc --noEmit`
Expected: exits 0 with no errors

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: exits 0 with no errors

- [ ] **Step 3: Confirm no leftover references to the old topic domain in the pipeline**

Run: `grep -rn "n8n\|Telegram-бот" lib/pipeline/topic-miner.ts lib/pipeline/style-guide.ts lib/pipeline/writer.ts`
Expected: no output, OR only occurrences inside the "AI-автоматизация бизнеса через Claude" pillar context (business-automation pillar legitimately mentions bots/n8n as integration targets — if a match appears, read the surrounding line and confirm it's part of that pillar's description, not leftover old-topic boilerplate)

- [ ] **Step 4: Confirm the build still succeeds**

Run: `npm run build`
Expected: exits 0 (build succeeds; this does not call any external AI/Exa API — the pipeline code is server-only and not executed at build time)

- [ ] **Step 5: Note for manual smoke test (not automatable here)**

Running `npx tsx scripts/seed-topic.ts` or `npx tsx scripts/run-pipeline.ts` to see a real generated topic/article requires a valid `EXA_API_KEY` (currently expired per `CLAUDE.md`) and incurs Gemini API cost. This plan does not run it automatically — after deploying, manually trigger the cron endpoints or run the script once with a working key, and eyeball one generated topic + one generated article against the 4 pillars and the new CTA before trusting the pipeline unattended.

- [ ] **Step 6: Final commit if any stray changes remain**

```bash
git status --short
```

If this shows no output, there is nothing to commit — all changes were already committed in Tasks 1-6.
