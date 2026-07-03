import { supabase } from "@/lib/supabase";

// llms.txt (https://llmstxt.org/): a markdown index of the site for AI
// agents/assistants, similar in spirit to sitemap.xml but human/LLM-readable.
export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vladlyamin.ru";

  const { data: posts } = await supabase
    .from("lvmn_blog_posts")
    .select("slug, title, meta_desc, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50);

  const postLines = (posts ?? [])
    .map((p) => `- [${p.title}](${siteUrl}/blog/${p.slug}): ${p.meta_desc ?? ""}`)
    .join("\n");

  const body = `# Влад Лямин

> Помогаю фаундерам и предпринимателям использовать AI как инфраструктуру решений — не набор разрозненных инструментов, а второй мозг для бизнеса.

## Pages

- [Главная](${siteUrl}/): обзор подхода и услуг
- [Обо мне](${siteUrl}/about): позиционирование, экспертиза, принципы
- [Продукты](${siteUrl}/products): каталог консультаций, гайдов, аудита
- [AI-аудит](${siteUrl}/audit): воронка аудита бизнес-процессов

## Blog

${postLines}

## Feeds

- [RSS](${siteUrl}/blog/feed.xml)
- [Sitemap](${siteUrl}/sitemap.xml)
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate",
    },
  });
}
