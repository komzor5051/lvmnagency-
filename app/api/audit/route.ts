import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/openrouter";

export const maxDuration = 30;

interface AuditRequest {
  niche: string;
  teamSize: string;
  routines: string[];
  tools: string[];
  biggestPain: string;
  triedAI: string;
}

const SYSTEM_PROMPT = `Ты -- эксперт по AI-автоматизации бизнес-процессов в агентстве LVMN. Проводишь бесплатный AI-аудит для малого и среднего бизнеса.

На основе ответов пользователя сгенерируй персональный аудит в формате JSON (строго JSON, без markdown-обёрток):

{
  "summary": "Краткий вывод -- 2-3 предложения о состоянии бизнеса и потенциале автоматизации",
  "automations": [
    {
      "title": "Название автоматизации",
      "description": "Что конкретно автоматизируем и как",
      "timeSaved": "Сколько часов/неделю экономим",
      "complexity": "simple | medium | complex",
      "priority": 1
    }
  ],
  "totalTimeSaved": "Итого часов/неделю",
  "totalMoneySaved": "Примерная экономия руб/мес (исходя из средней ЗП 60к для сотрудника)",
  "firstStep": "Что автоматизировать в первую очередь и почему"
}

Правила:
- Давай 3-5 конкретных автоматизаций, релевантных ИМЕННО этой нише и этим процессам
- Будь конкретным: не "автоматизация процессов", а "бот принимает заказы в Telegram и создаёт запись в CRM"
- Считай экономию реалистично: часы в неделю x стоимость часа сотрудника
- Complexity: simple = 3-5 дней, medium = 1-2 недели, complex = 2-4 недели
- Приоритет от 1 (делать первым) до 5
- Пиши по-русски, без канцеляризмов, коротко и конкретно
- Никаких эмодзи`;

export async function POST(req: NextRequest) {
  try {
    const body: AuditRequest = await req.json();

    if (!body.niche || !body.teamSize || !body.routines?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const userPrompt = `Проведи AI-аудит для бизнеса:

Ниша: ${body.niche}
Размер команды: ${body.teamSize}
Рутинные задачи, которые отнимают время: ${body.routines.join(", ")}
Используемые инструменты: ${body.tools.join(", ")}
Главная боль: ${body.biggestPain}
Пробовали AI раньше: ${body.triedAI}`;

    const result = await chatCompletion(`${SYSTEM_PROMPT}\n\n${userPrompt}`, {
      model: "google/gemini-2.5-flash",
      temperature: 0.4,
      maxTokens: 4096,
    });

    // Parse JSON from response
    let parsed;
    try {
      // Strip potential markdown code fences
      const clean = result.replace(/^```(?:json)?\s*\n?/m, "").replace(/\n?```\s*$/m, "");
      parsed = JSON.parse(clean);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response", raw: result },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Audit API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
