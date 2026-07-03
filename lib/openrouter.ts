const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? "";
const BASE_URL = "https://openrouter.ai/api/v1";

const HEADERS = {
  Authorization: `Bearer ${OPENROUTER_API_KEY}`,
  "Content-Type": "application/json",
  "HTTP-Referer": "https://lvmn.vercel.app",
  "X-Title": "Vlad Lyamin Blog",
};

/** Strip wrapping ```markdown ... ``` and LLM preamble artifacts */
function stripArtifacts(text: string): string {
  let clean = text.trim();

  // Strip code fences
  const fenceMatch = clean.match(
    /^```(?:markdown|md|html|json)?\s*\n([\s\S]*?)\n```\s*$/
  );
  if (fenceMatch) clean = fenceMatch[1];

  // Strip LLM preamble ("Вот исправленная статья...", "Here is...", etc.)
  clean = clean.replace(
    /^(?:Вот\s+(?:исправленная|отредактированная|готовая|обновлённая|переработанная)\s+статья[^:]*:\s*\n*)/i,
    ""
  );

  // Strip article delimiters from editor prompts
  clean = clean.replace(/^---\s*СТАТЬЯ\s*---\s*\n*/m, "");
  clean = clean.replace(/\n*---\s*КОНЕЦ СТАТЬИ\s*---\s*$/m, "");

  // Strip stray date line at the very start (e.g. "19 февраля 2026 г.")
  clean = clean.replace(/^\d{1,2}\s+(?:января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)\s+\d{4}\s*г?\.?\s*\n+/i, "");

  return clean.trim();
}

export async function chatCompletion(
  prompt: string,
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    // Reasoning ("thinking") models like gemini-2.5-flash spend hidden tokens on
    // reasoning that count against max_tokens — left on, they can truncate the
    // visible answer mid-output. Pass { enabled: false } for tasks that need a
    // complete, parseable response (e.g. JSON generation).
    reasoning?: { enabled?: boolean; max_tokens?: number; effort?: string };
    // OpenRouter native JSON mode — forces a clean JSON object with no markdown
    // fences, removing the need to strip ```json wrappers before parsing.
    responseFormat?: { type: "json_object" };
  }
): Promise<string> {
  const body: Record<string, unknown> = {
    model: options?.model ?? "google/gemini-2.5-flash",
    messages: [{ role: "user", content: prompt }],
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 8192,
  };
  if (options?.reasoning) body.reasoning = options.reasoning;
  if (options?.responseFormat) body.response_format = options.responseFormat;

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      ...HEADERS,
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY ?? ""}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from OpenRouter");
  return stripArtifacts(content);
}

export async function generateImage(prompt: string): Promise<Buffer> {
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      ...HEADERS,
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY ?? ""}`,
    },
    body: JSON.stringify({
      model: "openai/gpt-5.4-image-2",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter image error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const message = data.choices?.[0]?.message;

  // Response has images in message.images[].image_url
  const images = message?.images;
  if (Array.isArray(images) && images.length > 0) {
    const url: string = images[0]?.image_url?.url ?? images[0]?.url ?? "";
    if (url.startsWith("data:")) {
      const b64 = url.split(",")[1];
      return Buffer.from(b64, "base64");
    }
    if (url) {
      const imgRes = await fetch(url);
      return Buffer.from(await imgRes.arrayBuffer());
    }
  }

  throw new Error("No image data in OpenRouter response");
}
