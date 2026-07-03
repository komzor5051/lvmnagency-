# Product Permalink Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every product in `lib/products.ts` its own shareable URL at `/products/[slug]` with full content, correct metadata, and a per-product OG image — without changing the content or layout of the existing `/products` list page (aside from a small permalink link).

**Architecture:** A new dynamic route `app/products/[slug]/` renders one product's full detail (same content blocks as the existing `ProductSection`, single column) using `generateStaticParams()` for the 5 known product ids. A sibling `opengraph-image.tsx` in the same dynamic segment reuses the existing `og-products-bg.png` background and layout, swapping in the product's own title and meta. `ProductSection.tsx` gets one small addition: a permalink link next to the product title pointing to the new route.

**Tech Stack:** Next.js 16 App Router (React 19), Tailwind v4, no test runner in this repo — verification is `npm run lint`, `npm run build`, and manual checks via `npm run dev`.

## Global Constraints

- Design system: White + Lime, `#FFFFFF` paper / `#111111` ink / `#C8F04C` lime accent, radius 0, no shadows — see `app/products/CLAUDE.md` design tokens already used in `ProductCard.tsx` / `ProductSection.tsx`. Reuse existing Tailwind utility classes verbatim; do not invent new colors.
- No emojis anywhere (user global + project rule).
- `lib/products.ts` is the single source of truth and must not be edited — `slug` is the existing `Product.id` field, no new field.
- Reuse `BuyAction` (`app/products/BuyAction.tsx`), `Faq` (`app/products/Faq.tsx`), and `productExtras` (`app/products/content.ts`) as-is — do not fork their logic.
- No new images/assets — OG image reuses `public/og-products-bg.png`; page content is typography-only.
- Site URL for canonical/OG comes from `process.env.NEXT_PUBLIC_SITE_URL ?? "https://vladlyamin.ru"` (same pattern as `app/products/page.tsx:7`).

---

## File Structure

- `app/products/[slug]/page.tsx` — new. Single-product detail page: breadcrumb, title/meta/price/buy, description, forWhom/inside, FAQ. Exports `generateStaticParams` and `generateMetadata`.
- `app/products/[slug]/opengraph-image.tsx` — new. Per-product OG image, adapted from `app/products/opengraph-image.tsx`.
- `app/products/ProductSection.tsx` — modified. Add a small permalink `<Link>` next to the `<h2>`.

No other files change.

---

### Task 1: Permalink link on `/products`

**Files:**
- Modify: `app/products/ProductSection.tsx:37-63` (the `<h2>` block inside the left sticky column)

**Interfaces:**
- Consumes: `Product` type from `@/lib/products` (already imported in this file), specifically `product.id` and `product.title`.
- Produces: nothing new consumed by later tasks — this is a standalone visual addition.

- [ ] **Step 1: Add the permalink import and markup**

Open `app/products/ProductSection.tsx`. Add the `Link` import at the top (after the existing imports):

```tsx
import type { Product } from "@/lib/products";
import Link from "next/link";
import { BuyAction } from "./BuyAction";
import { Faq } from "./Faq";
import { productExtras } from "./content";
```

Replace the `<h2>` line:

```tsx
        <h2 className="font-heading mt-5 text-3xl font-bold leading-[1.05] tracking-[-0.03em] text-ink md:text-4xl">
          {product.title}
        </h2>
```

with a heading + permalink pair:

```tsx
        <h2 className="font-heading mt-5 flex items-baseline gap-2 text-3xl font-bold leading-[1.05] tracking-[-0.03em] text-ink md:text-4xl">
          {product.title}
          <Link
            href={`/products/${product.id}`}
            aria-label={`Постоянная ссылка на ${product.title}`}
            className="font-mono text-base font-normal tracking-normal text-ink-muted no-underline transition-colors hover:text-ink"
          >
            #
          </Link>
        </h2>
```

- [ ] **Step 2: Verify with lint**

Run: `npm run lint`
Expected: no errors related to `app/products/ProductSection.tsx`.

- [ ] **Step 3: Manual visual check**

