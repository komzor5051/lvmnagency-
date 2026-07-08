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
