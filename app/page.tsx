import { Nav } from "@/components/home/Nav";
import { Hero } from "@/components/home/Hero";
import { NotStrip } from "@/components/home/NotStrip";
import { SystemSection } from "@/components/home/SystemSection";
import { ProductsSection } from "@/components/home/ProductsSection";
import { CourseBanner } from "@/components/home/CourseBanner";
import { CasesSection } from "@/components/home/CasesSection";
import { SignalSection } from "@/components/home/SignalSection";
import { Footer } from "@/components/home/Footer";
import { CanvasStage } from "@/components/home/engine/CanvasStage";

// Homepage — «Сигнал из шума»: a fixed particle canvas under server-rendered
// chapters. Spec: docs/superpowers/specs/2026-07-04-signal-from-noise-design.md
export default function HomePage() {
  return (
    <div className="bg-paper text-ink">
      <CanvasStage />
      <div className="relative z-[1]">
        <Nav />
        <main>
          <Hero />
          <SystemSection />
          <NotStrip />
          <CasesSection />
          <ProductsSection />
          <CourseBanner />
          <SignalSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
