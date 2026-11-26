import { Item } from '../schemas'

export const COLD_WAR_GADGETS: Item[] = [
  {
    id: 'gad_minox_camera',
    name: 'Minox-B Subminiature Spy Camera',
    category: 'gadget',
    description: 'Ultra-compact 8x11mm film camera with built-in selenium meter. Concealable in palm.',
    concealability: 'Pocket',
    cost: 450,
    noise: 'Silent'
  },
  {
    id: 'gad_lockpick_acid',
    name: 'Nitric Acid Capsule & Syringe',
    category: 'gadget',
    description: 'Corrosive chemical vial that quietly melts brass padlock tumblers and security latch pins.',
    concealability: 'Pocket',
    cost: 300,
    noise: 'Silent'
  },
  {
    id: 'gad_rf_beacon',
    name: 'Shoe-Heel RF Homing Transmitter',
    category: 'gadget',
    description: 'Micro-watt pulsed beacon embedded in dress shoe heel for tracking high-value convoys.',
    concealability: 'Pocket',
    cost: 600,
    noise: 'Silent'
  },
  {
    id: 'gad_fountain_pen_dart',
    name: 'Gold-Plated Pneumatic Dart Pen',
    category: 'gadget',
    description: 'Concealed executive fountain pen firing a succinylcholine micro-dart up to 5 meters.',
    concealability: 'Pocket',
    cost: 850,
    noise: 'Silent',
    baseDamage: 8
  },
  {
    id: 'gad_wiretap_parasite',
    name: 'Inductive Audio Telephone Tap',
    category: 'gadget',
    description: 'Magnetic clamp microphone that intercepts analog copper phone line signals without stripping wire.',
    concealability: 'Pocket',
    cost: 500,
    noise: 'Silent'
  },
  {
    id: 'gad_night_monocular',
    name: 'Starlight Generation-I Night Monocular',
    category: 'gadget',
    description: 'Ambient light intensifier scope providing clear night-ops illumination across open corridors.',
    concealability: 'Coat',
    cost: 1200,
    noise: 'Silent'
  }
]

export const CAMPAIGN_CITIES = [
  {
    id: 'city_vienna',
    name: 'Vienna',
    country: 'Austria',
    x: 48,
    y: 35,
    threatLevel: 2,
    syndicateCell: 'Directorate 84-K Safehouse',
    objective: 'Intercept diplomatic bag exchange at Café Central',
    cleared: true,
    active: true
  },
  {
    id: 'city_berlin',
    name: 'East Berlin',
    country: 'GDR',
    x: 46,
    y: 28,
    threatLevel: 4,
    syndicateCell: 'Stasi Friedrichstraße Sub-Sector',
    objective: 'Retrieve compromised microdot cipher from safe deposit vault',
    cleared: false,
    active: false
  },
  {
    id: 'city_tangier',
    name: 'Tangier',
    country: 'Morocco',
    x: 35,
    y: 48,
    threatLevel: 3,
    syndicateCell: 'The Lattice Syndicate Smugglers',
    objective: 'Track arms convoy departing coastal shipping docks',
    cleared: false,
    active: false
  },
  {
    id: 'city_moscow',
    name: 'Moscow',
    country: 'USSR',
    x: 65,
    y: 22,
    threatLevel: 5,
    syndicateCell: 'CINDER Inner Circle Archive',
    objective: 'Infiltrate Lubyanka communications annex & extract double agent',
    cleared: false,
    active: false
  },
  {
    id: 'city_havana',
    name: 'Havana',
    country: 'Cuba',
    x: 20,
    y: 52,
    threatLevel: 3,
    syndicateCell: 'Grey Choir Listening Post',
    objective: 'Sabotage clandestine submarine relay terminal',
    cleared: false,
    active: false
  }
]
