import { config } from "dotenv";
config({ path: ".env.local" });

// Mines new blog topics (Exa + Gemini) into lvmn_blog_topics.
// With --if-low, only runs when the pending queue drops below MIN_PENDING —
// used by the daily GitHub Actions pipeline so the queue refills itself.
//   npx tsx scripts/mine-topics.ts [--if-low]

const MIN_PENDING = 5;

async function run() {
  const { supabase } = await import("../lib/supabase");
  const { mineTopics } = await import("../lib/pipeline/topic-miner");

  if (process.argv.includes("--if-low")) {
    const { count, error } = await supabase
      .from("lvmn_blog_topics")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");
    if (error) throw new Error(`Supabase error: ${error.message}`);
    console.log(`Pending topics: ${count}`);
    if ((count ?? 0) >= MIN_PENDING) {
      console.log(`Queue is healthy (>= ${MIN_PENDING}), skipping mining`);
      return;
    }
  }

  const topics = await mineTopics();
  console.log(`Mined ${topics.length} topics`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
