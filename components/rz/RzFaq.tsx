import type { ProductFaq } from "@/lib/products";
import { jsonLd } from "@/lib/json-ld";
import { SITE_URL } from "@/lib/site";

/**
 * Вопросы-ответы на <details>: без JS, текст остаётся в DOM для краулеров.
 * schemaId (например "/about#faq") добавляет FAQPage-разметку из того же массива.
 */
export function RzFaq({ items, schemaId }: { items: ProductFaq[]; schemaId?: string }) {
  if (items.length === 0) return null;
  const schema = schemaId
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${SITE_URL}${schemaId}`,
        inLanguage: "ru",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      }
    : null;
  return (
    <div className="rz-faq">
      {items.map((item) => (
        <details key={item.q}>
          <summary>{item.q}</summary>
          <p>{item.a}</p>
        </details>
      ))}
      {schema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      )}
    </div>
  );
}
