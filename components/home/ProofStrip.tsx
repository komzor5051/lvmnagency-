import { CountUp } from "@/components/motion/CountUp";

type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  note?: string; // sourced context, renders tiny below the label
};

const stats: Stat[] = [
  {
    value: 40,
    suffix: "+",
    label: "внедрений с 2022",
  },
  {
    value: 200,
    suffix: "+",
    label: "человек обучено работе с AI",
  },
];

/** Proof strip: four count-up stats with optional sourced footnotes. */
export function ProofStrip() {
  return (
    <section className="border-y border-line">
      <div className="mx-auto grid max-w-7xl grid-cols-2">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`px-5 py-7 md:px-10 ${i > 0 ? "border-l border-line" : ""}`}
          >
            <CountUp
              value={s.value}
              prefix={s.prefix}
              suffix={s.suffix}
              decimals={s.decimals}
              className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-ink"
            />
            <p className="mt-1 text-xs text-ink-muted">{s.label}</p>
            {s.note && (
              <p className="mt-0.5 text-[10px] text-ink-muted/60">{s.note}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
