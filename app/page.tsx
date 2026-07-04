import ChapterHero from "@/components/home/ChapterHero";
import ChapterNumbers from "@/components/home/ChapterNumbers";
import ChapterManifesto from "@/components/home/ChapterManifesto";
import ChapterMethod from "@/components/home/ChapterMethod";
import ChapterCases from "@/components/home/ChapterCases";
import ChapterEntries from "@/components/home/ChapterEntries";
import ChapterAbout from "@/components/home/ChapterAbout";
import ChapterFinal from "@/components/home/ChapterFinal";

export default function HomePage() {
  return (
    <main>
      <ChapterHero />
      <ChapterNumbers />
      <ChapterManifesto />
      <ChapterMethod />
      <ChapterCases />
      <ChapterEntries />
      <ChapterAbout />
      <ChapterFinal />
    </main>
  );
}
