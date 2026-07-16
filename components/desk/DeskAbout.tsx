import Image from "next/image";

const FACTS = [
  { b: "1-3 дня", s: "от аудита до работающей системы" },
  { b: "Лично", s: "без посредников и субподряда" },
  { b: "Ваша", s: "система остаётся у вас навсегда" },
];

export default function DeskAbout() {
  return (
    <section id="about" className="py-[130px] max-md:py-[84px]">
      <div className="mx-auto max-w-[1240px] px-8 max-md:px-4">
        <div className="grid grid-cols-2 items-center gap-[72px] max-md:grid-cols-1 max-md:gap-12">
          <div className="relative h-[520px] max-md:h-[420px]" data-rv>
            <figure className="desk-sheet absolute top-0 left-[4%] w-[300px] -rotate-3 border border-line bg-white p-3 pb-11 max-md:w-[56%]">
              <span className="desk-tape" aria-hidden />
              <Image
                src="/portrait.jpg"
                alt="Влад за работой"
                width={600}
                height={750}
                className="h-auto w-full grayscale contrast-105"
              />
              <figcaption className="desk-note absolute bottom-[10px] left-0 right-0 text-center text-[17px] text-ink">
                за работой
              </figcaption>
            </figure>
            <figure className="desk-sheet absolute right-[6%] bottom-0 w-[250px] rotate-[2.4deg] border border-line bg-white p-3 pb-11 max-md:w-[46%]">
              <Image
                src="/founder.jpg"
                alt="Влад Лямин"
                width={500}
                height={620}
                className="h-auto w-full grayscale contrast-105"
              />
              <figcaption className="desk-note absolute bottom-[10px] left-0 right-0 text-center text-[17px] text-ink">
                без галстука
              </figcaption>
            </figure>
          </div>

          <div data-rv>
            <h2 className="desk-display text-[clamp(30px,3.2vw,44px)] text-ink">
              Я не агентство. <span className="hl">И это плюс.</span>
            </h2>
            <p className="mt-5 max-w-[50ch] text-[16.5px] leading-[1.65] text-ink-muted">
              Меня зовут Влад. Я лично проектирую и внедряю AI-системы для фаундеров и владельцев
              digital-бизнеса. Никаких менеджеров между нами: вы говорите с тем, кто делает руками.
            </p>
            <p className="mt-4 max-w-[50ch] text-[16.5px] leading-[1.65] text-ink-muted">
              Моя работа заканчивается не презентацией, а системой, которая каждый день экономит вам
              часы.
            </p>
            <div className="mt-8 border-t border-line">
              {FACTS.map((f) => (
                <div key={f.b} className="flex items-baseline justify-between border-b border-line py-4">
                  <b className="font-tektur text-[20px] font-bold text-ink">{f.b}</b>
                  <span className="text-[14.5px] text-ink-muted">{f.s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
