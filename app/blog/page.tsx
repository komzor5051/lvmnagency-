import { supabase } from "@/lib/supabase";
import { PostCard } from "@/components/post-card";
import type { Metadata } from "next";

export const revalidate = 60;

const blogUrl = process.env.BLOG_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://vladlyamin.ru";

export const metadata: Metadata = {
  title: "AI для фаундеров — блог Влада Лямина",
  description:
    "Практичные статьи о том, как фаундеры и предприниматели используют AI: кейсы, инструменты, реальные цифры. Без теории — только то, что работает.",
  alternates: {
    canonical: `${blogUrl}/blog`,
  },
  openGraph: {
    title: "AI для фаундеров — блог Влада Лямина",
    description:
      "Как фаундеры используют AI: кейсы, инструменты, реальные цифры. Без теории — только то, что работает.",
    type: "website",
    url: `${blogUrl}/blog`,
    locale: "ru_RU",
  },
};

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from("lvmn_blog_posts")
    .select("slug, title, meta_desc, published_at, tags, cover_image")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-ink-muted mb-3">
        <span aria-hidden className="text-accent">
          {"//"}
        </span>{" "}
        Блог
      </p>
      <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-[-0.03em] text-ink mb-3">
        AI для фаундеров
      </h1>
      <p className="text-ink-muted mb-4 max-w-[60ch]">
        Кейсы, инструменты, реальные цифры. Пишу о том, что помогает бизнесу расти.
      </p>
      <div aria-hidden className="h-[3px] w-16 bg-lime mb-10" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {(posts ?? []).map((post) => (
          <PostCard
            key={post.slug}
            slug={post.slug}
            title={post.title}
            metaDesc={post.meta_desc}
            publishedAt={post.published_at}
            tags={post.tags ?? []}
            coverImage={post.cover_image}
          />
        ))}
        {(!posts || posts.length === 0) && (
          <p className="text-ink-muted py-12 text-center font-mono text-sm">
            Статьи скоро появятся
          </p>
        )}
      </div>
    </div>
  );
}
