/**
 * Yandex Wordstat API wrapper.
 * Uses OAuth token for authentication.
 * Rate-limited with retry on 429. Graceful degradation on failure.
 */

const WORDSTAT_API = "https://api.direct.yandex.com/json/v5/keywordsresearch";

interface WordstatResult {
  phrase: string;
  volume: number;
}

function getToken(): string | null {
  return process.env.WORDSTAT_TOKEN || null;
}

async function wordstatRequest(
  method: string,
  params: Record<string, unknown>,
  retries = 2
): Promise<unknown> {
  const token = getToken();
  if (!token) {
    throw new Error("WORDSTAT_TOKEN not set");
  }

  const body = {
    method,
    params,
  };

  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(WORDSTAT_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Accept-Language": "ru",
      },
      body: JSON.stringify(body),
    });

    if (res.status === 429) {
      const wait = Math.pow(2, attempt) * 1000;
      console.warn(`[wordstat] Rate limited, waiting ${wait}ms...`);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Wordstat API error ${res.status}: ${text}`);
    }

    const data = await res.json();
    return data;
  }

  throw new Error("Wordstat API: max retries exceeded");
}

/**
 * Get search volume for a single phrase.
 * Returns monthly impressions count, or 0 if unavailable.
 */
export async function getSearchVolume(phrase: string): Promise<number> {
  try {
    const result = await wordstatRequest("GetWordstatReport", {
      Phrases: [phrase],
      GeoID: [225], // Russia
    });

    // Parse response — structure varies by API version
    const data = result as Record<string, unknown>;
    if (data.result && Array.isArray(data.result)) {
      const first = data.result[0] as Record<string, unknown>;
      if (first && typeof first.Shows === "number") {
        return first.Shows;
      }
    }

    return 0;
  } catch (err) {
    console.warn(`[wordstat] getSearchVolume("${phrase}") failed:`, err);
    return 0;
  }
}

/**
 * Batch query: get top related requests for multiple phrases.
 * Returns array of {phrase, volume} sorted by volume desc.
 */
export async function getTopRequests(
  phrases: string[]
): Promise<WordstatResult[]> {
  const results: WordstatResult[] = [];

  for (const phrase of phrases) {
    try {
      const result = await wordstatRequest("GetWordstatReport", {
        Phrases: [phrase],
        GeoID: [225],
      });

      const data = result as Record<string, unknown>;
      if (data.result && Array.isArray(data.result)) {
        for (const item of data.result) {
          const r = item as Record<string, unknown>;
          if (r.Phrase && typeof r.Shows === "number") {
            results.push({
              phrase: String(r.Phrase),
              volume: r.Shows as number,
            });
          }
        }
      }

      // Rate limit: wait between requests
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      console.warn(`[wordstat] getTopRequests("${phrase}") failed:`, err);
    }
  }

  return results.sort((a, b) => b.volume - a.volume);
}

/**
 * Collect seed queries: for each seed phrase, get top related queries,
 * merge and deduplicate, return top N by volume.
 */
export async function collectSeedQueries(
  seeds: string[],
  topN = 10
): Promise<WordstatResult[]> {
  const token = getToken();
  if (!token) {
    console.warn("[wordstat] WORDSTAT_TOKEN not set, skipping seed collection");
    return [];
  }

  const allResults = await getTopRequests(seeds);

  // Deduplicate by phrase (keep highest volume)
  const seen = new Map<string, number>();
  for (const r of allResults) {
    const key = r.phrase.toLowerCase().trim();
    const existing = seen.get(key) ?? 0;
    if (r.volume > existing) {
      seen.set(key, r.volume);
    }
  }

  return Array.from(seen.entries())
    .map(([phrase, volume]) => ({ phrase, volume }))
    .sort((a, b) => b.volume - a.volume)
    .slice(0, topN);
}
