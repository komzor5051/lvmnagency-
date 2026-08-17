import { getPublishedPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { SITE_URL } from "@/lib/site";
import type { Metadata } from "next";

export const revalidate = 60;

const blogUrl = SITE_URL;

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
    <main className="studio-main bento-page">
      <section className="bento-section bento-section--hero bento-section--last">
        <div className="studio-frame">
          <header className="bento-head" data-studio-reveal>
            <p className="bento-mono">Лабораторные заметки / {posts.length}</p>
            <h1>Пишу о том, что работает</h1>
            <p>
              Кейсы, инструменты и реальные цифры. Без новостного шума — только
              практические способы встроить AI в работу.
            </p>
          </header>

          <div className="bento-grid">
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
          </div>
          {(!posts || posts.length === 0) && (
            <p className="bento-mono studio-blog-empty">Статьи скоро появятся</p>
          )}
        </div>
      </section>
    </main>
  );
}
