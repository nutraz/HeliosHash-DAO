const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  const out = {
    console: [],
    pageErrors: [],
    requestsFailed: [],
    responses: [],
    url: 'http://localhost:3000/splash'
  };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ recordHar: { path: '/tmp/splash.har' } });
  const page = await context.newPage();

  page.on('console', msg => {
    out.console.push({ type: msg.type(), text: msg.text(), location: msg.location() });
  });

  page.on('pageerror', err => {
    out.pageErrors.push({ message: err.message, stack: err.stack });
  });

  page.on('requestfailed', req => {
    out.requestsFailed.push({ url: req.url(), failureText: req.failure() ? req.failure().errorText : 'unknown' });
  });

  page.on('response', async res => {
    try {
      out.responses.push({ url: res.url(), status: res.status(), headers: res.headers() });
    } catch (e) {
      // ignore
    }
  });

  try {
    const resp = await page.goto(out.url, { waitUntil: 'networkidle', timeout: 15000 });
    out.status = resp ? resp.status() : null;
  } catch (e) {
    out.gotoError = { message: e.message };
  }

  // wait a bit for any deferred logs
  await page.waitForTimeout(1000);

  // take screenshot
  try {
    await page.screenshot({ path: '/tmp/splash.png', fullPage: true });
    out.screenshot = '/tmp/splash.png';
  } catch (e) {
    out.screenshotError = e.message;
  }

  await context.close();
  await browser.close();

  fs.writeFileSync('/tmp/splash_console.json', JSON.stringify(out, null, 2));
  console.log('Wrote /tmp/splash_console.json, /tmp/splash.har, /tmp/splash.png (if no errors).');
  console.log('Summary:');
  console.log(`  console messages: ${out.console.length}`);
  console.log(`  page errors: ${out.pageErrors.length}`);
  console.log(`  failed requests: ${out.requestsFailed.length}`);
  console.log(`  responses recorded: ${out.responses.length}`);
  if (out.gotoError) console.log('  goto error:', out.gotoError.message);
})();
