// a16z-style cover: cinematic image with a serif title + gold byline overlaid
// on the dark left side. A left-to-right scrim guarantees legibility even when
// the underlying image isn't dark enough on the left.

type Props = {
  title: string;
  byline?: string | null;
  image?: string | null;
  variant?: "card" | "hero";
  priority?: boolean;
};

export function CoverTitle({ title, byline, image, variant = "card", priority }: Props) {
  const isHero = variant === "hero";
  const Title = isHero ? "h1" : "h2";

  return (
    <div
      className={`relative w-full overflow-hidden bg-ink ${
        isHero ? "aspect-[16/9] sm:aspect-[2/1]" : "aspect-[3/2]"
      }`}
    >
      {image && (
        // Supabase public URLs — plain <img> avoids next/image remote config.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          aria-hidden
          loading={priority ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent"
      />

      <div
        className={`absolute inset-0 flex flex-col justify-center ${
          isHero ? "px-7 sm:px-12 lg:px-16" : "px-6 sm:px-7"
        }`}
      >
        <Title
          className={`font-serif font-semibold tracking-[-0.01em] text-white [text-shadow:0_1px_24px_rgba(0,0,0,0.45)] ${
            isHero
              ? "max-w-[62%] text-3xl leading-[1.05] sm:text-4xl md:text-5xl"
              : "line-clamp-3 max-w-[82%] text-xl leading-[1.08] sm:text-2xl"
          }`}
        >
          {title}
        </Title>
        {byline && (
          <p
            className={`font-serif text-gold [text-shadow:0_1px_18px_rgba(0,0,0,0.45)] ${
              isHero ? "mt-4 text-base sm:text-lg" : "mt-2.5 text-sm"
            }`}
          >
            {byline}
          </p>
        )}
      </div>
    </div>
  );
}
