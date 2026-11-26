import { z } from 'zod'

export const AttributeNameSchema = z.enum(['MGT', 'RFX', 'NRV', 'STA', 'INT', 'PER', 'PRS'])
export type AttributeName = z.infer<typeof AttributeNameSchema>

export const AttributesSchema = z.object({
  MGT: z.number().min(15).max(95),
  RFX: z.number().min(15).max(95),
  NRV: z.number().min(15).max(95),
  STA: z.number().min(15).max(95),
  INT: z.number().min(15).max(95),
  PER: z.number().min(15).max(95),
  PRS: z.number().min(15).max(95)
})
export type Attributes = z.infer<typeof AttributesSchema>

export const SkillNameSchema = z.enum([
  'Firearms',
  'Melee',
  'Stealth',
  'Driving',
  'Electronics',
  'Lockpicking',
  'Forgery',
  'Languages',
  'Disguise',
  'Persuasion',
  'Deception',
  'Surveillance',
  'Search',
  'First Aid',
  'Demolitions',
  'Interrogation',
  'Athletics',
  'Computers'
])
export type SkillName = z.infer<typeof SkillNameSchema>

export const DivisionSchema = z.enum([
  'Section F — Field Recovery',
  'Section K — Kinetic Ops',
  'Section S — Signals & Inquiry',
  'Section V — Veil'
])
export type Division = z.infer<typeof DivisionSchema>

export const BackgroundSchema = z.enum([
  'Ex-military',
  'Academic',
  'Journalist',
  'Career criminal',
  "Diplomat's child",
  'Hacker',
  'Athlete',
  'Medic'
])
export type Background = z.infer<typeof BackgroundSchema>

export const HitLocationSchema = z.enum(['head', 'chest', 'abdomen', 'arms', 'legs'])
export type HitLocation = z.infer<typeof HitLocationSchema>

export const WoundStateSchema = z.enum(['Fine', 'Grazed', 'Wounded', 'Critical', 'Down', 'Dead'])
export type WoundState = z.infer<typeof WoundStateSchema>

export const ItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['weapon', 'armor', 'gear', 'document', 'gadget']),
  description: z.string(),
  concealability: z.enum(['Pocket', 'Holster', 'Coat', 'Briefcase', 'Open Carry']),
  cost: z.number().default(0),
  noise: z.enum(['Silent', 'Low', 'Moderate', 'Loud']).default('Silent'),
  baseDamage: z.number().optional(),
  ammo: z.number().optional(),
  maxAmmo: z.number().optional(),
  range: z.enum(['Close', 'Medium', 'Long']).optional(),
  armorPoints: z.number().optional(),
  protects: z.array(HitLocationSchema).optional()
})
export type Item = z.infer<typeof ItemSchema>

export const PortraitConfigSchema = z.object({
  faceShape: z.number().min(0).max(4).default(0),
  skinTone: z.string().default('#E0AC69'),
  hairStyle: z.number().min(0).max(5).default(1),
  hairColor: z.string().default('#2B1A09'),
  glasses: z.boolean().default(false),
  sunglasses: z.boolean().default(false),
  scar: z.boolean().default(false),
  facialHair: z.number().min(0).max(3).default(0),
  clothingStyle: z.enum(['Trench Coat', 'Tuxedo', 'Field Tactical', 'Leather Jacket', 'Diplomatic Suit']).default('Trench Coat'),
  clothingColor: z.string().default('#1A1E24')
})
export type PortraitConfig = z.infer<typeof PortraitConfigSchema>

