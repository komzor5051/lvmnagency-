"use client";

import { useEffect, useRef } from "react";

export function HeroVideoSection() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let rafId = 0;

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const progress = Math.min(window.scrollY / window.innerHeight, 1);
        const scale = 1 - progress * 0.07;
        const radius = progress * 32;
        hero.style.transform = `scale(${scale})`;
        hero.style.borderRadius = `${radius}px`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section ref={heroRef} className="lo-hero">

      {/* Video background */}
      <video className="lo-video" autoPlay loop muted playsInline>
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260228_065522_522e2295-ba22-457e-8fdb-fbcd68109c73.mp4"
          type="video/mp4"
        />
      </video>

      {/* Bottom gradient — blends into page bg */}
      <div className="lo-gradient-bottom" aria-hidden="true" />

      {/* Floating white nav */}
      <nav className="lo-nav">
        <div className="lo-nav-inner">

          <div className="lo-logo">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <rect width="22" height="22" rx="6" fill="#111" />
              <path d="M6 16L11 6L16 16" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 13h6" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span>LVMN</span>
          </div>

          <div className="lo-links">
            <a href="#about">О нас</a>
            <a href="#cases">Кейсы</a>
            <a href="#services">Услуги</a>
            <a href="#testimonials">Отзывы</a>
          </div>

          <button className="lo-book-btn">
            Консультация
            <span className="lo-arrow-wrap">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2.5 10.5L10.5 2.5" stroke="#222" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M4.5 2.5H10.5V8.5" stroke="#222" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>

        </div>
      </nav>

      {/* Hero copy */}
      <div className="lo-content">
        <div className="lo-headlines">
          <p className="lo-line1">Строим AI-продукты</p>
          <p className="lo-line2">за дни, не за месяцы</p>
        </div>

        <p className="lo-sub">
          Боты, автоматизации и MVP-сервисы для бизнеса — с гарантией результата
        </p>

        <button className="lo-workreel-btn">
          <span className="lo-play-circle">
            <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
              <path d="M1 1.5L10 6.5L1 11.5V1.5Z" fill="white" />
            </svg>
          </span>
          Смотреть кейсы
        </button>
      </div>

    </section>
  );
}
