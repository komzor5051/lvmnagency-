"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function StudioFx() {
  const pathname = usePathname();

  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-studio-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -7% 0px" }
    );

    items.forEach((item) => observer.observe(item));

    const handlePointer = (event: PointerEvent) => {
      document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
    };

    window.addEventListener("pointermove", handlePointer, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", handlePointer);
    };
  }, [pathname]);

  return (
    <>
      <div className="studio-grain" aria-hidden="true" />
      <div className="studio-pointer" aria-hidden="true" />
    </>
  );
}
