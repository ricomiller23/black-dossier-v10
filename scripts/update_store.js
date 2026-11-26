const fs = require('fs');
const path = '/Users/ericmiller/.gemini/antigravity-ide/scratch/black-dossier/lib/store.ts';

// Revert to clean store before expansion
const gitCheckout = require('child_process').execSync('git checkout lib/store.ts', { cwd: '/Users/ericmiller/.gemini/antigravity-ide/scratch/black-dossier' });

let code = fs.readFileSync(path, 'utf8');

// 1. Update imports
const importTarget = "  SentryUnit\n} from './schemas'";
const newImports = `  SentryUnit,
  DarkroomRoll,
  CoverLegend,
  DeadDropSite,
  SurveillanceTail,
  SafeCrackingState,
  ChemicalCompound,
  MoleSuspect,
  GalaGuest,
  EmbassyGalaState,
  ExfiltrationRoute,
  CareerRecord
} from './schemas'
import {
  DEFAULT_DARKROOM_ROLLS,
  DEFAULT_COVER_LEGENDS,
  DEFAULT_DEAD_DROPS,
  DEFAULT_SURVEILLANCE_TAIL,
  DEFAULT_SAFE_STATE,
  DEFAULT_CHEMICAL_COMPOUNDS,
  DEFAULT_MOLE_SUSPECTS,
  DEFAULT_GALA_GUESTS,
  DEFAULT_GALA_STATE,
  DEFAULT_EXFIL_ROUTES,
  DEFAULT_CAREER_RECORDS
} from './engine/expansion10'`;

code = code.replace(importTarget, newImports);

// 2. Add interface types into GameState
const interfaceTarget = '  selectCampaignCity: (cityId: string) => void\n}';
const newInterfaceMethods = `  selectCampaignCity: (cityId: string) => void

  // --- 10 EXPANSION SYSTEMS ---
  darkroomRolls: DarkroomRoll[]
  advanceDarkroomStage: (rollId: string) => void
  inspectDarkroomMicrodot: (rollId: string) => void

  coverLegends: CoverLegend[]
  switchCoverLegend: (legendId: string) => void
  stampVisa: (visaCountry: string) => void
  burnCoverLegend: (legendId: string) => void

  deadDropSites: DeadDropSite[]
  retrieveDeadDrop: (siteId: string) => void
  orderAssetSabotage: (siteId: string) => void

  surveillanceTail: SurveillanceTail
  executeDryCleanManeuver: (maneuverId: 'u_bahn' | 'coat_reverse' | 'alley_sprint') => void

  safeCrackingState: SafeCrackingState
  rotateSafeDial: (delta: number) => void
  testSafeCombination: () => boolean

  chemicalCompounds: ChemicalCompound[]
  chemicalReagentsCount: number
  craftChemicalCompound: (compoundId: string) => void

  moleSuspects: MoleSuspect[]
  auditMoleSuspect: (suspectId: string) => void
  accuseStationMole: (suspectId: string) => boolean

  galaGuests: GalaGuest[]
  embassyGalaState: EmbassyGalaState
  eavesdropGalaGuest: (guestId: string) => void

  exfiltrationRoutes: ExfiltrationRoute[]
  executeBorderExfiltration: (routeId: string) => boolean

  careerRecords: CareerRecord[]
  awardCareerRecord: (record: CareerRecord) => void
}`;

code = code.replace(interfaceTarget, newInterfaceMethods);

// 3. Helper log function string
const logHelper = `
function appendLog(set: any, get: any, speaker: string, text: string, type: 'action' | 'system' | 'clue' | 'dialogue' | 'threat' = 'system') {
  const { logs } = get()
  const log: LogEntry = {
    id: \`log_\${Date.now()}_\${Math.floor(Math.random() * 1000)}\`,
    timestamp: new Date().toLocaleTimeString(),
    speaker,
    text,
    type
  }
  set({ logs: [...logs, log] })
}
`;

// Insert logHelper before create<GameState>
code = code.replace('export const useGameStore = create<GameState>((set, get) => ({', logHelper + '\nexport const useGameStore = create<GameState>((set, get) => ({');

// 4. Implementations
const storeEndTarget = `    set({ activeCityId: cityId })
    get().launchMission(undefined, '1980s Cold War', 'solo', city.name)
  }
}))`;

