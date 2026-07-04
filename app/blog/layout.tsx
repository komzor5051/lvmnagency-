import type { Metadata } from "next";
import "./blog.css";

export const metadata: Metadata = {
  title: "Блог Влада Лямина — AI для фаундеров",
  description:
    "Практичные разборы систем с AI для фаундеров и предпринимателей. Кейсы из 40+ внедрений, тренды нейросетей, рабочие инструменты.",
};

// No page-local header/footer here — the global HUD (components/hud/HudFrame,
// HudMenu, wired in the root layout) already gives every page a nav ("Блог"
// label + index, the poster menu with all site links) and a persistent
// Telegram link in the bottom-right corner. A second inline nav here was a
// leftover from the pre-HUD design and duplicated that surface.
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen">{children}</div>;
}
