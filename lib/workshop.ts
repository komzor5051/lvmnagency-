// Практикум «Система контента». Единственное место, где правятся дата и места:
// главная (components/home-kalka/WorkshopBanner.tsx) и /workshop читают отсюда.
// По мере оплат увеличивай SEATS_TAKEN и выкладывай.

// 11.10.2026, 12:00 МСК (UTC+3).
export const WORKSHOP_START = Date.UTC(2026, 9, 11, 9, 0, 0);

export const SEATS_TOTAL = 15;
export const SEATS_TAKEN = 0;

export const seatsLeft = Math.max(0, SEATS_TOTAL - SEATS_TAKEN);

// 1 место, 2 места, 5 мест.
export function seatsWord(n: number) {
  const d = n % 10;
  const dd = n % 100;
  if (d === 1 && dd !== 11) return "место";
  if (d >= 2 && d <= 4 && (dd < 12 || dd > 14)) return "места";
  return "мест";
}

export const seatsLabel =
  seatsLeft === 0 ? "мест не осталось" : `осталось ${seatsLeft} ${seatsWord(seatsLeft)} из ${SEATS_TOTAL}`;
