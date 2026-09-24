import { Accordion } from "@/components/kalka/Interactive";
import { jsonLd } from "@/lib/json-ld";
import { SITE_URL } from "@/lib/site";

// FAQ на кальке для /about: тот же Accordion, что и на /lab, плюс
// FAQPage-разметка из того же массива (раньше это делал RzFaq).
type FaqItem = { q: string; a: string };

export function AboutFaq({ items, schemaId }: { items: FaqItem[]; schemaId: string }) {
  if (items.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}${schemaId}`,
    inLanguage: "ru",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <Accordion items={items.map((item) => ({ title: item.q, body: item.a }))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
    </>
  );
}
