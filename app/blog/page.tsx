import { getPublishedPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import DeskFooter from "@/components/desk/DeskFooter";
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
    <main>
      <section className="pt-[130px] pb-[110px] max-md:pt-[110px] max-md:pb-[72px]">
        <div className="mx-auto max-w-[1240px] px-8 max-md:px-4">
          <header className="mb-14 max-w-[760px]">
            <h1 className="desk-display text-[clamp(34px,4vw,58px)] text-ink">
              Заметки <span className="hl">о системах</span>
            </h1>
            <p className="mt-6 max-w-[54ch] text-[17px] leading-[1.62] text-ink-muted">
              Кейсы, инструменты, реальные цифры. Пишу о том, что помогает бизнесу расти.
            </p>
          </header>

          {/* The whole index is one long paper sheet on the desk. */}
          <div className="desk-sheet relative px-10 py-2 max-md:px-4">
            <span className="desk-tape" aria-hidden />
            {(posts ?? []).map((post) => (
              <PostCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                publishedAt={post.published_at}
                coverImage={post.cover_image}
              />
            ))}
            {(!posts || posts.length === 0) && (
              <p className="mono-label py-16 text-center text-ink-muted">
                Статьи скоро появятся
              </p>
            )}
          </div>
        </div>
      </section>
      <DeskFooter />
    </main>
  );
}
