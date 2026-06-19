interface PostCardProps {
  slug: string;
  title: string;
  metaDesc: string | null;
  publishedAt: string;
  tags: string[];
  coverImage?: string | null;
}

export function PostCard({ slug, title, metaDesc, publishedAt, tags, coverImage }: PostCardProps) {
  const date = new Date(publishedAt).toLocaleDateString("ru-RU", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <article className="h-full">
      <a
        href={`/blog/${slug}`}
        className="group relative flex flex-col h-full border border-line bg-white overflow-hidden transition-colors duration-200 hover:border-ink"
      >
        {coverImage && (
          <div className="aspect-[16/9] overflow-hidden bg-[#efefec] border-b border-line">
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </div>
        )}
        <div className="p-5 sm:p-6 flex flex-col flex-1">
          <h2 className="font-heading text-xl font-extrabold tracking-[-0.02em] text-ink leading-snug group-hover:underline decoration-ink decoration-2 underline-offset-4">
            {title}
          </h2>
          {metaDesc && (
            <p className="mt-2.5 text-ink-muted text-sm leading-relaxed line-clamp-3 flex-1">
              {metaDesc}
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
            <time>{date}</time>
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1">
                <span aria-hidden className="text-accent">/</span>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </a>
    </article>
  );
}
