import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/posts";
import { getProduct } from "@/lib/products";
import { TrackedLink } from "@/components/bento/TrackedLink";
import { StickyGuideCta } from "@/components/bento/StickyGuideCta";

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
  { id: "audit", kind: "Аудит", note: "2 недели" },
  { id: "course", kind: "Курс", note: "лист ожидания" },
];

const facts = [
  { n: "50+", text: "человек научил работать с Claude" },
  { n: "40+", text: "систем собрал руками" },
  { n: "2022", text: "с этого года работаю с AI каждый день" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function HomePage() {
  const posts = (await getPublishedPosts()).slice(0, 3);
  const guide = getProduct("guide");

  return (
    <main className="rz">
      {/* 1. Hero — 5c: шторка слева направо, потом лайм-маркер под «личную». */}
      <header className="rz-hero" id="top">
        <div className="rz-wrap rz-hero-grid">
          <div>
            <p className="rz-mono rz-hero-eyebrow">Личная AI-система · обучение · консультации</p>
            <h1 className="rz-h1">
              Помогаю собрать <span className="rz-mark">личную</span> систему работы на&nbsp;Claude
            </h1>
            <p className="rz-lead rz-hero-lead">
              Гайды, консультации и аудит для тех, кто хочет закрывать одному задачи,
              под которые обычно нанимают команду.
            </p>
            <div className="rz-hero-acts">
              <TrackedLink href="#products" event="hero_cta_click" className="rz-btn rz-btn--solid">
                Смотреть продукты
              </TrackedLink>
              <Link href="/about" className="rz-btn">Кто я</Link>
            </div>
          </div>
          <aside className="rz-hero-aside">
            {facts.map((f) => (
              <p key={f.n}><strong>{f.n}</strong>{f.text}</p>
            ))}
          </aside>
        </div>
      </header>

      {/* 2. Продукты — оглавление. 1a: сдвиг вправо + лайм-полоса слева. */}
      <section className="rz-section" id="products">
        <div className="rz-wrap">
          <div className="rz-sec-head" data-studio-reveal>
            <h2 className="rz-h2">Продукты</h2>
            <p>Четыре формата. Начать можно с любого, дальше идти необязательно.</p>
          </div>
          <div className="rz-index">
            {showcase.map((item, i) => {
              const p = getProduct(item.id);
              if (!p) return null;
              const soon = p.price === null;
              return (
                <TrackedLink
                  key={p.id}
                  href={`/products/${p.id}`}
                  event="product_tile_click"
                  eventProps={{ product: p.id, position: i + 1, section: "home_index" }}
                  className={`rz-row ${soon ? "rz-row--soon" : ""}`}
                >
                  <span className="rz-mono">{item.kind}</span>
                  <h3>{p.title}</h3>
                  <span className="rz-row-desc">{p.tagline}</span>
                  <span className="rz-row-price">
                    {p.priceLabel}
                    <small>{item.note}</small>
                  </span>
                </TrackedLink>
              );
            })}
          </div>
          <p className="rz-more" data-studio-reveal>
            <Link href="/products" className="rz-link">Все форматы подробно</Link>
          </p>
        </div>
      </section>

      {/* 3. Обо мне */}
      <section className="rz-section rz-about" id="about">
        <div className="rz-wrap rz-about-grid">
          <div className="rz-portrait" data-studio-reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/portrait-editorial.jpg" alt="Влад Лямин" width="1012" height="1350" loading="lazy" />
          </div>
          <div>
            <p className="rz-mono" data-studio-reveal>Обо мне</p>
            <h2 className="rz-h2" data-studio-reveal>Четвёртый год работаю с Claude каждый день</h2>
            <p className="rz-thesis" data-studio-reveal>
              Не внедряю AI в чужие команды. Показываю одному человеку, как собрать
              систему, которая работает без команды.
            </p>
            <p className="rz-lead" data-studio-reveal>
              Пишу гайды, провожу консультации и аудиты. Всё, что советую, сначала
              проверяю на себе: этот сайт, блог и контент к нему собирает система,
              о которой я рассказываю.
            </p>
            <p data-studio-reveal>
              <Link href="/about" className="rz-btn">Подробнее обо мне</Link>
            </p>
          </div>
        </div>
      </section>

      {/* 4. Блог — 4b: толстая лайм-линия под карточкой. */}
      {posts.length > 0 && (
        <section className="rz-section" id="blog">
          <div className="rz-wrap">
            <div className="rz-sec-head" data-studio-reveal>
              <h2 className="rz-h2">Блог</h2>
              <p>Заметки о Claude и Claude Code. Что сработало, что нет и сколько стоило.</p>
            </div>
            <div className="rz-posts">
              {posts.map((post, i) => (
                <Link
                  href={`/blog/${post.slug}`}
                  key={post.slug}
                  className="rz-post"
                  data-studio-reveal
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <span className="rz-mono">
                    {formatDate(post.published_at)} · {(post.tags ?? [])[0] ?? "Claude"}
                  </span>
                  <h3>{post.title}</h3>
                  <span className="rz-post-line" />
                </Link>
              ))}
            </div>
            <p className="rz-more" data-studio-reveal>
              <Link href="/blog" className="rz-link">Все статьи</Link>
            </p>
          </div>
        </section>
      )}

      {/* 5. Финальный CTA */}
      <section className="rz-section rz-cta">
        <div className="rz-wrap">
          <p className="rz-mono" data-studio-reveal>Первый шаг</p>
          <h2 className="rz-h2 rz-cta-title" data-studio-reveal>
            Начни с гайда <span className="rz-mark">за {guide?.priceLabel ?? "990 ₽"}</span>
          </h2>
          <p className="rz-lead" data-studio-reveal>
            Самый дешёвый способ проверить, встроится ли Claude в твою работу.
            Файл приходит сразу после оплаты.
          </p>
          <p data-studio-reveal>
            <TrackedLink
              href="/products/guide"
              event="product_tile_click"
              eventProps={{ product: "guide", position: 1, section: "final" }}
              className="rz-btn rz-btn--solid"
            >
              Получить гайд
            </TrackedLink>
          </p>
        </div>
      </section>

      <StickyGuideCta />
    </main>
  );
}
