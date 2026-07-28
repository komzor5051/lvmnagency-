import { getPublishedPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import type { Metadata } from "next";

export const revalidate = 60;

const blogUrl = process.env.BLOG_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://vladlyamin.ru";

export const metadata: Metadata = {
  title: { absolute: "AI для фаундеров — блог Влада Лямина" },
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
  const posts = (await getPublishedPosts()).slice(0, 50);

  return (
    <main className="studio-main studio-blog">
      <section className="studio-page-hero">
        <div className="studio-frame">
          <p className="studio-eyebrow" data-studio-reveal>ЛАБОРАТОРНЫЕ ЗАМЕТКИ / {posts.length}</p>
          <h1 data-studio-reveal>Пишу о том,<br />что <em>работает.</em></h1>
          <p data-studio-reveal>
            Кейсы, инструменты и реальные цифры. Без новостного шума — только
            практические способы встроить AI в работу.
          </p>
        </div>
      </section>

      <section className="studio-blog-list">
        <div className="studio-frame">
          <div className="studio-post-index">
            {(posts ?? []).map((post, index) => (
              <PostCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                publishedAt={post.published_at}
                coverImage={post.cover_image}
                index={index + 1}
              />
            ))}
            {(!posts || posts.length === 0) && (
              <p className="studio-mono studio-blog-empty">Статьи скоро появятся</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
