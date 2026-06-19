// One-off: generate a brand logo mark via OpenRouter (Gemini image model).
// Usage: npx tsx scripts/gen-logo.ts [variantLabel]
import { config } from "dotenv";
config({ path: ".env.local" });
import { writeFileSync } from "fs";
import { generateImage } from "../lib/openrouter";

const label = process.argv[2] ?? "a";

const PROMPTS: Record<string, string> = {
  // Monogram mark in a solid square — favicon-friendly.
  a: `Design a minimalist logo mark for the personal brand of an AI engineer named "Влад Лямин".
A single solid black (#111111) square with perfectly sharp corners (no rounding).
Inside, the Cyrillic monogram "ВЛ" in bright lime green (#C8F04C),
set in a bold, geometric, condensed grotesque typeface with thick even strokes,
perfectly centered with generous even padding.
Flat 2D vector style. Swiss/International typographic design. Extremely clean.
Absolutely NO gradients, NO shadows, NO 3D, NO glow, NO bevel, NO texture, NO outline, NO extra shapes or decoration.
High contrast, crisp hard edges, must stay legible when scaled down to 16px.
1:1 square composition, the mark fills ~80% of the frame on a plain white backdrop.`,
  // Abstract geometric mark (no letters) — fallback if Cyrillic renders badly.
  b: `Design a minimalist abstract geometric logo mark for an AI engineer's personal brand.
A single bold mark built from clean straight lines / right angles suggesting the letters В and Л interlocking,
solid black (#111111) with one accent shape in bright lime green (#C8F04C).
Flat 2D vector, Swiss design, thick consistent strokes, lots of negative space.
NO gradients, NO shadows, NO 3D, NO glow, NO text labels, NO words, NO decoration.
Crisp hard edges, legible at 16px. 1:1 square on a plain white backdrop, mark centered, ~70% of frame.`,
};

async function main() {
  const prompt = PROMPTS[label];
  if (!prompt) throw new Error(`unknown variant ${label}`);
  console.log(`generating logo variant "${label}"...`);
  const buf = await generateImage(prompt);
  const out = `public/logo-gen-${label}.png`;
  writeFileSync(out, buf);
  console.log(`saved ${out} (${buf.length} bytes)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
