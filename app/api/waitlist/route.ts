import { NextResponse } from "next/server";
import { createLead } from "@/lib/notion";

// Telegram username: 5-32 chars, starts with a letter, letters/digits/underscores.
const TELEGRAM_RE = /^[a-zA-Z][a-zA-Z0-9_]{4,31}$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Accept "@user" or "user"; strip the leading @ before validating.
  const telegram =
    typeof (body as { telegram?: unknown })?.telegram === "string"
      ? ((body as { telegram: string }).telegram || "").trim().replace(/^@+/, "")
      : "";

  if (!TELEGRAM_RE.test(telegram)) {
    return NextResponse.json({ ok: false, error: "invalid_telegram" }, { status: 400 });
  }

  // Optional source tag so different opt-in forms (course waitlist, guide
  // update notifications, ...) land as distinguishable leads in Notion
  // instead of all reading "course-waitlist". Falls back to the original
  // course-waitlist behavior when omitted, so the existing WaitlistForm
  // caller needs no change.
  const rawSource =
    typeof (body as { source?: unknown })?.source === "string"
      ? (body as { source: string }).source.trim()
      : "";
  const source = rawSource || "course-waitlist";

  const sourceLabels: Record<string, string> = {
    "course-waitlist": "лист ожидания мини-курса по AI-автоматизации",
    "guide-updates:codex-content-os":
      "апдейты гайда Content OS (Codex/Claude Code)",
  };
  const sourceLabel = sourceLabels[source] ?? source;

  const handle = `@${telegram}`;

  try {
    // Same lead mechanism as the audit form; note tags which opt-in this came from.
    // throwOnError: the user must not see a success state if the handle was not
    // saved — a 500 here makes the form show its Telegram fallback.
    await createLead(
      {
        channel: "Сайт (аудит)",
        name: `Waitlist: ${handle}`,
        contact: handle,
        note: `source: ${source} — ${sourceLabel}`,
        temperature: "Тёплый",
        status: "Новый",
      },
      { throwOnError: true }
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
