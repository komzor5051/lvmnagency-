import { config } from "dotenv";
config({ path: ".env.local" });

async function seed() {
  const { supabase } = await import("../lib/supabase");

  // Check for existing pending topics
  const { data: existing } = await supabase
    .from("lvmn_blog_topics")
    .select("id, title, status")
    .eq("status", "pending")
    .limit(5);

  if (existing && existing.length > 0) {
    console.log("Existing pending topics:");
    existing.forEach((t) => console.log(`  - [${t.id.slice(0, 8)}] ${t.title}`));
    console.log("\nUsing first existing topic for pipeline test.");
    return;
  }

  // Seed a fresh topic
  const { error } = await supabase.from("lvmn_blog_topics").insert({
    title: "5 процессов, которые любой бизнес может автоматизировать за неделю",
    angle: "Практический гайд — от приёма заявок до отчётов, с конкретными инструментами и стоимостью",
    keywords: [
      "автоматизация бизнес процессов",
      "n8n автоматизация",
      "AI для малого бизнеса",
      "telegram бот для заявок",
    ],
    source: "manual",
    score: 10,
    status: "pending",
  });

  if (error) console.error("Seed error:", error);
  else console.log("Test topic seeded!");
}

seed().catch(console.error);
