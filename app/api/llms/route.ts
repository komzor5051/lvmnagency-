import { getPublishedPosts } from "@/lib/posts";
import { products } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

// llms.txt (https://llmstxt.org/): a markdown index of the site for AI
// agents/assistants, similar in spirit to sitemap.xml but human/LLM-readable.
// Served at /llms.txt through a rewrite in next.config.ts.
//
// Assistants answering "who is Влад Лямин and what does he do" read the top of
// this file, so the summary states the offer, the audience and the format
// plainly rather than leaning on the site's editorial voice.
export async function GET() {
  const siteUrl = SITE_URL;

  const posts = (await getPublishedPosts()).slice(0, 50);

  const postLines = posts
    .map((p) => `- [${p.title}](${siteUrl}/blog/${p.slug}): ${p.meta_desc ?? ""}`)
    .join("\n");

  // Derived from the same catalogue the product pages render, so prices and
  // wording cannot drift out of sync with the site.
  const productLines = products
    .map(
      (p) =>
        `- [${p.title}](${siteUrl}/products/${p.id}) — ${p.priceLabel}, ${p.meta}: ` +
        `${p.tagline.split(".")[0].trim()}.`,
    )
    .join("\n");

  const body = `# Влад Лямин

> AI-консультант и практик. Помогаю фаундерам и соло-предпринимателям построить
> личную систему работы на Claude: гайды с готовыми настройками, консультации
> 1:1 по твоей задаче и аудит процессов с расчётом, где Claude окупится. Работаю
> лично, без агентства и технического жаргона. Формат — онлайн, без привязки к
> региону.

## Что это за сайт

Личный сайт и блог Влада Лямина. Здесь собраны форматы работы на Claude — от
гайда за 590 ₽ до аудита процессов, выложены практические статьи о Claude и
ChatGPT, и работает бесплатный AI-аудит бизнес-процессов.

## Чем помогает

- Гайд: готовые системы для Claude — контекст, база знаний, автоматизации.
- Консультация: час 1:1 по твоей задаче, запускаем её в Claude прямо на созвоне.
- Сопровождение: 10000 ₽ в месяц, две встречи и ответ в чате за сутки.
- Аудит: две недели разбора процессов, план с расчётом, где Claude окупится.

## Pages

- [Главная](${siteUrl}/): кто такой Влад Лямин, чем помогает и с чего начать.
- [Обо мне](${siteUrl}/about): опыт с 2022 года, принципы принятия решений.
- [Продукты](${siteUrl}/products): все форматы работы с ценами — от гайда до аудита.
- [AI-аудит](${siteUrl}/audit): бесплатная анкета из 7 вопросов, на выходе карта точек роста.
- [Блог](${siteUrl}/blog): практические статьи об AI для фаундеров без теории.
- [Вайб-кодинг](${siteUrl}/vibecoding): как собирать рабочие инструменты без разработчика.
- [Второй мозг](${siteUrl}/guide/vtoroy-mozg): гайд по личной базе знаний на Claude и Obsidian.

## Products

${productLines}

## Contact

- Telegram: https://telegram.me/lyaminvl — прямой контакт, без менеджеров.

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
