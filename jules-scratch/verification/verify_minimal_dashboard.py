from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Listen for console messages
    page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))

    page.goto("http://localhost:3000")

    # Wait for the button to be visible
    increment_button = page.get_by_role("button", name="Increment")
    expect(increment_button).to_be_visible()

    # Click the button to update the state
    increment_button.click()

    # Wait for the state to update
    expect(page.get_by_text("Count: 1")).to_be_visible()

    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
