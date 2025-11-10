import dotenv from "dotenv";
dotenv.config();

export class TwitterProvider {
  public name = "twitter";

  constructor() {
    // TODO: add real SDK setup here
  }

  async post(item: { title: string; body: string; tags?: string[] }) {
    // SAFE STUB: does not call external API. Replace with real API client.
    const safeMode = process.env.SAFE_MODE === "true";
    const payload = `${item.title} — ${item.body} ${
      item.tags?.map((t) => `#${t}`).join(" ") ?? ""
    }`;
    console.log("[TwitterProvider] would post:", payload);
    if (safeMode) {
      return { ok: true, mock: true, payload };
    }

    // TODO: implement Twitter/X API call using official SDK or fetch
    throw new Error(
      "TwitterProvider not implemented - set SAFE_MODE=true to avoid this"
    );
  }
}