const newImplementations = `    set({ activeCityId: cityId })
    get().launchMission(undefined, '1980s Cold War', 'solo', city.name)
  },

  // 6. Microfilm Darkroom
  darkroomRolls: DEFAULT_DARKROOM_ROLLS,
  advanceDarkroomStage: (rollId) => {
    sound.playChemicalDrip()
    const current = get().darkroomRolls
    const nextStages: Record<string, 'raw' | 'developer' | 'stop_bath' | 'fixer' | 'developed'> = {
      raw: 'developer',
      developer: 'stop_bath',
      stop_bath: 'fixer',
      fixer: 'developed'
    }
    const updated = current.map(r => {
      if (r.id === rollId) {
        const nextStage = nextStages[r.stage] || 'developed'
        return { ...r, stage: nextStage }
      }
      return r
    })
    set({ darkroomRolls: updated })
    const roll = updated.find(r => r.id === rollId)
    appendLog(set, get, 'DARKROOM LAB', \`Advanced film canister to \${roll?.stage.toUpperCase()} chemical bath.\`, 'action')
  },
  inspectDarkroomMicrodot: (rollId) => {
    sound.playCameraShutter()
    const current = get().darkroomRolls
    const target = current.find(r => r.id === rollId)
    if (!target) return

    const updated = current.map(r => r.id === rollId ? { ...r, isInspected: true } : r)
    const { revealedClues, alertLevel } = get()
    if (!revealedClues.includes(target.clueRevealed)) {
      set({
        darkroomRolls: updated,
        revealedClues: [...revealedClues, target.clueRevealed],
        alertLevel: Math.max(1, alertLevel - 1)
      })
    } else {
      set({ darkroomRolls: updated })
    }
    appendLog(set, get, 'FORENSIC LOUPE', \`35mm negative magnified: \${target.clueRevealed}\`, 'clue')
  },

  // 7. Cover Passport & Legends
  coverLegends: DEFAULT_COVER_LEGENDS,
  switchCoverLegend: (legendId) => {
    sound.playTypewriter()
    const current = get().coverLegends
    const updated = current.map(l => ({ ...l, isActive: l.id === legendId }))
    const active = updated.find(l => l.isActive)
    set({ coverLegends: updated })
    if (active) {
      appendLog(set, get, 'PASSPORT CONTROL', \`Cover legend assumed: \${active.aliasName} (\${active.nationality}, \${active.occupation}).\`, 'system')
    }
  },
  stampVisa: (visaCountry) => {
    sound.playStamp()
    const current = get().coverLegends
    const updated = current.map(l => {
      if (l.isActive && !l.visaStamps.includes(visaCountry)) {
        return {
          ...l,
          visaStamps: [...l.visaStamps, visaCountry],
          suspicionPercent: Math.max(0, l.suspicionPercent - 15)
        }
      }
      return l
    })
    set({ coverLegends: updated })
    appendLog(set, get, 'CONSULAR STAMP', \`Validated border entry visa for \${visaCountry}. Cover suspicion dropped.\`, 'system')
  },
  burnCoverLegend: (legendId) => {
    sound.playAlarm()
    const current = get().coverLegends
    const updated = current.map(l => l.id === legendId ? { ...l, isBurned: true, isActive: false } : l)
    const fallback = updated.find(l => !l.isBurned)
    if (fallback) fallback.isActive = true
    set({ coverLegends: updated, alertLevel: get().alertLevel + 1 })
    appendLog(set, get, 'SECURITY BREACH', 'Cover legend permanently BURNED. Emergency alias assumed. Sector alert increased.', 'threat')
  },

  // 8. Dead-Drop & Asset Network
  deadDropSites: DEFAULT_DEAD_DROPS,
  retrieveDeadDrop: (siteId) => {
    sound.playGadgetSnap()
    const current = get().deadDropSites
    const target = current.find(d => d.id === siteId)
    if (!target || target.status === 'retrieved') return

    const updated = current.map(d => d.id === siteId ? { ...d, status: 'retrieved' as const } : d)
    const { agent, revealedClues } = get()
    const updatedAgent = agent ? { ...agent, funds: agent.funds + target.cashReward } : null

    set({
      deadDropSites: updated,
      agent: updatedAgent,
      revealedClues: revealedClues.includes(target.intelPayload) ? revealedClues : [...revealedClues, target.intelPayload]
    })
    appendLog(set, get, 'DEAD-DROP RETRIEVED', \`Recovered $\${target.cashReward} operational funds & intel from \${target.name}.\`, 'clue')
  },
  orderAssetSabotage: (siteId) => {
    sound.playAlarm()
    const current = get().deadDropSites
    const updated = current.map(d => d.id === siteId ? { ...d, status: 'sabotage_ordered' as const } : d)
    const { sentries, alertLevel } = get()
    const updatedSentries = sentries.map((s, idx) => idx === 0 ? { ...s, status: 'neutralized' as const } : s)
    set({
      deadDropSites: updated,
      sentries: updatedSentries,
      alertLevel: Math.max(1, alertLevel - 1)
    })
    appendLog(set, get, 'ASSET DISPATCH', 'Local informant initiated power grid blackout! Sentry patrol disoriented & sector alert reduced.', 'action')
  },

  // 9. Counter-Surveillance "Dry Cleaning" Tail
  surveillanceTail: DEFAULT_SURVEILLANCE_TAIL,
  executeDryCleanManeuver: (maneuverId) => {
    sound.playRadarPing()
    const tail = get().surveillanceTail
    let dropPercent = 35
    let desc = ''
    if (maneuverId === 'u_bahn') {
      dropPercent = 45
      desc = 'Last-second slip onto departing U-Bahn subway car as pneumatics seal doors.'
    } else if (maneuverId === 'coat_reverse') {
      dropPercent = 30
      desc = "Reversible trench-coat color swap inside public men's washroom."
    } else {
      dropPercent = 50
      desc = 'Sprint through labyrinthine butcher alleyway and over locked timber fence.'
    }

    const newThreat = Math.max(0, tail.threatLevelPercent - dropPercent)
    const isNowClean = newThreat === 0
    set({
      surveillanceTail: {
        ...tail,
        threatLevelPercent: newThreat,
        activeTail: !isNowClean,
        lastManeuver: desc
      }
    })
    appendLog(set, get, 'COUNTER-SURVEILLANCE', \`\${desc} (Tail Threat: \${newThreat}%)\`, 'action')
    if (isNowClean) {
      sound.playStamp()
      appendLog(set, get, 'TAIL DUMPED', 'Hostile observation team completely shaken. Safehouse access clear!', 'system')
    }
  },

  // 10. Stethoscope Wall Safe
  safeCrackingState: DEFAULT_SAFE_STATE,
  rotateSafeDial: (delta) => {
    sound.playSafeClick()
    const safe = get().safeCrackingState
    const newDial = (safe.currentDial + delta + 100) % 100
    set({ safeCrackingState: { ...safe, currentDial: newDial } })
  },
  testSafeCombination: () => {
    const safe = get().safeCrackingState
    const targetNumber = safe.targetCombo[safe.crackedSteps]
    const isNear = Math.abs(safe.currentDial - targetNumber) <= 2

    if (isNear) {
      sound.playGadgetSnap()
      const nextStep = safe.crackedSteps + 1
      const isComplete = nextStep === 3
      if (isComplete) {
        sound.playStamp()
        const { agent, revealedClues } = get()
        const updatedAgent = agent ? { ...agent, funds: agent.funds + safe.vaultBearerBonds } : null
        set({
          safeCrackingState: { ...safe, crackedSteps: 3, isCracked: true },
          agent: updatedAgent,
          revealedClues: revealedClues.includes(safe.vaultClassifiedDoc) ? revealedClues : [...revealedClues, safe.vaultClassifiedDoc]
        })
        appendLog(set, get, 'VAULT CRACKED', \`Tumblers aligned! Recovered $\${safe.vaultBearerBonds} in Swiss bearer bonds and Top Secret Syndicate Directive!\`, 'clue')
        return true
      } else {
        set({ safeCrackingState: { ...safe, crackedSteps: nextStep } })
        appendLog(set, get, 'TUMBLER CLICK', \`Stethoscope caught mechanical gate notch! Step \${nextStep} of 3 aligned.\`, 'action')
        return true
      }
    } else {
      sound.playAlarm()
      set({ safeCrackingState: { ...safe, alarmTripped: true }, alertLevel: get().alertLevel + 1 })
      appendLog(set, get, 'TAMPER TRIP', 'Safe dial misaligned! Silent alarm relay activated. Sector alert raised.', 'threat')
      return false
    }
  },

  // 11. Clandestine Chemical Lab
  chemicalCompounds: DEFAULT_CHEMICAL_COMPOUNDS,
  chemicalReagentsCount: 6,
  craftChemicalCompound: (compoundId) => {
    sound.playChemicalDrip()
    const { chemicalCompounds, chemicalReagentsCount, agent } = get()
    const compound = chemicalCompounds.find(c => c.id === compoundId)
    if (!compound || chemicalReagentsCount < compound.costReagents) return

    const updated = chemicalCompounds.map(c => c.id === compoundId ? { ...c, crafted: true } : c)
    const newItem: Item = {
      id: \`item_\${compound.id}\`,
      name: compound.name,
      category: 'gadget',
      description: compound.effect,
      concealability: 'Pocket',
      cost: 0,
      noise: 'Silent'
    }
    const updatedAgent = agent ? { ...agent, inventory: [...agent.inventory, newItem] } : null

    set({
      chemicalCompounds: updated,
      chemicalReagentsCount: chemicalReagentsCount - compound.costReagents,
      agent: updatedAgent
    })
    appendLog(set, get, 'CHEM LAB', \`Synthesized batch of \${compound.name}. Added to operative gear loadout.\`, 'action')
  },

  // 12. Internal Mole Hunt Board
  moleSuspects: DEFAULT_MOLE_SUSPECTS,
  auditMoleSuspect: (suspectId) => {
    sound.playTypewriter()
    const current = get().moleSuspects
    const suspect = current.find(s => s.id === suspectId)
    if (!suspect) return

    appendLog(set, get, \`INTERNAL AUDIT: \${suspect.name.toUpperCase()}\`, \`Intercept proof examined: \${suspect.interceptProof}\`, 'clue')
  },
  accuseStationMole: (suspectId) => {
    const current = get().moleSuspects
    const suspect = current.find(s => s.id === suspectId)
    if (!suspect) return false

    const updated = current.map(s => s.id === suspectId ? { ...s, isFormallyAccused: true } : s)
    if (suspect.isTrueMole) {
      sound.playStamp()
      const { agent, alertLevel } = get()
      const updatedAgent = agent ? { ...agent, funds: agent.funds + 1000 } : null
      set({
        moleSuspects: updated,
        agent: updatedAgent,
        alertLevel: Math.max(1, alertLevel - 2)
      })
      appendLog(set, get, 'TRAITOR EXPOSED', 'Inspector Vance confessed under MI6 arrest! $1000 Directorate award & Syndicate leak line silenced.', 'clue')
      return true
    } else {
      sound.playAlarm()
      set({ moleSuspects: updated, alertLevel: get().alertLevel + 1 })
      appendLog(set, get, 'FALSE ACCUSATION', 'Major Hastings is innocent! Internal station relations damaged. Sector alert raised.', 'threat')
      return false
    }
  },

  // 13. Embassy Gala Social Eavesdropping
  galaGuests: DEFAULT_GALA_GUESTS,
  embassyGalaState: DEFAULT_GALA_STATE,
  eavesdropGalaGuest: (guestId) => {
    sound.playRadioStatic()
    const { galaGuests, embassyGalaState, revealedClues } = get()
    const guest = galaGuests.find(g => g.id === guestId)
    if (!guest) return

    const updatedGuests = galaGuests.map(g => g.id === guestId ? { ...g, eavesdropped: true } : g)
    const newComposure = Math.max(0, embassyGalaState.composure - 10)
    const newSuspicion = Math.min(100, embassyGalaState.suspicion + guest.suspicionRisk)

    set({
      galaGuests: updatedGuests,
      embassyGalaState: {
        ...embassyGalaState,
        composure: newComposure,
        suspicion: newSuspicion,
        secretsExtracted: embassyGalaState.secretsExtracted + 1
      },
      revealedClues: revealedClues.includes(guest.whisperedSecret) ? revealedClues : [...revealedClues, guest.whisperedSecret]
    })
    appendLog(set, get, \`DIRECTIONAL MIC // \${guest.name.toUpperCase()}\`, \`Intercepted whisper: \${guest.whisperedSecret}\`, 'clue')
  },

  // 14. Emergency Border Exfiltration
  exfiltrationRoutes: DEFAULT_EXFIL_ROUTES,
  executeBorderExfiltration: (routeId) => {
    const { exfiltrationRoutes, alertLevel } = get()
    const route = exfiltrationRoutes.find(r => r.id === routeId)
    if (!route) return false

    const adjustedRate = Math.max(20, route.baseSuccessRate - (alertLevel * 8))
    const roll = Math.floor(Math.random() * 100) + 1
    const success = roll <= adjustedRate

    const outcomeText = success
      ? \`SUCCESS (Rolled \${roll} vs \${adjustedRate}%): Operative crossed the demarcation wire safely into the Western Sector!\`
      : \`COMPROMISED (Rolled \${roll} vs \${adjustedRate}%): Border floodlights engaged! Vehicle pursued by border patrol!\`

    const updated = exfiltrationRoutes.map(r => r.id === routeId ? { ...r, isExecuted: true, outcomeNarrative: outcomeText } : r)
    set({ exfiltrationRoutes: updated })

    if (success) {
      sound.playStamp()
      appendLog(set, get, 'EXFILTRATION VICTORY', outcomeText, 'clue')
    } else {
      sound.playAlarm()
      appendLog(set, get, 'BORDER ALARM', outcomeText, 'threat')
      set({ alertLevel: Math.min(5, alertLevel + 2) })
    }
    return success
  },

  // 15. Operative Service Record & Scars
  careerRecords: DEFAULT_CAREER_RECORDS,
  awardCareerRecord: (record) => {
    sound.playStamp()
    const current = get().careerRecords
    set({ careerRecords: [...current, record] })
    appendLog(set, get, 'COMMENDATION / RECORD', \`Added to official dossier: \${record.title}\`, 'system')
  }
}))`;

code = code.replace(storeEndTarget, newImplementations);

fs.writeFileSync(path, code, 'utf8');
console.log('Cleanly applied store update!');
