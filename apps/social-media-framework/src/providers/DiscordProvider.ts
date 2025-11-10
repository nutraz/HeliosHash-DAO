import dotenv from "dotenv";
dotenv.config();

/**
 * DiscordProvider
 * - Posts to a Discord incoming webhook URL (env: DISCORD_WEBHOOK_URL)
 * - Honors SAFE_MODE to avoid accidental live posts
 * - Implements simple retry/backoff for HTTP 429 responses
 * - Optionally integrates with `SqliteStore` if available to enforce posting policies
 */
export class DiscordProvider {
  public name = "discord";

  private webhookUrl?: string;
  private store: any | null = null; // optional store integration (if available)

  constructor() {
    this.webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    // Try to load optional store (SqliteStore) if present
    try {
      // dynamic import so provider remains usable even if storage not present
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      // Note: use path relative import; if it fails we proceed without persistence
      // We attempt to import compiled JS variant; this is best-effort.
      // eslint-disable-next-line no-constant-condition
      // @ts-ignore
      const maybe = require("../storage/SqliteStore");
      this.store = maybe && maybe.default ? maybe.default : maybe;
    } catch (e) {
      // store not available — that's fine, provider will still function but without persisted policy enforcement
      this.store = null;
    }
  }

  private sleep(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }

  private async precheck(projectId: string, title: string, body: string) {
    // Enforce posting policy if store is available
    if (!this.store) return { allowed: true };
    try {
      const todayCount = await this.store.getTodayCount(projectId);
      const maxPerDay = Number(process.env.MAX_POSTS_PER_DAY || "3");
      if (todayCount >= maxPerDay)
        return { allowed: false, reason: "daily_limit" };
      const isDup = await this.store.isDuplicate(
        projectId,
        title,
        body,
        24 * 60 * 60
      );
      if (isDup) return { allowed: false, reason: "duplicate" };
      return { allowed: true };
    } catch (err) {
      console.warn(
        "[DiscordProvider] precheck failed, proceeding without enforcement",
        err
      );
      return { allowed: true };
    }
  }

  async post(item: {
    title: string;
    body: string;
    tags?: string[];
    projectId?: string;
    mediaUrls?: string[]; // optional image URLs to include as embeds
  }) {
    const safeMode =
      process.env.SAFE_MODE === "true" || process.env.SAFE_MODE === undefined;
    const payload: any = { content: `**${item.title}**\n\n${item.body}` };
    if (item.mediaUrls && item.mediaUrls.length > 0) {
      payload.embeds = item.mediaUrls.map((u) => ({ image: { url: u } }));
    }

    if (!this.webhookUrl) {
      console.warn(
        "[DiscordProvider] DISCORD_WEBHOOK_URL not configured. Aborting post."
      );
      return { ok: false, error: "missing_webhook" };
    }

    // precheck: whether allowed to post (daily limits / duplicate detection)
    const projectId =
      item.projectId || process.env.DEFAULT_PROJECT || "default";
    const check = await this.precheck(projectId, item.title, item.body);
    if (!check.allowed) return { ok: false, error: check.reason };

    if (safeMode) {
      console.log(
        "[DiscordProvider][SAFE_MODE] would post to webhook",
        this.webhookUrl,
        payload
      );
      return { ok: true, mock: true, payload };
    }

    // perform POST with retry/backoff on 429
    const maxRetries = 2;
    let attempt = 0;
    let lastError: any = null;
    while (attempt <= maxRetries) {
      try {
        const res = await fetch(this.webhookUrl!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.status === 204 || (res.status >= 200 && res.status < 300)) {
          // Success - record in store if available
          const result = { ok: true, status: res.status };
          try {
            if (this.store && this.store.recordPost) {
              await this.store.recordPost({
                provider: this.name,
                project_id: projectId,
                title: item.title,
                body: item.body,
                external_id: null,
                url: null,
                status: "posted",
                created_at: Date.now(),
                meta: {},
              });
            }
          } catch (err) {
            console.warn(
              "[DiscordProvider] failed to record post in store",
              err
            );
          }
          return result;
        }
        if (res.status === 429) {
          const backoff = Math.pow(2, attempt) * 1000;
          console.warn("[DiscordProvider] rate limited, backing off", backoff);
          await this.sleep(backoff);
          attempt += 1;
          continue;
        }
        // other non-2xx
        const text = await res.text();
        throw new Error(`Discord POST failed ${res.status}: ${text}`);
      } catch (err: any) {
        lastError = err;
        // on network error or other fatal errors, do not retry endlessly
        if (attempt >= maxRetries) break;
        const backoff = Math.pow(2, attempt) * 1000;
        await this.sleep(backoff);
        attempt += 1;
      }
    }

    return { ok: false, error: lastError?.message ?? "unknown_error" };
  }
}
