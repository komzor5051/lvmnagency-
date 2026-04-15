const STATS = [
  { num: "15+", label: "автоматизаций запущено" },
  { num: "Соло", label: "без агентства и субподрядчиков" },
  { num: "40 ч/мес", label: "экономия у клиентов" },
  { num: "3–5×", label: "ускорение рутинных задач" },
] as const;

export function ProofBar() {
  return (
    <div className="l-proof-bar">
      {STATS.map((s, i) => (
        <div key={s.num} style={{ display: "contents" }}>
          <div className="l-proof-item">
            <div className="l-proof-num">{s.num}</div>
            <div className="l-proof-label">{s.label}</div>
          </div>
          {i < STATS.length - 1 && <div className="l-proof-sep" />}
        </div>
      ))}
    </div>
  );
}
