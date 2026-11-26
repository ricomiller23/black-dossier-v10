import { MissionBlueprint, SceneNode, NPC } from '../schemas'
import { SeededRNG } from '../engine/rng'
import { CITIES_AND_VENUES, FACTIONS, TWISTS } from './tables'
import { STANDARD_WEAPONS } from '../engine/combat'

const OBJECTIVE_TYPES = [
  'recover item',
  'extract defector',
  'eliminate/capture target',
  'plant device',
  'expose mole',
  'protect VIP',
  'sabotage',
  'intercept exchange'
] as const

const CODENAME_PREFIXES = ['OPERATION', 'PROJECT', 'DOSSIER', 'SIGNAL', 'PROTOCOL']
const CODENAME_WORDS = [
  'SILENT BARRICADE',
  'BLACK VELVET',
  'SHADOW LANTERN',
  'IRON CIPHER',
  'AMBER NEEDLE',
  'OBSIDIAN ARCHIVE',
  'NIGHT SKYLINE',
  'COLD HORIZON',
  'COBALT ECHO',
  'PHANTOM WIRE'
]

export function generateMissionBlueprint({
  seed,
  clearance = 1,
  era = '1980s Cold War',
  mode = 'solo'
}: {
  seed: string
  clearance?: number
  era?: '1980s Cold War' | 'Modern Day'
  mode?: 'solo' | 'ally' | 'rival' | 'mole'
  playerDivision?: string
}): MissionBlueprint {
  const rng = new SeededRNG(seed)

  // 1. Pick location
  const locIndex = rng.range(0, CITIES_AND_VENUES.length - 1)
  const location = CITIES_AND_VENUES[locIndex]

  // 2. Pick faction
  const factionIndex = rng.range(0, FACTIONS.length - 1)
  const faction = FACTIONS[factionIndex]

  // 3. Pick objective
  const objIndex = rng.range(0, OBJECTIVE_TYPES.length - 1)
  const objectiveType = OBJECTIVE_TYPES[objIndex]

  // 4. Pick twist
  const twistIndex = rng.range(0, TWISTS.length - 1)
  const twist = TWISTS[twistIndex]

  // 5. Generate codename
  const prefix = CODENAME_PREFIXES[rng.range(0, CODENAME_PREFIXES.length - 1)]
  const name = CODENAME_WORDS[rng.range(0, CODENAME_WORDS.length - 1)]
  const codeName = `${prefix} ${name}`

  // 6. Generate NPCs
  const npcs: NPC[] = [
    {
      id: 'npc_primary_target',
      name: era === '1980s Cold War' ? 'Col. Viktor Malenkov' : 'Director Alexei Vane',
      role: 'Chief Security Overseer',
      faction: faction.name,
      disposition: -2,
      secret: 'Maintains an offshore numbered Swiss account under the cipher name "Acrobat".',
      status: 'Alive',
      wp: 14 + clearance * 2,
      maxWP: 14 + clearance * 2,
      alertReaction: 'Sound Alarm',
      weapon: STANDARD_WEAPONS[1] // Compact 9mm
    },
    {
      id: 'npc_informant',
      name: 'Maria "Siren" Santos',
      role: 'Double Agent & Inside Contact',
      faction: 'Independent / Contract',
      disposition: 1,
      secret: 'Her sister is being detained in an undisclosed black site; she will trade intel for extraction.',
      status: 'Alive',
      wp: 10,
      maxWP: 10,
      alertReaction: 'Freeze',
      weapon: STANDARD_WEAPONS[0] // Suppressed .22
    },
    {
      id: 'npc_guard_lieutenant',
      name: 'Officer Hans Becker',
      role: 'Perimeter Checkpoint Commander',
      faction: faction.name,
      disposition: -1,
      secret: 'Heavy gambler indebted to local syndicate bookmakers.',
      status: 'Alive',
      wp: 12 + clearance,
      maxWP: 12 + clearance,
      alertReaction: 'Attack',
      weapon: STANDARD_WEAPONS[1]
    },
    {
      id: 'npc_technician',
      name: 'Dr. Aris Thorne',
      role: 'Chief Cryptographer / Systems Engineer',
      faction: faction.name,
      disposition: 0,
      secret: 'Planted a dead-man logic bomb in the central mainframe to protect himself.',
      status: 'Alive',
      wp: 8,
      maxWP: 8,
      alertReaction: 'Flee'
    }
  ]

  // 7. Generate Scenes Graph (5-node connected directed graph)
  const scenes: SceneNode[] = [
    {
      id: 'scene_1_approach',
      title: 'Phase I: Outer Perimeter & Infiltration Point',
      type: 'approach',
      venueName: `${location.venue} — Outer Perimeter`,
      description: `Rain slickens the cobblestones outside the ${location.venue}. Security spotlights sweep across the perimeter fencing at regular 45-second intervals. A service entrance lies adjacent to the alleyway dumpsters.`,
      nextScenes: ['scene_2_interior', 'scene_2_social'],
      clues: [
        'Security rotation clipboard notes guard shift changeover occurs at the top of the hour.',
        'High-voltage circuit panel can be bridged using basic electronics gear.'
      ],
      npcs: [npcs[2]], // guard lieutenant
      hazards: ['Infrared motion sensors along main gate', 'K-9 patrol unit on perimeter lawn'],
      securityRating: 2
    },
    {
      id: 'scene_2_interior',
      title: 'Phase II: Mechanical Corridors & Sub-Level Maintenance',
      type: 'infiltration',
      venueName: `${location.venue} — Steam Pipe Gallery`,
      description: `Hissing steam and amber emergency illumination line the reinforced concrete corridor. Heavy steel blast doors divide the secure inner sanctum from the public facilities.`,
      nextScenes: ['scene_3_vault'],
      clues: [
        'Maintenance locker contains an overridden electromagnetic keycard stamped CLEARANCE 3.',
        'HVAC blueprint reveals a crawlspace bypassing the armed biometric checkpoint.'
      ],
      npcs: [npcs[3]], // technician
      hazards: ['Pressurized steam vents', 'Patrolling armed sentries'],
      securityRating: 3
    },
    {
      id: 'scene_2_social',
      title: 'Phase II (Alternate): The Public Floor & VIP Lounge',
      type: 'social',
      venueName: `${location.venue} — Diplomatic Reception Area`,
      description: `Cigarette smoke, clinking crystal glasses, and hushed negotiations fill the opulent ballroom. Armed plainclothes officers eye the attendees from the mezzanine balcony.`,
      nextScenes: ['scene_3_vault'],
      clues: [
        'Cocktail napkin with handwritten six-digit emergency override code: 849-201.',
        'Eavesdropped conversation confirms the primary target is inspecting the secure vault personally.'
      ],
      npcs: [npcs[1]], // inside contact
      hazards: ['Facial recognition cameras', 'Disguise inspection check by head of protocol'],
      securityRating: 3
    },
    {
      id: 'scene_3_vault',
      title: 'Phase III: Inner Sanctum & Core Objective',
      type: 'climax',
      venueName: `${location.venue} — Vault Core`,
      description: `The heart of the facility. Reinforced titanium doors stand half-open as primary telemetry is being transferred. ${npcs[0].name} stands beside the central console flanked by armed bodyguards.`,
      nextScenes: ['scene_4_extraction'],
      clues: [
        'Encrypted microfilm cassette containing the complete syndicate operative roster.',
        'Direct satellite uplink terminal with live transmission feed.'
      ],
      npcs: [npcs[0]], // primary target
      hazards: ['Active automated laser tripwires', 'Emergency lockdown bulkheads closing on timer'],
      securityRating: 4 + clearance
    },
    {
      id: 'scene_4_extraction',
      title: 'Phase IV: Extraction & High-Speed Pursuit',
      type: 'extraction',
      venueName: `${location.venue} — Rooftop Helipad / River Barge Slip`,
      description: `Klaxons blare across the complex. Searchlights converge on your location as enemy pursuit vehicles screech onto the tarmac below. Your extraction transport is 90 seconds out.`,
      nextScenes: [],
      clues: [
        'Radio chatter reveals enemy reinforcements are bottlenecked at the South Bridge.'
      ],
      npcs: [],
      hazards: ['Sniper fire from adjacent water tower', 'Chase vehicle pursuit along wet tarmac'],
      securityRating: 5
    }
  ]

  const briefingText = `CLASSIFIED // EYES ONLY // DISAVOWAL MANDATE
CODE NAME: ${codeName}
LOCATION: ${location.city}, ${location.country} (${location.venue})
TARGET FACTION: ${faction.name}
PRIMARY OBJECTIVE: Execute covert operation to ${objectiveType}.

SITUATION REPORT:
Intelligence assets confirm ${faction.name} has established a secure operations nerve center at the ${location.venue}. 

CONFIDENTIAL COMPLICATION:
${twist}

DIRECTIVE:
Infiltrate the perimeter, secure the asset, and exfiltrate cleanly before local authorities lock down the sector. Any agent captured will be disavowed by the Ministry.`

  return {
    id: `mission_${seed}`,
    codeName,
    seed,
    clearance,
    era,
    objectiveType,
    city: location.city,
    country: location.country,
    venue: location.venue,
    faction: faction.name,
    twist,
    briefingText,
    scenes,
    startSceneId: 'scene_1_approach',
    extractionSceneId: 'scene_4_extraction'
  }
}
