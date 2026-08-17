// Bento tile on the /blog index grid — optional cover on top, mono publish
// date, Onest title, "Читать" pinned to the bottom. Covers keep their
// cinematic style untouched.

interface PostCardProps {
  slug: string;
  title: string;
  publishedAt: string;
  coverImage?: string | null;
  index?: number;
}

export function PostCard({ slug, title, publishedAt, coverImage, index = 1 }: PostCardProps) {
  const date = new Date(publishedAt).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <a
      href={`/blog/${slug}`}
      className="bento-tile bento-tile--link bento-col-4"
      data-studio-reveal
      style={{ transitionDelay: `${((index - 1) % 3) * 60}ms` }}
    >
      {coverImage && (
        <span className="bento-post-cover">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImage}
            alt={title}
            width={1200}
            height={630}
            loading="lazy"
            decoding="async"
          />
        </span>
      )}
      <p className="bento-mono">{date}</p>
      <h2 className="bento-post-title">{title}</h2>
      <p className="bento-post-read">Читать</p>
    </a>
  );
}
