"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { track } from "@/lib/analytics";

/**
 * VSL над описанием продукта. Постер и кнопка «Смотреть»; iframe грузится
 * только по клику, чтобы тяжёлый плеер не попадал в first paint.
 */
export function Vsl({ product }: { product: Product }) {
  const [playing, setPlaying] = useState(false);
  const vsl = product.vsl;
  if (!vsl) return null;

  const ratio = vsl.ratio ?? "16/9";
  const src = vsl.embedUrl.includes("?")
    ? `${vsl.embedUrl}&autoplay=1`
    : `${vsl.embedUrl}?autoplay=1`;

  return (
    <div className="bento-vsl" style={{ aspectRatio: ratio }} data-m="reveal">
      {playing ? (
        <iframe
          src={src}
          title={vsl.title}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="bento-vsl-poster"
          onClick={() => {
            track("vsl_play", { product: product.id });
            setPlaying(true);
          }}
          aria-label={`Смотреть: ${vsl.title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={vsl.poster} alt="" loading="eager" />
          <span className="bento-vsl-play">
            <span className="bento-mono">Смотреть</span>
            <strong>{vsl.title}</strong>
          </span>
        </button>
      )}
    </div>
  );
}
