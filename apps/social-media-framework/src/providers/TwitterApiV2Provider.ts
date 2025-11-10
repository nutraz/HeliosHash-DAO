import dotenv from "dotenv";
import assert from "assert";
dotenv.config();

type ContentItem = { title: string; body: string; tags?: string[] };

export class TwitterApiV2Provider {
  public name = "twitter";

  private apiKey?: string;
  private apiSecret?: string;
  private accessToken?: string;
  private accessSecret?: string;

  constructor() {
    this.apiKey = process.env.TWITTER_API_KEY;
    this.apiSecret = process.env.TWITTER_API_SECRET;
    this.accessToken = process.env.TWITTER_ACCESS_TOKEN;
    this.accessSecret = process.env.TWITTER_ACCESS_SECRET;
  }

  private checkCredentials() {
    const safeMode =
      process.env.SAFE_MODE === "true" || process.env.SAFE_MODE === undefined;
    if (safeMode) return true;
    assert(
      this.apiKey && this.apiSecret && this.accessToken && this.accessSecret,
      "Missing Twitter credentials in env"
    );
    return true;
  }

  private async uploadMedia(
    client: any,
    mediaBuffer: Buffer,
    mimeType: string
  ) {
    // Validate size and mime type (basic)
    const maxBytes = 15 * 1024 * 1024; // 15 MB
    const allowed = ["image/png", "image/jpeg", "image/gif", "image/webp"];
    if (!allowed.includes(mimeType))
      throw new Error(`Unsupported media type ${mimeType}`);
    if (mediaBuffer.length > maxBytes)
      throw new Error(`Media too large (${mediaBuffer.length} bytes)`);

    // twitter-api-v2 exposes v1.1 upload endpoints via client.v1.uploadMedia
    if (!client?.v1) throw new Error("Media upload not supported by client");
    // try chunked upload if available
    if (typeof client.v1.uploadMediaChunked === "function") {
      const mediaId = await client.v1.uploadMediaChunked(mediaBuffer, {
        mimeType,
      });
      return mediaId;
    }
    // fallback to simple upload (works for small files)
    if (typeof client.v1.uploadMedia === "function") {
      const mediaId = await client.v1.uploadMedia(mediaBuffer, { mimeType });
      return mediaId;
    }
    throw new Error("No supported upload method available on twitter client");
  }

  private splitToTweets(text: string, maxLen = 280) {
    if (text.length <= maxLen) return [text];
    const parts: string[] = [];
    let remaining = text;
    while (remaining.length > 0) {
      const part = remaining.slice(0, maxLen);
      parts.push(part);
      remaining = remaining.slice(maxLen);
    }
    return parts;
  }

  private sleep(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }

  // post returns an object with ok and meta info
  async post(
    item: ContentItem,
    media?: { buffer: Buffer; mimeType: string }[]
  ) {
    const safeMode =
      process.env.SAFE_MODE === "true" || process.env.SAFE_MODE === undefined;
    if (safeMode) {
      const mockPayload = `${item.title} — ${item.body}`;
      console.log("[TwitterApiV2Provider][SAFE_MODE] would post:", mockPayload);
      return { ok: true, mock: true, payload: mockPayload };
    }

    // credentials must exist now
    this.checkCredentials();

    // dynamic import to avoid requiring twitter lib in SAFE_MODE unit tests
    const { TwitterApi } = await import("twitter-api-v2");
    const client = new TwitterApi({
      appKey: this.apiKey!,
      appSecret: this.apiSecret!,
      accessToken: this.accessToken!,
      accessSecret: this.accessSecret!,
    });

    // simple rate-limit retry policy (exponential backoff)
    const maxRetries = 2;
    let attempt = 0;
    let lastError: any = null;

    // handle media upload if present
    let mediaIds: string[] = [];
    if (media && media.length > 0) {
      for (const m of media) {
        // upload synchronously for now
        const id = await this.uploadMedia(client, m.buffer, m.mimeType);
        mediaIds.push(id as unknown as string);
      }
    }

    const tweets = this.splitToTweets(`${item.title}\n\n${item.body}`);

    // Post each tweet in sequence; attach media to the first tweet if present
    let inReplyToId: string | undefined = undefined;
    let lastId: string | undefined = undefined;
    for (let i = 0; i < tweets.length; i++) {
      const t = tweets[i];
      attempt = 0;
      while (attempt <= maxRetries) {
        try {
          const opts: any = {};
          if (inReplyToId) opts.in_reply_to_tweet_id = inReplyToId;
          // attach media only to the first tweet
          if (i === 0 && mediaIds.length > 0) {
            opts.media = { media_ids: mediaIds };
          }

          const resp = await client.v2.tweet(
            t,
            Object.keys(opts).length ? opts : undefined
          );
          const id = resp?.data?.id;
          lastId = id;
          inReplyToId = id;
          break; // success, break retry loop and continue to next tweet
        } catch (err: any) {
          lastError = err;
          const status =
            err?.status ||
            err?.code ||
            (err?.errors && err.errors[0]?.code) ||
            null;
          if (
            status === 429 ||
            (err?.data && err.data.title === "Too Many Requests")
          ) {
            const backoff = Math.pow(2, attempt) * 1000;
            console.warn(
              "[TwitterApiV2Provider] rate limited, backing off",
              backoff
            );
            await this.sleep(backoff);
            attempt += 1;
            continue;
          } else {
            throw err;
          }
        }
      }
      if (attempt > maxRetries && lastError) {
        throw lastError;
      }
    }

    if (lastId) {
      return {
        ok: true,
        id: lastId,
        url: `https://twitter.com/i/web/status/${lastId}`,
      };
    }
    throw lastError ?? new Error("Failed to post tweet");
  }
}

// Simple self-test when run directly
if (process.argv[1] && process.argv[1].endsWith("TwitterApiV2Provider.ts")) {
  (async () => {
    const p = new TwitterApiV2Provider();
    const res = await p.post({ title: "test", body: "this is a test" });
    console.log("selftest", res);
  })();
}