Run: `npm run dev`, open `http://localhost:3000/products`.
Expected: each product title shows a small `#` after it; hovering darkens it from muted grey to ink; clicking it navigates to `/products/<id>` (will 404 until Task 2 lands — that's expected at this point).

- [ ] **Step 4: Commit**

```bash
git add app/products/ProductSection.tsx
git commit -m "feat(products): add permalink link next to product titles"
```

---

### Task 2: Standalone product detail page `/products/[slug]`

**Files:**
- Create: `app/products/[slug]/page.tsx`

**Interfaces:**
- Consumes: `products`, `getProduct`, `type Product` from `@/lib/products`; `productExtras` from `@/app/products/content` (relative import `../content`); `BuyAction` from `../BuyAction`; `Faq` from `../Faq`. All already exist and are used identically in `ProductSection.tsx`.
- Produces: route `/products/[slug]` — consumed by Task 3's `opengraph-image.tsx` only insofar as both share the same `params.slug` → `product.id` lookup pattern (no shared code, just the same convention).

- [ ] **Step 1: Create the page file**

Create `app/products/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, products, type Product } from "@/lib/products";
import { Reveal } from "@/components/motion/Reveal";
import { BuyAction } from "../BuyAction";
import { Faq } from "../Faq";
import { productExtras } from "../content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vladlyamin.ru";

const typeLabels: Record<Product["type"], string> = {
  consultation: "консультация",
  digital: "цифровой продукт",
  service: "услуга",
  "coming-soon": "скоро",
};

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  const title = `${product.title} — Влад Лямин`;
  const description = product.tagline;
  const url = `${siteUrl}/products/${product.id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: "website",
      url,
      locale: "ru_RU",
    },
  };
}

