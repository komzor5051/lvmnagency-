/**
 * Build-time halftone map generator for the homepage particle engine.
 *
 * Reads public/portrait.jpg, samples it on a coarse grid and writes:
 *  - public/portrait-map.json      — packed [x, y, r] points, normalized 0..1
 *  - public/portrait-halftone.png  — static halftone fallback image
 *
 * Run: npx tsx scripts/generate-portrait-map.ts
 */
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const SRC = path.join(process.cwd(), "public/portrait.jpg");
const OUT_JSON = path.join(process.cwd(), "public/portrait-map.json");
const OUT_PNG = path.join(process.cwd(), "public/portrait-halftone.png");

const GRID_W = 72; // sample columns
const MAX_POINTS = 3200; // matches the engine's particle budget
const MIN_DARKNESS = 0.12; // skip near-white cells

async function main() {
  const img = sharp(SRC).grayscale();
  const meta = await img.metadata();
  if (!meta.width || !meta.height) throw new Error("cannot read portrait.jpg");
  const aspect = meta.height / meta.width;
  const gridH = Math.round(GRID_W * aspect);

  const { data } = await img
    .resize(GRID_W, gridH, { fit: "fill" })
    .raw()
    .toBuffer({ resolveWithObject: true });

  type Pt = { x: number; y: number; r: number };
  const pts: Pt[] = [];
  for (let y = 0; y < gridH; y++) {
    for (let x = 0; x < GRID_W; x++) {
      const darkness = 1 - data[y * GRID_W + x] / 255;
      if (darkness < MIN_DARKNESS) continue;
      pts.push({
        x: (x + 0.5) / GRID_W,
        y: (y + 0.5) / gridH,
        r: 0.25 + darkness * 0.75,
      });
    }
  }
  // Keep the darkest points if over budget.
  pts.sort((a, b) => b.r - a.r);
  const kept = pts.slice(0, MAX_POINTS);
  // Restore spatial order so index-based sampling stays roughly uniform.
  kept.sort((a, b) => a.y - b.y || a.x - b.x);

  const flat: number[] = [];
  for (const p of kept) {
    flat.push(+p.x.toFixed(4), +p.y.toFixed(4), +p.r.toFixed(3));
  }
  await fs.writeFile(
    OUT_JSON,
    JSON.stringify({ aspect: +aspect.toFixed(4), pts: flat })
  );

  // Static halftone fallback (white bg, ink dots, every 17th dot lime).
  const W = 960;
  const H = Math.round(W * aspect);
  const cell = W / GRID_W;
  const circles = kept
    .map((p, i) => {
      const fill = i % 17 === 0 ? "#C8F04C" : "#111111";
      const cx = (p.x * W).toFixed(1);
      const cy = (p.y * H).toFixed(1);
      const r = (p.r * cell * 0.48).toFixed(2);
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
    })
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="100%" height="100%" fill="#FFFFFF"/>${circles}</svg>`;
  await sharp(Buffer.from(svg)).png().toFile(OUT_PNG);

  const jsonSize = (await fs.stat(OUT_JSON)).size;
  const pngSize = (await fs.stat(OUT_PNG)).size;
  console.log(
    `points: ${kept.length}, json: ${(jsonSize / 1024).toFixed(1)} KB, png: ${(pngSize / 1024).toFixed(1)} KB`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
