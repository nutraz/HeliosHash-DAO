const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  const out = { url: 'http://localhost:3000/splash' };
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(out.url, { waitUntil: 'networkidle' });

  const domInfo = await page.evaluate(() => {
    const bySel = sel => document.querySelector(sel) || null;
    const elRect = el => el ? el.getBoundingClientRect() : null;
    const compStyle = (el) => {
      if (!el) return null;
      const s = getComputedStyle(el);
      return {
        display: s.display,
        alignItems: s.alignItems,
        justifyContent: s.justifyContent,
        minHeight: s.minHeight,
        height: s.height,
        width: s.width
      };
    };

    const main = bySel('main');
    const header = bySel('header');
    const footer = bySel('footer');

    return {
      windowInner: { w: window.innerWidth, h: window.innerHeight, scrollHeight: document.documentElement.scrollHeight },
      mainRect: elRect(main),
      mainStyle: compStyle(main),
      headerRect: elRect(header),
      headerStyle: compStyle(header),
      footerRect: elRect(footer),
      footerStyle: compStyle(footer),
      btnCount: document.querySelectorAll('button, .btn, [role="button"]').length,
      minHCount: Array.from(document.querySelectorAll('[class]')).filter(n=>/min-h-screen/.test(n.className)).length,
      first100Html: document.body.innerHTML.slice(0,2000)
    };
  });

  out.dom = domInfo;
  fs.writeFileSync('/tmp/splash_dom.json', JSON.stringify(out, null, 2));
  console.log('Wrote /tmp/splash_dom.json');
  console.log(JSON.stringify(out.dom, null, 2));

  await browser.close();
})();
