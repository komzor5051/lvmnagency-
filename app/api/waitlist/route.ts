import { NextResponse } from "next/server";
import { createLead } from "@/lib/notion";

// Pragmatic server-side email check: something@something.tld
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const email =
    typeof (body as { email?: unknown })?.email === "string"
      ? ((body as { email: string }).email || "").trim()
      : "";

  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  try {
    // Same lead mechanism as the audit form; marked as course waitlist.
    // throwOnError: the user must not see "Вы в списке" if the email was not saved —
    // a 500 here makes WaitlistForm show the Telegram fallback.
    await createLead(
      {
        channel: "Сайт (аудит)",
        name: `Waitlist: ${email}`,
        contact: email,
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