export const AgentSchema = z.object({
  id: z.string(),
  codename: z.string(),
  realName: z.string(),
  nationality: z.string(),
  age: z.number().min(20).max(65),
  division: DivisionSchema,
  background: BackgroundSchema,
  contact: z.string(),
  attributes: AttributesSchema,
  skills: z.record(SkillNameSchema, z.number().min(0).max(95)),
  maxWP: z.number(),
  currentWP: z.number(),
  maxComposure: z.number(),
  currentComposure: z.number(),
  initiative: z.number(),
  coverIntegrity: z.number().min(0).max(100),
  edgePoints: z.number().min(0).max(3),
  woundState: WoundStateSchema,
  clearanceLevel: z.number().min(1).max(5),
  merit: z.number().min(0),
  funds: z.number().min(0),
  inventory: z.array(ItemSchema),
  portrait: PortraitConfigSchema,
  status: z.enum(['Active', 'MIA', 'KIA', 'Compromised', 'Retired']).default('Active')
})
export type Agent = z.infer<typeof AgentSchema>

export const TestResultSchema = z.object({
  roll: z.number(),
  target: z.number(),
  modifier: z.number(),
  margin: z.number(),
  outcome: z.enum(['CRITICAL', 'SUCCESS', 'FAILURE', 'FUMBLE']),
  actor: z.string(),
  skill: SkillNameSchema,
  reason: z.string()
})
export type TestResult = z.infer<typeof TestResultSchema>

export const NPCSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  faction: z.string(),
  disposition: z.number().min(-3).max(3), // -3 Hostile to +3 Devoted
  secret: z.string(),
  status: z.enum(['Alive', 'Unconscious', 'Neutralized', 'Escaped']).default('Alive'),
  wp: z.number(),
  maxWP: z.number(),
  alertReaction: z.enum(['Flee', 'Sound Alarm', 'Attack', 'Bribe', 'Freeze']),
  weapon: ItemSchema.optional(),
  portrait: PortraitConfigSchema.optional()
})
export type NPC = z.infer<typeof NPCSchema>

export const SceneNodeSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(['briefing', 'approach', 'infiltration', 'social', 'complication', 'climax', 'extraction', 'debrief']),
  venueName: z.string(),
  description: z.string(),
  nextScenes: z.array(z.string()),
  clues: z.array(z.string()),
  npcs: z.array(NPCSchema),
  hazards: z.array(z.string()),
  securityRating: z.number().min(1).max(5)
})
export type SceneNode = z.infer<typeof SceneNodeSchema>

export const MissionBlueprintSchema = z.object({
  id: z.string(),
  codeName: z.string(),
  seed: z.string(),
  clearance: z.number().min(1).max(5),
  era: z.enum(['1980s Cold War', 'Modern Day']),
  objectiveType: z.enum([
    'recover item',
    'extract defector',
    'eliminate/capture target',
    'plant device',
    'expose mole',
    'protect VIP',
    'sabotage',
    'intercept exchange'
  ]),
  city: z.string(),
  country: z.string(),
  venue: z.string(),
  faction: z.string(),
  twist: z.string(),
  briefingText: z.string(),
  scenes: z.array(SceneNodeSchema),
  startSceneId: z.string(),
  extractionSceneId: z.string()
})
export type MissionBlueprint = z.infer<typeof MissionBlueprintSchema>

export const LogEntrySchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  speaker: z.string(), // "HANDLER", "AGENT", NPC name, or "SYSTEM"
  text: z.string(),
  type: z.enum(['narrative', 'dialogue', 'action', 'dice', 'combat', 'system', 'clue', 'alert']),
  testResult: TestResultSchema.optional()
})
export type LogEntry = z.infer<typeof LogEntrySchema>

export const AIPersonaSchema = z.object({
  id: z.string(),
  name: z.string(),
  codename: z.string(),
  role: z.enum(['ally', 'rival', 'mole']),
  division: DivisionSchema,
  personality: z.string(),
  loyalty: z.number().min(0).max(100),
  secretGoal: z.string(),
  agent: AgentSchema
})
export type AIPersona = z.infer<typeof AIPersonaSchema>

export const GamePhaseSchema = z.enum([
  'TITLE',
  'CREATION',
  'BRIEFING',
  'PLAY_EXPLORATION',
  'PLAY_COMBAT',
  'PLAY_CHASE',
  'DEBRIEF',
  'ARCHIVE'
])
export type GamePhase = z.infer<typeof GamePhaseSchema>

