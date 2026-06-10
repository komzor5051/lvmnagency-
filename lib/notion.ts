import { Client } from "@notionhq/client";

export type LeadChannel =
  | "Сайт (аудит)"
  | "Сайт (чат)"
  | "Telegram-бот"
  | "Личка @lyaminvl"
  | "Реклама";

export type LeadTemperature = "Горячий" | "Тёплый" | "Холодный";

export interface LeadInput {
  channel: LeadChannel;
  name: string;
  contact?: string;
  niche?: string;
  pain?: string;
  note?: string;
  temperature?: LeadTemperature;
  score?: number;
  status?: string;
}

// Notion rich_text content is capped at 2000 chars per item.
const richText = (value?: string) =>
  value ? [{ text: { content: value.slice(0, 2000) } }] : [];

export interface CreateLeadOptions {
  /**
   * When true, missing env config or a Notion API failure rejects instead of
   * being swallowed — use when the caller must know the lead was actually saved
   * (e.g. the waitlist form, which degrades to a Telegram fallback on failure).
   */
  throwOnError?: boolean;
}

/**
 * Writes a lead to the Notion Leads database. By default fire-and-forget:
 * never throws, so a misconfigured token or Notion outage can't break the
 * request flow. Pass `{ throwOnError: true }` to surface failures.
 */
export async function createLead(
  lead: LeadInput,
  options: CreateLeadOptions = {}
): Promise<void> {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_LEADS_DB_ID;

  if (!token || !databaseId) {
    console.warn(
      `[notion] NOTION_TOKEN / NOTION_LEADS_DB_ID not set — skipping lead (${lead.channel})`
    );
    if (options.throwOnError) {
      throw new Error("[notion] NOTION_TOKEN / NOTION_LEADS_DB_ID not set");
    }
    return;
  }

  const notion = new Client({ auth: token });

  try {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: { title: [{ text: { content: (lead.name || "Лид").slice(0, 200) } }] },
        Channel: { select: { name: lead.channel } },
        Status: { select: { name: lead.status ?? "Новый" } },
        ...(lead.contact ? { Contact: { rich_text: richText(lead.contact) } } : {}),
        ...(lead.niche ? { Niche: { rich_text: richText(lead.niche) } } : {}),
        ...(lead.temperature ? { Temperature: { select: { name: lead.temperature } } } : {}),
        ...(typeof lead.score === "number" ? { Score: { number: lead.score } } : {}),
        ...(lead.pain ? { Pain: { rich_text: richText(lead.pain) } } : {}),
        ...(lead.note ? { Note: { rich_text: richText(lead.note) } } : {}),
      },
    });
  } catch (error) {
    console.error("[notion] createLead failed:", error);
    if (options.throwOnError) throw error;
  }
}
