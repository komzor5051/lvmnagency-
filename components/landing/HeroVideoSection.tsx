"use client";

export function HeroVideoSection() {
  return (
    <section className="lo-hero">
      {/* ── Video background (no overlay) ──────────── */}
      <video className="lo-video" autoPlay loop muted playsInline>
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260228_065522_522e2295-ba22-457e-8fdb-fbcd68109c73.mp4"
          type="video/mp4"
        />
      </video>

      {/* ── Floating white nav ─────────────────────── */}
      <nav className="lo-nav">
        <div className="lo-nav-inner">

          {/* Logo */}
          <div className="lo-logo">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <rect width="22" height="22" rx="6" fill="#111" />
              <path d="M6 16L11 6L16 16" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 13h6" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span>Logoisum</span>
          </div>

          {/* Links */}
          <div className="lo-links">
            <a href="#about">About</a>
            <a href="#works">Works</a>
            <a href="#services">Services</a>
            <a href="#testimonial">Testimonial</a>
          </div>

          {/* Book CTA */}
          <button className="lo-book-btn">
            Book A Free Meeting
            <span className="lo-arrow-wrap">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2.5 10.5L10.5 2.5" stroke="#222" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M4.5 2.5H10.5V8.5" stroke="#222" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>

        </div>
      </nav>

      {/* ── Hero content ───────────────────────────── */}
      <div className="lo-content">

        <div className="lo-headlines">
          <p className="lo-line1">Agency that makes your</p>
          <p className="lo-line2">videos &amp; reels viral</p>
        </div>

        <p className="lo-sub">
          Short-form video editing for Influencers, Creators and Brands
        </p>

        <button className="lo-workreel-btn">
          <span className="lo-play-circle">
            <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
              <path d="M1 1.5L10 6.5L1 11.5V1.5Z" fill="white" />
            </svg>
          </span>
          See Our Workreel
        </button>

      </div>
    </section>
  );
}
