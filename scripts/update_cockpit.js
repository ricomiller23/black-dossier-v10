const fs = require('fs');
const path = '/Users/ericmiller/.gemini/antigravity-ide/scratch/black-dossier/components/dossier/PlayCockpit.tsx';

let code = fs.readFileSync(path, 'utf8');

// 1. Add component imports
const componentImportTarget = "import { GlobalCampaignAtlas } from '../campaign/GlobalCampaignAtlas'";
const newComponentImports = `import { GlobalCampaignAtlas } from '../campaign/GlobalCampaignAtlas'
import { MicrofilmDarkroom } from '../forensics/MicrofilmDarkroom'
import { CoverPassportBook } from '../passport/CoverPassportBook'
import { DeadDropNetwork } from '../deaddrop/DeadDropNetwork'
import { CounterSurveillanceTail } from '../counterintel/CounterSurveillanceTail'
import { StethoscopeSafeVault } from '../safecracking/StethoscopeSafeVault'
import { ClandestineChemLab } from '../lab/ClandestineChemLab'
import { StationMoleHuntBoard } from '../molehunt/StationMoleHuntBoard'
import { EmbassyGalaEavesdrop } from '../social/EmbassyGalaEavesdrop'
import { BorderExfiltrationRun } from '../exfiltration/BorderExfiltrationRun'
import { OperativeServiceRecord } from '../career/OperativeServiceRecord'`;

code = code.replace(componentImportTarget, newComponentImports);

// 2. Add extra icon imports
const iconImportTarget = '  Briefcase,\n  Activity,\n  Globe';
const newIcons = `  Briefcase,
  Activity,
  Globe,
  Camera,
  FileBadge,
  Compass,
  Lock,
  Droplets,
  UserX,
  Wine,
  Flag,
  Award,
  FlaskConical,
  Eye`;

code = code.replace(iconImportTarget, newIcons);

// 3. Update DeckTab type
const tabTypeTarget = "type DeckTab = 'map' | 'corkboard' | 'combat' | 'chase' | 'sigint' | 'armory' | 'interrogate' | 'atlas'";
const newTabType = `export type DeckTab =
  | 'map'
  | 'combat'
  | 'chase'
  | 'safecracking'
  | 'exfiltration'
  | 'sigint'
  | 'countertail'
  | 'deaddrop'
  | 'embassygala'
  | 'darkroom'
  | 'chemlab'
  | 'interrogate'
  | 'corkboard'
  | 'passport'
  | 'armory'
  | 'molehunt'
  | 'servicerecord'
  | 'atlas'

export type ConsoleDepartment = 'field' | 'surveillance' | 'forensics' | 'hq'`;

code = code.replace(tabTypeTarget, newTabType);

// 4. Update renderActiveView()
const renderTarget = `    switch (activeTab) {
      case 'map':
        return <TacticalBlueprintMap />
      case 'corkboard':
        return <EvidenceCorkboard />
      case 'combat':
        return <BallisticCombatView />
      case 'chase':
        return <ChaseTrackView />
      case 'sigint':
        return <AudioInterceptDecoder />
      case 'armory':
        return <BriefcaseLoadout />
      case 'interrogate':
        return <PolygraphInterrogation />
      case 'atlas':
        return <GlobalCampaignAtlas />
    }`;

const newRender = `    switch (activeTab) {
      case 'map':
        return <TacticalBlueprintMap />
      case 'combat':
        return <BallisticCombatView />
      case 'chase':
        return <ChaseTrackView />
      case 'safecracking':
        return <StethoscopeSafeVault />
      case 'exfiltration':
        return <BorderExfiltrationRun />
      case 'sigint':
        return <AudioInterceptDecoder />
      case 'countertail':
        return <CounterSurveillanceTail />
      case 'deaddrop':
        return <DeadDropNetwork />
      case 'embassygala':
        return <EmbassyGalaEavesdrop />
      case 'darkroom':
        return <MicrofilmDarkroom />
      case 'chemlab':
        return <ClandestineChemLab />
      case 'interrogate':
        return <PolygraphInterrogation />
      case 'corkboard':
        return <EvidenceCorkboard />
      case 'passport':
        return <CoverPassportBook />
      case 'armory':
        return <BriefcaseLoadout />
      case 'molehunt':
        return <StationMoleHuntBoard />
      case 'servicerecord':
        return <OperativeServiceRecord />
      case 'atlas':
        return <GlobalCampaignAtlas />
    }`;

