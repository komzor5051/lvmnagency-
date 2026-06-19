import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TableOfContents } from "@/components/table-of-contents";
import { CopyableCode } from "@/components/copyable-code";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await supabase
    .from("lvmn_blog_posts")
    .select("title, meta_desc, slug, tags, published_at, cover_image")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) return {};

  const blogUrl = process.env.BLOG_URL ?? "https://lvmn.vercel.app";

  return {
    title: post.title,
    description: post.meta_desc ?? undefined,
    keywords: post.tags ?? undefined,
    openGraph: {
      title: post.title,
      description: post.meta_desc ?? undefined,
      type: "article",
      url: `/blog/${post.slug}`,
      publishedTime: post.published_at,
      ...(post.cover_image && {
        images: [{ url: post.cover_image, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.meta_desc ?? undefined,
      ...(post.cover_image && { images: [post.cover_image] }),
    },
    alternates: {
      canonical: `${blogUrl}/blog/${post.slug}`,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const { data: post } = await supabase
    .from("lvmn_blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) notFound();

  const [{ data: prev }, { data: next }] = await Promise.all([
    supabase
      .from("lvmn_blog_posts")
      .select("slug, title")
      .eq("status", "published")
      .lt("published_at", post.published_at)
      .order("published_at", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("lvmn_blog_posts")
      .select("slug, title")
      .eq("status", "published")
      .gt("published_at", post.published_at)
      .order("published_at", { ascending: true })
      .limit(1)
      .single(),
  ]);

  const date = new Date(post.published_at).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const minutes = readingTime(post.content_md);
  const blogUrl = process.env.BLOG_URL ?? "https://lvmn.vercel.app";
  const contentHtml = post.content_html ?? "";

  return (
    <>
      <article>
        {/* Breadcrumbs */}
        <nav className="font-mono text-xs uppercase tracking-wider text-ink-muted mb-6">
          <Link
            href="/blog"
            className="hover:text-ink hover:underline decoration-accent underline-offset-4 transition-colors"
          >
            Блог
          </Link>
          <span aria-hidden className="mx-2 text-accent">/</span>
          <span className="text-ink truncate max-w-[200px] sm:max-w-none inline-block align-bottom normal-case">
            {post.title}
          </span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <h1 className="font-heading text-3xl md:text-5xl font-extrabold tracking-[-0.03em] text-ink mb-5 leading-[1.1]">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-wider text-ink-muted">
            <time dateTime={post.published_at}>{date}</time>
            <span aria-hidden className="text-accent">/</span>
            <span>{minutes} мин чтения</span>
            {(post.tags ?? []).slice(0, 4).map((tag: string) => (
              <span key={tag} className="inline-flex items-center gap-1">
                <span aria-hidden className="text-accent">/</span>
                {tag}
              </span>
            ))}
          </div>
          <div aria-hidden className="mt-6 h-[3px] w-16 bg-lime" />
        </header>

        {/* Two-column: TOC + Content */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* TOC (handles mobile/desktop internally) */}
          <TableOfContents html={contentHtml} />

          {/* Article content */}
          <div className="min-w-0 flex-1 max-w-[68ch]">
            <CopyableCode html={contentHtml} />

            {/* Prev/Next */}
            {(prev || next) && (
              <nav className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {prev ? (
                  <a
                    href={`/blog/${prev.slug}`}
                    className="group relative p-4 border border-line bg-white overflow-hidden transition-colors duration-200 hover:border-ink"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                      ← Предыдущая
                    </span>
                    <p className="text-ink font-medium mt-1 line-clamp-2 group-hover:underline decoration-ink underline-offset-4">
                      {prev.title}
                    </p>
                  </a>
                ) : (
                  <div />
                )}
                {next ? (
                  <a
                    href={`/blog/${next.slug}`}
                    className="group relative p-4 border border-line bg-white overflow-hidden text-right transition-colors duration-200 hover:border-ink"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                      Следующая →
                    </span>
                    <p className="text-ink font-medium mt-1 line-clamp-2 group-hover:underline decoration-ink underline-offset-4">
                      {next.title}
                    </p>
                  </a>
                ) : (
                  <div />
                )}
              </nav>
            )}

            {/* CTA */}
            <div className="relative mt-10 p-6 sm:p-8 bg-white border border-line text-center overflow-hidden">
              <span aria-hidden className="absolute top-0 left-0 right-0 h-[3px] bg-lime" />
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted mb-3">
                AI-аудит
              </p>
              <p className="font-heading text-xl font-extrabold tracking-[-0.02em] text-ink mb-2">
                Автоматизируйте свой бизнес с AI
              </p>
              <p className="text-sm text-ink-muted mb-5 max-w-[48ch] mx-auto">
                Напишите «Аудит» в Telegram — разберу ваши процессы и предложу конкретное решение
              </p>
              <a
                href={post.cta_url ?? "https://t.me/lyaminvl?text=Аудит"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-ink text-paper text-sm font-medium hover:bg-black transition-colors"
              >
                Написать в Telegram →
              </a>
            </div>
          </div>
        </div>
      </article>

      {/* JSON-LD: BlogPosting */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.meta_desc,
            datePublished: post.published_at,
            dateModified: post.published_at,
            wordCount: post.content_md?.trim().split(/\s+/).length ?? 0,
            inLanguage: "ru",
            articleSection: (post.tags ?? [])[0] ?? "AI-автоматизация",
            keywords: (post.tags ?? []).join(", "),
            ...(post.cover_image && { image: post.cover_image }),
            author: {
              "@type": "Person",
              name: "Влад Лямин",
              url: "https://lvmn.vercel.app/about",
            },
            publisher: {
              "@type": "Person",
              name: "Влад Лямин",
              url: "https://lvmn.vercel.app",
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${blogUrl}/blog/${post.slug}`,
            },
          }),
        }}
      />

      {/* JSON-LD: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Блог",
                item: `${blogUrl}/blog`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: post.title,
                item: `${blogUrl}/blog/${post.slug}`,
              },
            ],
          }),
        }}
      />
    </>
  );
}
