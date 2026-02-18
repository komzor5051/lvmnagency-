"use client";

import { useEffect, useCallback } from "react";

export default function LandingInteractivity() {
  const handleNavScroll = useCallback(() => {
    const nav = document.querySelector(".landing .landing-nav");
    if (nav) {
      nav.classList.toggle("scrolled", window.scrollY > 40);
    }
  }, []);

  useEffect(() => {
    // Nav scroll effect
    window.addEventListener("scroll", handleNavScroll);

    // Reveal on scroll (IntersectionObserver)
    const reveals = document.querySelectorAll(".landing .reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("visible"), i * 80);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));

    // Smooth scroll for anchor links + close mobile menu
    const anchors = document.querySelectorAll('.landing a[href^="#"]');
    const handleAnchorClick = (e: Event) => {
      e.preventDefault();
      const a = e.currentTarget as HTMLAnchorElement;
      const href = a.getAttribute("href");
      if (href) {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
      // Close mobile menu
      document.querySelector(".landing .nav-links")?.classList.remove("open");
      document
        .querySelector(".landing .nav-burger")
        ?.classList.remove("active");
    };
    anchors.forEach((a) => a.addEventListener("click", handleAnchorClick));

    // FAQ toggle
    const faqItems = document.querySelectorAll(".landing .faq-item");
    const handleFaqClick = (e: Event) => {
      const item = e.currentTarget as HTMLElement;
      item.classList.toggle("open");
    };
    faqItems.forEach((item) =>
      item.addEventListener("click", handleFaqClick)
    );

    // Mobile burger toggle
    const burger = document.querySelector(
      ".landing .nav-burger"
    ) as HTMLElement | null;
    const handleBurgerClick = () => {
      burger?.classList.toggle("active");
      document.querySelector(".landing .nav-links")?.classList.toggle("open");
    };
    if (burger) {
      burger.addEventListener("click", handleBurgerClick);
    }

    return () => {
      window.removeEventListener("scroll", handleNavScroll);
      io.disconnect();
      anchors.forEach((a) => a.removeEventListener("click", handleAnchorClick));
      faqItems.forEach((item) =>
        item.removeEventListener("click", handleFaqClick)
      );
      if (burger) {
        burger.removeEventListener("click", handleBurgerClick);
      }
    };
  }, [handleNavScroll]);

  return null;
}
