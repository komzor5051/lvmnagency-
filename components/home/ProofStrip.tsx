import { CountUp } from "@/components/motion/CountUp";

const stats: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
}[] = [
  { value: 40, suffix: "+", label: "внедрений с 2022" },
  { value: 50, suffix: "+", label: "обученных людей" },
  { value: 1.7, prefix: "×", decimals: 1, label: "лучший рост конверсии" },
  { value: 38, prefix: "−", suffix: "%", label: "времени на рутину" },
];

/** Proof strip: four count-up stats separated by thin lines. */
export function ProofStrip() {
  return (
    <section className="border-y border-line">
      <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`px-5 py-7 md:px-10 ${i > 0 ? "md:border-l md:border-line" : ""} ${
              i % 2 === 1 ? "border-l border-line md:border-l" : ""
            } ${i >= 2 ? "border-t border-line md:border-t-0" : ""}`}
          >
            <CountUp
              value={s.value}
              prefix={s.prefix}
              suffix={s.suffix}
              decimals={s.decimals}
              className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-ink"
            />
            <p className="mt-1 text-xs text-ink-muted">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
