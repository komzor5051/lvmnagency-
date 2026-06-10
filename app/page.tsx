import { Nav } from "@/components/home/Nav";
import { Hero } from "@/components/home/Hero";
import { ProofStrip } from "@/components/home/ProofStrip";
import { ProductsSection } from "@/components/home/ProductsSection";
import { DarkBusiness } from "@/components/home/DarkBusiness";
import { CasesSection } from "@/components/home/CasesSection";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { FinalCta } from "@/components/home/FinalCta";
import { Footer } from "@/components/home/Footer";

// Homepage — server component shell, client sections handle their own motion.
// Spec: docs/superpowers/specs/2026-06-10-personal-site-redesign-design.md
export default function HomePage() {
  return (
    <div className="bg-paper text-ink">
      <Nav />
      <main>
        <Hero />
        <ProofStrip />
        <ProductsSection />
        <DarkBusiness />
        <CasesSection />
        <AboutTeaser />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
