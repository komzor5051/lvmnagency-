// Линейки по краям листа: деления рисует CSS (.k-ruler), цифры — здесь.
// Родитель должен быть position: relative и overflow: hidden.
export function Rulers() {
  return (
    <>
      <div className="k-ruler-corner" aria-hidden="true" />
      <div className="k-ruler k-ruler--top" aria-hidden="true">
        {Array.from({ length: 60 }, (_, i) => (
          <span key={i} style={{ left: i * 40 }}>{i > 0 ? i : ""}</span>
        ))}
      </div>
      <div className="k-ruler k-ruler--left" aria-hidden="true">
        {Array.from({ length: 30 }, (_, i) => (
          <span key={i} style={{ top: i * 40 }}>{i > 0 ? i : ""}</span>
        ))}
      </div>
    </>
  );
}
