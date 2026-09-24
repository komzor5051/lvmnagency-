import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/posts";
import { getProduct } from "@/lib/products";
import { TrackedLink } from "@/components/bento/TrackedLink";
import { StickyGuideCta } from "@/components/bento/StickyGuideCta";
import { Crosshair } from "@/components/kalka/Interactive";
import { Rulers } from "@/components/kalka/Rulers";
import "@/components/home-kalka/home.css";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

// Порядок витрины на главной. Тип и подпись под ценой — здесь, а не в
// каталоге: это подача главной, у /products своя.
const showcase: { id: string; kind: string; note: string }[] = [
  { id: "guide", kind: "Гайд", note: "PDF · мгновенно" },
  { id: "codex-content-os", kind: "Гайд", note: "PDF + код" },
  { id: "consultation", kind: "1:1", note: "60 минут · онлайн" },
  { id: "support", kind: "1:1", note: "2 встречи в месяц" },
  { id: "audit", kind: "Аудит", note: "2 недели" },
  { id: "course", kind: "Курс", note: "лист ожидания" },
];

const facts = [
  { n: "200+", text: "человек научил работать с Claude/Codex" },
  { n: "40+", text: "систем собрал руками" },
  { n: "2022", text: "с этого года работаю с AI каждый день" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const H2 =
  "font-heading mt-5 max-w-3xl text-balance text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] md:text-5xl";

export default async function HomePage() {
  const posts = (await getPublishedPosts()).slice(0, 3);
  const guide = getProduct("guide");

  return (
    <div className="k-page">
      <Crosshair />
      <main>
        {/* 1. Hero — лист с линейками, как на /lab */}
        <header className="relative min-h-[min(92vh,880px)] overflow-hidden border-b border-[#15161a]" id="top">
          <Rulers />

          <div className="relative z-[2] mx-auto max-w-7xl px-5 pb-20 pl-10 pt-24 md:px-14 md:pt-28">
            <p className="k-mono inline-block bg-white pr-2">Обучение · консультации · гайды по Claude/Codex</p>

            <h1
              data-m="lines"
              data-m-hero
              className="font-heading mt-6 max-w-[16ch] text-balance text-[42px] font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-[56px] lg:max-w-[19ch] lg:text-[72px]"
            >
              Учу экспертов и предпринимателей работать с <span className="rz-mark">нейросетями</span>
            </h1>

            <div data-m="reveal" data-m-delay="0.5" className="mt-8 max-w-xl bg-white/85 py-1">
              <p className="text-[17px] leading-[1.6] text-[#6b6e78] md:text-[18px]">
                Гайды, консультации и аудит для тех, кто хочет закрывать одному задачи, под которые обычно
                нанимают команду.
              </p>
            </div>

            <div className="k-point mt-10 flex flex-wrap items-center gap-4" style={{ animationDelay: "0.9s" }}>
              <TrackedLink href="#products" event="hero_cta_click" className="k-btn k-btn--solid">
                Смотреть продукты
              </TrackedLink>
              <Link href="/about" className="k-btn">
                Кто я
              </Link>
            </div>

            <div data-m="stagger" className="hk-facts mt-16 sm:grid-cols-3">
              {facts.map((f) => (
                <div key={f.n} data-m-item className="hk-fact">
                  <p data-m="count" className="font-heading text-4xl font-extrabold tracking-[-0.03em] md:text-5xl">
                    {f.n}
                  </p>
                  <p className="text-[14px] leading-snug text-[#6b6e78]">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* 2. Продукты — каталог строк */}
        <section className="border-b border-[#15161a]" id="products">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
            <p className="k-mono inline-block bg-white pr-2">Продукты</p>
            <h2 data-m="lines" className={H2}>
              Продукты
            </h2>

            <div data-m="stagger" className="hk-products mt-14">
              {showcase.map((item, i) => {
                const p = getProduct(item.id);
                if (!p) return null;
                const soon = p.price === null;
                return (
                  <div key={p.id} data-m-item>
                    <TrackedLink
                      href={`/products/${p.id}`}
                      event="product_tile_click"
                      eventProps={{ product: p.id, position: i + 1, section: "home_index" }}
                      className={`hk-product ${soon ? "hk-product--soon" : ""}`}
                    >
                      <span className="k-mono !text-[#15161a]">{item.kind}</span>
                      <h3 className="hk-product-title">{p.title}</h3>
                      <span className="hk-product-desc">{p.tagline}</span>
                      <span className="hk-product-price">
                        {p.priceLabel}
                        <small>{item.note}</small>
                      </span>
                    </TrackedLink>
                  </div>
                );
              })}
            </div>

            <p className="mt-10">
              <Link href="/products" className="k-btn">
                Все форматы подробно <span aria-hidden="true">&rarr;</span>
              </Link>
            </p>
          </div>
        </section>

        {/* 3. Обо мне */}
        <section className="border-b border-[#15161a]" id="about">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
            <div className="hk-about-grid">
              <div data-m="reveal" className="hk-portrait">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/portrait-editorial.jpg"
                  alt="Влад Лямин"
                  width="1012"
                  height="1350"
                  loading="lazy"
                />
              </div>
              <div>
                <p className="k-mono inline-block bg-white pr-2">Обо мне</p>
                <h2 data-m="lines" className={H2}>
                  Четвёртый год работаю с нейросетями каждый день
                </h2>
                <p data-m="reveal" className="mt-6 max-w-md text-[18px] font-medium leading-[1.35] text-[#15161a]">
                  Внедряю AI в бизнесы, обучаю команды, а также показываю, как одному человеку собрать
                  систему, которая работает без команды.
                </p>
                <p data-m="reveal" className="mt-6 max-w-md text-[16px] leading-relaxed text-[#6b6e78]">
                  Пишу гайды, провожу консультации и аудиты. Всё, что советую, сначала проверяю на себе: этот
                  сайт, блог и контент к нему собирает система, о которой я рассказываю.
                </p>
                <p data-m="reveal" className="mt-8">
                  <Link href="/about" className="k-btn">
                    Подробнее обо мне
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Блог */}
        {posts.length > 0 && (
          <section className="border-b border-[#15161a]" id="blog">
            <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
              <p className="k-mono inline-block bg-white pr-2">Блог</p>
              <h2 data-m="lines" className={H2}>
                Заметки о Claude/Codex
              </h2>
              <p data-m="reveal" className="mt-4 max-w-xl bg-white/85 text-[16px] leading-relaxed text-[#6b6e78]">
                Что сработало, что нет и сколько стоило.
              </p>

              <div data-m="stagger" className="hk-posts mt-14">
                {posts.map((post) => (
                  <Link href={`/blog/${post.slug}`} key={post.slug} className="k-sheet p-6 pt-8" data-m-item>
                    <span className="k-mono hk-post-date">
                      {formatDate(post.published_at)} · {(post.tags ?? [])[0] ?? "Claude/Codex"}
                    </span>
                    <h3 className="hk-post-title">{post.title}</h3>
                  </Link>
                ))}
              </div>

              <p className="mt-10">
                <Link href="/blog" className="k-btn">
                  Все статьи <span aria-hidden="true">&rarr;</span>
                </Link>
              </p>
            </div>
          </section>
        )}

        {/* 5. Финальный CTA */}
        <section>
          <div className="mx-auto max-w-7xl px-5 py-24 md:px-14 md:py-32">
            <p className="k-mono inline-block bg-white pr-2">Первый шаг</p>
            <h2
              data-m="lines"
              className="font-heading mt-5 max-w-3xl text-balance text-4xl font-extrabold leading-[1.06] tracking-[-0.04em] md:text-6xl"
            >
              Начни с <span className="rz-mark">азов</span>
            </h2>
            <p data-m="reveal" className="mt-6 max-w-xl text-[17px] leading-[1.6] text-[#6b6e78]">
              Самый дешёвый способ проверить, встроится ли Claude/Codex в твою работу. Файл приходит сразу после
              оплаты.
            </p>
            <p data-m="reveal" className="mt-10">
              <TrackedLink
                href="/products/guide"
                event="product_tile_click"
                eventProps={{ product: "guide", position: 1, section: "final" }}
                className="k-btn k-btn--solid"
              >
                Получить материал
              </TrackedLink>
            </p>
          </div>
        </section>
      </main>

      <StickyGuideCta />
    </div>
  );
}
