// Poster row for the /blog index — mono publish date, Literata title (goes
// italic on hover), small cover thumbnail on the right. Mirrors the row
// pattern used on /products (see app/products/ProductSection.tsx).

interface PostCardProps {
  slug: string;
  title: string;
  publishedAt: string;
  coverImage?: string | null;
}

export function PostCard({ slug, title, publishedAt, coverImage }: PostCardProps) {
  const date = new Date(publishedAt).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <a
      href={`/blog/${slug}`}
      className="group flex items-center gap-5 border-b border-line px-2 py-7 transition-transform duration-200 hover:translate-x-3 md:gap-8 md:px-4 md:py-8"
    >
      <span className="mono-label w-24 shrink-0 text-ink-muted sm:w-32">{date}</span>
      <span className="font-display flex-1 text-[clamp(20px,3.2vw,34px)] underline-offset-[5px] decoration-1 group-hover:underline">
        {title}
      </span>
      {coverImage && (
        <span className="hidden h-16 w-24 shrink-0 overflow-hidden border border-line sm:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImage}
            alt=""
            aria-hidden
            loading="lazy"
            className="h-full w-full object-cover grayscale transition-[filter] duration-300 group-hover:grayscale-0"
          />
        </span>
      )}
    </a>
  );
}
