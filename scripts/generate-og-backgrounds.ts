/**
 * Generates static OG background images via AI (OpenRouter/Gemini).
 * Run once: npx tsx scripts/generate-og-backgrounds.ts
 * Output: public/og-home-bg.png, public/og-products-bg.png
 *
 * Text is NOT baked in — it's overlaid by opengraph-image.tsx at build time.
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? "";

if (!OPENROUTER_API_KEY) {
  console.error("OPENROUTER_API_KEY not set in .env.local");
  process.exit(1);
}

async function generateImage(prompt: string): Promise<Buffer> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://vladlyamin.ru",
      "X-Title": "Vlad Lyamin Site",
    },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash-exp:free",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const message = data.choices?.[0]?.message;

  const images = message?.images;
  if (Array.isArray(images)) {
    for (const img of images) {
      const url: string = img?.image_url?.url ?? img?.url ?? "";
      if (url.startsWith("data:")) {
        return Buffer.from(url.split(",")[1], "base64");
      }
      if (url) {
        const imgRes = await fetch(url);
        return Buffer.from(await imgRes.arrayBuffer());
      }
    }
  }

  const content = message?.content;
  if (typeof content === "string") {
    const b64Match = content.match(
      /data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/
    );
    if (b64Match) return Buffer.from(b64Match[1], "base64");
  }

  throw new Error("No image data in response. Check model supports image generation.");
}

const BASE_STYLE = `
Minimal abstract composition for a personal brand OG card. Landscape 16:9 ratio.
Color palette: ONLY white (#FFFFFF), off-white (#F5F4F1), and lime green (#C8F04C).
No text, no people, no UI elements, no gradients.
Style: editorial minimal, Swiss graphic design, clean geometry.
The LEFT 2/3 of the image must be a clean white/off-white area with minimal texture
— this space will have text overlaid on it.
The RIGHT 1/3 can have a geometric accent: thin lime lines, a lime rectangle,
abstract angular shapes, or a subtle grid pattern. Sharp, flat, no shadows, no blur.
Think: poster design, editorial layout, Helvetica-era Swiss modernism.
`;

const PROMPTS: { name: string; extra: string }[] = [
  {
    name: "og-home-bg",
    extra:
      "The right side has a bold vertical lime (#C8F04C) stripe with thin black horizontal rules crossing it, like a minimal editorial layout. Very clean, very precise.",
  },
  {
    name: "og-products-bg",
    extra:
      "The right side has three stacked lime (#C8F04C) rectangles of different widths arranged like a minimal bar chart or product cards skeleton. Flat, geometric, no shadows.",
  },
];

const OUT_DIR = path.join(process.cwd(), "public");

async function main() {
  for (const { name, extra } of PROMPTS) {
    const outPath = path.join(OUT_DIR, `${name}.png`);
    console.log(`Generating ${name}...`);

    try {
      const buf = await generateImage(`${BASE_STYLE}\n${extra}`);
      fs.writeFileSync(outPath, buf);
      console.log(`  Saved: ${outPath} (${buf.length} bytes)`);
    } catch (err) {
      console.error(`  Failed: ${err}`);
      console.log("  Trying with gemini-3-pro-image-preview model...");
      // retry with the model used in the blog pipeline
      try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://vladlyamin.ru",
            "X-Title": "Vlad Lyamin Site",
          },
          body: JSON.stringify({
            model: "google/gemini-3-pro-image-preview",
            messages: [{ role: "user", content: `${BASE_STYLE}\n${extra}` }],
          }),
        });
        const data = await res.json();
        const message = data.choices?.[0]?.message;
        const images = message?.images;
        if (Array.isArray(images) && images.length > 0) {
          const url = images[0]?.image_url?.url ?? images[0]?.url ?? "";
          let buf2: Buffer;
          if (url.startsWith("data:")) {
            buf2 = Buffer.from(url.split(",")[1], "base64");
          } else {
            const ir = await fetch(url);
            buf2 = Buffer.from(await ir.arrayBuffer());
          }
          fs.writeFileSync(outPath, buf2);
          console.log(`  Saved (retry): ${outPath} (${buf2.length} bytes)`);
        } else {
          console.error("  Retry also failed — no image data");
        }
      } catch (err2) {
        console.error(`  Retry failed: ${err2}`);
      }
    }
  }
}

main();
