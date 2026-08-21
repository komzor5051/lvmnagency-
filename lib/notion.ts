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
// The Timeweb VPS this app runs on gets a 403 from Cloudflare on
// api.notion.com directly (IP/ASN-level block, confirmed 2026-08-21 — not
// endpoint-specific, blocks every Notion API call from that host). When
// NOTION_PROXY_URL is set, route lead writes through a small Vercel relay
// (see ../notion-lead-proxy) that isn't behind that block, authenticated by
// a shared secret rather than exposing the Notion token to it. Local dev
// (not on the blocked ASN) can still hit Notion directly by leaving
// NOTION_PROXY_URL unset.
async function createLeadViaProxy(
  proxyUrl: string,
  secret: string,
  lead: LeadInput
): Promise<void> {
  const res = await fetch(proxyUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Proxy-Secret": secret },
    body: JSON.stringify({
      name: (lead.name || "Лид").slice(0, 200),
      channel: lead.channel,
      status: lead.status ?? "Новый",
      contact: lead.contact,
      note: lead.note,
      temperature: lead.temperature,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`[notion-proxy] request failed: ${res.status} ${text.slice(0, 300)}`);
  }
}

async function createLeadDirect(token: string, databaseId: string, lead: LeadInput): Promise<void> {
  const notion = new Client({ auth: token });
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
}

export async function createLead(
  lead: LeadInput,
  options: CreateLeadOptions = {}
): Promise<void> {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_LEADS_DB_ID;
  const proxyUrl = process.env.NOTION_PROXY_URL;
  const proxySecret = process.env.NOTION_PROXY_SECRET;

  if (proxyUrl && proxySecret) {
    try {
      await createLeadViaProxy(proxyUrl, proxySecret, lead);
    } catch (error) {
      console.error("[notion] createLead via proxy failed:", error);
      if (options.throwOnError) throw error;
    }
    return;
  }

  if (!token || !databaseId) {
    console.warn(
      `[notion] NOTION_TOKEN / NOTION_LEADS_DB_ID not set — skipping lead (${lead.channel})`
    );
    if (options.throwOnError) {
      throw new Error("[notion] NOTION_TOKEN / NOTION_LEADS_DB_ID not set");
    }
    return;
  }

  try {
    await createLeadDirect(token, databaseId, lead);
  } catch (error) {
    console.error("[notion] createLead failed:", error);
    if (options.throwOnError) throw error;
  }
}
