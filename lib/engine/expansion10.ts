import {
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
} from '../schemas'

export const DEFAULT_DARKROOM_ROLLS: DarkroomRoll[] = [
  {
    id: 'roll_stasi_cables',
    label: 'Canister 04-A // Friedrichstraße Microfilm',
    exposureSeconds: 0,
    stage: 'raw',
    clueRevealed: 'MICRODOT MAGNIFIED: Soviet General Staff Directive confirms secondary weapon shipment arrives at Vienna Südbahnhof Platform 3 at 04:00.',
    isInspected: false
  },
  {
    id: 'roll_vault_schematic',
    label: 'Canister 12-X // Consular Architecture Negative',
    exposureSeconds: 0,
    stage: 'raw',
    clueRevealed: 'BLUEPRINT REVEALED: Secret subterranean ventilation duct bypasses Sector B motion infrared grid directly into the diplomatic archive.',
    isInspected: false
  }
]

export const DEFAULT_COVER_LEGENDS: CoverLegend[] = [
  {
    id: 'legend_swedish_engineer',
    aliasName: 'Carl Lindqvist',
    nationality: 'Swedish (Neutral)',
    occupation: 'Petrochemical Process Consultant',
    visaStamps: ['Austria (1983)', 'GDR Transit (1984)', 'FRG (1984)'],
    suspicionPercent: 12,
    isActive: true,
    isBurned: false
  },
  {
    id: 'legend_swiss_watchmaker',
    aliasName: 'Henri Vane',
    nationality: 'Swiss Confederation',
    occupation: 'Precision Chronometer Importer',
    visaStamps: ['Austria (1982)', 'Switzerland (1984)'],
    suspicionPercent: 5,
    isActive: false,
    isBurned: false
  },
  {
    id: 'legend_french_diplomat',
    aliasName: 'Marcel Dubois',
    nationality: 'French Republic',
    occupation: 'Consular Cultural Attaché Liaison',
    visaStamps: ['France (1981)', 'Austria (1983)', 'Morocco (1984)'],
    suspicionPercent: 28,
    isActive: false,
    isBurned: false
  }
]

export const DEFAULT_DEAD_DROPS: DeadDropSite[] = [
  {
    id: 'drop_opera_brick',
    name: 'Loose Facade Brick Behind Vienna Opera',
    locationDesc: 'Alleyway recess between service loading dock and scenic costume storage.',
    assetContact: 'Asset "CARDINAL" (Ballet stagehand)',
    intelPayload: 'STOLEN CIPHER BOOKLET: Contains Stasi courier frequency list and Sector A guard change times.',
    cashReward: 350,
    status: 'unvisited'
  },
  {
    id: 'drop_park_lion',
    name: 'Hollow Bronze Lion // Stadtpark Bench',
    locationDesc: 'Removable cast-iron paw bolt facing the Johann Strauss golden monument.',
    assetContact: 'Asset "NIGHTINGALE" (Municipal groundskeeper)',
    intelPayload: 'KEYCARD DUPLICATE: Magnetic stripe bypass card for embassy basement records vault.',
    cashReward: 500,
    status: 'unvisited'
  },
  {
    id: 'drop_cemetery_vault',
    name: 'Crypt S-14 Iron Flower Urn // Zentralfriedhof',
    locationDesc: 'Heavy verdigris brass urn chained behind the gravestone of Baron von Seidl.',
    assetContact: 'Asset "GHOST" (Sexton informant)',
    intelPayload: 'SYNDICATE FINANCIAL LEDGER: Documents Swiss bearer account numbers used for bribery.',
    cashReward: 600,
    status: 'unvisited'
  }
]

export const DEFAULT_SURVEILLANCE_TAIL: SurveillanceTail = {
  activeTail: true,
  tailAgency: 'Stasi Abteilung VIII (Observation)',
  threatLevelPercent: 55,
  turnsTracked: 2,
  lastManeuver: null
}

export const DEFAULT_SAFE_STATE: SafeCrackingState = {
  targetCombo: [32, 68, 14],
  currentDial: 0,
  crackedSteps: 0,
  isCracked: false,
  alarmTripped: false,
  vaultBearerBonds: 850,
  vaultClassifiedDoc: 'TOP SECRET SYNDICATE DIRECTIVE: Signed authorization by Soviet Directorate Head ordering total liquidation of compromised field safehouses.'
}

export const DEFAULT_CHEMICAL_COMPOUNDS: ChemicalCompound[] = [
  {
    id: 'chem_truth_serum',
    name: 'Sodium Pentothal Serum (Ultra-Pure)',
    formula: 'C11H17N2NaO2S',
    effect: 'Reduces Polygraph suspect psychological resistance by 35% and speeds confession break.',
    costReagents: 2,
    crafted: false
  },
  {
    id: 'chem_nitric_acid',
    name: 'Fuming Nitric Acid Lock Breaker',
    formula: 'HNO3 (98% conc.)',
    effect: 'Silently melts heavy brass tumbler locks, bypassing door security checks with zero sound.',
    costReagents: 1,
    crafted: false
  },
  {
    id: 'chem_curare_dart',
    name: 'Synthetic Curare Neuro-Dart Solution',
    formula: 'C40H44N4O',
    effect: 'Instantaneous motor paralysis toxin. Grants +25 bonus to ballistic combat non-lethal subdues.',
    costReagents: 2,
    crafted: false
  }
]

