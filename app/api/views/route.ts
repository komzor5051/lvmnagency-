import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { slug } = await req.json();
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  try {
    // Supabase may be unreachable from the VPS — cap the wait, never fail the request.
    await supabase
      .rpc("increment_lvmn_views", { post_slug: slug })
      .abortSignal(AbortSignal.timeout(5000));
  } catch {
    // view counting is best-effort
  }
  return NextResponse.json({ ok: true });
}
