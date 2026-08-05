/**
 * Repairs dead internal /blog/ links in already-published posts.
 *
 * A site audit found 52 internal links returning 404: the writer model invents
 * cross-link slugs (typos, stale years, untransliterated Cyrillic). Publishing
 * is now guarded by lib/pipeline/link-check.ts, but posts written before that
 * guard still carry the bad links. This unwraps them — the anchor text stays,
 * only the dead href goes — in both content_html and content_md.
 *
 * It also rewrites leftover absolute links to the old lvmn.vercel.app preview
 * domain, which is a live byte-for-byte copy of this site — every such link
 * hands ranking signals to the duplicate instead of the canonical domain.
 *
 * Usage:
 *   npx tsx scripts/fix-dead-links.ts --dry   # report only, no writes
 *   npx tsx scripts/fix-dead-links.ts         # apply
 */
import { config } from "dotenv";
config({ path: ".env.local" });

// Static imports are hoisted above config() under ESM, so lib/supabase would
// build its client from unset env vars. Import it lazily inside main().

const dryRun = process.argv.includes("--dry");

const LEGACY_ORIGIN = /https?:\/\/(?:lvmn|lvmn-blog)\.vercel\.app/gi;

/** Repoints old preview-domain URLs at the canonical origin. */
function rewriteLegacyOrigin(text: string) {
  let count = 0;
  const out = text.replace(LEGACY_ORIGIN, () => {
    count++;
    return "https://vladlyamin.ru";
  });
  return { text: out, count };
}

/** Unwraps markdown links [text](/blog/slug) whose slug does not exist. */
function stripDeadMarkdownLinks(md: string, valid: Set<string>) {
  const removed: string[] = [];
  const out = md.replace(
    /\[([^\]]*)\]\((\/blog\/[^)\s]+)\)/g,
    (whole, text: string, href: string) => {
      const m = /^\/blog\/([^/?#]+)\/?$/.exec(href);
      if (!m) return whole;
      let slug = m[1];
      try {
        slug = decodeURIComponent(slug);
      } catch {
        /* keep raw */
      }
      if (valid.has(slug)) return whole;
      removed.push(slug);
      return text;
    },
  );
  return { md: out, removed };
}

async function main() {
  const { supabase } = await import("../lib/supabase");
  const { stripDeadInternalLinks } = await import("../lib/pipeline/link-check");

  const { data: posts, error } = await supabase
    .from("lvmn_blog_posts")
    .select("id, slug, content_md, content_html")
    .eq("status", "published");

  if (error) throw new Error(`Fetch failed: ${error.message}`);
  if (!posts?.length) {
    console.log("No published posts found.");
    return;
  }

  const valid = new Set(posts.map((p) => p.slug).filter(Boolean));
  console.log(`${posts.length} published posts, ${valid.size} valid slugs.\n`);

  let touched = 0;
  let totalRemoved = 0;
  let totalRepointed = 0;
  const missing = new Map<string, number>();

  for (const post of posts) {
    const html = stripDeadInternalLinks(post.content_html ?? "", valid);
    const md = stripDeadMarkdownLinks(post.content_md ?? "", valid);
    const htmlFinal = rewriteLegacyOrigin(html.html);
    const mdFinal = rewriteLegacyOrigin(md.md);

    const removed = [...html.removed, ...md.removed];
    const repointed = htmlFinal.count + mdFinal.count;
    if (!removed.length && !repointed) continue;

    touched++;
    totalRemoved += removed.length;
    totalRepointed += repointed;
    for (const slug of removed) missing.set(slug, (missing.get(slug) ?? 0) + 1);

    const notes = [
      ...[...new Set(removed)].map((s) => `dead link -> ${s}`),
      ...(repointed ? [`${repointed} legacy vercel.app URL(s) repointed`] : []),
    ];
    console.log(`${post.slug}\n  ${notes.join("\n  ")}`);

    if (!dryRun) {
      const { error: upErr } = await supabase
        .from("lvmn_blog_posts")
        .update({ content_html: htmlFinal.text, content_md: mdFinal.text })
        .eq("id", post.id);
      if (upErr) throw new Error(`Update ${post.slug} failed: ${upErr.message}`);
    }
  }

  console.log(
    `\n${dryRun ? "[dry run] would fix" : "Fixed"} ${totalRemoved} dead link(s) ` +
      `and repoint ${totalRepointed} legacy URL(s) across ${touched} post(s); ` +
      `${missing.size} distinct missing slug(s).`,
  );
  if (dryRun) console.log("Re-run without --dry to apply.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
