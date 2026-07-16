import { getPublishedPosts } from "@/lib/posts";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogUrl = process.env.BLOG_URL ?? "https://vladlyamin.ru";

  const posts = await getPublishedPosts();

  const postEntries = posts.map((post) => ({
    url: `${blogUrl}/blog/${post.slug}`,
    lastModified: post.published_at,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: `${blogUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    ...postEntries,
  ];
}