function BulletList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-4 text-sm leading-relaxed text-ink">
            <span aria-hidden="true" className="mt-[0.65em] h-0.5 w-4 shrink-0 bg-accent" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const extra = productExtras[product.id];

  return (
    <main className="bg-paper text-ink">
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-10 md:pb-32">
        <nav aria-label="Хлебные крошки">
          <Link
            href="/products"
            className="font-mono text-xs tracking-[0.08em] text-ink-muted transition-colors hover:text-ink"
          >
            &larr; Продукты
          </Link>
        </nav>

        <Reveal>
          <header data-reveal className="pb-10 pt-14 md:pt-20">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
              {typeLabels[product.type]}
            </p>
            <h1 className="font-heading mt-5 text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] text-ink md:text-6xl">
              {product.title}
            </h1>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">
              {product.meta}
            </p>
            <p className="mt-8 text-3xl font-bold tracking-[-0.02em] text-ink">
              {product.priceLabel}
            </p>
            <div className="mt-6 max-w-xs">
              <BuyAction product={product} />
            </div>
          </header>

          <div className="space-y-12">
            <div data-reveal className="space-y-5">
              {product.description.map((paragraph) => (
                <p key={paragraph} className="text-base leading-relaxed text-ink md:text-lg">
                  {paragraph}
                </p>
              ))}
            </div>

            {extra && (
              <div data-reveal className="grid gap-10 sm:grid-cols-2 sm:gap-8">
                <BulletList title="Для кого" items={extra.forWhom} />
                <BulletList title="Что внутри" items={extra.inside} />
              </div>
            )}

            {product.faq && product.faq.length > 0 && (
              <div data-reveal>
                <Faq items={product.faq} />
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify with lint and build**

Run: `npm run lint`
Expected: no errors.

Run: `npm run build`
Expected: build succeeds and prints 5 static paths generated under `/products/[slug]` (one per product id: `guide`, `consultation`, `audit`, `ai-os`, `course`) in the route summary.

- [ ] **Step 3: Manual check of all 5 routes**

Run: `npm run dev`, then visit each of:
- `http://localhost:3000/products/guide`
- `http://localhost:3000/products/consultation`
- `http://localhost:3000/products/audit`
- `http://localhost:3000/products/ai-os`
- `http://localhost:3000/products/course`

Expected: each shows the product's title, meta, price, buy action, description paragraphs, "Для кого"/"Что внутри" (except `ai-os`, which has no `productExtras` entry — that section should simply not render), and FAQ. `← Продукты` link returns to `/products`.

Also visit `http://localhost:3000/products/does-not-exist` — expected: Next.js 404 page.

- [ ] **Step 4: Commit**

```bash
git add "app/products/[slug]/page.tsx"
git commit -m "feat(products): add standalone /products/[slug] detail pages"
```

---

### Task 3: Per-product OG image

**Files:**
- Create: `app/products/[slug]/opengraph-image.tsx`

**Interfaces:**
- Consumes: `getProduct` from `@/lib/products`; reads `public/og-products-bg.png` from disk exactly like `app/products/opengraph-image.tsx:9-14` does.
- Produces: nothing consumed elsewhere — this is a leaf route handler picked up automatically by Next.js metadata file conventions for `/products/[slug]`.

- [ ] **Step 1: Create the OG image file**

Create `app/products/[slug]/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { getProduct } from "@/lib/products";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function loadBg(name: string): string | null {
  const p = join(process.cwd(), "public", name);
  if (!existsSync(p)) return null;
  const buf = readFileSync(p);
  return `data:image/png;base64,${buf.toString("base64")}`;
}

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  return [
    {
      id: slug,
      alt: product ? `${product.title} — Влад Лямин` : "Продукты — Влад Лямин",
      size,
      contentType,
    },
  ];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  const bg = loadBg("og-products-bg.png");
  const title = product?.title ?? "Продукты";
  const badge = product?.meta ?? "vladlyamin.ru";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "#FFFFFF",
          position: "relative",
        }}
      >
        {bg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bg}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "right center",
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: "65%",
            background: bg
              ? "linear-gradient(to right, #FFFFFF 80%, transparent)"
              : "#FFFFFF",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "7px",
            backgroundColor: "#C8F04C",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "64px 64px 56px",
            width: "65%",
          }}
        >
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: "15px",
              color: "#888888",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: "24px",
            }}
          >
            vladlyamin.ru · продукты
          </div>
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: title.length > 24 ? "56px" : "76px",
              fontWeight: 800,
              color: "#111111",
              lineHeight: 1.05,
              marginBottom: "32px",
              letterSpacing: "-0.03em",
            }}
          >
            {title}
          </div>

          <div
            style={{
              padding: "8px 16px",
              border: "1.5px solid #D0D0D0",
              fontFamily: "sans-serif",
              fontSize: "17px",
              color: "#333333",
              backgroundColor: "#FFFFFF",
              alignSelf: "flex-start",
            }}
          >
            {badge}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginTop: "36px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "3px",
                backgroundColor: "#C8F04C",
              }}
            />
            <div
              style={{
                fontFamily: "sans-serif",
                fontSize: "14px",
                color: "#888888",
              }}
            >
              Влад Лямин
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 2: Verify with lint and build**

Run: `npm run lint`
Expected: no errors.

Run: `npm run build`
Expected: build succeeds; route output includes `opengraph-image` entries under `/products/[slug]`.

- [ ] **Step 3: Manual check**

Run: `npm run dev`, then visit:
- `http://localhost:3000/products/guide/opengraph-image`
- `http://localhost:3000/products/consultation/opengraph-image`

Expected: each returns a 1200×630 PNG with the product's own title large on the left and its `meta` string in the badge (not the generic "Продукты" heading or the 4-tag list from `app/products/opengraph-image.tsx`).

- [ ] **Step 4: Commit**

```bash
git add "app/products/[slug]/opengraph-image.tsx"
git commit -m "feat(products): add per-product OG image for /products/[slug]"
```

---

### Task 4: Full verification pass

**Files:** none (verification only).

- [ ] **Step 1: Full lint + build**

Run: `npm run lint && npm run build`
Expected: both succeed with no errors or warnings introduced by the new files.

- [ ] **Step 2: Confirm all 5 static params built**

Run: `npm run build` output should list, under the route tree, static pages for `/products/guide`, `/products/consultation`, `/products/audit`, `/products/ai-os`, `/products/course` (look for `● (SSG)` or similar static markers next to `/products/[slug]` in the Next.js build summary).

- [ ] **Step 3: End-to-end manual pass**

Run: `npm run dev`. Walk through:
1. `/products` — confirm the permalink `#` links work and existing cards/sections are unchanged.
2. Each of the 5 `/products/[slug]` pages — confirm content matches what's on `/products` for that product (same description, FAQ, price, buy button behavior).
3. `/products/nonexistent-slug` — confirm 404.
4. One `opengraph-image` URL — confirm it renders and shows the correct product title.

Expected: no regressions on `/products`, all subpages render correctly, unknown slugs 404.

- [ ] **Step 4: Final commit (if any fixes were needed)**

If Steps 1-3 required fixes, commit them:

```bash
git add -A
git commit -m "fix(products): address verification issues in permalink pages"
```

If no fixes were needed, skip this step — the feature is complete as of Task 3's commit.
