import dotenv from "dotenv";
dotenv.config();

export class TelegramProvider {
  public name = "telegram";

  constructor() {}

  async post(item: { title: string; body: string; tags?: string[] }) {
    const safeMode = process.env.SAFE_MODE === "true";
    const payload = `${item.title}\n\n${item.body}`;
    console.log(
      "[TelegramProvider] would post to chat",
      process.env.TELEGRAM_CHAT_ID,
      payload
    );
    if (safeMode) return { ok: true, mock: true, payload };

    // TODO: implement Telegram Bot API calls (sendMessage) using fetch or a library
    throw new Error(
      "TelegramProvider not implemented - set SAFE_MODE=true to avoid this"
    );
  }
}
