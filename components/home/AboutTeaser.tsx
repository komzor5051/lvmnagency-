import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

/** About teaser: small photo + personal positioning + link to the manifesto. */
export function AboutTeaser() {
  return (
    <section>
      <Reveal className="mx-auto grid max-w-7xl items-start gap-10 px-5 pb-20 md:grid-cols-[280px_1fr] md:gap-12 md:px-10 md:pb-24">
        <div data-reveal className="relative aspect-[4/5] w-full max-w-[280px] overflow-hidden border border-line">
          <Image
            src="/portrait.jpg"
            alt="Влад Лямин"
            fill
            sizes="280px"
            className="object-cover"
          />
        </div>

        <div data-reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted">
            04 — Обо мне
          </p>
          <h2 className="mt-3 font-heading text-2xl font-extrabold leading-[1.18] tracking-[-0.02em] text-ink md:text-3xl">
            Я не агентство. Я инженер, который отвечает{" "}
            <span className="lime-mark">лично</span>.
          </h2>
          <p className="mt-3 font-hand text-[22px] font-semibold text-ink-muted">
            ↳ один. без менеджеров и пересылок
          </p>
          <p className="mt-4 max-w-[560px] text-base leading-[1.6] text-ink-muted">
            В AI с 2022. Строю агентов, пайплайны и автоматизацию на n8n,
            Supabase, Claude. Преподаю. Живу в Новосибирске, работаю со всем
            миром. Подробнее — кто я, как работаю и почему «скучный AI» —{" "}
            <Link href="/about" className="link-ul">
              в манифесте
            </Link>
            .
          </p>
        </div>
      </Reveal>
    </section>
  );
}
