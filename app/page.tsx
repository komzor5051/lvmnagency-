import ChapterHero from "@/components/home/ChapterHero";
import ChapterNumbers from "@/components/home/ChapterNumbers";
import ChapterManifesto from "@/components/home/ChapterManifesto";
import ChapterMethod from "@/components/home/ChapterMethod";
// (chapters 5-8 added in Task 7)

export default function HomePage() {
  return (
    <main>
      <ChapterHero />
      <ChapterNumbers />
      <ChapterManifesto />
      <ChapterMethod />
    </main>
  );
}
