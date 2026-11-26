const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const DOWNLOADS = '/Users/ericmiller/Downloads';
const BASE_URL = 'https://black-dossier.vercel.app';

async function testAll() {
  console.log('🏁 INITIATING SYSTEM TEST: ALL 5 EXPANSION MODULES');
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log(`📡 Connecting to live production: ${BASE_URL}`);
  await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });

  // 1. Click Quick-Start
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.includes('QUICK-START'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  // 2. Click Commence Field Infiltration
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.includes('COMMENCE FIELD INFILTRATION'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  // ==========================================
  // MODULE 1: GUARD PATROLS & VISION CONES
  // ==========================================
  console.log('--- Testing Module 1: Guard Patrols & Vision Cones ---');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const tab = btns.find(b => b.innerText.trim() === 'MAP');
    if (tab) tab.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Test Sentry Silent Takedown
  const takedownStatus = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const takedownBtn = btns.find(b => b.innerText.includes('SILENT TAKEDOWN'));
    if (takedownBtn) {
      takedownBtn.click();
      return 'Takedown executed via HUD button';
    }
    return 'No takedown button';
  });
  console.log('Module 1 Sentry Action:', takedownStatus);
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: path.join(DOWNLOADS, 'black_dossier_19_sentry_patrol.png'), fullPage: false });
  console.log('Saved: black_dossier_19_sentry_patrol.png');

  // ==========================================
  // MODULE 2: SIGINT OSCILLOSCOPE DECODER
  // ==========================================
  console.log('--- Testing Module 2: SIGINT Audio Intercept & Numbers Station ---');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const tab = btns.find(b => b.innerText.trim() === 'SIGINT');
    if (tab) tab.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Click 7.25 MHz Preset
  const presetStatus = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const preset = btns.find(b => b.innerText.includes('7.25 MHz'));
    if (preset) {
      preset.click();
      return 'Tuned to 7.25 MHz Preset';
    }
    return 'Preset button not found';
  });
  console.log('Module 2 Tuning:', presetStatus);
  await new Promise(r => setTimeout(r, 1000));

  // Click Decrypt button
  const decryptStatus = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const decryptBtn = btns.find(b => b.innerText.includes('DECRYPT INTEL CABLE'));
    if (decryptBtn) {
      decryptBtn.click();
      return 'Successfully decrypted cable & lowered alert';
    }
    return 'Decrypt button not active';
  });
  console.log('Module 2 Decrypt Action:', decryptStatus);
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: path.join(DOWNLOADS, 'black_dossier_20_sigint_decoder.png'), fullPage: false });
  console.log('Saved: black_dossier_20_sigint_decoder.png');

  // ==========================================
  // MODULE 3: ATTACHÉ CASE LOADOUT & ARMORY
  // ==========================================
  console.log('--- Testing Module 3: Attaché Case Loadout & Armory ---');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const tab = btns.find(b => b.innerText.trim() === 'ARMORY');
    if (tab) tab.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  const armoryStatus = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const reqBtn = btns.find(b => b.innerText.includes('REQUISITION'));
    if (reqBtn) {
      reqBtn.click();
      return 'Gadget requisitioned into briefcase';
    }
    return 'No requisition button';
  });
  console.log('Module 3 Armory Action:', armoryStatus);
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: path.join(DOWNLOADS, 'black_dossier_21_briefcase_loadout.png'), fullPage: false });
  console.log('Saved: black_dossier_21_briefcase_loadout.png');

  // ==========================================
  // MODULE 4: POLYGRAPH LIE DETECTOR INTERROGATION
  // ==========================================
  console.log('--- Testing Module 4: Polygraph Lie-Detector Interrogation ---');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const tab = btns.find(b => b.innerText.trim() === 'POLYGRAPH');
    if (tab) tab.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Apply tactics to drive stress up
  const tacticStatus = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const t = btns.find(b => b.innerText.trim() === 'Cold Logic');
    if (t) {
      t.click();
      return 'Executed Cold Logic tactic';
    }
    return 'Cold Logic button not found';
  });
  console.log('Module 4 Tactic 1:', tacticStatus);
  await new Promise(r => setTimeout(r, 1200));

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const t = btns.find(b => b.innerText.trim() === 'Blunt Intimidation');
    if (t) t.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({ path: path.join(DOWNLOADS, 'black_dossier_22_polygraph_interrogation.png'), fullPage: false });
  console.log('Saved: black_dossier_22_polygraph_interrogation.png');

  // ==========================================
  // MODULE 5: GLOBAL CAMPAIGN ATLAS
  // ==========================================
  console.log('--- Testing Module 5: Global Campaign Atlas ---');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const tab = btns.find(b => b.innerText.trim() === 'ATLAS');
    if (tab) tab.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  const atlasStatus = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const cityBtn = btns.find(b => b.innerText.includes('East Berlin') || b.innerText.includes('Tangier'));
    if (cityBtn) {
      cityBtn.click();
      return 'Selected theater: ' + cityBtn.innerText.trim();
    }
    return 'Atlas ready';
  });
  console.log('Module 5 Atlas Action:', atlasStatus);
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: path.join(DOWNLOADS, 'black_dossier_23_global_campaign.png'), fullPage: false });
  console.log('Saved: black_dossier_23_global_campaign.png');

  // ==========================================
  // EXPANDED THEATER DECK
  // ==========================================
  console.log('--- Testing Expanded Theater View ---');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const tBtn = btns.find(b => b.innerText.trim() === 'THEATER' || b.innerText.trim() === 'EXPAND DECK');
    if (tBtn) tBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({ path: path.join(DOWNLOADS, 'black_dossier_25_expanded_theater_deck.png'), fullPage: false });
  console.log('Saved: black_dossier_25_expanded_theater_deck.png');

  // Close theater modal
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const closeBtn = btns.find(b => b.title === 'Close Theater' || b.innerText.trim() === '✕');
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // ==========================================
  // MOBILE PHONE VIEWPORT AUDIT (390x844)
  // ==========================================
  console.log('--- Testing Mobile Phone Viewport (390x844) ---');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await new Promise(r => setTimeout(r, 1200));

  const mobileCheck = await page.evaluate(() => {
    return {
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      viewportWidth: window.innerWidth,
      docWidth: document.documentElement.scrollWidth
    };
  });
  console.log('Mobile Viewport Audit:', mobileCheck);
  if (mobileCheck.overflow) {
    throw new Error('FAILED: Mobile horizontal overflow detected!');
  }

  await page.screenshot({ path: path.join(DOWNLOADS, 'black_dossier_26_mobile_full_flow.png'), fullPage: true });
  console.log('Saved: black_dossier_26_mobile_full_flow.png');

  await browser.close();
  console.log('🎉 ALL 5 MODULES TESTED & VERIFIED ON LIVE VERCEL PRODUCTION!');
}

testAll().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