code = code.replace(renderTarget, newRender);

// 5. Update deckTabs and add department grouping
const deckTabsTarget = `  const deckTabs: { id: DeckTab; label: string; icon: any }[] = [
    { id: 'map', label: 'MAP', icon: MapPin },
    { id: 'corkboard', label: 'EVIDENCE', icon: FolderOpen },
    { id: 'combat', label: 'COMBAT', icon: Crosshair },
    { id: 'chase', label: 'CHASE', icon: Zap },
    { id: 'sigint', label: 'SIGINT', icon: Radio },
    { id: 'interrogate', label: 'POLYGRAPH', icon: Activity },
    { id: 'armory', label: 'ARMORY', icon: Briefcase },
    { id: 'atlas', label: 'ATLAS', icon: Globe }
  ]`;

const newDeckTabs = `  const [selectedDept, setSelectedDept] = useState<ConsoleDepartment>('field')

  const deckTabs: { id: DeckTab; label: string; icon: any; dept: ConsoleDepartment }[] = [
    // Field Ops
    { id: 'map', label: 'MAP', icon: MapPin, dept: 'field' },
    { id: 'combat', label: 'COMBAT', icon: Crosshair, dept: 'field' },
    { id: 'chase', label: 'CHASE', icon: Zap, dept: 'field' },
    { id: 'safecracking', label: 'SAFE VAULT', icon: Lock, dept: 'field' },
    { id: 'exfiltration', label: 'BORDER EXFIL', icon: Flag, dept: 'field' },

    // Surveillance
    { id: 'sigint', label: 'SIGINT', icon: Radio, dept: 'surveillance' },
    { id: 'countertail', label: 'COUNTER-TAIL', icon: Eye, dept: 'surveillance' },
    { id: 'deaddrop', label: 'DEAD-DROP', icon: Compass, dept: 'surveillance' },
    { id: 'embassygala', label: 'EMBASSY GALA', icon: Wine, dept: 'surveillance' },

    // Forensics & Lab
    { id: 'darkroom', label: 'DARKROOM', icon: Camera, dept: 'forensics' },
    { id: 'chemlab', label: 'CHEM LAB', icon: FlaskConical, dept: 'forensics' },
    { id: 'interrogate', label: 'POLYGRAPH', icon: Activity, dept: 'forensics' },
    { id: 'corkboard', label: 'EVIDENCE', icon: FolderOpen, dept: 'forensics' },

    // HQ Archives & Personnel
    { id: 'passport', label: 'PASSPORT', icon: FileBadge, dept: 'hq' },
    { id: 'armory', label: 'ARMORY', icon: Briefcase, dept: 'hq' },
    { id: 'molehunt', label: 'MOLE HUNT', icon: UserX, dept: 'hq' },
    { id: 'servicerecord', label: 'SERVICE RECORD', icon: Award, dept: 'hq' },
    { id: 'atlas', label: 'ATLAS', icon: Globe, dept: 'hq' }
  ]

  const departments: { id: ConsoleDepartment; label: string }[] = [
    { id: 'field', label: 'FIELD OPS' },
    { id: 'surveillance', label: 'SURVEILLANCE' },
    { id: 'forensics', label: 'FORENSICS' },
    { id: 'hq', label: 'HQ ARCHIVES' }
  ]`;

code = code.replace(deckTabsTarget, newDeckTabs);

// 6. Update the tabs render UI in Zone 3
const zone3TabTarget = `<div className="flex flex-wrap gap-1">
              {deckTabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={\`px-2.5 py-1.5 rounded-lg font-bold text-[11px] sm:text-xs transition-all flex items-center gap-1 cursor-pointer \${
                      activeTab === tab.id
                        ? 'bg-[#F2D06B] text-black shadow-md scale-105'
                        : 'bg-stone-900 text-stone-400 hover:text-white'
                    }\`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>`;

const newZone3Tab = `<div className="flex flex-col gap-1.5 flex-1 mr-2">
              {/* Department Console Selector */}
              <div className="flex items-center gap-1">
                {departments.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      setSelectedDept(d.id)
                      const firstInDept = deckTabs.find(t => t.dept === d.id)
                      if (firstInDept) setActiveTab(firstInDept.id)
                    }}
                    className={\`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer \${
                      selectedDept === d.id
                        ? 'bg-[#C9A227] text-black shadow'
                        : 'bg-stone-900/80 text-stone-500 hover:text-stone-300'
                    }\`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              {/* Department Sub-Tabs */}
              <div className="flex flex-wrap gap-1">
                {deckTabs
                  .filter((tab) => tab.dept === selectedDept)
                  .map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={\`px-2 py-1 rounded-md font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer \${
                          activeTab === tab.id
                            ? 'bg-[#F2D06B] text-black shadow-md scale-105'
                            : 'bg-stone-900 text-stone-400 hover:text-white'
                        }\`}
                      >
                        <Icon className="w-3 h-3" />
                        <span>{tab.label}</span>
                      </button>
                    )
                  })}
              </div>
            </div>`;

