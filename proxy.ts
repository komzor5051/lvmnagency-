import { NextResponse, type NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

// Markdown for Agents: requests with `Accept: text/markdown` against an
// article page get the raw content_md instead of the rendered HTML page.
// Browsers (Accept: text/html) are unaffected.
//
// Guide access gate: /guides/codex-content-os (page + static HTML/PDF/zip
// under public/) is paid content with no user-account system behind it, so
// it's gated by a single shared token instead of per-buyer login. The token
// is handed out as part of the delivery link on lava.top:
// https://vladlyamin.ru/guides/codex-content-os?key=<GUIDE_ACCESS_TOKEN>
// Trade-off: one shared secret, not revocable per-person — if it leaks,
// rotate GUIDE_ACCESS_TOKEN in .env.local and resend the new link to buyers.
const GUIDE_PATH_PREFIX = "/guides/codex-content-os";
const GUIDE_ACCESS_COOKIE = "guide_access";

export const config = {
  matcher: ["/blog/:slug", "/guides/codex-content-os/:path*", "/guides/codex-content-os"],
};

function guideAccessGate(req: NextRequest): NextResponse | null {
  const token = process.env.GUIDE_ACCESS_TOKEN;
  // Fail open only if the token was never configured (e.g. local dev without
  // .env.local) — never fail open in production once it's set.
  if (!token) return null;

  const queryOk = req.nextUrl.searchParams.get("key") === token;
  const cookieOk = req.cookies.get(GUIDE_ACCESS_COOKIE)?.value === token;

  if (!queryOk && !cookieOk) {
    const deniedUrl = new URL("/products/codex-content-os", req.url);
    deniedUrl.searchParams.set("locked", "1");
    return NextResponse.redirect(deniedUrl);
  }

  const response = NextResponse.next();
  if (queryOk && !cookieOk) {
    response.cookies.set(GUIDE_ACCESS_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: GUIDE_PATH_PREFIX,
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return response;
}

export async function proxy(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith(GUIDE_PATH_PREFIX)) {
    return guideAccessGate(req) ?? NextResponse.next();
  }

  const accept = req.headers.get("accept") ?? "";
  if (!accept.includes("text/markdown")) return NextResponse.next();

  const slug = req.nextUrl.pathname.split("/").pop();
  const { data: post } = await supabase
    .from("lvmn_blog_posts")
    .select("title, meta_desc, content_md, published_at")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) return NextResponse.next();

  const body = `# ${post.title}\n\n${post.meta_desc ? post.meta_desc + "\n\n" : ""}${post.content_md}`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate",
    },
  });
}
