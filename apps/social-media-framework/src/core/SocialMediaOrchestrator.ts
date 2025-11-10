import { ContentStrategyManager } from "./ContentStrategyManager.js";
import { TwitterProvider } from "../providers/TwitterProvider.js";
import { TwitterApiV2Provider } from "../providers/TwitterApiV2Provider.js";
import { TelegramProvider } from "../providers/TelegramProvider.js";
import { DiscordProvider } from "../providers/DiscordProvider.js";
import { SocialAnalytics } from "../analytics/SocialAnalytics.js";
import { loadProjects } from "../config/projects.js";

export class SocialMediaOrchestrator {
  private strategy: ContentStrategyManager;
  private providers: Array<any>;
  private analytics: SocialAnalytics;

  constructor() {
    this.strategy = new ContentStrategyManager();
    this.analytics = new SocialAnalytics();
    // instantiate providers (safe stubs)
    // prefer the new API v2 provider; fallback to safe stub if not configured
    const twitter = new TwitterApiV2Provider();
    this.providers = [twitter, new TelegramProvider(), new DiscordProvider()];
  }

  async runOnce(): Promise<void> {
    // Example flow: gather items from strategy and post to providers
    const projects = await loadProjects();
    const items = this.strategy.generateContentForProject(
      projects[process.env.DEFAULT_PROJECT ?? "baghpat"]
    );

    for (const item of items) {
      for (const p of this.providers) {
        try {
          const resp = await p.post(item);
          this.analytics.recordPost(p.name || "provider", item, resp);
        } catch (err) {
          console.error("Posting failed", { provider: p.name, err });
        }
      }
    }
  }
}
