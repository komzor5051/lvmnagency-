import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import { renderMarkdown } from "../lib/utils";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Fix "Это не X. Это Y." pattern — replace with direct statement
function fixSlopPattern(text: string): string {
  // "Это не [phrase1]. Это [phrase2]." → "[phrase2]."
  // Covers variants: "Это не X, это Y.", "Это не X — это Y."
  return text
    .replace(/Это не[^.!?]+\.\s*Это ([^.!?\n]+\.)/g, (_, second) => second)
    .replace(/Это не[^,]+,\s*это ([^.!?\n]+\.)/gi, (_, second) => second)
    .replace(/Это не[^—]+—\s*это ([^.!?\n]+\.)/gi, (_, second) => second)
    // "это не просто X, а Y" → just Y
    .replace(/это не просто [^,]+,\s*а ([^.!?\n]+)/gi, (_, y) => y);
}

async function main() {
  const { data: posts, error } = await supabase
    .from("lvmn_blog_posts")
    .select("id, slug, title, content_md")
    .eq("status", "published");

  if (error) { console.error(error.message); return; }

  let fixed = 0;
  for (const post of posts ?? []) {
    const original = post.content_md as string;
    const cleaned = fixSlopPattern(original);
    if (cleaned === original) continue;

    const content_html = renderMarkdown(cleaned);
    const { error: updateError } = await supabase
      .from("lvmn_blog_posts")
      .update({ content_md: cleaned, content_html })
      .eq("id", post.id);

    if (updateError) {
      console.error(`  FAIL ${post.slug}: ${updateError.message}`);
    } else {
      console.log(`  fixed: /blog/${post.slug}`);
      fixed++;
    }
  }

  console.log(`\nDone. Fixed ${fixed} of ${posts?.length ?? 0} articles.`);
}

main().catch(console.error);