export const DEFAULT_MOLE_SUSPECTS: MoleSuspect[] = [
  {
    id: 'mole_hastings',
    name: 'Major Arthur Hastings',
    stationRole: 'Station Deputy Chief of Operations',
    dossierSnippet: '30-year veteran. Recent heavy gambling debts logged at Baden-Baden casino.',
    suspicionScore: 40,
    interceptProof: 'Bank wire showing 50,000 Swiss Francs deposit from unknown Zurich numbered vault.',
    isTrueMole: false,
    isFormallyAccused: false
  },
  {
    id: 'mole_vance',
    name: 'Inspector Julian Vance',
    stationRole: 'Signals & Cryptanalysis Liaison',
    dossierSnippet: 'Holds top cipher clearance. Unscheduled midnight visits to teletype cable room.',
    suspicionScore: 85,
    interceptProof: 'Intercepted Stasi radio dispatch explicitly citing Vance by cipher codename "ALBATROSS".',
    isTrueMole: true,
    isFormallyAccused: false
  },
  {
    id: 'mole_rostova',
    name: 'Elena Rostova',
    stationRole: 'Diplomatic Translator & Case Officer',
    dossierSnippet: 'Defected from Moscow in 1978. Sister still resides in Leningrad under KGB surveillance.',
    suspicionScore: 65,
    interceptProof: 'Forged Austrian exit visa found concealed inside consular dictionary binding.',
    isTrueMole: false,
    isFormallyAccused: false
  },
  {
    id: 'mole_klein',
    name: 'Dieter Klein',
    stationRole: 'Quartermaster & Logistics Officer',
    dossierSnippet: 'Discrepancies in armory ammunition ledgers and untracked Minox film orders.',
    suspicionScore: 30,
    interceptProof: 'Private post-office box in Graz containing civilian surplus contraband.',
    isTrueMole: false,
    isFormallyAccused: false
  }
]

export const DEFAULT_GALA_GUESTS: GalaGuest[] = [
  {
    id: 'guest_kozlov',
    name: 'Valeri Kozlov',
    title: 'First Secretary, Soviet Commercial Mission',
    faction: 'Soviet Trade Delegation',
    whisperedSecret: '"The shipments through Trieste are disguised as agricultural tractors. The manifest is signed by Viktor Rostov."',
    suspicionRisk: 25,
    eavesdropped: false
  },
  {
    id: 'guest_renaud',
    name: 'Colette Renaud',
    title: 'Cultural Attaché, French Embassy',
    faction: 'Western European Diplomatic Corps',
    whisperedSecret: '"The Austrian interior ministry suspects a Stasi wiretap tap in the chandelier of Ballroom B."',
    suspicionRisk: 10,
    eavesdropped: false
  },
  {
    id: 'guest_varga',
    name: 'Anton Varga',
    title: 'Managing Director, Creditanstalt Bank',
    faction: 'Neutral Austrian Banking Consortium',
    whisperedSecret: '"The syndicate bearer bonds have been laundered through a dummy shell company named Alpine Trust."',
    suspicionRisk: 15,
    eavesdropped: false
  }
]

export const DEFAULT_GALA_STATE: EmbassyGalaState = {
  composure: 85,
  suspicion: 15,
  selectedGuestId: 'guest_kozlov',
  secretsExtracted: 0
}

export const DEFAULT_EXFIL_ROUTES: ExfiltrationRoute[] = [
  {
    id: 'exfil_checkpoint_trunk',
    name: 'Checkpoint Charlie Diplomatic Trunk Run',
    borderLocation: 'Friedrichstraße / Sector Wall Crossing',
    description: 'Conceal inside reinforced false bottom of US Consular sedan trunk during shift change.',
    requiredConcealment: 'Requires forged passport & low sector alert (<= 3)',
    baseSuccessRate: 75,
    isExecuted: false,
    outcomeNarrative: null
  },
  {
    id: 'exfil_spree_rebreather',
    name: 'Spree River Underwater Rebreather Route',
    borderLocation: 'East Berlin Canal / Spree Wall Perimeter',
    description: 'Submerged nighttime swim using oxygen rebreather to slip past river patrol boats and searchlights.',
    requiredConcealment: 'Requires silent gear & stealth checks',
    baseSuccessRate: 85,
    isExecuted: false,
    outcomeNarrative: null
  },
  {
    id: 'exfil_glienicke_swap',
    name: 'Glienicke "Bridge of Spies" Pre-Dawn Transfer',
    borderLocation: 'Potsdam / Wannsee Demarcation Line',
    description: 'Official diplomatic swap arranged via backchannel telegram exchanging Stasi courier for operative extraction.',
    requiredConcealment: 'Requires captured suspect or high leverage evidence',
    baseSuccessRate: 90,
    isExecuted: false,
    outcomeNarrative: null
  }
]

export const DEFAULT_CAREER_RECORDS: CareerRecord[] = [
  {
    id: 'rec_medal_white_rose',
    title: 'Order of the White Rose // Meritorious Service',
    type: 'medal',
    citation: 'Conferred for extraordinary courage during clandestine courier extraction in Budapest, 1982.',
    dateAwarded: '1982-11-14',
    statModifier: '+10 Social Infiltration & Composure'
  },
  {
    id: 'rec_scar_shrapnel',
    title: 'Left Clavicle Shrapnel Wound (7.62mm Kalashnikov)',
    type: 'scar',
    citation: 'Sustained during firefight along the Berlin Sector fence. Chronic dull ache in cold climates.',
    dateAwarded: '1983-04-02',
    statModifier: '+5 Intimidation checks, -5 Heavy Lifting'
  },
  {
    id: 'rec_psych_hypervigilance',
    title: 'Conditioned Hyper-Vigilance & Paranoia',
    type: 'neurosis',
    citation: 'Subject demonstrates acute situational awareness and rapid reflex reaction to hostile surveillance.',
    dateAwarded: '1984-01-19',
    statModifier: '+15 Spotting Tails & Counter-Surveillance'
  }
]
