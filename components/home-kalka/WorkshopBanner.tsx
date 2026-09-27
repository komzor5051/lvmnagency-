"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";
import { WORKSHOP_START as START, SEATS_TOTAL, SEATS_TAKEN, seatsLabel } from "@/lib/workshop";

// После старта практикума секция пропадает сама.

const files = ["Файл голоса по твоим постам", "Банк из 30 тем из практики", "5 черновиков постов и рилсов"];

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [
    { v: Math.floor(s / 86400), l: "дней" },
    { v: Math.floor((s % 86400) / 3600), l: "часов" },
    { v: Math.floor((s % 3600) / 60), l: "минут" },
    { v: s % 60, l: "секунд" },
  ];
}

// null до монтирования: сервер и клиент рисуют одинаковые «--», цифры появляются после гидрации.
function useNow() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return now;
}

// Карточка в правом верхнем углу первого экрана главной. Только на широких экранах.
export function WorkshopHeroCard() {
  const now = useNow();
  if (now !== null && now >= START) return null;
  const left = now === null ? null : parts(START - now);

  return (
    <aside className="absolute right-6 top-28 z-[3] hidden w-[300px] border border-[#15161a] bg-white min-[1360px]:block">
      <div className="flex items-center justify-between bg-[#15161a] px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white">
        <span>До старта практикума</span>
        <span className="text-[#c8f04c]">11.10</span>
      </div>
      <div className="grid grid-cols-4 border-b border-[#15161a]">
        {(left ?? parts(0)).map((p, i) => (
          <div key={p.l} className={`px-2 py-4 text-center ${i > 0 ? "border-l border-[#15161a]/15" : ""}`}>
            <span className="font-heading block text-[30px] font-extrabold leading-none tracking-[-0.03em] tabular-nums">
              {left ? String(p.v).padStart(2, "0") : "--"}
            </span>
            <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.1em] text-[#6b6e78]">{p.l}</span>
          </div>
        ))}
      </div>
      <div className="p-4">
        <p className="font-heading text-[17px] font-bold leading-snug tracking-[-0.02em]">
          Как внедрить ИИ в&nbsp;свой контент за&nbsp;3&nbsp;часа
        </p>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-[#6b6e78]">{seatsLabel}</p>
        <Link
          href="/workshop"
          onClick={() => track("workshop_home_click", { cta: "hero_card" })}
          className="mt-4 flex items-center justify-between bg-[#c8f04c] px-4 py-3 text-[15px] font-semibold text-[#15161a] transition-colors hover:bg-[#15161a] hover:text-white"
        >
          Записаться за 4900 ₽ <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </aside>
  );
}

export function WorkshopBanner() {
  const now = useNow();

  if (now !== null && now >= START) return null;

  const left = now === null ? null : parts(START - now);

  return (
    <section
      id="workshop"
      className="relative border-b border-[#15161a] text-white"
      style={{
        backgroundColor: "#15161a",
        backgroundImage:
          "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
        backgroundSize: "200px 200px",
      }}
    >
      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 md:px-14 md:py-28 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-16">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/50">
            Ближайший практикум · 11 октября · 12:00 МСК · Zoom
          </p>
          <h2 className="font-heading mt-6 max-w-[18ch] text-balance text-4xl font-extrabold leading-[1.04] tracking-[-0.04em] md:text-6xl">
            Как внедрить ИИ в&nbsp;свой контент{" "}
            <span className="bg-[#c8f04c] px-1 text-[#15161a]">за&nbsp;3&nbsp;часа</span>
          </h2>
          <p className="mt-8 max-w-xl text-[17px] leading-[1.65] text-white/65">
            Собираем вживую на твоих старых постах. Группа до 15 человек, запись остаётся у тебя.
          </p>

          <ul className="mt-8 space-y-3">
            {files.map((f, i) => (
              <li key={f} className="flex items-baseline gap-4 text-[16px]">
                <span className="font-mono text-[12px] text-[#c8f04c]">{String(i + 1).padStart(2, "0")}</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/workshop"
              onClick={() => track("workshop_home_click", { cta: "primary" })}
              className="inline-flex items-center gap-2 bg-[#c8f04c] px-6 py-4 text-[16px] font-semibold text-[#15161a] transition-colors hover:bg-white"
            >
              Записаться за 4900 ₽ <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link
              href="/workshop"
              onClick={() => track("workshop_home_click", { cta: "program" })}
              className="inline-flex items-center gap-2 border border-white/40 px-6 py-4 text-[16px] font-semibold transition-colors hover:border-white"
            >
              Программа по минутам
            </Link>
          </div>
        </div>

        <div className="border border-white/25 bg-[#15161a] p-6 md:p-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/50">До старта</p>
          <div className="mt-6 grid grid-cols-2 gap-px bg-white/15">
            {(left ?? parts(0)).map((p) => (
              <div key={p.l} className="bg-[#15161a] p-5 md:p-7">
                <span className="font-heading block text-6xl font-extrabold leading-none tracking-[-0.04em] tabular-nums md:text-7xl">
                  {left ? String(p.v).padStart(2, "0") : "--"}
                </span>
                <span className="mt-3 block font-mono text-[11px] uppercase tracking-[0.12em] text-white/50">{p.l}</span>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <div className="flex items-baseline justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.12em]">
              <span className="text-white/50">Места</span>
              <span className="text-[#c8f04c]">{seatsLabel}</span>
            </div>
            <div className="mt-3 flex gap-1" aria-hidden="true">
              {Array.from({ length: SEATS_TOTAL }, (_, i) => (
                <span key={i} className={`h-2 flex-1 ${i < SEATS_TAKEN ? "bg-white/25" : "bg-[#c8f04c]"}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
