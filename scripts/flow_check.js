const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('https://black-dossier.vercel.app', { waitUntil: 'networkidle2' });

  // 1. Click Quick-Start
  const qs = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.includes('QUICK-START'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked Quick-Start:', qs);
  await new Promise(r => setTimeout(r, 1200));

  // 2. See next buttons
  let buttons = await page.evaluate(() => Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()));
  console.log('Step 2 Buttons:', buttons);

  // If there's an INITIALIZE or COMMENCE button, click it
  const initClicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const target = btns.find(b => b.innerText.includes('DEPLOY') || b.innerText.includes('COMMENCE') || b.innerText.includes('INITIALIZE') || b.innerText.includes('CONFIRM'));
    if (target) {
      target.click();
      return target.innerText;
    }
    return null;
  });
  console.log('Clicked deployment target:', initClicked);
  await new Promise(r => setTimeout(r, 1200));

  buttons = await page.evaluate(() => Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(Boolean));
  console.log('Step 3 Buttons (Cockpit):', buttons);

  await browser.close();
})();
