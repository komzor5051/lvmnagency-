const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vladlyamin.ru";

// Content Signals (https://contentsignals.org/): declares AI usage
// preferences alongside classic robots directives. search=yes keeps normal
// indexing; ai-input=yes lets agents retrieve/cite content (aligns with the
// site's AI-SEO / "second brain" positioning); ai-train=no opts out of
// third-party model training on the content.
const body = `User-agent: *
Allow: /
Disallow: /api/
Content-Signal: ai-train=no, search=yes, ai-input=yes

Sitemap: ${siteUrl}/sitemap.xml
`;

export function GET() {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
