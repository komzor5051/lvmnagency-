import { NextResponse, type NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

// Markdown for Agents: requests with `Accept: text/markdown` against an
// article page get the raw content_md instead of the rendered HTML page.
// Browsers (Accept: text/html) are unaffected.
export const config = {
  matcher: "/blog/:slug",
};

export async function proxy(req: NextRequest) {
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
