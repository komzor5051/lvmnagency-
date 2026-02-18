const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? "";
const BASE_URL = "https://openrouter.ai/api/v1";

const HEADERS = {
  Authorization: `Bearer ${OPENROUTER_API_KEY}`,
  "Content-Type": "application/json",
  "HTTP-Referer": "https://lvmn.vercel.app",
  "X-Title": "LVMN Blog",
};

/** Strip wrapping ```markdown ... ``` that LLMs sometimes add */
function stripCodeFence(text: string): string {
  const trimmed = text.trim();
  const match = trimmed.match(
    /^```(?:markdown|md|html|json)?\s*\n([\s\S]*?)\n```\s*$/
  );
  return match ? match[1] : trimmed;
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
  return stripCodeFence(content);
}

export async function generateImage(prompt: string): Promise<Buffer> {
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      ...HEADERS,
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY ?? ""}`,
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-image",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter image error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const parts = data.choices?.[0]?.message?.content;

  // Response can be array of parts (multimodal) or string
  if (Array.isArray(parts)) {
    for (const part of parts) {
      if (part.type === "image_url" && part.image_url?.url) {
        const url: string = part.image_url.url;
        if (url.startsWith("data:")) {
          const b64 = url.split(",")[1];
          return Buffer.from(b64, "base64");
        }
        // If it's an actual URL, fetch the image
        const imgRes = await fetch(url);
        return Buffer.from(await imgRes.arrayBuffer());
      }
    }
  }

  // Try parsing string content for base64 data
  if (typeof parts === "string") {
    const b64Match = parts.match(
      /data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/
    );
    if (b64Match) {
      return Buffer.from(b64Match[1], "base64");
    }
  }

  throw new Error("No image data in OpenRouter response");
}
