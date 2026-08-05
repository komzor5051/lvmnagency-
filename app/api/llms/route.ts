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

> AI-консультант и практик. Помогаю фаундерам, соло-предпринимателям и владельцам
> digital-бизнесов встраивать AI в ежедневную работу: нахожу процессы, где
> автоматизация окупается, настраиваю рабочий сценарий на ваших данных и помогаю
> команде освоить его. Работаю лично, без агентства и технического жаргона.
> Формат — онлайн, без привязки к региону.

## Что это за сайт

Личный сайт и блог Влада Лямина. Здесь описаны форматы работы (от разового
разбора до внедрения под ключ), выложены практические статьи о работе с Claude,
ChatGPT и автоматизацией, и работает бесплатный AI-аудит бизнес-процессов.

## Чем помогает

- Аудит: разбор процессов и данных, карта точек роста с оценкой эффекта.
- Прототип: рабочий сценарий на ваших данных за 1–3 дня, до большого внедрения.
- Система: встраивание в работу команды, документация и обучение.

## Pages

- [Главная](${siteUrl}/): кто такой Влад Лямин, подход к внедрению AI и этапы работы.
- [Обо мне](${siteUrl}/about): опыт с 2022 года, 40+ внедрений, принципы принятия решений.
- [Продукты](${siteUrl}/products): все форматы работы с ценами — от гайда до внедрения.
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
