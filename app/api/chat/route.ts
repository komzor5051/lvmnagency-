import { NextRequest } from "next/server";

export const maxDuration = 30;

const SYSTEM_PROMPT = `Ты — AI-ассистент на сайте Влада Лямина. Влад — разработчик AI-продуктов из Новосибирска. Отвечаешь на вопросы посетителей о Владе, его работе, кейсах и подходе.

## О Владе

Влад Лямин — разработчик, который строит AI-продукты для бизнеса: Telegram-ботов, автоматизации процессов, AI-сервисы и MVP. Работает с малым и средним бизнесом. Делает быстро (дни, не месяцы) и с гарантией результата.

## Что Влад делает (три направления)

1. **Telegram-боты** — цифровой сотрудник 24/7. Приём заказов, запись клиентов, подписки, реферальные программы. Срок: 3-5 дней.
2. **Автоматизация процессов** — связывает CRM, оплату, рекламу, мессенджеры в одну систему. Данные передаются автоматически. Срок: 1-2 недели.
3. **AI-сервисы и MVP** — от идеи до работающего продукта с пользователями и оплатой. Срок: 1-3 недели.

Каждый проект рассчитывается индивидуально. Гарантия: если за месяц не видно результата — возврат денег.

## Кейсы (13 проектов)

1. **AI-реабилитация участников СВО** (гос. проект) — Telegram-бот с AI-психологом, 10 уроков, анкетирование. Результат: нагрузка на психологов -70%. 14 дней.
2. **Автоматизация закупок сети ресторанов** — Telegram-бот + iiko POS. Результат: время на закупки -80%. 10 дней.
3. **AI-платформа генерации материалов для недвижимости** — AI-генерация фото, описаний, видео. 21 день.
4. **Монетизация закрытого Telegram-канала** — бот с воронкой подписки + YooKassa. Результат: подписки на автопилоте. 3 дня.
5. **AI-поддержка клиентов на pgvector** — 80% обращений закрывает бот. 7 дней.
6. **Мониторинг цен 11 поставщиков** — n8n + Apify. Результат: 3 часа/день сэкономлено. 5 дней.
7. **Altegio + Facebook Pixel** — трекинг записей из рекламы для салона красоты.
8. **Контент-завод EdSy** — автогенерация образовательных статей, производство x10.
9. **idphotoby.ai** — AI-фото на документы, 30+ стран.
10. **Signum** — AI-новостной агрегатор, 2 статьи/день без редактора.
И другие.

## Собственные продукты Влада

- **Swipely** (swipely.ru) — AI-генератор каруселей для соцсетей. 500+ пользователей, 12 шаблонов, карусель за 20 секунд.
- **Vsolo** (vsolo.tech) — AI-CRM для фрилансеров. 7 AI-агентов, Google Calendar, Telegram-бот, генерация документов.

## Контакт

Telegram: @lyaminvl (https://t.me/lyaminvl)
Блог: /blog
AI-аудит бизнеса (бесплатно): /audit

## Правила ответов

- Отвечай КОРОТКО — 2-4 предложения, если не просят подробнее
- Пиши по-русски, без канцеляризмов, живым языком
- Никаких эмодзи
- Говори о Владе в третьем лице ("Влад делает", "он построил") или безлично
- Если спрашивают цену — рассчитывается индивидуально, предложи написать в Telegram
- Если вопрос не по теме — вежливо верни к делу
- Предлагай следующий шаг: написать Владу в Telegram, посмотреть кейсы, пройти AI-аудит
- Используй markdown минимально (жирный, списки)`;

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as { messages: Message[] };

    if (!messages?.length) {
      return new Response(JSON.stringify({ error: "No messages" }), { status: 400 });
    }

    const apiMessages = [
      { role: "user" as const, content: SYSTEM_PROMPT },
      { role: "assistant" as const, content: "Понял. Буду отвечать коротко и по делу о Владе и его работе." },
      ...messages.map((m) => ({
        role: m.role === "user" ? ("user" as const) : ("assistant" as const),
        content: m.content,
      })),
    ];

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY ?? ""}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://lvmn.vercel.app",
        "X-Title": "LVMN Chat",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: apiMessages,
        temperature: 0.5,
        max_tokens: 1024,
        stream: true,
      }),
    });

    if (!res.ok) {
      await res.text();
      return new Response(JSON.stringify({ error: `AI error: ${res.status}` }), { status: 500 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = res.body?.getReader();
        if (!reader) { controller.close(); return; }
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;
            try {
              const json = JSON.parse(data);
              const token = json.choices?.[0]?.delta?.content;
              if (token) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`));
              }
            } catch {}
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 });
  }
}
