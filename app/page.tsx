import DeskFx from "@/components/desk/DeskFx";
import DeskHero from "@/components/desk/DeskHero";
import DeskAbout from "@/components/desk/DeskAbout";
import DeskServices from "@/components/desk/DeskServices";
import DeskProcess from "@/components/desk/DeskProcess";
import DeskProof from "@/components/desk/DeskProof";
import DeskCta from "@/components/desk/DeskCta";
import DeskFooter from "@/components/desk/DeskFooter";

// Desk DS home («стол с чертёжной калькой», 2026-07 redesign).
// Prototype reference: docs/design-concepts/variant-b2-desk.html
export default function HomePage() {
  return (
    <main>
      <DeskFx />
      <DeskHero />
      <DeskAbout />
      <DeskServices />
      <DeskProcess />
      <DeskProof />
      <DeskCta />
      <DeskFooter />
    </main>
  );
}
