import { create } from 'zustand'
import {
  Agent,
  GamePhase,
  MissionBlueprint,
  SceneNode,
  TestResult,
  LogEntry,
  SkillName,
  HitLocation,
  AIPersona,
  Item,
  SigintChannel,
  InterrogationSubject,
  InterrogationTactic,
  CampaignCity,
  SentryUnit,
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
} from './engine/expansion10'
import { generateMissionBlueprint } from './missions/generator'
import { resolveTest } from './engine/tests'
import { determineHitLocation, calculateCombatDamage, updateWoundState } from './engine/combat'
import { adjustAlertLevel, adjustChaseProgress, downgradeWound } from './engine/minisystems'
import { calculateMissionRewards } from './engine/advancement'
import { COLD_WAR_GADGETS, CAMPAIGN_CITIES } from './engine/gadgets'
import { SeededRNG } from './engine/rng'
import { sound } from './audio'

interface GameState {
  phase: GamePhase
  theme: 'manila' | 'crt_green' | 'crt_amber' | 'night_ops'
  crtEffect: boolean
  filmGrain: boolean
  soundMuted: boolean

  // Player & Mission
  agent: Agent | null
  blueprint: MissionBlueprint | null
  currentScene: SceneNode | null
  alertLevel: number
  chaseProgress: number
  coverIntegrity: number
  revealedClues: string[]
  visitedSceneIds: string[]
  latestActionOutcome: { action: string; result: TestResult; response: string; timestamp: string } | null
  logs: LogEntry[]
  suggestedActions: string[]
  diceResult: TestResult | null
  isRollingDice: boolean
  allies: AIPersona[]
  rivals: AIPersona[]
  missionMode: 'solo' | 'ally' | 'rival' | 'mole'

  // 1. Dynamic Sentries
  sentries: SentryUnit[]

  // 2. SIGINT Decoder
  tunedFrequency: number
  sigintChannels: SigintChannel[]

  // 3. Armory & Gadgets
  availableGadgets: Item[]

  // 4. Polygraph Interrogation
  interrogationSubject: InterrogationSubject | null

  // 5. Global Campaign Atlas
  campaignCities: CampaignCity[]
  activeCityId: string

  // Debrief stats
  lastRewards: { merit: number; funds: number; clearanceAdvance: boolean } | null

  // Core Methods
  boot: () => void
  setPhase: (phase: GamePhase) => void
  setTheme: (theme: 'manila' | 'crt_green' | 'crt_amber' | 'night_ops') => void
  toggleCRT: () => void
  toggleGrain: () => void
  toggleSound: () => void

  startNewAgent: () => void
  saveAgent: (agent: Agent) => void
  launchMission: (seed?: string, era?: '1980s Cold War' | 'Modern Day', mode?: 'solo' | 'ally' | 'rival' | 'mole', city?: string) => void
  moveToScene: (sceneId: string) => void
  submitAction: (actionText: string) => void
  executeSkillCheck: (skill: SkillName, modifier?: number, reason?: string) => TestResult
  useEdgePoint: () => boolean
  applyDamage: (damage: number, location?: HitLocation) => void
  healAgent: (amount: number) => void
  setAlert: (delta: number) => void
  setChase: (delta: number) => void
  finishMission: (outcome: 'success' | 'partial' | 'failure') => void
  exportSaveDossier: () => string
  importSaveDossier: (json: string) => boolean

  // Expansion Feature Actions
  neutralizeSentry: (sentryId: string) => void
  setTunedFrequency: (freq: number) => void
  decryptChannel: (channelId: string) => void
  buyGadget: (gadget: Item) => boolean
  conductInterrogation: (tactic: InterrogationTactic) => { success: boolean; text: string }
  selectCampaignCity: (cityId: string) => void

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
}

