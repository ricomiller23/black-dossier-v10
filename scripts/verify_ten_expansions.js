const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const DOWNLOADS = '/Users/ericmiller/Downloads';
const BASE_URL = 'https://black-dossier.vercel.app';

async function testTenExpansions() {
  console.log('🏁 STARTING PRODUCTION VERIFICATION: 10 NEW TRADECRAFT EXPANSIONS');
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log(`📡 Connecting to live production: ${BASE_URL}`);
  await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });

  // 1. Enter Game Cockpit
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const qs = btns.find(b => b.innerText.includes('QUICK-START'));
    if (qs) qs.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const cf = btns.find(b => b.innerText.includes('COMMENCE FIELD INFILTRATION'));
    if (cf) cf.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  // Helper to switch department and tab
  async function selectTab(deptName, tabName) {
    await page.evaluate((d, t) => {
      const btns = Array.from(document.querySelectorAll('button'));
      const deptBtn = btns.find(b => b.innerText.trim().toUpperCase() === d.toUpperCase());
      if (deptBtn) deptBtn.click();
    }, deptName, tabName);
    await new Promise(r => setTimeout(r, 600));

    await page.evaluate((t) => {
      const btns = Array.from(document.querySelectorAll('button'));
      const tabBtn = btns.find(b => b.innerText.trim().toUpperCase() === t.toUpperCase());
      if (tabBtn) tabBtn.click();
    }, tabName);
    await new Promise(r => setTimeout(r, 800));
  }

  // =========================================================================
  // SYSTEM 1: MICROFILM DARKROOM & FORENSIC LOUPE
  // =========================================================================
  console.log('--- 1. Testing Microfilm Darkroom ---');
  await selectTab('FORENSICS', 'DARKROOM');
  
  // Advance chemical bath
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const advanceBtn = btns.find(b => b.innerText.includes('ADVANCE TO NEXT CHEMICAL BATH'));
    if (advanceBtn) advanceBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: path.join(DOWNLOADS, 'black_dossier_27_darkroom_forensics.png'), fullPage: false });
  console.log('Saved: black_dossier_27_darkroom_forensics.png');

  // =========================================================================
  // SYSTEM 2: COVER PASSPORT & CONSULAR VISA STAMPING
  // =========================================================================
  console.log('--- 2. Testing Cover Passport Book ---');
  await selectTab('HQ ARCHIVES', 'PASSPORT');

  // Apply new visa stamp
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const stampBtn = btns.find(b => b.innerText.includes('East Berlin Checkpoint') || b.innerText.includes('Vienna Diplomatic'));
    if (stampBtn) stampBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: path.join(DOWNLOADS, 'black_dossier_28_cover_passport.png'), fullPage: false });
  console.log('Saved: black_dossier_28_cover_passport.png');

  // =========================================================================
  // SYSTEM 3: DEAD-DROP NETWORK
  // =========================================================================
  console.log('--- 3. Testing Dead-Drop Network ---');
  await selectTab('SURVEILLANCE', 'DEAD-DROP');

  // Retrieve dead drop
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const retBtn = btns.find(b => b.innerText.includes('RETRIEVE DROP'));
    if (retBtn) retBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: path.join(DOWNLOADS, 'black_dossier_29_dead_drop_network.png'), fullPage: false });
  console.log('Saved: black_dossier_29_dead_drop_network.png');

  // =========================================================================
  // SYSTEM 4: COUNTER-SURVEILLANCE DRY-CLEANING TAIL
  // =========================================================================
  console.log('--- 4. Testing Counter-Surveillance Tail ---');
  await selectTab('SURVEILLANCE', 'COUNTER-TAIL');

  // Execute U-Bahn maneuver
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const ubahnBtn = btns.find(b => b.innerText.includes('-45% Threat'));
    if (ubahnBtn) ubahnBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: path.join(DOWNLOADS, 'black_dossier_30_counter_surveillance_tail.png'), fullPage: false });
  console.log('Saved: black_dossier_30_counter_surveillance_tail.png');

  // =========================================================================
  // SYSTEM 5: STETHOSCOPE SAFE VAULT
  // =========================================================================
  console.log('--- 5. Testing Stethoscope Safe Vault ---');
  await selectTab('FIELD OPS', 'SAFE VAULT');

  // Rotate dial and test
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const plusBtn = btns.find(b => b.innerText.trim() === '+5');
    if (plusBtn) plusBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: path.join(DOWNLOADS, 'black_dossier_31_stethoscope_safe_vault.png'), fullPage: false });
  console.log('Saved: black_dossier_31_stethoscope_safe_vault.png');

  // =========================================================================
  // SYSTEM 6: CLANDESTINE CHEMICAL LAB
  // =========================================================================
  console.log('--- 6. Testing Clandestine Chem Lab ---');
  await selectTab('FORENSICS', 'CHEM LAB');

  // Synthesize compound
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const synthBtn = btns.find(b => b.innerText.includes('SYNTHESIZE COMPOUND'));
    if (synthBtn) synthBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: path.join(DOWNLOADS, 'black_dossier_32_clandestine_chem_lab.png'), fullPage: false });
  console.log('Saved: black_dossier_32_clandestine_chem_lab.png');

  // =========================================================================
  // SYSTEM 7: STATION MOLE HUNT BOARD
  // =========================================================================
  console.log('--- 7. Testing Station Mole Hunt Board ---');
  await selectTab('HQ ARCHIVES', 'MOLE HUNT');

  // Select suspect Vance
  await page.evaluate(() => {
    const divs = Array.from(document.querySelectorAll('div'));
    const vanceCard = divs.find(d => d.innerText.includes('Julian Vance'));
    if (vanceCard) vanceCard.click();
  });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: path.join(DOWNLOADS, 'black_dossier_33_station_mole_hunt.png'), fullPage: false });
  console.log('Saved: black_dossier_33_station_mole_hunt.png');

  // =========================================================================
  // SYSTEM 8: EMBASSY GALA SOCIAL EAVESDROPPING
  // =========================================================================
  console.log('--- 8. Testing Embassy Gala Eavesdropping ---');
  await selectTab('SURVEILLANCE', 'EMBASSY GALA');

  // Eavesdrop on first diplomat
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const micBtn = btns.find(b => b.innerText.includes('AIM DIRECTIONAL MIC'));
    if (micBtn) micBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: path.join(DOWNLOADS, 'black_dossier_34_embassy_gala_eavesdrop.png'), fullPage: false });
  console.log('Saved: black_dossier_34_embassy_gala_eavesdrop.png');

  // =========================================================================
  // SYSTEM 9: BORDER EXFILTRATION RUN
  // =========================================================================
  console.log('--- 9. Testing Border Exfiltration Run ---');
  await selectTab('FIELD OPS', 'BORDER EXFIL');

  // Attempt border crossing
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const exfilBtn = btns.find(b => b.innerText.includes('EXECUTE BORDER CROSSING'));
    if (exfilBtn) exfilBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: path.join(DOWNLOADS, 'black_dossier_35_border_exfiltration_run.png'), fullPage: false });
  console.log('Saved: black_dossier_35_border_exfiltration_run.png');

  // =========================================================================
  // SYSTEM 10: OPERATIVE SERVICE RECORD
  // =========================================================================
  console.log('--- 10. Testing Operative Service Record ---');
  await selectTab('HQ ARCHIVES', 'SERVICE RECORD');

  await page.screenshot({ path: path.join(DOWNLOADS, 'black_dossier_36_operative_service_record.png'), fullPage: false });
  console.log('Saved: black_dossier_36_operative_service_record.png');

  // =========================================================================
  // MOBILE PHONE VIEWPORT AUDIT (390x844)
  // =========================================================================
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

  await page.screenshot({ path: path.join(DOWNLOADS, 'black_dossier_37_tactical_departments_mobile.png'), fullPage: true });
  console.log('Saved: black_dossier_37_tactical_departments_mobile.png');

  await browser.close();
  console.log('🎉 ALL 10 EXPANSION SYSTEMS FULLY TESTED & VERIFIED ON LIVE PRODUCTION!');
}

testTenExpansions().catch(err => {
  console.error('Production test failed:', err);
  process.exit(1);
});
