import { config } from "dotenv";
config({ path: ".env.local" });

import { supabase } from "../lib/supabase";

async function seed() {
  const { error } = await supabase.from("lvmn_blog_topics").insert({
    title: "Как Telegram-бот сэкономил ресторану 40 часов в месяц",
    angle: "Реальный кейс LVMN — автоматизация управления сменами через Telegram + iiko",
    keywords: ["telegram бот для бизнеса", "автоматизация ресторана", "AI для бизнеса"],
    source: "manual",
    score: 10,
    status: "pending",
  });

  if (error) console.error(error);
  else console.log("Topic seeded!");
}

seed();
