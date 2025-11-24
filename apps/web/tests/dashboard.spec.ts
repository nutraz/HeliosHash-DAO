import { test, expect } from "@playwright/test";

test("dashboard loads and shows profile", async ({ page }) => {
  await page.goto("http://localhost:3002/dashboard");
  await expect(page.getByText("Dharmendra Sharma")).toBeVisible();
  await expect(page.getByRole("button", { name: "View NFTs" })).toBeVisible();
});

test("quick actions clickable", async ({ page }) => {
  await page.goto("http://localhost:3002/dashboard");
  await page.getByText("My NFTs").click();
  // since this is mock UI, we just ensure click doesn't crash
  await expect(page).toHaveURL(/dashboard/);
});
