// Integration test setup
import { beforeAll, afterAll } from "vitest";

beforeAll(() => {
  process.env.SAFE_MODE = "true";
  process.env.MAX_POSTS_PER_DAY = "1";
});

afterAll(() => {
  delete process.env.SAFE_MODE;
  delete process.env.MAX_POSTS_PER_DAY;
});
// Integration test setup
import { beforeAll, afterAll } from "vitest";

beforeAll(() => {
  // Set safe mode for all integration tests
  process.env.SAFE_MODE = "true";
  process.env.MAX_POSTS_PER_DAY = "1";
});

afterAll(() => {
  // Cleanup
  delete process.env.SAFE_MODE;
  delete process.env.MAX_POSTS_PER_DAY;
});
