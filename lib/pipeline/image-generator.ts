import { generateImage as openrouterGenerateImage } from "@/lib/openrouter";
import { supabase } from "@/lib/supabase";
import { buildCoverPrompt, buildInlinePrompt } from "./cover-style";

const IMG_PLACEHOLDER_REGEX = /!\[IMG:\s*(.+?)\]\(placeholder\)/g;

async function generateImage(prompt: string, retries = 2): Promise<Buffer> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await openrouterGenerateImage(prompt);
    } catch (err) {
      if (attempt < retries) {
        console.log(`[image-gen] Attempt ${attempt + 1} failed, retrying in 3s...`);
        await new Promise((r) => setTimeout(r, 3000));
      } else {
        throw err;
      }
    }
  }
  throw new Error("Unreachable");
}

async function uploadToStorage(
  buffer: Buffer,
  slug: string,
  index: number
): Promise<string> {
  const path = `blog-images/${slug}/img-${index}.png`;

  const { error } = await supabase.storage
    .from("lvmn-blog-images")
    .upload(path, buffer, {
      contentType: "image/png",
      upsert: true,
    });

  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data } = supabase.storage.from("lvmn-blog-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function generateArticleImages(
  markdown: string,
  articleSlug: string
): Promise<{ markdown: string; coverImage: string | null }> {
  const matches: { full: string; description: string }[] = [];
  let match;
  const regex = new RegExp(IMG_PLACEHOLDER_REGEX.source, "g");

  while ((match = regex.exec(markdown)) !== null) {
    matches.push({ full: match[0], description: match[1] });
  }

  if (matches.length === 0) {
    return { markdown, coverImage: null };
  }

  // Cap at 3 images max
  if (matches.length > 3) {
    console.log(`[image-gen] Found ${matches.length} placeholders, limiting to 3`);
    for (let i = 3; i < matches.length; i++) {
      markdown = markdown.replace(matches[i].full, "");
    }
    matches.length = 3;
  }

  let result = markdown;
  let coverImage: string | null = null;

  for (let i = 0; i < matches.length; i++) {
    const { full, description } = matches[i];
    // First image is the cover (subject right, empty dark left for the title
    // overlay); the rest are inline cinematic images with the same grade.
    const prompt = i === 0 ? buildCoverPrompt(description) : buildInlinePrompt(description);

    try {
      console.log(`[image-gen] Generating image ${i + 1}/${matches.length}: ${description.slice(0, 60)}...`);
      const buffer = await generateImage(prompt);
      const url = await uploadToStorage(buffer, articleSlug, i + 1);

      if (i === 0) coverImage = url;

      const altText = description.trim();
      result = result.replace(full, `![${altText}](${url})`);

      console.log(`[image-gen] Image ${i + 1} uploaded: ${url}`);
    } catch (err) {
      console.error(`[image-gen] Failed to generate image ${i + 1}:`, err);
      result = result.replace(full, "");
    }

    if (i < matches.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  return { markdown: result, coverImage };
}
