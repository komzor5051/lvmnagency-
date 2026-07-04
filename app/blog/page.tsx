import { supabase } from "@/lib/supabase";
import { PostCard } from "@/components/post-card";
import Link from "next/link";
import Chapter from "@/components/hud/Chapter";
import SplitLines from "@/components/motion/SplitLines";
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
    <main>
      <Chapter name="Blog" theme="light" className="bg-paper2 px-[6vw] pb-24 pt-10 md:pb-32">
        <nav aria-label="Хлебные крошки">
          <Link
            href="/"
            className="mono-label text-ink-muted transition-colors hover:text-ink"
          >
            &larr; На главную
          </Link>
        </nav>

        <header className="pb-14 pt-14 md:pb-20 md:pt-20">
          <p className="mono-label text-ink-muted">Блог</p>
          <SplitLines as="h1" className="font-display mt-6 text-[clamp(40px,7vw,96px)]">
            Заметки о <em>системах</em>
          </SplitLines>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Кейсы, инструменты, реальные цифры. Пишу о том, что помогает бизнесу расти.
          </p>
        </header>

        <div className="border-t border-line">
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
      </Chapter>
    </main>
  );
}
