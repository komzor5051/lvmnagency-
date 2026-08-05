import { slugify } from "@/lib/utils";

// Topic-level duplicate detection.
//
// The blog accumulated ~20 duplicate articles because the only guard was a
// slug-collision check in publisher.ts, which appended -2/-3/-4 and published
// anyway. It also missed the common case entirely: the miner regenerated the
// same topic with slightly different wording, so the slugs never collided
// ("...-prines-200k" vs "...-kak-ya-sdelal-200k-za-2-dnya").
//
// Comparing normalised title tokens catches both cases.

// Function words: they appear in unrelated titles ("как сделать X" / "как
// сделать Y") and would inflate similarity between genuinely distinct topics.
// Tokens of 2 chars or fewer are dropped separately, which already removes
// в/и/с/на/за/по/от/до.
const STOP_TOKENS = new Set([
  "dlya", "kak", "chto", "eto", "bez", "ili", "pro", "esli", "chtoby",
  "moy", "moya", "moi", "tvoy", "tvoya", "tvoey", "vash", "svoy", "svoi",
  "kotorye", "kotoruyu", "kotoryy", "kotoraya", "vse", "uzhe", "eshche",
  "chem", "gde", "kogda", "pochemu", "nuzhno", "mozhno", "delat", "sdelal",
]);

export function topicTokens(title: string): Set<string> {
  return new Set(
    slugify(title)
      .split("-")
      // Bare numbers ("5 шагов" / "5 процессов") say nothing about the subject.
      .filter((t) => t.length > 2 && !STOP_TOKENS.has(t) && !/^\d+$/.test(t))
  );
}

/** Jaccard overlap of the two token sets, 0..1. */
export function similarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  const intersection = [...a].filter((t) => b.has(t)).length;
  return intersection / (a.size + b.size - intersection);
}

// Calibrated against the 135 live articles: at 0.6 the check flags 25 pairs and
// every one of them is a genuine duplicate ("Мой способ" / "Мой метод",
// "15 часов в неделю" / "15 часов") — no false positives. Below 0.6 the
// synonym-swap cases start blending into unrelated titles.
//
// Distinct Claude-pillar titles score far lower than this even when they share
// "claude"+"code", because those are only 2 tokens out of 6-8.
//
// Raise it if legitimate topics start getting rejected — every rejection is
// logged with its score, so the logs show whether the cutoff is wrong.
export const DUPLICATE_THRESHOLD = 0.6;

export interface DuplicateMatch {
  title: string;
  score: number;
}

/**
 * Returns the closest existing title that is too similar to `title`, or null.
 * `existing` is a list of titles already used as topics or published articles.
 */
export function findDuplicate(
  title: string,
  existing: string[],
  threshold: number = DUPLICATE_THRESHOLD
): DuplicateMatch | null {
  const tokens = topicTokens(title);
  let best: DuplicateMatch | null = null;

  for (const candidate of existing) {
    const score = similarity(tokens, topicTokens(candidate));
    if (score >= threshold && (!best || score > best.score)) {
      best = { title: candidate, score };
    }
  }

  return best;
}
