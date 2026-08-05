import type { ProductFaq } from "@/lib/products";
import { jsonLd } from "@/lib/json-ld";
import { SITE_URL } from "@/lib/site";

/**
 * A full-width Q&A section plus its FAQPage markup.
 *
 * Answer engines quote question-shaped passages far more readily than prose,
 * so the visible copy and the structured data are generated from one array —
 * they cannot drift apart, and the answer a model quotes is the answer a reader
 * sees. Built on <details>/<summary>: no JS, and the text stays in the DOM for
 * crawlers even while collapsed.
 */
export function FaqSection({
  items,
  eyebrow,
  heading,
  lead,
  /** Fragment id for the FAQPage @id, e.g. "/#faq". Must be unique per page. */
  schemaId,
}: {
  items: ProductFaq[];
  eyebrow: string;
  heading: React.ReactNode;
  lead?: string;
  schemaId: string;
}) {
  if (items.length === 0) return null;

  const faqSchema = {
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
    <section className="studio-faq" id="faq">
      <div className="studio-frame">
        <header className="studio-section-head" data-studio-reveal>
          <p className="studio-eyebrow studio-eyebrow--dark">{eyebrow}</p>
          <h2>{heading}</h2>
          {lead && <p>{lead}</p>}
        </header>
        <div className="studio-faq-list" data-studio-reveal>
          {items.map((item) => (
            <details key={item.q}>
              <summary>
                <span>{item.q}</span>
                <i aria-hidden="true">+</i>
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema) }}
      />
    </section>
  );
}
