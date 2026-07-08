import { generateFlash } from "@/lib/gemini";

type EditorRole = "structure" | "coherence" | "anti-slop" | "factcheck";

const IMAGE_PRESERVATION = `
ВАЖНО: В статье есть плейсхолдеры для картинок в формате ![IMG: описание](placeholder).
НЕ УДАЛЯЙ и НЕ ИЗМЕНЯЙ их! Оставь их точно как есть, на тех же местах.`;

const EDITOR_PROMPTS: Record<EditorRole, string> = {
  structure: `Ты редактор-структуралист. Проверь и исправь статью:

1. Первый абзац ЦЕПЛЯЕТ? Если нет — перепиши хук.
2. После хука есть краткий пересказ "В этой статье: ..."? Если нет — добавь 2-3 предложения.
3. Заголовки логичны и информативны? Исправь размытые.
4. Используются ТОЛЬКО ## (H2) и ### (H3)? Если есть # (H1) — убери его.
5. Есть ли "мост" между секциями? Добавь переходы.
6. CTA-секция в конце понятна и мотивирует?
7. CTA ведёт на гайд «AI вместо команды» (https://vladlyamin.ru/products/guide), а не на консультацию/Telegram?
${IMAGE_PRESERVATION}
Верни ИСПРАВЛЕННУЮ статью целиком в Markdown. Без комментариев.`,

  coherence: `Ты редактор связности. Проверь и исправь статью:

1. Нет ли повторов мыслей/фраз в разных абзацах?
2. Абзацы перетекают друг в друга логично?
3. Аргументация последовательна?
4. Примеры поддерживают тезисы?
5. Есть минимум 1 ссылка на https://vladlyamin.ru или https://vladlyamin.ru/products/guide? Если нет — вставь естественно (без консультации/Telegram — CTA ведёт на гайд, не на разговор с Владом).
${IMAGE_PRESERVATION}
Верни ИСПРАВЛЕННУЮ статью целиком в Markdown. Без комментариев.`,

  "anti-slop": `Ты редактор-чистильщик. Убери из статьи AI-слоп, канцелярит и штампы.

ЗАМЕНЫ ТЕРМИНОВ (СТРОГО):
- "AI" → "ИИ" (везде, кроме названий моделей типа "Google AI")
- "VPN" → "ВИПИЭН"

УДАЛИ/ЗАМЕНИ эти фразы:

ГЛАВНЫЙ ЗАПРЕТ — КОНСТРУКЦИЯ "ЭТО НЕ X, ЭТО Y" (самый явный нейрослоп):
- "Это не проблема X. Это проблема Y." → переписать через утверждение: "Проблема в Y."
- "Это не X. Это Y." → убрать, оставить только Y
- "Это не X, это Y." → то же
- "Это не просто X, а Y." → убрать конструкцию целиком
- "это не просто X, а Y" → убрать конструкцию целиком
- Любой вариант "Это не... Это..." где два предложения подряд по этому шаблону — переписать

- "в мире X", "в эпоху X" → убрать
- "в современном мире", "как известно" → убрать
- "безусловно", "несомненно", "разумеется" → убрать
- "стоит отметить", "важно понимать", "необходимо подчеркнуть" → убрать
- "не стоит забывать" → убрать
- "данный" → "этот" или убрать
- "является" → простая форма ("X является Y" → "X — это Y")
- "таким образом", "как следствие" → упростить или убрать
- "революционный", "инновационный", "передовой" → убрать
- "позволяет оптимизировать", "способствует повышению" → переписать по-человечески
- Пассивный залог → активный
- Слишком длинные предложения (30+ слов) → разбить

ЛИМИТЫ (максимум за статью):
- "кроме того" / "более того" / "помимо этого" — максимум 1 раз
- "однако" — максимум 1 раз
- "по сути" — максимум 1 раз

ПРОВЕРКА ВАРИАТИВНОСТИ:
- Если 3+ предложений подряд одинаковой длины (10-15 слов) — переписать: чередуй короткие (3-5 слов) с длинными (20-30 слов)
- Если 3+ абзацев подряд одинакового размера (2-3 предложения) — переписать: чередуй короткие (1 предложение) с длинными (4-6 предложений)

Текст должен звучать как живой человек, не как ИИ-генерация. Сохрани смысл и экспертность.
${IMAGE_PRESERVATION}
Верни ИСПРАВЛЕННУЮ статью целиком в Markdown. Без комментариев.`,

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
};

export async function editArticle(
  content: string,
  role: EditorRole
): Promise<string> {
  const prompt = `${EDITOR_PROMPTS[role]}

--- СТАТЬЯ ---
${content}
--- КОНЕЦ СТАТЬИ ---`;

  return generateFlash(prompt);
}

export async function runAllEditors(content: string): Promise<string> {
  // Extract image placeholders before editing — LLMs often remove them despite instructions
  const imgRegex = /!\[IMG:\s*.+?\]\(placeholder\)/g;
  const imgPlaceholders = content.match(imgRegex) ?? [];

  const roles: EditorRole[] = ["structure", "coherence", "anti-slop", "factcheck"];
  let result = content;
  for (const role of roles) {
    result = await editArticle(result, role);
  }

  // Re-insert lost placeholders after H2 headings
  if (imgPlaceholders.length > 0) {
    const surviving = (result.match(imgRegex) ?? []).length;
    if (surviving < imgPlaceholders.length) {
      const lost = imgPlaceholders.filter((p) => !result.includes(p));
      const h2Positions: number[] = [];
      const h2Regex = /^## .+$/gm;
      let m;
      while ((m = h2Regex.exec(result)) !== null) {
        // Position right after the H2 line
        const endOfLine = result.indexOf("\n", m.index + m[0].length);
        if (endOfLine !== -1) h2Positions.push(endOfLine + 1);
      }

      // Distribute lost placeholders evenly across H2 positions
      for (let i = 0; i < lost.length && i < h2Positions.length; i++) {
        const posIndex = Math.floor((i / lost.length) * h2Positions.length);
        const insertAt = h2Positions[posIndex];
        result = result.slice(0, insertAt) + "\n" + lost[i] + "\n\n" + result.slice(insertAt);
        // Shift remaining positions
        const shift = lost[i].length + 3;
        for (let j = posIndex + 1; j < h2Positions.length; j++) {
          h2Positions[j] += shift;
        }
      }
      console.log(`[editors] Re-inserted ${lost.length} lost IMG placeholders`);
    }
  }

  return result;
}
