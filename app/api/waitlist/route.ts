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

  const handle = `@${telegram}`;

  try {
    // Same lead mechanism as the audit form; marked as course waitlist.
    // throwOnError: the user must not see "Вы в списке" if the handle was not saved —
    // a 500 here makes WaitlistForm show the Telegram fallback.
    await createLead(
      {
        channel: "Сайт (аудит)",
        name: `Waitlist: ${handle}`,
        contact: handle,
        note: "source: course-waitlist — лист ожидания мини-курса по AI-автоматизации",
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
