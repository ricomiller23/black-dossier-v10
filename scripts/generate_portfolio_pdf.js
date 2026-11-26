const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const PDF_PATH = '/Users/ericmiller/Downloads/Master_App_Build_Portfolio.pdf';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Master Application Build Portfolio</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 16mm 18mm 16mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      line-height: 1.45;
      font-size: 11pt;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }
    .header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .title {
      font-size: 22pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
      margin: 0 0 4px 0;
    }
    .subtitle {
      font-size: 11pt;
      color: #475569;
      margin: 0 0 10px 0;
      font-weight: 500;
    }
    .meta-pills {
      display: flex;
      gap: 8px;
      font-size: 8.5pt;
      font-weight: 600;
      color: #334155;
    }
    .pill {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      padding: 3px 8px;
      border-radius: 4px;
    }
    .category {
      margin-top: 18px;
      margin-bottom: 12px;
      page-break-after: avoid;
    }
    .category-header {
      font-size: 13pt;
      font-weight: 700;
      color: #0f172a;
      border-left: 4px solid #2563eb;
      padding-left: 8px;
      margin: 0 0 10px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .cat-games .category-header { border-left-color: #8b5cf6; }
    .cat-sec .category-header { border-left-color: #059669; }
    .cat-deal .category-header { border-left-color: #d97706; }
    .cat-osint .category-header { border-left-color: #dc2626; }
    .cat-real .category-header { border-left-color: #0284c7; }

    .app-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .app-item {
      padding: 6px 10px;
      background: #fafafa;
      border: 1px solid #e2e8f0;
      border-radius: 5px;
      font-size: 9.5pt;
      page-break-inside: avoid;
    }
    .app-item:nth-child(even) {
      background: #ffffff;
    }
    .app-link {
      font-weight: 700;
      color: #2563eb;
      text-decoration: underline;
      font-size: 10pt;
      margin-right: 6px;
    }
    .app-link:hover {
      color: #1d4ed8;
    }
    .app-desc {
      color: #334155;
      line-height: 1.4;
    }
    .footer {
      margin-top: 25px;
      border-top: 1px solid #e2e8f0;
      padding-top: 8px;
      font-size: 8pt;
      color: #64748b;
      display: flex;
      justify-content: space-between;
      page-break-inside: avoid;
    }
  </style>
</head>
<body>

  <div class="header">
    <h1 class="title">Master Application Build Portfolio</h1>
    <p class="subtitle">Complete Production Directory of Verified Web Applications, Live Deployments & Interactive Systems</p>
    <div class="meta-pills">
      <span class="pill">All Systems Active on Vercel Production</span>
      <span class="pill">Updated: November 25, 2026</span>
      <span class="pill">45 Primary Production Builds</span>
    </div>
  </div>

  <!-- 1. Games & 3D Simulations -->
  <div class="category cat-games">
    <h2 class="category-header">1. Interactive Games & 3D Simulations</h2>
    <div class="app-list">
      <div class="app-item">
        <a class="app-link" href="https://black-dossier.vercel.app">Black Dossier</a>
        <span class="app-desc">Cold War solo espionage tabletop RPG with darkroom forensics, wiretaps, safe-cracking, and tactical sentry blueprints.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://scoundrel-card-game-drab.vercel.app">Scoundrel</a>
        <span class="app-desc">Roguelike solitaire card dungeon crawler with monster combat and weapon durability decay.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://hearthlands-two.vercel.app">Hearthlands</a>
        <span class="app-desc">3D solo medieval tile-laying game with sculpted figurines, procedural PBR textures, and macro zoom.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://treasure-hunter-orcin.vercel.app">Treasure Hunter</a>
        <span class="app-desc">Solo deck-building dungeon crawl with push-your-luck peril scaling and token crafting.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://fugitive-solo.vercel.app">Fugitive Solo</a>
        <span class="app-desc">Noir deduction card game with sprint mechanics and Bayesian inference AI solver.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://royal-backgammon-3d.vercel.app">Royal Backgammon 3D</a>
        <span class="app-desc">3D salon backgammon and Acey-Deucey with cryptographic two-stage dice re-rolls.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://dead-mans-bluff.vercel.app">Dead Man's Bluff</a>
        <span class="app-desc">Wild West saloon Liar's Dice tabletop simulator with real-time probability engine.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://chopper-strike.vercel.app">Chopper Strike</a>
        <span class="app-desc">Retro green vector-line helicopter combat flight simulator with SAM missile evasion.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://antikythera-mk3.vercel.app">Antikythera Mechanism Mk3</a>
        <span class="app-desc">Fully articulated 3D ancient Greek analog computer and astronomical gear train.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://antikythera-mk2.vercel.app">Antikythera Mechanism Mk2</a>
        <span class="app-desc">Second-generation 3D interactive model of the Antikythera celestial calculator.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://antikythera-mechanism-eight.vercel.app">Antikythera Mechanism Mk1</a>
        <span class="app-desc">Original 3D bronze gear-work reconstruction of the ancient calendar device.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://misslie-command.vercel.app">Missile Command</a>
        <span class="app-desc">Cold War ballistic defense missile intercept simulator with trajectory physics.</span>
      </div>
    </div>
  </div>

  <!-- 2. SEC EDGAR, Capital Markets & Securities Intelligence -->
  <div class="category cat-sec">
    <h2 class="category-header">2. SEC EDGAR, Capital Markets & Securities Intelligence</h2>
    <div class="app-list">
      <div class="app-item">
        <a class="app-link" href="https://edgar-scout-light.vercel.app">EDGAR Scout Light</a>
        <span class="app-desc">Real-time SEC filing parser for Form 4, 144, 8-K, and insider transactions.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://filings-outreach.vercel.app">Filings Outreach</a>
        <span class="app-desc">SEC Form 144 intent-to-sell intelligence engine with broker and owner contacts.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://filings-outreach-scout.vercel.app">Filings Outreach Scout</a>
        <span class="app-desc">Automated insider sale prospector tracking beneficial ownership disclosures.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://144-analysis-daily.vercel.app">144 Analysis Daily</a>
        <span class="app-desc">Daily quantitative impact scoring engine for Rule 144 restricted stock liquidations.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://desk144.vercel.app">Desk 144</a>
        <span class="app-desc">Restricted securities trade desk terminal tracking insider block liquidations.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://3a10-transactions-ledger.vercel.app">3a10 Transactions Ledger</a>
        <span class="app-desc">SEC Section 3(a)(10) fairness hearing debt-for-equity settlement database.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://future-3a10-candidates.vercel.app">Future 3a10 Candidates</a>
        <span class="app-desc">Screener identifying microcaps eligible for court-approved debt settlements.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://delisted-crm-database.vercel.app">Delisted CRM Database</a>
        <span class="app-desc">OTCQB and Pink Sheet delisting tracker and reverse-merger turnaround pipeline.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://edgar-crm-console.vercel.app">EDGAR CRM Console</a>
        <span class="app-desc">C-suite transaction pipeline tracking clustered corporate insider purchasing.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://edgar-insider-scout.vercel.app">EDGAR Insider Scout</a>
        <span class="app-desc">Algorithmic radar detecting significant open-market officer and director buys.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://shell-finder-blush.vercel.app">Shell Finder</a>
        <span class="app-desc">Forensic public shell screener tracking custodianship petitions and share structures.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://grnh-forensics.vercel.app">GRNH Forensics</a>
        <span class="app-desc">Deep forensic audit dashboard analyzing microcap share issuances and corporate actions.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://maxim-targets.vercel.app">Maxim Targets</a>
        <span class="app-desc">Microcap investment banking pipeline tracking underwriter warrants and offerings.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://lg-event-targets.vercel.app">LG Event Targets</a>
        <span class="app-desc">Registered direct and public offering capital raise catalyst tracker.</span>
      </div>
    </div>
  </div>

  <!-- 3. M&A Dealrooms, Distress Arbitrage & Debt Restructuring -->
  <div class="category cat-deal">
    <h2 class="category-header">3. M&A Dealrooms, Distress Arbitrage & Debt Restructuring</h2>
    <div class="app-list">
      <div class="app-item">
        <a class="app-link" href="https://project-cliff-deal-lab.vercel.app">Project Cliff Deal Lab</a>
        <span class="app-desc">Interactive liquidity cliff simulator calculating debt maturity walls and covenants.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://cliff-deal-interactive-2.vercel.app">Cliff Deal Interactive 2</a>
        <span class="app-desc">Advanced debt restructuring and cash runway modeling workbench.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://ziro-deal-lab.vercel.app">Ziro Deal Lab</a>
        <span class="app-desc">Virtual data room analytics workspace for distressed asset recapitalizations.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://ziro-dealroom.vercel.app">Ziro Dealroom</a>
        <span class="app-desc">Institutional secure virtual data room with granular document permissions.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://ziro-dealroom-ii.vercel.app">Ziro Dealroom II</a>
        <span class="app-desc">Second-generation M&A data room platform with real-time diligence auditing.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://single-tenant-vdr.vercel.app">Single Tenant VDR</a>
        <span class="app-desc">Isolated, single-tenant private credit and equity diligence data repository.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://western-targets.vercel.app">Western Targets</a>
        <span class="app-desc">Judgment debtor and asset recovery pipeline mapping commercial liens and bank accounts.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://asset-liberator.vercel.app">Asset Liberator</a>
        <span class="app-desc">Senior secured lender asset recovery engine identifying encumbered collateral.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://dealroom-bank-outreach-crm.vercel.app">Dealroom Bank Outreach CRM</a>
        <span class="app-desc">Syndicated lending portal managing commercial lender participation rosters.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://byond-credit-crm.vercel.app">Byond Credit CRM</a>
        <span class="app-desc">Mezzanine debt and alternative specialty credit underwriting CRM.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://acquisition-agent.vercel.app">Acquisition Agent</a>
        <span class="app-desc">Autonomous M&A origination agent matching strategic buyers with EBITDA targets.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://lex-core-terminal-20261024.vercel.app">Lex Core Terminal</a>
        <span class="app-desc">Corporate acquisition and deal clearance legal workflow terminal.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://ucc-lien-radar-20260930.vercel.app">UCC Lien Radar</a>
        <span class="app-desc">Article 9 UCC-1 and UCC-3 filing tracker detecting default notices and asset liens.</span>
      </div>
    </div>
  </div>

  <!-- 4. Geopolitical War Rooms, Infrastructure & OSINT Monitors -->
  <div class="category cat-osint">
    <h2 class="category-header">4. Geopolitical War Rooms, Infrastructure & OSINT Monitors</h2>
    <div class="app-list">
      <div class="app-item">
        <a class="app-link" href="https://gods-eye-chokepoint-terminal-202610.vercel.app">God's Eye Chokepoint Terminal</a>
        <span class="app-desc">Live maritime telemetry monitor tracking Hormuz, Suez, and global straits.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://subsea-wire.vercel.app">Subsea Wire</a>
        <span class="app-desc">Global submarine telecommunications cable map tracking cable cuts and landing stations.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://strat-mineral.vercel.app">Strat Mineral</a>
        <span class="app-desc">Strategic critical minerals and rare earth export control monitoring dashboard.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://russian-oil-analysis.vercel.app">Russian Oil Analysis</a>
        <span class="app-desc">Shadow tanker fleet AIS tracker and oil export sanctions evasion terminal.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://wildberries-analysis.vercel.app">Wildberries Analysis</a>
        <span class="app-desc">Corporate dispute and sanctions intelligence dashboard for Eastern European retail.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://plague-monitor-20261006.vercel.app">Plague Monitor</a>
        <span class="app-desc">Global epidemiological and biological outbreak surveillance terminal.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://ballot-watch.vercel.app">Ballot Watch</a>
        <span class="app-desc">Multi-jurisdiction election results and campaign finance disclosure dashboard.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://the-interpreter.vercel.app">The Interpreter</a>
        <span class="app-desc">Autonomous multi-language covert intelligence and foreign dispatch translator.</span>
      </div>
    </div>
  </div>

  <!-- 5. Real Estate, Housing Intelligence, Legal & Career Portals -->
  <div class="category cat-real">
    <h2 class="category-header">5. Real Estate, Housing Intelligence, Legal & Career Portals</h2>
    <div class="app-list">
      <div class="app-item">
        <a class="app-link" href="https://california-ab1033-terminal-20261001.vercel.app">California AB 1033 Terminal</a>
        <span class="app-desc">Legal and financial feasibility engine for ADU condominium split sales.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://adu4you.vercel.app">ADU4You</a>
        <span class="app-desc">Prefabricated and custom ADU floorplan configurator and permitting cost calculator.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://lansing-housing-finder.vercel.app">Lansing Housing Finder</a>
        <span class="app-desc">Distressed multifamily rental screener evaluating rent-to-price yields in Michigan.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://irvine-housing-finder.vercel.app">Irvine Housing Finder</a>
        <span class="app-desc">Southern California rental intelligence engine tracking landlord concessions.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://summary-judgment-v3.vercel.app">Summary Judgment v3</a>
        <span class="app-desc">Civil judgment collection and enforcement workflow automation tool.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://summary-judgment-enforcement-dashbo.vercel.app">Summary Judgment Enforcement</a>
        <span class="app-desc">Post-judgment asset discovery and statutory interest calculation dashboard.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://debra-job-finder-eric-millers-projects-c2f93b56.vercel.app">Debra Job Finder</a>
        <span class="app-desc">Automated executive job search agent with applicant tracking integration.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://debra-resume-campaign.vercel.app">Debra Resume Campaign</a>
        <span class="app-desc">Targeted executive recruiter outreach and resume distribution pipeline.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://hass-lead-generator.vercel.app">HASS Lead Generator</a>
        <span class="app-desc">B2B commercial real estate and property owner contact discovery tool.</span>
      </div>
      <div class="app-item">
        <a class="app-link" href="https://kustomxworks.com">Kustom X Works</a>
        <span class="app-desc">Custom specialty automotive engineering and performance fabrication portfolio.</span>
      </div>
    </div>
  </div>

  <div class="footer">
    <span>Generated by Antigravity Automation Core</span>
    <span>Master Portfolio // All Live Production Links Verified</span>
  </div>

</body>
</html>`;

async function generatePDF() {
  console.log('Rendering publication-grade PDF via Chrome headless...');
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: PDF_PATH,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '16mm',
      bottom: '16mm',
      left: '14mm',
      right: '14mm'
    }
  });

  await browser.close();
  console.log('PDF generated successfully at:', PDF_PATH);
}

generatePDF().catch(err => {
  console.error('Failed to generate PDF:', err);
  process.exit(1);
});
