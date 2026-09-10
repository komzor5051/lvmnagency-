import { config } from "dotenv";
config({ path: ".env.local" });

import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { renderMarkdown } from "../lib/utils";

// Hand-written batch about Claude Code and Codex. No model in the loop: the
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
    file: "01-codex-i-claude-code-ryadom.md",
    slug: "codex-i-claude-code-na-odnoy-mashine",
    metaDesc:
      "Чем Codex CLI отличается от Claude Code по фактам: конфиги, AGENTS.md против CLAUDE.md, уровни песочницы, Guardian, worktrees. И по какому признаку делить задачи между ними.",
    tags: ["Codex", "Claude Code", "сравнение", "настройка"],
    ctaUrl: "https://vladlyamin.ru/products/codex-content-os",
    publishedAt: "2026-09-11T06:00:00.000Z",
  },
  {
    file: "02-odin-nabor-skillov-na-dvukh-agentov.md",
    slug: "odin-nabor-skillov-na-claude-code-i-codex",
    metaDesc:
      "Формат SKILL.md одинаковый у Claude Code и Codex. Где лежат файлы, какие лимиты у полей, как держать общие скиллы в одной папке и почему их не должно быть 267.",
    tags: ["Claude Code", "Codex", "скиллы", "контекст"],
    ctaUrl: "https://vladlyamin.ru/products/guide",
    publishedAt: "2026-09-11T06:30:00.000Z",
  },
  {
    file: "03-pervyy-chas-s-codex-cli.md",
    slug: "pervyy-chas-s-codex-cli",
    metaDesc:
      "Установка Codex CLI, минимальный config.toml, AGENTS.md, три уровня песочницы и первые команды. Плюс честный разбор доступа из России.",
    tags: ["Codex", "старт", "настройка", "терминал"],
    ctaUrl: "https://vladlyamin.ru/products/codex-content-os",
    publishedAt: "2026-09-11T07:00:00.000Z",
  },
  {
    file: "04-subagenty-kogda-ekonomyat-a-kogda-zhgut.md",
    slug: "subagenty-kogda-ekonomyat-a-kogda-zhgut-tokeny",
    metaDesc:
      "Команды агентов расходуют примерно в семь раз больше токенов. Три задачи, где делегирование окупается, три, где это выброшенные деньги, и правило, по которому решать.",
    tags: ["Claude Code", "Codex", "субагенты", "токены"],
    ctaUrl: "https://vladlyamin.ru/products/guide",
    publishedAt: "2026-09-11T07:30:00.000Z",
  },
  {
    file: "05-skolko-stoit-den-raboty-s-agentom.md",
    slug: "skolko-stoit-den-raboty-s-ai-agentom",
    metaDesc:
      "Тринадцать долларов на разработчика в активный день — цифра Anthropic. Из чего она складывается, где умножается на семь и какие рычаги реально снижают счёт.",
    tags: ["Claude", "Codex", "деньги", "токены", "тарифы"],
    ctaUrl: "https://vladlyamin.ru/products/consultation",
    publishedAt: "2026-09-11T08:00:00.000Z",
  },
  {
    file: "06-huki-32-sobytiya-i-tri-nuzhnykh.md",
    slug: "huki-v-claude-code-tri-kotorye-nuzhny",
    metaDesc:
      "В Claude Code 32 события для хуков. Разбор трёх рабочих — контекст на старте, обновление после правки, гейт на завершении — с конфигами и одной типичной ошибкой.",
    tags: ["Claude Code", "хуки", "автоматизация", "настройка"],
    ctaUrl: "https://vladlyamin.ru/products/guide",
    publishedAt: "2026-09-11T08:30:00.000Z",
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