const DEFAULT_SIGINT_CHANNELS: SigintChannel[] = [
  {
    id: 'sig_patrol_walkie',
    name: 'Sentry Tactical Walkie-Talkie',
    frequencyMHz: 4.62,
    waveform: 'pulse',
    intelTitle: 'GUARD PATROL ROUTE & VAULT KEYCODE',
    intelContent: 'Intercepted Guard Audio: "Post 3 to Central. Guard rotation delayed. Vault primary bypass sequence is 8-4-9-2. Keep secondary alarm muted until relief arrives."',
    isDecrypted: false,
    requiredTuningTolerance: 0.15
  },
  {
    id: 'sig_numbers_station',
    name: 'Numbers Station G06 / "Lincolnshire Poacher"',
    frequencyMHz: 9.20,
    waveform: 'sine',
    intelTitle: 'DECRYPTED NUMBERS CABLE // DEFECTOR EXTRACTION',
    intelContent: 'Numbers Audio: "5-1-8-3-0 ... 5-1-8-3-0 ... Directive from Berlin: Asset double-agent has cached confidential microdot behind portrait in Mezzanine Salon. Confirm extraction."',
    isDecrypted: false,
    requiredTuningTolerance: 0.12
  },
  {
    id: 'sig_embassy_wiretap',
    name: 'Consular Telephone Wiretap',
    frequencyMHz: 14.85,
    waveform: 'sawtooth',
    intelTitle: 'SYNDICATE HIGH LIAISON CIPHER',
    intelContent: 'Consular Intercept: "Courier has arrived with the black ledger. The Directorate mole has supplied false transit papers. If compromised, initiate protocol Scorched Earth."',
    isDecrypted: false,
    requiredTuningTolerance: 0.15
  }
]

const DEFAULT_SENTRIES: SentryUnit[] = [
  {
    id: 'sentry_1',
    name: 'Sector B-1 Patrolling Guard',
    sectorId: 'scene_2_interior',
    x: 430,
    y: 330,
    facingAngle: 180,
    patrolRoute: [
      { x: 340, y: 330 },
      { x: 500, y: 330 }
    ],
    currentWaypoint: 0,
    status: 'patrolling',
    awareness: 0
  },
  {
    id: 'sentry_2',
    name: 'Sector C Vault Sentry',
    sectorId: 'scene_3_vault',
    x: 670,
    y: 230,
    facingAngle: 270,
    patrolRoute: [
      { x: 670, y: 190 },
      { x: 670, y: 280 }
    ],
    currentWaypoint: 0,
    status: 'patrolling',
    awareness: 0
  }
]


