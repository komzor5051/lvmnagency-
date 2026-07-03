import { Nav } from "@/components/home/Nav";
import { Hero } from "@/components/home/Hero";
import { NotStrip } from "@/components/home/NotStrip";
import { TeachingStrip } from "@/components/home/TeachingStrip";
import { ProductsSection } from "@/components/home/ProductsSection";
import { CourseBanner } from "@/components/home/CourseBanner";
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
        <TeachingStrip />
        <NotStrip />
        <ProductsSection />
        <CourseBanner />
        <DarkBusiness />
        <CasesSection />
        <AboutTeaser />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
