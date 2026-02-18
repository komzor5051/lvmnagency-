import { generatePro } from "@/lib/gemini";
import { searchSources } from "@/lib/researcher";
import { supabase } from "@/lib/supabase";
import { collectSeedQueries, getSearchVolume } from "@/lib/wordstat";

interface GeneratedTopic {
  title: string;
  angle: string;
  keywords: string[];
  score: number;
}

const WORDSTAT_SEEDS = [
  "автоматизация бизнеса",
  "AI для бизнеса",
  "нейросети для бизнеса",
  "Telegram бот для бизнеса",
  "n8n автоматизация",
  "ChatGPT для бизнеса",
  "внедрение ИИ в бизнес",
  "AI автоматизация процессов",
];

export async function mineTopics(): Promise<GeneratedTopic[]> {
  // 1. Research current AI trends
  const trends = await searchSources(
    "AI автоматизация бизнеса нейросети тренды внедрение ChatGPT", 8
  );
  const trendSummary = trends.map((t) => `- ${t.title}: ${t.summary}`).join("\n");

  // 2. Fetch real search demand from Wordstat
  let searchDemandContext = "";
  try {
    console.log("[topic-miner] Fetching Wordstat search demand...");
    const seedData = await collectSeedQueries(WORDSTAT_SEEDS, 5);
    if (seedData.length > 0) {
      searchDemandContext = `\nРЕАЛЬНЫЙ ПОИСКОВЫЙ СПРОС (Яндекс Wordstat):
${seedData.map((q) => `- "${q.phrase}" — ${q.volume} запросов/мес`).join("\n")}
Используй эти данные: темы с высоким спросом получают больший score.
Включай популярные фразы в keywords.\n`;
      console.log(`[topic-miner] Got ${seedData.length} Wordstat queries`);
    }
  } catch (err) {
    console.warn("[topic-miner] Wordstat unavailable, continuing without:", err);
  }

  // 3. Get existing topics to avoid duplicates
  const { data: existing } = await supabase
    .from("lvmn_blog_topics")
    .select("title")
    .order("created_at", { ascending: false })
    .limit(50);

  const existingTitles = (existing ?? []).map((t) => t.title).join("\n");

  // 4. Generate new topics
  const prompt = `Ты контент-стратег блога AI-агентства LVMN — агентства по внедрению AI-автоматизации в бизнес.

Тренды:
${trendSummary}
${searchDemandContext}
Уже опубликованные (НЕ повторяй):
${existingTitles || "Пока нет публикаций"}

Сгенерируй 10 тем для блога.

ТЕМАТИКА — AI-автоматизация для бизнеса:
- Кейсы внедрения AI в бизнес-процессы
- ROI автоматизации (конкретные цифры)
- Сравнения инструментов (n8n, Make, Zapier)
- Telegram-боты для бизнеса
- Тренды нейросетей с практическим применением
- Ошибки при внедрении AI
- Гайды по конкретным задачам автоматизации

СТИЛЬ ЗАГОЛОВКОВ — разговорный, как пост в Telegram. Примеры ХОРОШИХ тем:
- "Собрал бота для ресторана за 3 дня — вот что вышло"
- "Почему 90% AI-проектов умирают после демо"
- "n8n vs Make: что выбрать для автоматизации"
- "Как Telegram-бот сэкономил ресторану 40 часов в месяц"
- "5 процессов, которые любой бизнес может автоматизировать за неделю"
- "ChatGPT для бизнеса: 3 реальных кейса, а не маркетинговый бред"

Примеры ПЛОХИХ тем (НЕ ДЕЛАЙ ТАК):
- "Обзор возможностей современных нейросетей" — размыто
- "Инновационные подходы к автоматизации бизнеса" — AI-слоп
- "Как искусственный интеллект трансформирует бизнес" — клише
- "Тренды цифровой трансформации 2026" — скучно

КЛЮЧЕВЫЕ СЛОВА:
- 50% тем — популярные запросы (автоматизация бизнеса, Telegram бот, нейросети для бизнеса, ChatGPT для работы)
- 50% тем — низкочастотные длинные запросы ("как автоматизировать приём заявок", "бот для записи клиентов Telegram")

ЗАПРЕЩЁННЫЕ ТЕМЫ (не генерируй):
- Инструкции по обходу блокировок
- Обзоры VPN-сервисов
- Политические темы
- Темы про мультичаты/агрегаторы нейросетей (это продукт Sabka, не LVMN)

Каждая тема должна:
- Быть практичной (как сделать X, кейс Y, сравнение Z vs W)
- Иметь конкретный угол, отличающий от типичных статей
- Заголовок ≤ 55 символов

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

  // 5. Validate keywords against Wordstat and enrich scores
  for (const topic of topics) {
    try {
      const mainKeyword = topic.keywords[0];
      if (mainKeyword) {
        const volume = await getSearchVolume(mainKeyword);
        if (volume > 0) {
          // Boost score based on search volume
          const boost = volume >= 1000 ? 3 : volume >= 300 ? 2 : volume >= 100 ? 1 : 0;
          topic.score = Math.min(10, topic.score + boost);
          console.log(`[topic-miner] "${mainKeyword}" → ${volume} searches, score ${topic.score}`);
        }
      }
    } catch {
      // Wordstat validation is best-effort
    }
  }

  // 6. Save to Supabase
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
