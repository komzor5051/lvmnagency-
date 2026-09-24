// Лист на кальке в сетке /blog — обложка сверху (если есть), дата моно,
// заголовок Geologica, «Читать» с индексом листа в углу.

interface PostCardProps {
  slug: string;
  title: string;
  publishedAt: string;
  coverImage?: string | null;
  index?: number;
}

export function PostCard({ slug, title, publishedAt, coverImage, index }: PostCardProps) {
  const date = new Date(publishedAt).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <a href={`/blog/${slug}`} className="k-sheet group flex flex-col" data-m="reveal">
      {index != null && <span className="k-sheet-index">{String(index).padStart(2, "0")}</span>}
      {coverImage && (
        <span className="block overflow-hidden border-b border-[#15161a]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImage}
            alt={title}
            width={1200}
            height={630}
            loading="lazy"
            decoding="async"
            className="aspect-[16/9] w-full object-cover"
          />
        </span>
      )}
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <p className="k-mono">{date}</p>
        <h2 className="font-heading mt-3 text-xl font-bold leading-snug tracking-[-0.02em]">{title}</h2>
        <p className="k-mono mt-auto pt-6 !text-[#15161a] transition-colors group-hover:text-[#6b6e78]">
          Читать &rarr;
        </p>
      </div>
    </a>
  );
}
