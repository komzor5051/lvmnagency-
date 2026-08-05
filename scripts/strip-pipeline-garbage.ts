/**
 * Strips leaked pipeline output from published posts.
 *
 * Some articles were published with the editor pass's own fact-check report
 * wrapped around (or in front of) the actual body, and two were additionally
 * fenced in a ```markdown block. This removes only that scaffolding — the
 * article text itself is left byte-identical.
 *
 * Line ranges are 1-based and inclusive, taken from a manual read of each post.
 *
 * Usage: npx tsx scripts/strip-pipeline-garbage.ts [--dry]
 */
import { config } from "dotenv";
config({ path: ".env.local" });

const dryRun = process.argv.includes("--dry");

/** slug -> [firstKeptLine, lastKeptLine] of the real article body */
const KEEP: Record<string, [number, number]> = {
  "ii-agenty-kak-oni-zamenili-3-moikh-menedzhera-za-mesyats": [60, 198],
  "chatgpt-v-crm-kak-ya-vyzhimayu-iz-nego-100-pribyli": [39, 174],
  "ii-analitik-dlya-startapa-kak-sekonomit-million": [55, 249],
  "roi-ii-formula-kotoruyu-skryvayut-integratory": [6, 168],
  "pochemu-tvoy-zapier-ne-spravlyaetsya-delaem-make-n8n": [47, 167],
};

const GARBAGE = /ФАКТЧЕК|ЮРИДИЧЕСКАЯ ПРОВЕРКА|ПРОВЕРКА УСЛУГ|ИСПРАВЛЕННАЯ СТАТЬЯ|Обоснование изменений|Все необходимые исправления внесены/i;

async function main() {
  const { supabase } = await import("../lib/supabase");
  const { renderMarkdown } = await import("../lib/utils");

  for (const [slug, [from, to]] of Object.entries(KEEP)) {
    const { data: post, error } = await supabase
      .from("lvmn_blog_posts")
      .select("id, content_md")
      .eq("slug", slug)
      .single();

    if (error || !post) {
      console.log(`SKIP  ${slug} — ${error?.message ?? "not found"}`);
      continue;
    }

    const lines = post.content_md.split("\n");
    const body = lines.slice(from - 1, to).join("\n").trim() + "\n";

    // Refuse to write if the slice still smells like the report, or if the
    // article text would come out mangled — a wrong line range must fail loud.
    if (GARBAGE.test(body)) {
      console.log(`FAIL  ${slug} — garbage still present in kept range`);
      continue;
    }
    if (body.includes("```markdown") || body.trim().endsWith("```")) {
      console.log(`FAIL  ${slug} — stray code fence in kept range`);
      continue;
    }
    if (body.length < 3000) {
      console.log(`FAIL  ${slug} — kept body suspiciously short (${body.length})`);
      continue;
    }

    const delta = `${post.content_md.length} → ${body.length} (-${post.content_md.length - body.length})`;
    if (dryRun) {
      console.log(`DRY   ${slug}  ${delta}`);
      console.log(`      начало: ${body.slice(0, 80)}…`);
      continue;
    }

    const { error: upErr } = await supabase
      .from("lvmn_blog_posts")
      .update({ content_md: body, content_html: renderMarkdown(body) })
      .eq("id", post.id);

    console.log(upErr ? `FAIL  ${slug} — ${upErr.message}` : `OK    ${slug}  ${delta}`);
  }
}

main();
