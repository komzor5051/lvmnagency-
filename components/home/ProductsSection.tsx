import { products } from "@/lib/products";
import { ProductCard } from "@/components/products/ProductCard";
import { Reveal } from "@/components/motion/Reveal";

export function ProductsSection() {
  const mainProducts = products.filter((p) => p.type !== "coming-soon");
  const courseProduct = products.find((p) => p.type === "coming-soon");

  return (
    <section id="products" className="scroll-mt-20">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted">
          01 — Продукты
        </p>
        <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-[-0.03em] text-ink md:text-[42px] md:leading-tight">
          Выберите точку входа под свою задачу
        </h2>
        <p className="mt-4 max-w-[580px] text-base leading-[1.55] text-ink-muted">
          Если нужно разобраться самому — начните с гайда. Если уже есть
          конкретная задача в бизнесе — приходите на консультацию: выйдете
          с планом внедрения. Если нужно перестроить команду — аудит или
          система под ключ.
        </p>
        <p className="mt-3.5 font-hand text-[22px] font-semibold text-ink-muted">
          ↳ фаундеры с задачей — сразу на консультацию
        </p>

        <Reveal className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mainProducts.map((p, i) => (
              <div key={p.id} data-reveal>
                <ProductCard product={p} step={i + 1} />
              </div>
            ))}
          </div>

          {courseProduct && (
            <div data-reveal className="mt-4">
              <ProductCard product={courseProduct} />
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
