/**
 * One-time setup: adds the Leads schema to the Notion database.
 *
 * Prerequisites:
 *   1. Create an internal integration at https://www.notion.so/my-integrations
 *   2. Share the "Leads" page with that integration (••• → Connections)
 *   3. Set NOTION_TOKEN and NOTION_LEADS_DB_ID in .env.local
 *
 * Run: npx tsx scripts/setup-notion-leads.ts
 */
import { config as loadEnv } from "dotenv";
import { Client } from "@notionhq/client";

loadEnv({ path: ".env.local" });
loadEnv();

const token = process.env.NOTION_TOKEN;
const databaseId = process.env.NOTION_LEADS_DB_ID;

async function main() {
  if (!token || !databaseId) {
    console.error("Missing NOTION_TOKEN or NOTION_LEADS_DB_ID in env.");
    process.exit(1);
  }

  const notion = new Client({ auth: token });

  // Notion API 2025-09-03 moved the schema onto data sources, so resolve the
  // database's default data source and update its properties there.
  const db = await notion.databases.retrieve({ database_id: databaseId });
  const dataSourceId = "data_sources" in db ? db.data_sources[0]?.id : undefined;
  if (!dataSourceId) {
    console.error("Could not resolve data source for database", databaseId);
    process.exit(1);
  }

  await notion.dataSources.update({
    data_source_id: dataSourceId,
    properties: {
      Channel: {
        select: {
          options: [
            { name: "Сайт (аудит)", color: "blue" },
            { name: "Сайт (чат)", color: "purple" },
            { name: "Telegram-бот", color: "green" },
            { name: "Личка @lyaminvl", color: "orange" },
            { name: "Реклама", color: "red" },
          ],
        },
      },
      Contact: { rich_text: {} },
      Status: {
        select: {
          options: [
            { name: "Новый", color: "default" },
            { name: "Квалификация", color: "yellow" },
            { name: "Созвон", color: "blue" },
            { name: "КП", color: "purple" },
            { name: "Сделка", color: "green" },
            { name: "Слив", color: "red" },
          ],
        },
      },
      Niche: { rich_text: {} },
      Temperature: {
        select: {
          options: [
            { name: "Горячий", color: "red" },
            { name: "Тёплый", color: "orange" },
            { name: "Холодный", color: "blue" },
          ],
        },
      },
      Score: { number: { format: "number" } },
      Pain: { rich_text: {} },
      Note: { rich_text: {} },
    },
  });

  console.log("Notion Leads schema updated successfully.");
}

main().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});
