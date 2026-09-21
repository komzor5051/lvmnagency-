import { config } from "dotenv";
config({ path: ".env.local" });

import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { renderMarkdown } from "../lib/utils";

// Hand-written batch: practical Claude how-tos (content analysis, access from
// Russia, skills, Instagram DM analysis, code-word autoreplies). No model in the loop: the
// markdown lives in drafts/, this script only renders and publishes it.
//
// Supabase is unreachable from some machines (*.supabase.co is DNS-poisoned on
// several RU networks), so the script always merges the batch into
// data/posts-snapshot.json — the file the VPS actually serves from — and treats
// the Supabase write as best-effort. Run it again from a machine that can reach
// Supabase to sync the database.

interface Article {
  file: string;
  slug: string;
  metaDesc: string;
  tags: string[];
  ctaUrl: string;
  publishedAt: string;
}

const ARTICLES: Article[] = [
  {
    file: "07-razbor-chuzhogo-kontenta-cherez-claude.md",
    slug: "razbor-chuzhogo-kontenta-cherez-claude",
    metaDesc: 
      "Разобрал через Claude 112 рилсов из 43 аккаунтов: первая фраза кончается на 4,7 секунде, первое число звучит на 10,5. Как собрать ролики через Apify, какой промпт дать Claude и как проверять его выводы.",
    tags: ["Claude", "контент", "Instagram", "анализ"],
    ctaUrl: "https://vladlyamin.ru/products/codex-content-os",
    publishedAt: "2026-09-22T06:00:00.000Z",
  },
  {
    file: "08-registratsiya-v-claude-iz-rossii.md",
    slug: "registratsiya-v-claude-iz-rossii",
    metaDesc: 
      "Почему банят российские аккаунты Claude и как регистрироваться без блокировки: одна страна для IP, номера, карты и биллинга, прогрев 3-7 дней, план Б через API.",
    tags: ["Claude", "старт", "доступ из России", "оплата"],
    ctaUrl: "https://vladlyamin.ru/products/guide",
    publishedAt: "2026-09-22T06:30:00.000Z",
  },
  {
    file: "09-pokazal-claude-zadachu-i-poluchil-skill.md",
    slug: "kak-prevratit-zadachu-v-skill-claude",
    metaDesc: 
      "Как без кода превратить повторяющуюся задачу в скилл Claude: провести её в чате, поправить, попросить упаковать, проверить описание. И почему из 267 скиллов я оставил 39.",
    tags: ["Claude", "Claude Code", "скиллы", "без кода"],
    ctaUrl: "https://vladlyamin.ru/products/guide",
    publishedAt: "2026-09-22T07:00:00.000Z",
  },
  {
    file: "10-razbor-direkta-instagram-cherez-claude.md",
    slug: "razbor-direkta-instagram-cherez-claude",
    metaDesc: 
      "Выгрузил 50 диалогов директа Instagram и прогнал через Claude по шкале из четырёх критериев. Живых лидов оказалось 6%, оплат ноль. Промпт-шкала и порядок разбора.",
    tags: ["Claude", "Instagram", "продажи", "лиды"],
    ctaUrl: "https://vladlyamin.ru/products/consultation",
    publishedAt: "2026-09-22T07:30:00.000Z",
  },
  {
    file: "11-avtootvet-po-kodovomu-slovu-cherez-claude.md",
    slug: "avtootvet-po-kodovomu-slovu-instagram-claude",
    metaDesc: 
      "Как Claude собирает автоответ по кодовому слову в Instagram через ChatPlace MCP: запрос, проверка руками, ограничения Meta и подвох с заменой триггеров.",
    tags: ["Claude", "Instagram", "автоворонка", "MCP"],
    ctaUrl: "https://vladlyamin.ru/products/consultation",
    publishedAt: "2026-09-22T08:00:00.000Z",
  },
];

const DRAFTS_DIR = path.join(process.cwd(), "drafts");
const SNAPSHOT_PATH = path.join(process.cwd(), "data", "posts-snapshot.json");

// The leading H1 becomes the title column; content_md keeps only the body.
function splitTitle(raw: string): { title: string; md: string } {
  const text = raw.trim();
  const h1 = text.match(/^#\s+(.+)/);
  if (!h1) throw new Error("В черновике нет заголовка первого уровня");
  return { title: h1[1].trim(), md: text.replace(/^#\s+.+\n/, "").trim() };
}

async function build() {
  return Promise.all(
    ARTICLES.map(async (a) => {
      const raw = await fs.readFile(path.join(DRAFTS_DIR, a.file), "utf8");
      const { title, md } = splitTitle(raw);
      return {
        slug: a.slug,
        title,
        meta_desc: a.metaDesc,
        content_md: md,
        content_html: renderMarkdown(md),
        cover_image: null,
        tags: a.tags,
        cta_url: a.ctaUrl,
        cta_product: "telegram",
        status: "published",
        published_at: a.publishedAt,
      };
    })
  );
}

async function writeSnapshot(posts: Awaited<ReturnType<typeof build>>) {
  const raw = await fs.readFile(SNAPSHOT_PATH, "utf8");
  const existing = JSON.parse(raw) as Record<string, unknown>[];
  const bySlug = new Map(existing.map((p) => [p.slug as string, p]));

  for (const post of posts) {
    const prev = bySlug.get(post.slug);
    bySlug.set(post.slug, {
      id: prev?.id ?? crypto.randomUUID(),
      topic_id: prev?.topic_id ?? null,
      ...post,
      telegram_sent: prev?.telegram_sent ?? false,
      created_at: prev?.created_at ?? post.published_at,
      views: prev?.views ?? 0,
    });
  }

  const merged = [...bySlug.values()].sort((a, b) =>
    String(b.published_at).localeCompare(String(a.published_at))
  );
  await fs.writeFile(SNAPSHOT_PATH, JSON.stringify(merged, null, 1), "utf8");
  console.log(`Снапшот обновлён: ${merged.length} статей всего, ${posts.length} из этой пачки`);
}

async function writeSupabase(posts: Awaited<ReturnType<typeof build>>) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    console.warn("SUPABASE_URL/SUPABASE_SERVICE_KEY не заданы — база пропущена");
    return;
  }
  const supabase = createClient(url, key);
  for (const post of posts) {
    const { data: existing } = await supabase
      .from("lvmn_blog_posts")
      .select("id")
      .eq("slug", post.slug)
      .maybeSingle();

    const { error } = existing
      ? await supabase.from("lvmn_blog_posts").update(post).eq("id", existing.id)
      : await supabase.from("lvmn_blog_posts").insert(post);

    if (error) throw new Error(`${post.slug}: ${error.message}`);
    console.log(`${existing ? "обновлена" : "создана"}: ${post.slug}`);
  }
}

async function main() {
  const posts = await build();
  await writeSnapshot(posts);
  try {
    await writeSupabase(posts);
  } catch (e) {
    console.warn(
      `Supabase недоступен или отклонил запись — снапшот уже обновлён, повтори запуск с машины, у которой есть доступ.\n  ${e instanceof Error ? e.message : e}`
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
