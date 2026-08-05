/**
 * Internal-link validation for generated articles.
 *
 * The writer model invents plausible-looking /blog/ slugs when it cross-links
 * articles: typos ("programista"), stale years ("na-2024-god"), and Cyrillic
 * left untransliterated. A site audit found 52 such links live, every one a
 * 404. Rather than let them ship, unwrap any anchor whose target does not
 * exist — the sentence keeps its text and loses only the dead link.
 */

/** Extracts the slug from an internal /blog/ href, or null if not one. */
function blogSlug(href: string): string | null {
  const m = /^\/blog\/([^/?#]+)\/?$/.exec(href.trim());
  if (!m) return null;
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return m[1];
  }
}

export interface LinkCheckResult {
  html: string;
  /** Slugs that were referenced but do not exist; each link was unwrapped. */
  removed: string[];
}

/**
 * Unwraps <a href="/blog/...">text</a> whose slug is not in `validSlugs`.
 * External links and non-blog internal links are left untouched.
 */
export function stripDeadInternalLinks(
  html: string,
  validSlugs: Iterable<string>,
): LinkCheckResult {
  const valid = new Set(validSlugs);
  const removed: string[] = [];

  const out = html.replace(
    /<a\b([^>]*?)href="([^"]+)"([^>]*)>([\s\S]*?)<\/a>/gi,
    (whole, _pre: string, href: string, _post: string, text: string) => {
      const slug = blogSlug(href);
      if (slug === null || valid.has(slug)) return whole;
      removed.push(slug);
      return text;
    },
  );

  return { html: out, removed };
}
