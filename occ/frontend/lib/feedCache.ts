import type { Post } from "@/lib/dataProvider";
import type { FeedSettingsInput } from "@/lib/postApi";

const FEED_CACHE_PREFIX = "occ-feed-cache:";
const FEED_CACHE_TTL_MS = 45_000;

type CachedFeedPayload = {
  savedAt: number;
  page: number;
  total: number;
  totalPages: number;
  items: Post[];
};

function buildFeedCacheKey(page: number, limit: number, settings: FeedSettingsInput = {}) {
  return `${FEED_CACHE_PREFIX}${JSON.stringify({
    page,
    limit,
    sortBy: settings.sortBy || "latest",
    showClubPosts: settings.showClubPosts ?? true,
    showGeneralPosts: settings.showGeneralPosts ?? true,
  })}`;
}

export function readFeedCache(page: number, limit: number, settings: FeedSettingsInput = {}) {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(buildFeedCacheKey(page, limit, settings));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedFeedPayload;
    if (!parsed?.savedAt || Date.now() - parsed.savedAt > FEED_CACHE_TTL_MS) {
      window.sessionStorage.removeItem(buildFeedCacheKey(page, limit, settings));
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeFeedCache(
  page: number,
  limit: number,
  settings: FeedSettingsInput = {},
  payload: Omit<CachedFeedPayload, "savedAt">,
) {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(
      buildFeedCacheKey(page, limit, settings),
      JSON.stringify({
        ...payload,
        savedAt: Date.now(),
      } satisfies CachedFeedPayload),
    );
  } catch {
    // Ignore cache write failures
  }
}

export function clearFeedCache() {
  if (typeof window === "undefined") return;

  try {
    const keysToDelete: string[] = [];
    for (let index = 0; index < window.sessionStorage.length; index += 1) {
      const key = window.sessionStorage.key(index);
      if (key?.startsWith(FEED_CACHE_PREFIX)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => window.sessionStorage.removeItem(key));
  } catch {
    // Ignore cache clear failures
  }
}