export const EngineStateSchema = z.object({
  mission: MissionBlueprintSchema.nullable(),
  currentSceneId: z.string().nullable(),
  alertLevel: z.number().min(0).max(5).default(0),
  chaseProgress: z.number().min(0).max(10).default(5),
  activeCombatRound: z.number().default(0),
  turnCount: z.number().default(0),
  playerAgent: AgentSchema.nullable(),
  allies: z.array(AIPersonaSchema).default([]),
  rivals: z.array(AIPersonaSchema).default([]),
  revealedClues: z.array(z.string()).default([]),
  log: z.array(LogEntrySchema).default([]),
  suggestedActions: z.array(z.string()).default([])
})
export type EngineState = z.infer<typeof EngineStateSchema>

// =========================================================================
// 5 NEW EXPANSION SCHEMAS (§14)
// =========================================================================

export const SigintChannelSchema = z.object({
  id: z.string(),
  name: z.string(),
  frequencyMHz: z.number(),
  waveform: z.enum(['sine', 'pulse', 'sawtooth', 'noise']),
  intelTitle: z.string(),
  intelContent: z.string(),
  isDecrypted: z.boolean().default(false),
  requiredTuningTolerance: z.number().default(0.15)
})
export type SigintChannel = z.infer<typeof SigintChannelSchema>

export const InterrogationTacticSchema = z.enum([
  'Cold Logic',
  'Ideological Pressure',
  'Blackmail Threat',
  'Bribery & Safe Passage',
  'Blunt Intimidation'
])
export type InterrogationTactic = z.infer<typeof InterrogationTacticSchema>

export const InterrogationSubjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  alias: z.string(),
  role: z.string(),
  allegiance: z.string(),
  currentBPM: z.number().default(78),
  stress: z.number().min(0).max(100).default(25),
  composure: z.number().min(0).max(100).default(75),
  breakThreshold: z.number().default(80),
  isBroken: z.boolean().default(false),
  secretRevealed: z.string()
})
export type InterrogationSubject = z.infer<typeof InterrogationSubjectSchema>

export const CampaignCitySchema = z.object({
  id: z.string(),
  name: z.string(),
  country: z.string(),
  x: z.number(), // Percentage on world map (0-100)
  y: z.number(),
  threatLevel: z.number().min(1).max(5),
  syndicateCell: z.string(),
  objective: z.string(),
  cleared: z.boolean().default(false),
  active: z.boolean().default(false)
})
export type CampaignCity = z.infer<typeof CampaignCitySchema>

export const SentryUnitSchema = z.object({
  id: z.string(),
  name: z.string(),
  sectorId: z.string(),
  x: z.number(),
  y: z.number(),
  facingAngle: z.number(), // Degrees
  patrolRoute: z.array(z.object({ x: z.number(), y: z.number() })),
  currentWaypoint: z.number().default(0),
  status: z.enum(['patrolling', 'investigating', 'alerted', 'neutralized']).default('patrolling'),
  awareness: z.number().min(0).max(100).default(0)
})
export type SentryUnit = z.infer<typeof SentryUnitSchema>

// =========================================================================
// TEN EXPANSION SYSTEMS SCHEMAS (§15 Tradecraft Expansion Modules)
// =========================================================================

// 1. Microfilm Darkroom
export const DarkroomRollSchema = z.object({
  id: z.string(),
  label: z.string(),
  exposureSeconds: z.number().default(0),
  stage: z.enum(['raw', 'developer', 'stop_bath', 'fixer', 'developed', 'ruined']).default('raw'),
  clueRevealed: z.string(),
  isInspected: z.boolean().default(false)
})
export type DarkroomRoll = z.infer<typeof DarkroomRollSchema>

// 2. Cover Passport & Legends
export const CoverLegendSchema = z.object({
  id: z.string(),
  aliasName: z.string(),
  nationality: z.string(),
  occupation: z.string(),
  visaStamps: z.array(z.string()),
  suspicionPercent: z.number().min(0).max(100).default(10),
  isActive: z.boolean().default(false),
  isBurned: z.boolean().default(false)
})
export type CoverLegend = z.infer<typeof CoverLegendSchema>

