// Row on the /blog index sheet — mono publish date, Tektur title, small cover
// thumbnail on the right (covers keep their cinematic style untouched).

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
      className="group flex items-center gap-5 border-b border-line px-2 py-7 transition-transform duration-200 last:border-b-0 hover:translate-x-3 md:gap-8 md:px-4 md:py-8"
    >
      <span className="mono-label w-24 shrink-0 text-ink-muted sm:w-32">{date}</span>
      <span className="font-tektur flex-1 text-[clamp(18px,2.2vw,26px)] font-bold leading-snug underline-offset-[5px] decoration-1 group-hover:underline">
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
