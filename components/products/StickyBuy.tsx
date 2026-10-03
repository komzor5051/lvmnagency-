"use client";

// Липкая полоса покупки для телефона. Появляется, когда основная кнопка ушла
// с экрана, и прячется, пока в кадре любой блок с data-sticky-hide (основная
// кнопка или финальный блок покупки) и подвал сайта.

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import "./sticky-buy.css";

type Props = {
  href: string;
  label: string;
  price: string;
  product: string;
};

export function StickyBuy({ href, label, price, product }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll("[data-sticky-hide], footer"));
    if (!targets.length) return;
    const inView = new Set<Element>();
    let pastTop = false;
    const update = () => setShow(pastTop && inView.size === 0);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) inView.add(e.target);
        else inView.delete(e.target);
      }
      update();
    });
    targets.forEach((t) => io.observe(t));
    const onScroll = () => {
      pastTop = window.scrollY > 240;
      update();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className={`sb${show ? " is-on" : ""}`} aria-hidden={!show}>
      <p className="sb-price">{price}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="sb-btn"
        tabIndex={show ? 0 : -1}
        onClick={() => track("checkout_redirect", { product, source: "sticky" })}
      >
        {label}
      </a>
    </div>
  );
}
