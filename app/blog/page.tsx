import { getPublishedPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { SITE_URL } from "@/lib/site";
import { Crosshair } from "@/components/kalka/Interactive";
import { Rulers } from "@/components/kalka/Rulers";
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
    <div className="k-page">
      <Crosshair />
      <main>
        {/* Hero — лист с линейками */}
        <section className="relative min-h-[min(56vh,440px)] overflow-hidden border-b border-[#15161a]">
          <Rulers />
          <div className="relative z-[2] mx-auto max-w-7xl px-5 pb-16 pl-10 pt-24 md:px-14 md:pt-28">
            <p className="k-mono inline-block bg-white pr-2">Лабораторные заметки / {posts.length}</p>
            <h1
              data-m="lines"
              data-m-hero
              className="font-heading mt-6 max-w-[16ch] text-balance text-[40px] font-extrabold leading-[1.03] tracking-[-0.04em] sm:text-[52px] lg:text-[64px]"
            >
              Пишу о том, что <span className="rz-mark">работает</span>
            </h1>
            <div data-m="reveal" data-m-delay="0.5" className="mt-6 max-w-xl bg-white/85 py-1">
              <p className="text-[17px] leading-[1.6] text-[#6b6e78] md:text-[18px]">
                Кейсы, инструменты и реальные цифры. Без новостного шума — только
                практические способы встроить AI в работу.
              </p>
            </div>
          </div>
        </section>

        {/* Список статей */}
        <section>
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-14 md:py-20">
            {posts && posts.length > 0 ? (
              <div data-m="stagger" className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
                {posts.map((post, index) => (
                  <div key={post.slug} data-m-item>
                    <PostCard
                      slug={post.slug}
                      title={post.title}
                      publishedAt={post.published_at}
                      coverImage={post.cover_image}
                      index={index + 1}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="k-mono">Статьи скоро появятся</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