// 3. Dead-Drop & Asset Network
export const DeadDropSiteSchema = z.object({
  id: z.string(),
  name: z.string(),
  locationDesc: z.string(),
  assetContact: z.string(),
  intelPayload: z.string(),
  cashReward: z.number().default(250),
  status: z.enum(['unvisited', 'retrieved', 'sabotage_ordered', 'compromised']).default('unvisited')
})
export type DeadDropSite = z.infer<typeof DeadDropSiteSchema>

// 4. Counter-Surveillance "Dry Cleaning" Tail
export const SurveillanceTailSchema = z.object({
  activeTail: z.boolean().default(true),
  tailAgency: z.string().default('Stasi Greifkommando'),
  threatLevelPercent: z.number().min(0).max(100).default(45),
  turnsTracked: z.number().default(1),
  lastManeuver: z.string().nullable().default(null)
})
export type SurveillanceTail = z.infer<typeof SurveillanceTailSchema>

// 5. Stethoscope Wall Safe
export const SafeCrackingStateSchema = z.object({
  targetCombo: z.tuple([z.number(), z.number(), z.number()]),
  currentDial: z.number().min(0).max(99).default(0),
  crackedSteps: z.number().min(0).max(3).default(0),
  isCracked: z.boolean().default(false),
  alarmTripped: z.boolean().default(false),
  vaultBearerBonds: z.number().default(850),
  vaultClassifiedDoc: z.string()
})
export type SafeCrackingState = z.infer<typeof SafeCrackingStateSchema>

// 6. Clandestine Chemical Lab
export const ChemicalCompoundSchema = z.object({
  id: z.string(),
  name: z.string(),
  formula: z.string(),
  effect: z.string(),
  costReagents: z.number(),
  crafted: z.boolean().default(false)
})
export type ChemicalCompound = z.infer<typeof ChemicalCompoundSchema>

// 7. Internal Mole Hunt Board
export const MoleSuspectSchema = z.object({
  id: z.string(),
  name: z.string(),
  stationRole: z.string(),
  dossierSnippet: z.string(),
  suspicionScore: z.number().min(0).max(100),
  interceptProof: z.string(),
  isTrueMole: z.boolean().default(false),
  isFormallyAccused: z.boolean().default(false)
})
export type MoleSuspect = z.infer<typeof MoleSuspectSchema>

// 8. Embassy Gala Social Eavesdropping
export const GalaGuestSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string(),
  faction: z.string(),
  whisperedSecret: z.string(),
  suspicionRisk: z.number(),
  eavesdropped: z.boolean().default(false)
})
export type GalaGuest = z.infer<typeof GalaGuestSchema>

export const EmbassyGalaStateSchema = z.object({
  composure: z.number().min(0).max(100).default(85),
  suspicion: z.number().min(0).max(100).default(15),
  selectedGuestId: z.string().nullable().default(null),
  secretsExtracted: z.number().default(0)
})
export type EmbassyGalaState = z.infer<typeof EmbassyGalaStateSchema>

// 9. Emergency Border Exfiltration
export const ExfiltrationRouteSchema = z.object({
  id: z.string(),
  name: z.string(),
  borderLocation: z.string(),
  description: z.string(),
  requiredConcealment: z.string(),
  baseSuccessRate: z.number(),
  isExecuted: z.boolean().default(false),
  outcomeNarrative: z.string().nullable().default(null)
})
export type ExfiltrationRoute = z.infer<typeof ExfiltrationRouteSchema>

// 10. Operative Service Record & Scars
export const CareerRecordSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(['medal', 'scar', 'neurosis']),
  citation: z.string(),
  dateAwarded: z.string(),
  statModifier: z.string()
})
export type CareerRecord = z.infer<typeof CareerRecordSchema>
