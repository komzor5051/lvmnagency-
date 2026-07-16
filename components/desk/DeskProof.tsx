export default function DeskProof() {
  return (
    <section className="py-[130px] max-md:py-[84px]">
      <div className="mx-auto max-w-[1240px] px-8 max-md:px-4">
        <div className="grid grid-cols-2 items-center gap-16 max-md:grid-cols-1 max-md:gap-10">
          <div
            className="desk-sheet relative -rotate-[1.4deg] border border-line bg-white px-12 py-14 text-center max-md:px-7"
            data-rv
          >
            <span className="desk-tape" aria-hidden />
            <div className="font-tektur text-[clamp(64px,7vw,116px)] font-bold leading-none text-ink">
              <span className="hl">
                <span data-counter="50">50</span>-70%
              </span>
            </div>
            <span className="desk-note mt-3 block text-[20px] text-ink">
              времени освобождается
            </span>
          </div>
          <figure data-rv>
            <blockquote className="font-serif text-[clamp(21px,2vw,27px)] font-semibold italic leading-[1.45] text-ink">
              «Раньше заявки разбирали два человека полдня. Теперь система делает это к девяти утра».
            </blockquote>
            <figcaption className="mt-[18px] text-[15px] text-ink-muted">
              Основатель онлайн-школы, клиент по внедрению
              <br />
              <span className="desk-note text-[17px] text-ink">результат за первую неделю</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
