import { SITE_URL } from "@/lib/site";

const siteUrl = SITE_URL;

// Content Signals (https://contentsignals.org/): declares AI usage
// preferences alongside classic robots directives. search=yes keeps normal
// indexing; ai-input=yes lets agents retrieve/cite content (aligns with the
// site's AI-SEO / "second brain" positioning); ai-train=no opts out of
// third-party model training on the content.
// Answer-engine crawlers are listed explicitly. The wildcard group already
// permits them, but a named group is an unambiguous signal and lets the policy
// diverge per bot later without touching the default rules.
const aiCrawlers = [
  "GPTBot", // ChatGPT training/browsing
  "OAI-SearchBot", // ChatGPT Search
  "ChatGPT-User", // ChatGPT on-demand fetch
  "ClaudeBot", // Claude crawler
  "Claude-User", // Claude on-demand fetch
  "Claude-Web", // legacy Anthropic UA, still seen in the wild
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended", // Gemini / AI Overviews grounding
  "Applebot-Extended",
  "Bingbot", // also feeds Copilot's index
  "CCBot", // Common Crawl — upstream corpus for several assistants
];

const aiGroups = aiCrawlers
  .map((ua) => `User-agent: ${ua}\nAllow: /\nDisallow: /api/\n`)
  .join("\n");

const body = `User-agent: *
Allow: /
Disallow: /api/
Content-Signal: ai-train=no, search=yes, ai-input=yes

${aiGroups}
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