code = code.replace(zone3TabTarget, newZone3Tab);

// 7. Update Theater mode tabs so all 18 can be switched or by department
const theaterTabsTarget = `<div className="flex flex-wrap gap-1 sm:gap-1.5">
                    {deckTabs.map((tab) => {
                      const Icon = tab.icon
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveTab(tab.id)}
                          className={\`px-3 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1 cursor-pointer \${
                            activeTab === tab.id
                              ? 'bg-[#F2D06B] text-black shadow-lg scale-105'
                              : 'bg-stone-900 text-stone-400 hover:text-white'
                          }\`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{tab.label}</span>
                        </button>
                      )
                    })}
                  </div>`;

const newTheaterTabs = `<div className="flex flex-col gap-1.5">
                    {/* Department Selector */}
                    <div className="flex items-center gap-1.5">
                      {departments.map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => {
                            setSelectedDept(d.id)
                            const first = deckTabs.find(t => t.dept === d.id)
                            if (first) setActiveTab(first.id)
                          }}
                          className={\`px-2.5 py-1 rounded text-xs font-bold uppercase transition-all cursor-pointer \${
                            selectedDept === d.id
                              ? 'bg-[#C9A227] text-black shadow'
                              : 'bg-stone-900 text-stone-400 hover:text-white'
                          }\`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>

                    {/* Department Sub-Tabs */}
                    <div className="flex flex-wrap gap-1 sm:gap-1.5">
                      {deckTabs
                        .filter((t) => t.dept === selectedDept)
                        .map((tab) => {
                          const Icon = tab.icon
                          return (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => setActiveTab(tab.id)}
                              className={\`px-3 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1 cursor-pointer \${
                                activeTab === tab.id
                                  ? 'bg-[#F2D06B] text-black shadow-lg scale-105'
                                  : 'bg-stone-900 text-stone-400 hover:text-white'
                              }\`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              <span>{tab.label}</span>
                            </button>
                          )
                        })}
                    </div>
                  </div>`;

code = code.replace(theaterTabsTarget, newTheaterTabs);

// 8. Mobile Footer: provide quick department/tab switching
const mobileFooterTarget = `<footer className="flex lg:hidden items-center justify-around h-14 border-t border-[#C9A227]/30 bg-[#0F131A] px-2 z-30 shrink-0 font-mono text-[9px]">
        {deckTabs.slice(0, 5).map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id)
                setIsTheaterOpen(true)
              }}
              className={\`flex flex-col items-center gap-0.5 \${
                activeTab === tab.id ? 'text-[#F2D06B]' : 'text-stone-400'
              }\`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="flex flex-col items-center gap-0.5 text-cyan-400"
        >
          <Shield className="w-4 h-4" />
          <span>STATUS</span>
        </button>
      </footer>`;

const newMobileFooter = `<footer className="flex lg:hidden items-center justify-around h-14 border-t border-[#C9A227]/30 bg-[#0F131A] px-2 z-30 shrink-0 font-mono text-[9px]">
        {departments.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => {
              setSelectedDept(d.id)
              const firstInDept = deckTabs.find(t => t.dept === d.id)
              if (firstInDept) setActiveTab(firstInDept.id)
              setIsTheaterOpen(true)
            }}
            className={\`flex flex-col items-center gap-0.5 cursor-pointer \${
              selectedDept === d.id ? 'text-[#F2D06B] font-bold' : 'text-stone-400'
            }\`}
          >
            <Compass className="w-4 h-4" />
            <span>{d.label}</span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="flex flex-col items-center gap-0.5 text-cyan-400 cursor-pointer"
        >
          <Shield className="w-4 h-4" />
          <span>STATUS</span>
        </button>
      </footer>`;

code = code.replace(mobileFooterTarget, newMobileFooter);

fs.writeFileSync(path, code, 'utf8');
console.log('Successfully updated PlayCockpit.tsx with all 18 systems!');
