import { config } from "dotenv";
config({ path: ".env.local" });

import fs from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";
import { renderMarkdown, slugify } from "../lib/utils";

// One-off publisher for the hand-written teaser article that leads into the
// guide. The auto-pipeline is not involved: the markdown is written by hand in
// Obsidian, so nothing here calls a model.
const SOURCE =
  "/Users/lvmn/Documents/Obsidian Vault/04 Контент/Черновики/statya-tizer-issledovanie-claude.md";

const SLUG = "issledovanie-kak-lyudi-rabotayut-s-claude";
const META_DESC =
  "Разобрал по документации, исследованиям и практике сообщества, как люди реально работают с Claude. Пять выводов, которые заставили меня переделать половину своих настроек.";
const TAGS = [
  "Claude",
  "Claude Code",
  "контекст",
  "база знаний",
  "исследование",
];
const CTA_URL = "/products/guide";

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
    cover_image: null,
    tags: TAGS,
    cta_url: CTA_URL,
    status: "published",
  };

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
