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
  options?: { model?: string; temperature?: number; maxTokens?: number }
): Promise<string> {
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      ...HEADERS,
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY ?? ""}`,
    },
    body: JSON.stringify({
      model: options?.model ?? "google/gemini-2.5-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 8192,
    }),
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
      model: "google/gemini-3-pro-image-preview",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter image error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const message = data.choices?.[0]?.message;

  // OpenRouter returns images in message.images[] array
  const images = message?.images;
  if (Array.isArray(images)) {
    for (const img of images) {
      const url: string = img?.image_url?.url ?? img?.url ?? "";
      if (url.startsWith("data:")) {
        const b64 = url.split(",")[1];
        return Buffer.from(b64, "base64");
      }
      if (url) {
        const imgRes = await fetch(url);
        return Buffer.from(await imgRes.arrayBuffer());
      }
    }
  }

  // Fallback: check content for inline base64
  const content = message?.content;
  if (typeof content === "string") {
    const b64Match = content.match(
      /data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/
    );
    if (b64Match) {
      return Buffer.from(b64Match[1], "base64");
    }
  }

  throw new Error("No image data in OpenRouter response");
}
