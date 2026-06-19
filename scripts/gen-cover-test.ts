// One-off: validate the cover style. Usage: npx tsx scripts/gen-cover-test.ts
import { config } from "dotenv";
config({ path: ".env.local" });
import { writeFileSync } from "fs";
import { generateImage } from "../lib/openrouter";
import { buildCoverPrompt } from "../lib/pipeline/cover-style";

// Sample article: "Почему 90% AI-проектов умирают после демо"
const concept =
  "Силуэт человека в рубашке за ноутбуком у большого панорамного окна в ПРАВОЙ части кадра; за окном догорает закат над городом. Левая половина комнаты — в глубокой тени, пустая. Тёплый контровой свет заката, холодные синие тени, лёгкая дымка, ощущение незаконченного дела.";

async function main() {
  const prompt = buildCoverPrompt(concept);
  console.log("generating test cover...");
  const buf = await generateImage(prompt);
  writeFileSync("public/cover-test.png", buf);
  console.log(`saved public/cover-test.png (${buf.length} bytes)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
