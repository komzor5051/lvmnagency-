/**
 * Single source of truth for the site's public origin.
 *
 * Canonical URLs, og:url and JSON-LD @id must all agree on one origin. When
 * they disagree, search engines treat the other origin as the real home of the
 * content and drop this one as a duplicate. The blog used to read a separate
 * BLOG_URL variable, which is how every /blog/* page ended up canonicalised to
 * lvmn.vercel.app while the rest of the site pointed at vladlyamin.ru.
 *
 * Import this everywhere instead of reading env vars ad hoc.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://vladlyamin.ru"
).replace(/\/+$/, "");

/** Absolute URL for a site-relative path, e.g. absoluteUrl("/blog") */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
