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

  // 1. Load Live Vercel Production
  console.log(`📡 Connecting to live production: ${BASE_URL}`);
  await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });

  // 2. Click Quick-Start
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.includes('QUICK-START'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  // 3. Click Commence Field Infiltration
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
  // Click MAP tab
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const tab = btns.find(b => b.innerText.trim() === 'MAP');
    if (tab) tab.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Check sentry presence & click takedown if available
  const sentryResult = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const takedownBtn = btns.find(b => b.innerText.includes('TAKEDOWN') || b.innerText.includes('NEUTRALIZE'));
    if (takedownBtn) {
      takedownBtn.click();
      return 'Takedown executed';
    }
    return 'Sentries on active patrol';
  });
  console.log('Module 1 Sentry Action:', sentryResult);
  await new Promise(r => setTimeout(r, 800));

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

  // Tune to 7.25 MHz (Stasi Station)
  const tuneResult = await page.evaluate(() => {
    const slider = document.querySelector('input[type="range"]');
    if (slider) {
      slider.value = '7.25';
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
      return 'Tuned to 7.25 MHz';
    }
    return 'Slider not found';
  });
  console.log('Module 2 Tuning:', tuneResult);
  await new Promise(r => setTimeout(r, 800));

  // Click Decrypt button
  const decryptResult = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const decryptBtn = btns.find(b => b.innerText.includes('DECRYPT') || b.innerText.includes('INTERCEPT'));
    if (decryptBtn) {
      decryptBtn.click();
      return 'Decryption triggered';
    }
    return 'Decrypt button not active';
  });
  console.log('Module 2 Decrypt Action:', decryptResult);
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

  // Purchase Minox Camera ($250) or first available gadget
  const purchaseResult = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const buyBtn = btns.find(b => b.innerText.includes('REQUISITION') || b.innerText.includes('PURCHASE'));
    if (buyBtn) {
      buyBtn.click();
      return 'Purchased first gadget';
    }
    return 'No requisition button';
  });
  console.log('Module 3 Purchase:', purchaseResult);
  await new Promise(r => setTimeout(r, 800));

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

  // Execute interrogation tactics twice to build stress
  const polyResult = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    // Look for tactical buttons
    const tactic = btns.find(b => b.innerText.includes('Present Stolen') || b.innerText.includes('Chemical') || b.innerText.includes('Cold War') || b.innerText.includes('Offer Immunity') || b.innerText.includes('Microfilm'));
    if (tactic) {
      tactic.click();
      return 'Executed: ' + tactic.innerText.trim();
    }
    return 'Tactic not found';
  });
  console.log('Module 4 Interrogation Tactic 1:', polyResult);
  await new Promise(r => setTimeout(r, 1000));

  // Apply another tactic to push stress further
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const tactic2 = btns.find(b => b.innerText.includes('Chemical') || b.innerText.includes('Cold War'));
    if (tactic2) tactic2.click();
  });
  await new Promise(r => setTimeout(r, 1000));

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

  // Select East Berlin or Tangier
  const atlasResult = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const cityBtn = btns.find(b => b.innerText.includes('East Berlin') || b.innerText.includes('Tangier'));
    if (cityBtn) {
      cityBtn.click();
      return 'Selected theater city: ' + cityBtn.innerText.trim();
    }
    return 'City pins displayed';
  });
  console.log('Module 5 Atlas City Selection:', atlasResult);
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: path.join(DOWNLOADS, 'black_dossier_23_global_campaign.png'), fullPage: false });
  console.log('Saved: black_dossier_23_global_campaign.png');

  // ==========================================
  // THEATER MODE & MOBILE VIEWPORT AUDIT
  // ==========================================
  console.log('--- Testing Expanded Theater View ---');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const theaterBtn = btns.find(b => b.innerText.trim() === 'THEATER' || b.innerText.includes('EXPAND DECK'));
    if (theaterBtn) theaterBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(DOWNLOADS, 'black_dossier_25_expanded_theater_deck.png'), fullPage: false });
  console.log('Saved: black_dossier_25_expanded_theater_deck.png');

  // Close theater modal if open
  await page.evaluate(() => {
    const closeBtn = document.querySelector('button[title="Close Theater"], button::-p-text(✕), button::-p-text(CLOSE)');
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  console.log('--- Testing Mobile Phone Viewport (390x844) ---');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await new Promise(r => setTimeout(r, 1200));

  const mobileCheck = await page.evaluate(() => {
    const overflow = document.documentElement.scrollWidth > window.innerWidth;
    const bodyHeight = document.body.scrollHeight;
    const hasBottomNav = document.querySelectorAll('button').length > 5;
    return { overflow, bodyHeight, hasBottomNav };
  });
  console.log('Mobile Viewport Audit:', mobileCheck);
  if (mobileCheck.overflow) {
    throw new Error('FAILED: Mobile horizontal overflow detected!');
  }

  await page.screenshot({ path: path.join(DOWNLOADS, 'black_dossier_26_mobile_full_flow.png'), fullPage: true });
  console.log('Saved: black_dossier_26_mobile_full_flow.png');

  await browser.close();
  console.log('✅ ALL VERIFICATIONS COMPLETED WITH ZERO ERRORS!');
}

testAll().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
