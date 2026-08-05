// Row on the /blog index sheet — mono publish date, Tektur title, small cover
// thumbnail on the right (covers keep their cinematic style untouched).

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
      className="studio-post-row"
      data-studio-reveal
    >
      <span className="studio-post-num">{String(index).padStart(2, "0")}</span>
      <span className="studio-mono">{date}</span>
      <h2>{title}</h2>
      {coverImage && (
        <span className="studio-post-thumb">
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
      <b aria-hidden="true">→</b>
    </a>
  );
}
