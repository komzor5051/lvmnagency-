import { CoverTitle } from "@/components/blog/CoverTitle";

interface PostCardProps {
  slug: string;
  title: string;
  metaDesc: string | null;
  publishedAt: string;
  tags: string[];
  coverImage?: string | null;
}

export function PostCard({ slug, title, publishedAt, coverImage }: PostCardProps) {
  const date = new Date(publishedAt).toLocaleDateString("ru-RU", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <article className="h-full">
      <a
        href={`/blog/${slug}`}
        className="group block h-full overflow-hidden border border-line transition-colors duration-200 hover:border-ink"
      >
        <div className="transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
          <CoverTitle title={title} byline={date} image={coverImage} />
        </div>
      </a>
    </article>
  );
}
