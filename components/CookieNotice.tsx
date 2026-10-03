"use client";

import { useEffect, useRef, useState } from "react";
import "./cookie-notice.css";

const STORAGE_KEY = "cookie-notice-accepted";

// Информационный баннер: сайт использует cookie (Метрика, PostHog),
// продолжая пользоваться сайтом, человек соглашается. Выбор хранится в localStorage.
export default function CookieNotice() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Высота баннера нужна липкой полосе покупки, чтобы встать над ним, а не под него.
  useEffect(() => {
    const root = document.documentElement;
    if (!visible || !ref.current) {
      root.style.setProperty("--ck-h", "0px");
      return;
    }
    const el = ref.current;
    const set = () => root.style.setProperty("--ck-h", `${el.offsetHeight}px`);
    set();
    window.addEventListener("resize", set);
    return () => {
      window.removeEventListener("resize", set);
      root.style.setProperty("--ck-h", "0px");
    };
  }, [visible]);

  // Баннер не должен закрывать цену и кнопку оплаты на первом экране телефона.
  // Показываем после первого движения (скролл, касание, клавиша) или через 6 секунд.
  useEffect(() => {
    let accepted = false;
    try {
      accepted = !!localStorage.getItem(STORAGE_KEY);
    } catch {}
    if (accepted) return;
    const events = ["scroll", "touchmove", "keydown", "wheel"] as const;
    const show = () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, onEvent));
      setVisible(true);
    };
    // Программный scroll при загрузке (восстановление позиции, Lenis) не считаем движением.
    const onEvent = (ev: Event) => {
      if (ev.type === "scroll" && window.scrollY < 24) return;
      show();
    };
    events.forEach((e) => window.addEventListener(e, onEvent, { passive: true }));
    const timer = setTimeout(show, 6000);
    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, onEvent));
    };
  }, []);

  if (!visible) return null;

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setVisible(false);
  };

  return (
    <div ref={ref} className="ck" role="region" aria-label="Использование cookie">
      <p className="ck-text">
        Мы используем cookie-файлы. Это нужно для лучшей работы сайта. Продолжая
        пользоваться сайтом, вы соглашаетесь с этим.
      </p>
      <button type="button" className="ck-btn" onClick={accept}>
        OK
      </button>
    </div>
  );
}
