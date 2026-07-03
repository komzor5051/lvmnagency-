import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import { buildCoverPrompt, buildInlinePrompt } from "../lib/pipeline/cover-style";
import { renderMarkdown } from "../lib/utils";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? "";
const IMG_PLACEHOLDER_REGEX = /!\[IMG:\s*(.+?)\]\(placeholder\)/g;

async function fetchImageBuffer(prompt: string, retries = 2): Promise<Buffer> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://vladlyamin.ru",
          "X-Title": "Vlad Lyamin Blog",
        },
        body: JSON.stringify({
          model: "openai/gpt-5.4-image-2",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!res.ok) {
        throw new Error(`OpenRouter ${res.status}: ${await res.text()}`);
      }

      const data = await res.json();
      const imgUrl: string = data.choices?.[0]?.message?.images?.[0]?.image_url?.url ?? "";

      if (!imgUrl) throw new Error("No image URL in response");

      if (imgUrl.startsWith("data:")) {
        const b64 = imgUrl.split(",")[1];
        return Buffer.from(b64, "base64");
      }

      const imgRes = await fetch(imgUrl);
      return Buffer.from(await imgRes.arrayBuffer());
    } catch (err) {
      if (attempt < retries) {
        console.log(`    Attempt ${attempt + 1} failed, retrying in 5s...`);
        await new Promise((r) => setTimeout(r, 5000));
      } else {
        throw err;
      }
    }
  }
  throw new Error("Unreachable");
}

async function uploadBuffer(buffer: Buffer, slug: string, index: number): Promise<string> {
  const path = `blog-images/${slug}/img-${index}.png`;
  const { error } = await supabase.storage
    .from("lvmn-blog-images")
    .upload(path, buffer, { contentType: "image/png", upsert: true });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  return supabase.storage.from("lvmn-blog-images").getPublicUrl(path).data.publicUrl;
}

async function processArticle(post: { id: string; slug: string; content_md: string }) {
  const matches: { full: string; description: string }[] = [];
  const regex = new RegExp(IMG_PLACEHOLDER_REGEX.source, "g");
  let match;
  while ((match = regex.exec(post.content_md)) !== null) {
    matches.push({ full: match[0], description: match[1] });
  }

  if (matches.length === 0) return;

  // Cap at 2 images
  const toProcess = matches.slice(0, 2);
  let updatedMd = post.content_md;
  let coverImage: string | null = null;

  for (let i = 0; i < toProcess.length; i++) {
    const { full, description } = toProcess[i];
    const prompt = i === 0 ? buildCoverPrompt(description) : buildInlinePrompt(description);

    console.log(`  [${i + 1}/${toProcess.length}] ${description.slice(0, 70)}...`);

    try {
      const buffer = await fetchImageBuffer(prompt);
      console.log(`    Generated: ${Math.round(buffer.length / 1024)}KB`);

      const url = await uploadBuffer(buffer, post.slug, i + 1);
      console.log(`    Uploaded: ${url.slice(-50)}`);

      if (i === 0) coverImage = url;
      updatedMd = updatedMd.replace(full, `![${description.trim()}](${url})`);
    } catch (err) {
      console.error(`    FAIL: ${err instanceof Error ? err.message : err}`);
      updatedMd = updatedMd.replace(full, "");
    }

    if (i < toProcess.length - 1) {
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  // Remove remaining unresolved placeholders
  updatedMd = updatedMd.replace(/!\[IMG:\s*.+?\]\(placeholder\)/g, "");

  const content_html = renderMarkdown(updatedMd);
  const { error } = await supabase
    .from("lvmn_blog_posts")
    .update({
      content_md: updatedMd,
      content_html,
      ...(coverImage ? { cover_image: coverImage } : {}),
    })
    .eq("id", post.id);

  if (error) console.error(`  DB update failed: ${error.message}`);
  else console.log(`  Saved. Cover: ${coverImage ? "yes" : "no"}`);
}

async function main() {
  const { data: posts, error } = await supabase
    .from("lvmn_blog_posts")
    .select("id, slug, title, content_md, cover_image")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) { console.error(error.message); return; }

    const HAS_PLACEHOLDER = /!\[IMG:\s*.+?\]\(placeholder\)/;
  const needsImages = (posts ?? []).filter((p) =>
    HAS_PLACEHOLDER.test(p.content_md ?? "")
  );

  console.log(`\nFound ${needsImages.length} articles with placeholders (of ${posts?.length ?? 0} total)\n`);

  for (const post of needsImages) {
    console.log(`\n[${post.slug}]`);
    await processArticle(post);
    await new Promise((r) => setTimeout(r, 4000));
  }

  console.log("\nAll done.");
}

main().catch(console.error);
