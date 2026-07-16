import fs from "node:fs/promises";
import path from "node:path";
import { supabase } from "@/lib/supabase";

// The Timeweb VPS cannot reach *.supabase.co (TCP block on the DC's IP range),
// so every server-side read goes through this layer: try Supabase with a hard
// timeout, fall back to data/posts-snapshot.json shipped with each deploy
// (regenerate with `npx tsx scripts/export-posts.ts` before rsync).

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  meta_desc: string | null;
  content_md: string;
  content_html: string | null;
  cover_image: string | null;
  tags: string[] | null;
  cta_url: string | null;
  status: string;
  published_at: string;
}

const SNAPSHOT_PATH = path.join(process.cwd(), "data", "posts-snapshot.json");
const SUPABASE_TIMEOUT_MS = 5000;

async function loadSnapshot(): Promise<BlogPost[]> {
  try {
    const raw = await fs.readFile(SNAPSHOT_PATH, "utf8");
    return JSON.parse(raw) as BlogPost[];
  } catch {
    return [];
  }
}

let cachedPosts: { at: number; posts: BlogPost[] } | null = null;
const CACHE_TTL_MS = 60_000;

export async function getPublishedPosts(): Promise<BlogPost[]> {
  if (cachedPosts && Date.now() - cachedPosts.at < CACHE_TTL_MS) {
    return cachedPosts.posts;
  }
  let posts: BlogPost[] = [];
  try {
    const { data } = await supabase
      .from("lvmn_blog_posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .abortSignal(AbortSignal.timeout(SUPABASE_TIMEOUT_MS));
    if (data && data.length > 0) posts = data as BlogPost[];
  } catch {
    // network unreachable / timeout — fall through to snapshot
  }
  if (posts.length === 0) posts = await loadSnapshot();
  cachedPosts = { at: Date.now(), posts };
  return posts;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getPublishedPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

// Posts are sorted by published_at desc: prev = older, next = newer.
export async function getPrevNext(
  post: BlogPost
): Promise<{ prev: BlogPost | null; next: BlogPost | null }> {
  const posts = await getPublishedPosts();
  const i = posts.findIndex((p) => p.slug === post.slug);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: posts[i + 1] ?? null,
    next: posts[i - 1] ?? null,
  };
}
