import dotenv from "dotenv";
import { SocialMediaOrchestrator } from "./core/SocialMediaOrchestrator.js";

dotenv.config();

async function main() {
  const orchestrator = new SocialMediaOrchestrator();
  // Run a single sync cycle with mock data to verify wiring
  await orchestrator.runOnce();
}

if (
  import.meta.url === `file://${process.argv[1]}` ||
  process.env.RUN_DIRECT === "true"
) {
  void main();
}

export { main };
