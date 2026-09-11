import { config } from "dotenv";
config({ path: ".env.local" });

// The 2026-09 Supabase migration carried over covers only: the in-article
// illustrations (img-*.png) stayed in the deleted project and are gone for
// good. This strips every markdown image that points at the dead host and
// re-renders content_html so the site stops shipping broken <img> tags.
//
//   npx tsx scripts/strip-dead-images.ts --dry    (report, change nothing)
//   npx tsx scripts/strip-dead-images.ts

const DEAD_HOST = "kjkwbcnurljlebqiqxlz.supabase.co";

// Alt texts in the old pipeline output are not always well-formed (some
// contain brackets and span list items), so a single regex misses matches.
// Instead: find each dead URL, walk back to the nearest "![", cut to the
// closing paren. A span longer than this is malformed beyond repair and is
// reported instead of silently deleted.
const MAX_IMAGE_SPAN = 1200;

function strip(md: string): { text: string; removed: number; skipped: number } {
  let text = md;
  let removed = 0;
  let skipped = 0;

  for (;;) {
    const url = text.indexOf(DEAD_HOST);
    if (url === -1) break;

    const open = text.lastIndexOf("![", url);
    const close = text.indexOf(")", url);
    if (close === -1) {
      skipped++;
      text = text.slice(0, url) + "УДАЛЁННЫЙ-ХОСТ" + text.slice(url + DEAD_HOST.length);
      continue;
    }

    if (open === -1 || url - open > MAX_IMAGE_SPAN) {
      // Dangling link tail: the old pipeline dropped the opening "![" and left
      // a bare `](url)` glued to the previous sentence. Cut the tail only, so
      // the surrounding text survives, and flag the post for a human read.
      const tail = text.lastIndexOf("](", url);
      const start = tail === -1 ? url : tail;
      text = text.slice(0, start).replace(/["'\s]+$/, "") + text.slice(close + 1);
      skipped++;
      continue;
    }

    text = text.slice(0, open) + text.slice(close + 1);
    removed++;
  }

  text = text.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  return { text, removed, skipped };
}

async function run() {
  const dry = process.argv.includes("--dry");
  const { supabase } = await import("../lib/supabase");
  const { renderMarkdown } = await import("../lib/utils");

  const { data: posts, error } = await supabase
    .from("lvmn_blog_posts")
    .select("id, slug, content_md")
    .eq("status", "published");
  if (error) throw new Error(`Supabase error: ${error.message}`);

  const affected = (posts ?? []).filter((p) => (p.content_md ?? "").includes(DEAD_HOST));
  console.log(`Статей с битыми картинками: ${affected.length}`);

  let removed = 0;
  const malformed: string[] = [];
  for (const post of affected) {
    const before = post.content_md as string;
    const { text: after, removed: count, skipped } = strip(before);
    removed += count;
    if (skipped > 0) {
      malformed.push(`${post.slug} (${skipped})`);
    }
    if (after.includes(DEAD_HOST)) {
      throw new Error(`${post.slug}: ссылка на мёртвый хост осталась после чистки`);
    }
    if (dry) {
      console.log(`  ${post.slug}: -${count}${skipped ? ` (кривых: ${skipped})` : ""}`);
      continue;
    }

    const { error: updErr } = await supabase
      .from("lvmn_blog_posts")
      .update({ content_md: after, content_html: renderMarkdown(after) })
      .eq("id", post.id);
    if (updErr) throw new Error(`${post.slug}: ${updErr.message}`);
    console.log(`  ${post.slug}: -${count}${skipped ? ` (кривых: ${skipped})` : ""}`);
  }

  console.log(`${dry ? "Нашёл" : "Вырезал"} картинок: ${removed}`);
  if (malformed.length > 0) {
    console.log(`Обрезан хвост без открывающего «![», текст нужно вычитать глазами: ${malformed.join(", ")}`);
  }
  if (!dry) console.log("Дальше: npx tsx scripts/export-posts.ts");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
