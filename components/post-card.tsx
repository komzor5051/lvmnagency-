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
        className="group relative flex flex-col h-full border border-line bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.07)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      >
        <span
          aria-hidden
          className="absolute top-0 left-0 right-0 h-[2px] bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 z-10 motion-reduce:transition-none"
        />
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
          <h2 className="text-xl font-bold tracking-[-0.02em] text-ink leading-snug group-hover:underline decoration-accent decoration-2 underline-offset-4">
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
