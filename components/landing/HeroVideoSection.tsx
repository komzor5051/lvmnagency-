"use client";

import { HeroBadge } from "./HeroBadge";
import { HeroTitle } from "./HeroTitle";
import { HeroStats } from "./HeroStats";
import { ShimmerCTA } from "./ShimmerCTA";

function ArrowIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export function HeroVideoSection() {
  return (
    <section className="hero-video">
      {/* ── Video background ─────────────────────── */}
      <div className="hero-video-bg">
        <video autoPlay loop muted playsInline>
          {/*
            Drop your own video at /public/hero-bg.mp4 for production.
            Any abstract/motion/nature footage works — keep it muted + loop.
          */}
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* ── Two-panel layout ─────────────────────── */}
      <div className="hero-video-layout">

        {/* LEFT PANEL */}
        <div className="hero-video-left">
          {/* glass backing card — strong blur */}
          <div className="hero-video-left-glass hero-glass-strong" />

          {/* content (z-index above the glass card) */}
          <div className="hero-video-panel">
            <HeroBadge />
            <HeroTitle />
            <p className="hero-sub anim-fade-up d2">
              Я делаю ботов и автоматизации, которые берут рутину на себя —
              чтобы ваша команда занималась тем, что приносит деньги.
            </p>
            <div className="hero-ctas anim-fade-up d3">
              <ShimmerCTA href="https://t.me/lyaminvl">
                Написать Владу
                <ArrowIcon />
              </ShimmerCTA>
              <a href="#cases" className="btn-ghost hero-ghost-btn">
                Посмотреть кейсы
              </a>
            </div>
            <HeroStats />
          </div>
        </div>

        {/* RIGHT PANEL — desktop only */}
        <div className="hero-video-right">

          {/* status pills */}
          <div className="hero-right-top">
            <div className="hero-glass-pill hero-glass">
              <span className="hero-status-dot" />
              <span>13 проектов запущено</span>
            </div>
            <div className="hero-glass-pill hero-glass">
              <span>Новосибирск — Россия</span>
            </div>
          </div>

          {/* services + case block */}
          <div className="hero-services hero-glass-strong">

            {/* service card: n8n */}
            <div className="hero-service-card hero-glass">
              <div className="hero-feat-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8M12 17v4M7 8h10M7 12h4" />
                </svg>
              </div>
              <div>
                <h4>n8n Автоматизация</h4>
                <p>Связываем любые сервисы без кода</p>
              </div>
            </div>

            {/* service card: AI Agents */}
            <div className="hero-service-card hero-glass">
              <div className="hero-feat-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div>
                <h4>AI Агенты</h4>
                <p>Модели, которые думают и действуют</p>
              </div>
            </div>

            {/* service card: Telegram */}
            <div className="hero-service-card hero-glass">
              <div className="hero-feat-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <h4>Telegram Боты</h4>
                <p>От простых команд до сложной логики</p>
              </div>
            </div>

            {/* bottom featured case */}
            <div className="hero-case-card hero-glass">
              <div className="hero-case-thumb">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="hero-case-text">
                <h4>Бот для реабилитации ПТСР</h4>
                <p>10-урочная программа для Минобороны</p>
              </div>
              <div className="hero-case-plus">+</div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
