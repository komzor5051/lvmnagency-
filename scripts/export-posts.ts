import { config } from "dotenv";
config({ path: ".env.local" });

// Exports all published posts to data/posts-snapshot.json.
// The VPS cannot reach Supabase, so the site falls back to this snapshot
// (see lib/posts.ts). Run before every deploy:
//   npx tsx scripts/export-posts.ts

async function run() {
  const { supabase } = await import("../lib/supabase");
  const fs = await import("node:fs/promises");
  const path = await import("node:path");

  const { data: posts, error } = await supabase
    .from("lvmn_blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw new Error(`Supabase error: ${error.message}`);
  if (!posts || posts.length === 0) throw new Error("No published posts returned — aborting to avoid an empty snapshot");

  const outDir = path.join(process.cwd(), "data");
  await fs.mkdir(outDir, { recursive: true });
  const outFile = path.join(outDir, "posts-snapshot.json");
  await fs.writeFile(outFile, JSON.stringify(posts, null, 1), "utf8");
  console.log(`Snapshot written: ${outFile} (${posts.length} posts)`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
