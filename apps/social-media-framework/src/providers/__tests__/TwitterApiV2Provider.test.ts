#!/usr/bin/env node
import assert from "assert";
import dotenv from "dotenv";
dotenv.config();

// Ensure SAFE_MODE for unit tests
process.env.SAFE_MODE = "true";

import { TwitterApiV2Provider } from "../TwitterApiV2Provider.js";

async function run() {
  const p = new TwitterApiV2Provider();
  const res = await p.post({ title: "UnitTest", body: "safe mode test" });
  console.log("test result", res);
  assert(res.ok === true, "Expected ok:true in SAFE_MODE");
  assert(res.mock === true, "Expected mock:true in SAFE_MODE");
  // also test media argument in SAFE_MODE
  const fakeBuffer = Buffer.from("fake");
  const res2 = await p.post({ title: "UnitTestMedia", body: "media test" }, [
    { buffer: fakeBuffer, mimeType: "image/png" },
  ]);
  console.log("test result media", res2);
  assert(
    res2.ok === true && res2.mock === true,
    "Expected mock response for media in SAFE_MODE"
  );
  console.log("✅ TwitterApiV2Provider SAFE_MODE test passed");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
