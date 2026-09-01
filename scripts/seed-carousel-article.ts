import { config } from "dotenv";
config({ path: ".env.local" });

import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { renderMarkdown, slugify } from "../lib/utils";

// One-off publisher for the hand-written carousel-system article. The
// auto-pipeline is not involved: the markdown is written by hand in Obsidian,
// so nothing here calls a model. Slides referenced by the article live in
// public/carousels/ as webp — served statically, not from Supabase Storage.
const SOURCE =
  "/Users/lvmn/Obsidian/Бизнес/04 Контент/Черновики/Статья — система каруселей.md";

const SLUG = "kak-ya-sobral-sistemu-karuseley";
const META_DESC =
  "Разобрал 46 чужих каруселей по одному шаблону и собрал из разбора свою систему: семь закономерностей, шесть стилей, библиотека логотипов и рендерер, который делает карусель из текстового файла за 20 минут.";
const TAGS = [
  "карусели",
  "дизайн",
  "контент",
  "Instagram",
  "реверс-инжиниринг",
];
const CTA_URL = "/products/guide";

// Supabase is periodically unreachable (egress quota, and the VPS cannot reach
// *.supabase.co at all). `--snapshot` writes the post straight into the
// snapshot the site falls back to, so the article ships without the database.
// Run the plain form again once Supabase is healthy: export-posts.ts rebuilds
// the snapshot from the table and would otherwise drop a snapshot-only post.
const SNAPSHOT_ONLY = process.argv.includes("--snapshot");
const SNAPSHOT_PATH = path.join(process.cwd(), "data", "posts-snapshot.json");

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Obsidian keeps YAML frontmatter in the draft; the site stores only the body.
// The leading H1 goes into the title column, not into content_md.
function extractBody(raw: string): { title: string; md: string } {
  let text = raw;
  if (text.startsWith("---")) {
    const end = text.indexOf("\n---", 3);
    if (end !== -1) text = text.slice(end + 4);
  }
  text = text.trim();

  const h1 = text.match(/^#\s+(.+)/);
  if (!h1) throw new Error("В черновике нет заголовка первого уровня");

  return {
    title: h1[1].trim(),
    md: text.replace(/^#\s+.+\n/, "").trim(),
  };
}

async function main() {
  const raw = await fs.readFile(SOURCE, "utf8");
  const { title, md } = extractBody(raw);
  const html = renderMarkdown(md);

  const { data: existing } = await supabase
    .from("lvmn_blog_posts")
    .select("id")
    .eq("slug", SLUG)
    .maybeSingle();

  const payload = {
    slug: SLUG,
    title,
    meta_desc: META_DESC,
    content_md: md,
    content_html: html,
    cover_image: "/carousels/cover.webp",
    tags: TAGS,
    cta_url: CTA_URL,
    status: "published",
  };

  if (SNAPSHOT_ONLY) {
    const raw2 = await fs.readFile(SNAPSHOT_PATH, "utf8");
    const posts = JSON.parse(raw2) as Record<string, unknown>[];
    const prev = posts.find((p) => p.slug === SLUG);
    const now = new Date().toISOString();
    const post = {
      id: (prev?.id as string) ?? randomUUID(),
      topic_id: null,
      ...payload,
      published_at: (prev?.published_at as string) ?? now,
      telegram_sent: prev?.telegram_sent ?? false,
      created_at: (prev?.created_at as string) ?? now,
      views: prev?.views ?? 0,
    };
    const next = posts.filter((p) => p.slug !== SLUG);
    next.push(post);
    next.sort((a, b) =>
      String(b.published_at).localeCompare(String(a.published_at))
    );
    await fs.writeFile(SNAPSHOT_PATH, JSON.stringify(next, null, 2) + "\n");
    console.log(
      `${prev ? "Обновлена" : "Добавлена"} в снапшот: /blog/${SLUG} (${next.length} постов)`
    );
    console.log(`Заголовок: ${title}`);
    console.log(`Символов в теле: ${md.length}, в HTML: ${html.length}`);
    console.log(`Slug свободен от дублей: ${slugify(SLUG) === SLUG}`);
    return;
  }


  if (existing) {
    const { error } = await supabase
      .from("lvmn_blog_posts")
      .update(payload)
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
    console.log(`Обновлена: /blog/${SLUG}`);
  } else {
    const { error } = await supabase
      .from("lvmn_blog_posts")
      .insert({ ...payload, published_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    console.log(`Опубликована: /blog/${SLUG}`);
  }

  console.log(`Заголовок: ${title}`);
  console.log(`Символов в теле: ${md.length}, в HTML: ${html.length}`);
  console.log(`Slug свободен от дублей: ${slugify(SLUG) === SLUG}`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
