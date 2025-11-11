#!/usr/bin/env node
import assert from "assert";
import dotenv from "dotenv";
dotenv.config();

// Ensure SAFE_MODE for unit tests
process.env.SAFE_MODE = "true";

import { DiscordProvider } from "../DiscordProvider.js";

async function run() {
  const p = new DiscordProvider();
  const res = await p.post({
    title: "UnitTest",
    body: "discord safe mode test",
    projectId: "testproj",
    mediaUrls: ["https://example.com/image.png"],
  });
  console.log("discord test result", res);
  assert(res.ok === true, "Expected ok:true in SAFE_MODE");
  if ("mock" in res) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert(res.mock === true, "Expected mock:true in SAFE_MODE");
  }
  if ("payload" in res && res.payload && res.payload.embeds) {
    // ensure embeds included
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert(
      Array.isArray(res.payload.embeds) && res.payload.embeds.length === 1,
      "Expected one embed in SAFE_MODE payload"
    );
  }
  console.log("✅ DiscordProvider SAFE_MODE test passed");
}

run().catch((err) => {
  // Avoid calling process.exit in tests (Vitest treats this as an unhandled error)
  // Rethrow so the test framework can report the failure cleanly.
  console.error(err);
  throw err;
});
