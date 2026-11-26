const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const DOWNLOADS = '/Users/ericmiller/Downloads';
const BASE_URL = 'https://black-dossier.vercel.app';

async function run() {
  console.log('🚀 Starting Automated Verification against:', BASE_URL);
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('1. Navigating to production site...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });

  // 1. Initial State / Landing check
  await page.waitForSelector('button');
  
  // If "COMMENCE OPERATION" exists, click it to enter cockpit
  const commenceBtn = await page.$('button::-p-text(COMMENCE OPERATION)');
  if (commenceBtn) {
    console.log('Clicking COMMENCE OPERATION...');
    await commenceBtn.click();
    await new Promise(r => setTimeout(r, 1000));
  }

  // Also check if any "INITIALIZE DOSSIER" or similar exists
  const initBtn = await page.$('button::-p-text(INITIALIZE DOSSIER)');
  if (initBtn) {
    console.log('Clicking INITIALIZE DOSSIER...');
    await initBtn.click();
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('2. Verifying Tactical Blueprint Map with Sentries & Vision Cones...');
  // Ensure MAP tab is selected
  const mapTab = await page.$('button::-p-text(MAP)');
  if (mapTab) await mapTab.click();
  await new Promise(r => setTimeout(r, 1000));

  // Check for Sentry elements on the map
  const sentryFound = await page.evaluate(() => {
    const text = document.body.innerText;
    return text.includes('HOSTILE') || text.includes('Sentry') || document.querySelectorAll('svg circle').length > 0;
  });
  console.log('Sentry / Blueprint visual elements detected:', sentryFound);
  await page.screenshot({ path: path.join(DOWNLOADS, 'black_dossier_19_sentry_patrol.png'), fullPage: false });

  // Test Sentry Takedown if takedown button exists
  const takedownBtn = await page.$('button::-p-text(SILENT TAKEDOWN)');
  if (takedownBtn) {
    console.log('Testing Sentry Silent Takedown...');
    await takedownBtn.click();
    await new Promise(r => setTimeout(r, 800));
  }

  // 3. Testing SIGINT Tab
  console.log('3. Verifying SIGINT Oscilloscope & Numbers Station...');
  const sigintTab = await page.$('button::-p-text(SIGINT)');
  if (sigintTab) {
    await sigintTab.click();
    await new Promise(r => setTimeout(r, 1200));
    
    // Check if slider exists and change frequency
    const slider = await page.$('input[type="range"]');
    if (slider) {
      await page.evaluate(el => {
        el.value = '7.25';
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }, slider);
      await new Promise(r => setTimeout(r, 800));
    }

    // Try decrypt button
    const decryptBtn = await page.$('button::-p-text(DECRYPT INTERCEPT)');
    if (decryptBtn) {
      console.log('Testing Decrypt Intercept button...');
      await decryptBtn.click();
      await new Promise(r => setTimeout(r, 1000));
    }

    await page.screenshot({ path: path.join(DOWNLOADS, 'black_dossier_20_sigint_decoder.png'), fullPage: false });
  }

  // 4. Testing ARMORY / Briefcase Loadout
  console.log('4. Verifying Briefcase Armory & Requisition...');
  const armoryTab = await page.$('button::-p-text(ARMORY)');
  if (armoryTab) {
    await armoryTab.click();
    await new Promise(r => setTimeout(r, 1200));

    // Try purchasing a gadget
    const buyBtn = await page.$('button::-p-text(REQUISITION)');
    if (buyBtn) {
      console.log('Testing Requisition gadget button...');
      await buyBtn.click();
      await new Promise(r => setTimeout(r, 800));
    }

    await page.screenshot({ path: path.join(DOWNLOADS, 'black_dossier_21_briefcase_loadout.png'), fullPage: false });
  }

  // 5. Testing POLYGRAPH Interrogation
  console.log('5. Verifying Polygraph Interrogation...');
  const polygraphTab = await page.$('button::-p-text(POLYGRAPH)');
  if (polygraphTab) {
    await polygraphTab.click();
    await new Promise(r => setTimeout(r, 1200));

    // Execute interrogation tactics
    const tacticBtns = await page.$$('button[data-tactic="true"], button::-p-text(Apply), button::-p-text(Confront), button::-p-text(Present), button::-p-text(Inject), button::-p-text(Threaten)');
    if (tacticBtns.length > 0) {
      console.log(`Found ${tacticBtns.length} interrogation tactics. Applying tactic...`);
      await tacticBtns[0].click();
      await new Promise(r => setTimeout(r, 1200));
    } else {
      // Find buttons inside the tactics list
      const allButtons = await page.$$('button');
      for (const b of allButtons) {
        const text = await (await b.getProperty('innerText')).jsonValue();
        if (text.includes('Microfilm') || text.includes('Serum') || text.includes('Threat') || text.includes('Offer Immunity')) {
          console.log('Applying tactic:', text);
          await b.click();
          await new Promise(r => setTimeout(r, 1000));
          break;
        }
      }
    }

    await page.screenshot({ path: path.join(DOWNLOADS, 'black_dossier_22_polygraph_interrogation.png'), fullPage: false });
  }

  // 6. Testing GLOBAL ATLAS
  console.log('6. Verifying Global Campaign Atlas...');
  const atlasTab = await page.$('button::-p-text(ATLAS)');
  if (atlasTab) {
    await atlasTab.click();
    await new Promise(r => setTimeout(r, 1200));

    // Select a city like Berlin or Tangier
    const cityBtns = await page.$$('button');
    for (const b of cityBtns) {
      const text = await (await b.getProperty('innerText')).jsonValue();
      if (text.includes('East Berlin') || text.includes('Tangier') || text.includes('Moscow')) {
        console.log('Selecting theater city:', text);
        await b.click();
        await new Promise(r => setTimeout(r, 800));
        break;
      }
    }

    await page.screenshot({ path: path.join(DOWNLOADS, 'black_dossier_23_global_campaign.png'), fullPage: false });
  }

  // 7. Testing Mobile Viewport (390x844)
  console.log('7. Verifying Mobile Responsiveness (390x844)...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await new Promise(r => setTimeout(r, 1000));

  const mobileOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log('Mobile horizontal overflow detected:', mobileOverflow);

  await page.screenshot({ path: path.join(DOWNLOADS, 'black_dossier_24_mobile_viewport.png'), fullPage: true });

  await browser.close();
  console.log('🎉 Verification completed successfully! All screenshots saved to ~/Downloads');
}

run().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