function appendLog(set: any, get: any, speaker: string, text: string, type: 'action' | 'system' | 'clue' | 'dialogue' | 'alert' = 'system') {
  const { logs } = get()
  const log: LogEntry = {
    id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toLocaleTimeString(),
    speaker,
    text,
    type
  }
  set({ logs: [...logs, log] })
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'TITLE',
  theme: 'manila',
  crtEffect: true,
  filmGrain: true,
  soundMuted: false,

  agent: null,
  blueprint: null,
  currentScene: null,
  alertLevel: 0,
  chaseProgress: 5,
  coverIntegrity: 100,
  revealedClues: [],
  visitedSceneIds: [],
  latestActionOutcome: null,
  logs: [],
  suggestedActions: [],
  diceResult: null,
  isRollingDice: false,
  allies: [],
  rivals: [],
  missionMode: 'solo',
  lastRewards: null,

  // 1. Sentries
  sentries: DEFAULT_SENTRIES,

  // 2. SIGINT
  tunedFrequency: 7.00,
  sigintChannels: DEFAULT_SIGINT_CHANNELS,

  // 3. Armory
  availableGadgets: COLD_WAR_GADGETS,

  // 4. Interrogation
  interrogationSubject: {
    id: 'subj_rostov',
    name: 'Victor Rostov',
    alias: 'GREY FOX',
    role: 'CINDER Operations Commander',
    allegiance: 'Syndicate High Command',
    currentBPM: 76,
    stress: 20,
    composure: 80,
    breakThreshold: 85,
    isBroken: false,
    secretRevealed: 'CONFESSION EXTRACTED: "The syndicate mainframe is hardwired to the Vienna telephone exchange. The double agent inside your Directorate is code-named RAVEN."'
  },

  // 5. Campaign Atlas
  campaignCities: CAMPAIGN_CITIES as CampaignCity[],
  activeCityId: 'city_vienna',

  boot: () => {
    if (typeof window === 'undefined') return
    const savedAgent = localStorage.getItem('black_dossier_agent')
    const savedMuted = localStorage.getItem('black_dossier_muted') === 'true'
    if (savedAgent) {
      try {
        set({ agent: JSON.parse(savedAgent), soundMuted: savedMuted })
      } catch (e) {
        console.error('Failed to parse saved agent', e)
      }
    }
  },

  setPhase: (phase) => set({ phase }),
  setTheme: (theme) => set({ theme }),
  toggleCRT: () => set((s) => ({ crtEffect: !s.crtEffect })),
  toggleGrain: () => set((s) => ({ filmGrain: !s.filmGrain })),
  toggleSound: () => {
    const isMuted = sound.toggleMute()
    set({ soundMuted: isMuted })
  },

  startNewAgent: () => {
    sound.playTypewriter()
    set({ phase: 'CREATION' })
  },

  saveAgent: (agent) => {
    sound.playStamp()
    if (typeof window !== 'undefined') {
      localStorage.setItem('black_dossier_agent', JSON.stringify(agent))
    }
    set({ agent, phase: 'TITLE' })
  },

  launchMission: (seed, era = '1980s Cold War', mode = 'solo', city) => {
    const s = seed || Math.random().toString(36).substring(2, 9)
    const agent = get().agent
    const clearance = agent?.clearanceLevel || 1
    const blueprint = generateMissionBlueprint({
      seed: s,
      clearance,
      era,
      mode
    })

    if (city) {
      blueprint.city = city
    }

    const startScene = blueprint.scenes.find((sc) => sc.id === blueprint.startSceneId) || blueprint.scenes[0]

    sound.playStamp()

    const initialLog: LogEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      speaker: 'HANDLER',
      text: blueprint.briefingText,
      type: 'narrative'
    }

    set({
      blueprint,
      currentScene: startScene,
      phase: 'BRIEFING',
      alertLevel: 0,
      chaseProgress: 5,
      coverIntegrity: 100,
      revealedClues: [],
      visitedSceneIds: [startScene.id],
      latestActionOutcome: null,
      logs: [initialLog],
      missionMode: mode,
      sentries: DEFAULT_SENTRIES.map(s => ({ ...s, status: 'patrolling' })),
      sigintChannels: DEFAULT_SIGINT_CHANNELS.map(c => ({ ...c, isDecrypted: false })),
      suggestedActions: [
        'Inspect outer security perimeter with night optics',
        'Attempt to compromise service entrance lock',
        'Radio inside informant for distraction'
      ]
    })
  },

  moveToScene: (sceneId) => {
    const { blueprint, logs, visitedSceneIds, sentries, alertLevel } = get()
    if (!blueprint) return
    const next = blueprint.scenes.find((s) => s.id === sceneId)
    if (!next) return

    sound.playRadarPing()

    // Sentry Detection Check: Check if an active sentry is in destination room
    const hostilesInRoom = sentries.filter(s => s.sectorId === sceneId && s.status === 'patrolling')
    let addedAlert = 0
    let hostileWarning = ''

    if (hostilesInRoom.length > 0) {
      addedAlert = 1
      sound.playAlarm()
      hostileWarning = `\n[TACTICAL ALERT: Active sentry detected in ${next.venueName.toUpperCase()}! Flashlight cone sweeping corridor.]`
    }

    const sceneLog: LogEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      speaker: 'HANDLER',
      text: `TRANSITION TO ${next.title.toUpperCase()}\n${next.description}${hostileWarning}`,
      type: 'narrative'
    }

    const suggestions = next.type === 'extraction'
      ? ['Signal extraction vehicle', 'Lay suppressive fire against pursuers', 'Deploy smoke grenade canister']
      : next.type === 'climax'
      ? ['Confront primary target directly', 'Override central security console', 'Rig timed explosive charge']
      : hostilesInRoom.length > 0
      ? ['Execute silent takedown on patrolling sentry', 'Conceal in shadows behind steam pipes', 'Toss distraction coin into far corner']
      : ['Search for surveillance clues', 'Conceal behind cover', 'Initiate quiet radio relay']

    set({
      currentScene: next,
      alertLevel: Math.min(5, alertLevel + addedAlert),
      visitedSceneIds: [...new Set([...visitedSceneIds, sceneId])],
      logs: [...logs, sceneLog],
      suggestedActions: suggestions
    })
  },

  submitAction: (actionText) => {
    const { logs, currentScene, agent } = get()
    sound.playTypewriter()

    const playerLog: LogEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      speaker: agent?.codename || 'AGENT',
      text: actionText,
      type: 'action'
    }

    // Determine heuristic skill
    let skillToCheck: SkillName = 'Search'
    const lower = actionText.toLowerCase()
    if (lower.includes('shoot') || lower.includes('fire') || lower.includes('aim') || lower.includes('draw weapon')) {
      skillToCheck = 'Firearms'
    } else if (lower.includes('sneak') || lower.includes('hide') || lower.includes('shadow') || lower.includes('quiet') || lower.includes('takedown')) {
      skillToCheck = 'Stealth'
    } else if (lower.includes('lock') || lower.includes('pick') || lower.includes('bypass') || lower.includes('door') || lower.includes('acid')) {
      skillToCheck = 'Lockpicking'
    } else if (lower.includes('hack') || lower.includes('terminal') || lower.includes('code') || lower.includes('data') || lower.includes('sigint')) {
      skillToCheck = 'Computers'
    } else if (lower.includes('talk') || lower.includes('convince') || lower.includes('bribe') || lower.includes('persuade')) {
      skillToCheck = 'Persuasion'
    } else if (lower.includes('fight') || lower.includes('knife') || lower.includes('strike') || lower.includes('melee')) {
      skillToCheck = 'Melee'
    }

    // Execute test
    const result = get().executeSkillCheck(skillToCheck, 0, actionText)

    // Generate narrative response based on outcome
    let handlerResponse = ''
    if (result.outcome === 'CRITICAL') {
      sound.playStamp()
      handlerResponse = `CRITICAL EXECUTION: Your instincts are flawless. You execute "${actionText}" with clinical precision (+${result.margin} margin). Target defense dissolves instantly.`
    } else if (result.outcome === 'SUCCESS') {
      handlerResponse = `SUCCESS: The maneuver succeeds cleanly (+${result.margin} margin). You secure the tactical advantage without alerting the sector.`
    } else if (result.outcome === 'FUMBLE') {
      sound.playAlarm()
      get().setAlert(2)
      handlerResponse = `CATASTROPHIC FUMBLE: Critical blunder (${result.roll})! Equipment malfunction or security alert tripped! Sector alert level escalates immediately.`
    } else {
      handlerResponse = `FAILED ATTEMPT: The action fails to yield the intended outcome (${result.roll} vs ${result.target}). Local hostiles are suspicious.`
      get().setAlert(1)
    }

    const handlerLog: LogEntry = {
      id: `log_${Date.now() + 1}`,
      timestamp: new Date().toLocaleTimeString(),
      speaker: 'HANDLER',
      text: handlerResponse,
      type: 'narrative',
      testResult: result
    }

    // Check if new clues unlocked in current scene
    const currentClues = currentScene?.clues || []
    const newRevealed = [...get().revealedClues]
    if (result.outcome === 'SUCCESS' || result.outcome === 'CRITICAL') {
      for (const clue of currentClues) {
        if (!newRevealed.includes(clue)) {
          newRevealed.push(clue)
        }
      }
    }

    set({
      logs: [...logs, playerLog, handlerLog],
      revealedClues: newRevealed,
      latestActionOutcome: {
        action: actionText,
        result,
        response: handlerResponse,
        timestamp: new Date().toLocaleTimeString()
      }
    })
  },

  executeSkillCheck: (skill, modifier = 0, reason = 'Direct tactical action') => {
    const { agent } = get()
    sound.playDiceRoll()

    const rating = agent?.skills[skill] || 50
    const test = resolveTest({
      actor: agent?.codename || 'AGENT',
      skill,
      skillRating: rating,
      modifier,
      reason
    })

    set({ diceResult: test, isRollingDice: true })
    setTimeout(() => {
      set({ isRollingDice: false })
    }, 1200)

    return test
  },

  useEdgePoint: () => {
    const { agent, diceResult } = get()
    if (!agent || agent.edgePoints <= 0) return false

    sound.playStamp()
    const updatedAgent: Agent = {
      ...agent,
      edgePoints: agent.edgePoints - 1
    }

    if (diceResult && (diceResult.outcome === 'FAILURE' || diceResult.outcome === 'FUMBLE')) {
      const reTest = get().executeSkillCheck(diceResult.skill, diceResult.modifier, 'Edge Point Reroll')
      set({ agent: updatedAgent, diceResult: reTest })
      return true
    } else {
      const downgraded = downgradeWound(agent.woundState)
      set({
        agent: {
          ...updatedAgent,
          woundState: downgraded
        }
      })
      return true
    }
  },

  applyDamage: (damage, location) => {
    const { agent } = get()
    if (!agent) return

    sound.playSilencedShot()
    const hitLoc = location || determineHitLocation()
    const calc = calculateCombatDamage({
      baseDamage: damage,
      margin: 10,
      isCritical: false,
      hitLocation: hitLoc
    })

    const newWP = agent.currentWP - calc.effectiveDamage
    const newWound = updateWoundState(newWP, agent.maxWP)

    const updatedAgent: Agent = {
      ...agent,
      currentWP: newWP,
      woundState: newWound
    }

    set({ agent: updatedAgent })

    if (newWound === 'Down' || newWound === 'Dead') {
      get().finishMission('failure')
    }
  },

  healAgent: (amount) => {
    const { agent } = get()
    if (!agent) return
    const newWP = Math.min(agent.maxWP, agent.currentWP + amount)
    const newWound = updateWoundState(newWP, agent.maxWP)
    set({
      agent: {
        ...agent,
        currentWP: newWP,
        woundState: newWound
      }
    })
  },

  setAlert: (delta) => {
    const current = get().alertLevel
    const updated = adjustAlertLevel(current, delta)
    if (updated >= 3 && current < 3) {
      sound.playAlarm()
    }
    set({ alertLevel: updated })
  },

  setChase: (delta) => {
    const current = get().chaseProgress
    const updated = adjustChaseProgress(current, delta)
    set({ chaseProgress: updated })
  },

  finishMission: (outcome) => {
    const { blueprint, alertLevel, agent } = get()
    const clearance = blueprint?.clearance || 1
    const rewards = calculateMissionRewards(clearance, outcome, alertLevel)

    sound.playStamp()

    let updatedAgent = agent
    if (agent) {
      updatedAgent = {
        ...agent,
        merit: agent.merit + rewards.merit,
        funds: agent.funds + rewards.funds,
        clearanceLevel: rewards.clearanceAdvance ? Math.min(5, agent.clearanceLevel + 1) : agent.clearanceLevel
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('black_dossier_agent', JSON.stringify(updatedAgent))
      }
    }

    set({
      agent: updatedAgent,
      phase: 'DEBRIEF',
      lastRewards: rewards
    })
  },

  exportSaveDossier: () => {
    const state = get()
    const data = {
      agent: state.agent,
      theme: state.theme,
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    }
    return JSON.stringify(data, null, 2)
  },

  importSaveDossier: (json) => {
    try {
      const parsed = JSON.parse(json)
      if (parsed.agent) {
        sound.playStamp()
        set({ agent: parsed.agent })
        if (typeof window !== 'undefined') {
          localStorage.setItem('black_dossier_agent', JSON.stringify(parsed.agent))
        }
        return true
      }
    } catch (e) {
      console.error('Invalid save dossier', e)
    }
    return false
  },

  // 1. Sentry Neutralization Action
  neutralizeSentry: (sentryId) => {
    const { sentries, logs } = get()
    sound.playSilencedShot()
    const updated = sentries.map(s => s.id === sentryId ? { ...s, status: 'neutralized' as const } : s)
    const log: LogEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      speaker: 'SYSTEM',
      text: `TACTICAL TAKEDOWN: Sentry neutralized with silent takedown. Corridor secured.`,
      type: 'action'
    }
    set({ sentries: updated, logs: [...logs, log] })
  },

  // 2. SIGINT Actions
  setTunedFrequency: (freq) => {
    sound.playRadioStatic()
    set({ tunedFrequency: freq })
  },

  decryptChannel: (channelId) => {
    const { sigintChannels, revealedClues, logs } = get()
    sound.playMorseBeep(850, 0.15)
    setTimeout(() => sound.playMorseBeep(650, 0.1), 180)
    setTimeout(() => sound.playMorseBeep(950, 0.2), 320)

    const ch = sigintChannels.find(c => c.id === channelId)
    if (!ch) return

    const updatedChannels = sigintChannels.map(c => c.id === channelId ? { ...c, isDecrypted: true } : c)
    const newClues = revealedClues.includes(ch.intelContent) ? revealedClues : [...revealedClues, ch.intelContent]

    const interceptLog: LogEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      speaker: 'SIGINT DECRYPTOR',
      text: `[SIGNAL LOCKED: ${ch.frequencyMHz} MHz] — ${ch.intelTitle}\n${ch.intelContent}`,
      type: 'clue'
    }

    set({
      sigintChannels: updatedChannels,
      revealedClues: newClues,
      logs: [...logs, interceptLog],
      alertLevel: Math.max(0, get().alertLevel - 1) // Signal intel reduces alert!
    })
  },

  // 3. Armory Gadget Purchase & Equip
  buyGadget: (gadget) => {
    const { agent, logs } = get()
    if (!agent) return false
    if (agent.funds < gadget.cost) return false

    sound.playGadgetSnap()
    const updatedAgent: Agent = {
      ...agent,
      funds: agent.funds - gadget.cost,
      inventory: [...agent.inventory, gadget]
    }

    const buyLog: LogEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      speaker: 'QUARTERMASTER',
      text: `ATTACHÉ REQUISITION: ${gadget.name} slotted into field briefcase. (-$${gadget.cost})`,
      type: 'system'
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('black_dossier_agent', JSON.stringify(updatedAgent))
    }

    set({ agent: updatedAgent, logs: [...logs, buyLog] })
    return true
  },

  // 4. Polygraph Interrogation Confrontation
  conductInterrogation: (tactic) => {
    const { interrogationSubject, logs, revealedClues } = get()
    if (!interrogationSubject) return { success: false, text: 'No subject in interrogation chair.' }

    sound.playHeartbeat()
    setTimeout(() => sound.playHeartbeat(), 250)

    let stressDelta = 15
    let responseText = ''

    if (tactic === 'Cold Logic') {
      stressDelta = 18
      responseText = `Rostov shifts uncomfortably. His heart rate climbs to ${interrogationSubject.currentBPM + 14} BPM. "Your legal claims mean nothing in neutral territory, agent."`
    } else if (tactic === 'Ideological Pressure') {
      stressDelta = 22
      responseText = `The needle jerks violently on the drum. "You think your Directorate is any cleaner? We all serve the same masters!"`
    } else if (tactic === 'Blackmail Threat') {
      stressDelta = 28
      responseText = `Rostov turns pale. Polygraph Galvanic needle spikes off the chart. "How... how do you have those Swiss bank ledger numbers?!"`
    } else if (tactic === 'Bribery & Safe Passage') {
      stressDelta = 12
      responseText = `Rostov looks at the door. Heart rate stabilizes briefly. "If I talk, my family in Dresden needs a Western extraction window."`
    } else {
      stressDelta = 32
      responseText = `Rostov slams his palms on the steel table. The heart monitor alarms at 155 BPM! "Do your worst! You will find nothing in the vault!"`
    }

    const newStress = Math.min(100, interrogationSubject.stress + stressDelta)
    const newComposure = Math.max(0, interrogationSubject.composure - Math.floor(stressDelta * 0.8))
    const isNowBroken = newStress >= interrogationSubject.breakThreshold

    let updatedSubject: InterrogationSubject = {
      ...interrogationSubject,
      currentBPM: Math.min(170, interrogationSubject.currentBPM + Math.floor(stressDelta * 0.7)),
      stress: newStress,
      composure: newComposure,
      isBroken: isNowBroken
    }

    if (isNowBroken && !interrogationSubject.isBroken) {
      sound.playStamp()
      responseText += `\n\n[SUBJECT BREAKS UNDER PRESSURE]: ${interrogationSubject.secretRevealed}`
      if (!revealedClues.includes(interrogationSubject.secretRevealed)) {
        set({ revealedClues: [...revealedClues, interrogationSubject.secretRevealed] })
      }
    }

    const dialogueLog: LogEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      speaker: 'INTERROGATION CONSOLE',
      text: `[TACTIC: ${tactic.toUpperCase()}] (Polygraph Stress: ${newStress}%)\n${responseText}`,
      type: 'dialogue'
    }

    set({ interrogationSubject: updatedSubject, logs: [...logs, dialogueLog] })
    return { success: true, text: responseText }
  },

  // 5. Global Campaign City Selection
  selectCampaignCity: (cityId) => {
    const { campaignCities } = get()
    sound.playRadarPing()
    const city = campaignCities.find(c => c.id === cityId)
    if (!city) return

    set({ activeCityId: cityId })
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
    appendLog(set, get, 'DARKROOM LAB', `Advanced film canister to ${roll?.stage.toUpperCase()} chemical bath.`, 'action')
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
    appendLog(set, get, 'FORENSIC LOUPE', `35mm negative magnified: ${target.clueRevealed}`, 'clue')
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
      appendLog(set, get, 'PASSPORT CONTROL', `Cover legend assumed: ${active.aliasName} (${active.nationality}, ${active.occupation}).`, 'system')
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
    appendLog(set, get, 'CONSULAR STAMP', `Validated border entry visa for ${visaCountry}. Cover suspicion dropped.`, 'system')
  },
  burnCoverLegend: (legendId) => {
    sound.playAlarm()
    const current = get().coverLegends
    const updated = current.map(l => l.id === legendId ? { ...l, isBurned: true, isActive: false } : l)
    const fallback = updated.find(l => !l.isBurned)
    if (fallback) fallback.isActive = true
    set({ coverLegends: updated, alertLevel: get().alertLevel + 1 })
    appendLog(set, get, 'SECURITY BREACH', 'Cover legend permanently BURNED. Emergency alias assumed. Sector alert increased.', 'alert')
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
    appendLog(set, get, 'DEAD-DROP RETRIEVED', `Recovered ${target.cashReward} operational funds & intel from ${target.name}.`, 'clue')
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
    appendLog(set, get, 'COUNTER-SURVEILLANCE', `${desc} (Tail Threat: ${newThreat}%)`, 'action')
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
        appendLog(set, get, 'VAULT CRACKED', `Tumblers aligned! Recovered ${safe.vaultBearerBonds} in Swiss bearer bonds and Top Secret Syndicate Directive!`, 'clue')
        return true
      } else {
        set({ safeCrackingState: { ...safe, crackedSteps: nextStep } })
        appendLog(set, get, 'TUMBLER CLICK', `Stethoscope caught mechanical gate notch! Step ${nextStep} of 3 aligned.`, 'action')
        return true
      }
    } else {
      sound.playAlarm()
      set({ safeCrackingState: { ...safe, alarmTripped: true }, alertLevel: get().alertLevel + 1 })
      appendLog(set, get, 'TAMPER TRIP', 'Safe dial misaligned! Silent alarm relay activated. Sector alert raised.', 'alert')
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
      id: `item_${compound.id}`,
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
    appendLog(set, get, 'CHEM LAB', `Synthesized batch of ${compound.name}. Added to operative gear loadout.`, 'action')
  },

  // 12. Internal Mole Hunt Board
  moleSuspects: DEFAULT_MOLE_SUSPECTS,
  auditMoleSuspect: (suspectId) => {
    sound.playTypewriter()
    const current = get().moleSuspects
    const suspect = current.find(s => s.id === suspectId)
    if (!suspect) return

    appendLog(set, get, `INTERNAL AUDIT: ${suspect.name.toUpperCase()}`, `Intercept proof examined: ${suspect.interceptProof}`, 'clue')
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
      appendLog(set, get, 'FALSE ACCUSATION', 'Major Hastings is innocent! Internal station relations damaged. Sector alert raised.', 'alert')
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
    appendLog(set, get, `DIRECTIONAL MIC // ${guest.name.toUpperCase()}`, `Intercepted whisper: ${guest.whisperedSecret}`, 'clue')
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
      ? `SUCCESS (Rolled ${roll} vs ${adjustedRate}%): Operative crossed the demarcation wire safely into the Western Sector!`
      : `COMPROMISED (Rolled ${roll} vs ${adjustedRate}%): Border floodlights engaged! Vehicle pursued by border patrol!`

    const updated = exfiltrationRoutes.map(r => r.id === routeId ? { ...r, isExecuted: true, outcomeNarrative: outcomeText } : r)
    set({ exfiltrationRoutes: updated })

    if (success) {
      sound.playStamp()
      appendLog(set, get, 'EXFILTRATION VICTORY', outcomeText, 'clue')
    } else {
      sound.playAlarm()
      appendLog(set, get, 'BORDER ALARM', outcomeText, 'alert')
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
    appendLog(set, get, 'COMMENDATION / RECORD', `Added to official dossier: ${record.title}`, 'system')
  }
}))
