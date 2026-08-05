import { supabase } from "@/lib/supabase";
import { slugify, renderMarkdown } from "@/lib/utils";
import { generateFlash } from "@/lib/gemini";
import { findDuplicate } from "@/lib/pipeline/dedupe";
import { stripDeadInternalLinks } from "@/lib/pipeline/link-check";

interface PublishInput {
  topicId: string;
  title: string;
  content: string;
  tags: string[];
  coverImage?: string | null;
}

/** Thrown when the article being published already exists in another wording. */
export class DuplicateArticleError extends Error {
  constructor(readonly attemptedTitle: string, readonly existingTitle: string, readonly score: number) {
    super(`"${attemptedTitle}" duplicates published article "${existingTitle}" (similarity ${score.toFixed(2)})`);
    this.name = "DuplicateArticleError";
  }
}

export async function publishPost(input: PublishInput): Promise<string> {
  // Shorten title if > 55 chars (SEO best practice)
  let title = input.title;
  if (title.length > 55) {
    console.log(`[publisher] Title too long (${title.length} chars), shortening...`);
    title = await generateFlash(
      `Сократи заголовок статьи до 55 символов максимум, сохрани смысл и ключевые слова. Верни ТОЛЬКО заголовок, без кавычек и пояснений.\n\nЗаголовок: "${title}"`
    );
    title = title.trim().replace(/^["«]|["»]$/g, "");
    if (title.length > 55) {
      title = title.slice(0, 52) + "...";
    }
    console.log(`[publisher] Shortened title: "${title}" (${title.length} chars)`);
  }

  // Refuse to publish a rewording of something already live. Suffixing the
  // slug (below) only ever hid this: it produced -2/-3/-4 twins for identical
  // titles, and did nothing at all when the wording differed slightly.
  const { data: published } = await supabase
    .from("lvmn_blog_posts")
    .select("title, slug")
    .eq("status", "published");

  const clash = findDuplicate(title, (published ?? []).map((p) => p.title).filter(Boolean));
  if (clash) {
    throw new DuplicateArticleError(title, clash.title, clash.score);
  }

  // Distinct titles can still slugify to the same string (slugify truncates at
  // 80 chars). Suffix those so a collision doesn't crash the run.
  const baseSlug = slugify(title);
  let slug = baseSlug;
  for (let n = 2; ; n++) {
    const { data: clash } = await supabase
      .from("lvmn_blog_posts")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!clash) break;
    slug = `${baseSlug}-${n}`;
  }
  // Cross-links to invented slugs are the single largest source of 404s on the
  // site. Drop them here, before the article is ever stored.
  const { html: contentHtml, removed: deadLinks } = stripDeadInternalLinks(
    renderMarkdown(input.content),
    (published ?? []).map((p) => p.slug).filter(Boolean),
  );
  if (deadLinks.length) {
    console.log(
      `[publisher] Removed ${deadLinks.length} dead internal link(s): ${deadLinks.join(", ")}`,
    );
  }

  // Generate meta description. The model reliably undershoots a stated range,
  // so the floor is set above the 140-char target rather than at it.
  const metaDesc = await generateFlash(
    `Напиши SEO мета-описание для статьи с заголовком "${title}".\n` +
      `Требования: длина СТРОГО от 145 до 158 символов включительно (это важнее всего остального), ` +
      `одно-два предложения на русском, без кавычек и без пояснений. ` +
      `Перед ответом посчитай символы и при необходимости допиши до нужной длины. Верни только текст.`
  );

  const { data, error } = await supabase
    .from("lvmn_blog_posts")
    .insert({
      topic_id: input.topicId,
      slug,
      title,
      meta_desc: metaDesc.trim().slice(0, 160),
      content_md: input.content,
      content_html: contentHtml,
      cover_image: input.coverImage ?? null,
      tags: input.tags,
      cta_url: `https://telegram.me/lyaminvl?text=Аудит`,
      status: "published",
      published_at: new Date().toISOString(),
    })
    .select("slug")
    .single();

  if (error) throw new Error(`Publish failed: ${error.message}`);

  // Mark topic as used
  await supabase
    .from("lvmn_blog_topics")
    .update({ status: "used", used_at: new Date().toISOString() })
    .eq("id", input.topicId);

  return data.slug;
}
