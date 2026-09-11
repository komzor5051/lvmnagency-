import { config } from "dotenv";
config({ path: ".env.local" });

// Regenerates cover_image for posts whose cover is missing (set to null during
// the 2026-09 Supabase migration — old bucket images are unreachable).
// Usage:
//   npx tsx scripts/regenerate-covers.ts --limit=2      (dry test on a few posts)
//   npx tsx scripts/regenerate-covers.ts                (all posts missing a cover)

async function run() {
  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : Infinity;

  const { supabase } = await import("../lib/supabase");
  const { chatCompletion, generateImage } = await import("../lib/openrouter");
  const { buildCoverPrompt } = await import("../lib/pipeline/cover-style");

  const { data: posts, error } = await supabase
    .from("lvmn_blog_posts")
    .select("id, slug, title, meta_desc")
    .eq("status", "published")
    .is("cover_image", null)
    .order("published_at", { ascending: false });

  if (error) throw new Error(`Supabase error: ${error.message}`);
  if (!posts || posts.length === 0) {
    console.log("No posts missing a cover image.");
    return;
  }

  const batch = posts.slice(0, limit);
  console.log(`Regenerating covers for ${batch.length}/${posts.length} posts...`);

  let ok = 0;
  let failed = 0;

  for (const [i, post] of batch.entries()) {
    console.log(`\n[${i + 1}/${batch.length}] ${post.slug}`);
    try {
      const conceptPrompt = `Придумай ОДНУ кинематографичную визуальную метафору (одно предложение, на русском, без кавычек) для обложки статьи блога про Claude и AI-инструменты.

Заголовок статьи: ${post.title}
Описание: ${post.meta_desc ?? "нет"}

Метафора должна быть конкретной сценой или образом (например: "одинокий силуэт у окна офиса на закате, за стеклом город в дымке"), НЕ абстракцией и НЕ пересказом заголовка. Ответь только текстом метафоры, без пояснений.`;

      const concept = (
        await chatCompletion(conceptPrompt, {
          model: "google/gemini-2.5-flash",
          temperature: 0.9,
          maxTokens: 200,
          reasoning: { enabled: false },
        })
      ).trim();
      console.log(`  concept: ${concept.slice(0, 100)}`);

      const prompt = buildCoverPrompt(concept);
      const buffer = await generateImage(prompt);

      const path = `blog-images/${post.slug}/cover.png`;
      const { error: uploadErr } = await supabase.storage
        .from("lvmn-blog-images")
        .upload(path, buffer, { contentType: "image/png", upsert: true });
      if (uploadErr) throw new Error(`Storage upload failed: ${uploadErr.message}`);

      const { data: urlData } = supabase.storage.from("lvmn-blog-images").getPublicUrl(path);
      const { error: updateErr } = await supabase
        .from("lvmn_blog_posts")
        .update({ cover_image: urlData.publicUrl })
        .eq("id", post.id);
      if (updateErr) throw new Error(`DB update failed: ${updateErr.message}`);

      console.log(`  ✓ ${urlData.publicUrl}`);
      ok++;
    } catch (err) {
      console.error(`  ✗ failed:`, err instanceof Error ? err.message : err);
      failed++;
    }

    if (i < batch.length - 1) await new Promise((r) => setTimeout(r, 1500));
  }

  console.log(`\nDone. ok=${ok} failed=${failed}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
