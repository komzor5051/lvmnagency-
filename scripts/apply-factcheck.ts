/**
 * Applies fact-checked article rewrites back to lvmn_blog_posts.
 *
 * Reads corrected .md files (frontmatter + body) from a directory, matches each
 * to its post by the `id` in the frontmatter, and updates content_md +
 * content_html. HTML goes through the same renderMarkdown() the publisher uses,
 * so the stored markup stays byte-identical in shape to pipeline output.
 *
 * Usage: npx tsx scripts/apply-factcheck.ts <dir> [--dry]
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import fs from "node:fs";
import path from "node:path";

const dir = process.argv[2];
const dryRun = process.argv.includes("--dry");

if (!dir) {
  console.error("Usage: npx tsx scripts/apply-factcheck.ts <dir> [--dry]");
  process.exit(1);
}

function parse(raw: string): { id: string; body: string } | null {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return null;
  const id = m[1].match(/^id:\s*(\S+)$/m)?.[1];
  if (!id) return null;
  return { id, body: m[2].trim() + "\n" };
}

async function main() {
  // Imported lazily so dotenv has already populated SUPABASE_* by the time
  // lib/supabase.ts reads them at module scope.
  const { supabase } = await import("../lib/supabase");
  const { renderMarkdown } = await import("../lib/utils");

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort();
  let updated = 0;

  for (const file of files) {
    const parsed = parse(fs.readFileSync(path.join(dir, file), "utf8"));
    if (!parsed) {
      console.log(`SKIP  ${file} — no frontmatter id`);
      continue;
    }

    const { data: current, error: readErr } = await supabase
      .from("lvmn_blog_posts")
      .select("slug, content_md")
      .eq("id", parsed.id)
      .single();

    if (readErr || !current) {
      console.log(`SKIP  ${file} — post not found (${readErr?.message})`);
      continue;
    }
    if (current.content_md.trim() === parsed.body.trim()) {
      console.log(`SAME  ${current.slug}`);
      continue;
    }

    const before = current.content_md.length;
    const after = parsed.body.length;
    const delta = `${before} → ${after} (${after >= before ? "+" : ""}${after - before})`;

    if (dryRun) {
      console.log(`DRY   ${current.slug}  ${delta}`);
      continue;
    }

    const { error } = await supabase
      .from("lvmn_blog_posts")
      .update({ content_md: parsed.body, content_html: renderMarkdown(parsed.body) })
      .eq("id", parsed.id);

    if (error) {
      console.log(`FAIL  ${current.slug} — ${error.message}`);
      continue;
    }
    console.log(`OK    ${current.slug}  ${delta}`);
    updated++;
  }

  console.log(`\n${dryRun ? "Would update" : "Updated"} ${updated} post(s).`);
}

main();
