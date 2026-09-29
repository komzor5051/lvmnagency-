"use client";

import { useEffect, useState } from "react";
import "./cookie-notice.css";

const STORAGE_KEY = "cookie-notice-accepted";

// Информационный баннер: сайт использует cookie (Метрика, PostHog),
// продолжая пользоваться сайтом, человек соглашается. Выбор хранится в localStorage.
export default function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setVisible(false);
  };

  return (
    <div className="ck" role="region" aria-label="Использование cookie">
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
