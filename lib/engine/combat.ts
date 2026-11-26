import { HitLocation, WoundState, Item } from '../schemas'
import { SeededRNG } from './rng'

export const STANDARD_WEAPONS: Item[] = [
  {
    id: 'wep_walther_ppk',
    name: 'Suppressed .22 Pistol',
    category: 'weapon',
    description: 'Classic compact covert firearm with screw-on baffle suppressor.',
    concealability: 'Pocket',
    cost: 350,
    noise: 'Silent',
    baseDamage: 5,
    ammo: 8,
    maxAmmo: 8,
    range: 'Close'
  },
  {
    id: 'wep_browning_hp',
    name: 'Compact 9mm Pistol',
    category: 'weapon',
    description: 'High-reliability service sidearm with standard 13-round magazine.',
    concealability: 'Holster',
    cost: 450,
    noise: 'Moderate',
    baseDamage: 8,
    ammo: 13,
    maxAmmo: 13,
    range: 'Medium'
  },
  {
    id: 'wep_mp5k',
    name: 'Submachine Carbine 9mm',
    category: 'weapon',
    description: 'Concealable close-quarters automatic carbine with vertical foregrip.',
    concealability: 'Coat',
    cost: 1200,
    noise: 'Loud',
    baseDamage: 12,
    ammo: 30,
    maxAmmo: 30,
    range: 'Medium'
  },
  {
    id: 'wep_combat_knife',
    name: 'Tanto Combat Knife',
    category: 'weapon',
    description: 'Blackened matte steel fixed blade for silent takedowns.',
    concealability: 'Pocket',
    cost: 120,
    noise: 'Silent',
    baseDamage: 6,
    range: 'Close'
  },
  {
    id: 'wep_garrote',
    name: 'Piano Wire Garrote',
    category: 'weapon',
    description: 'Braided steel wire with turned walnut handles.',
    concealability: 'Pocket',
    cost: 80,
    noise: 'Silent',
    baseDamage: 10,
    range: 'Close'
  },
  {
    id: 'wep_tranq_dart',
    name: 'Tranquilliser Dart Pistol',
    category: 'weapon',
    description: 'CO2-propelled sedative dart delivering rapid neuro-paralytic compound.',
    concealability: 'Pocket',
    cost: 600,
    noise: 'Silent',
    baseDamage: 2,
    ammo: 4,
    maxAmmo: 4,
    range: 'Medium'
  }
]

export const STANDARD_ARMOR: Item[] = [
  {
    id: 'arm_concealable_vest',
    name: 'Concealable Kevlar Vest',
    category: 'armor',
    description: 'Under-shirt Type IIA ballistic weave absorbing low-caliber impact.',
    concealability: 'Coat',
    cost: 500,
    noise: 'Silent',
    armorPoints: 4,
    protects: ['chest', 'abdomen']
  },
  {
    id: 'arm_tactical_rig',
    name: 'Tactical Assault Rig',
    category: 'armor',
    description: 'Reinforced ceramic trauma plates for high-threat kinetic operations.',
    concealability: 'Open Carry',
    cost: 1500,
    noise: 'Low',
    armorPoints: 8,
    protects: ['chest', 'abdomen', 'arms']
  }
]

export function determineHitLocation(rng: SeededRNG = new SeededRNG()): HitLocation {
  const roll = rng.rollD10()
  if (roll === 1) return 'head'
  if (roll <= 3) return 'chest'
  if (roll <= 5) return 'abdomen'
  if (roll <= 7) return 'arms'
  return 'legs'
}

export function calculateCombatDamage({
  baseDamage,
  margin,
  isCritical,
  targetArmor = 0,
  hitLocation
}: {
  baseDamage: number
  margin: number
  isCritical: boolean
  targetArmor?: number
  hitLocation: HitLocation
}): { damage: number; effectiveDamage: number; locationMultiplier: number } {
  let locationMultiplier = 1.0
  if (hitLocation === 'head') locationMultiplier = 2.0
  if (hitLocation === 'chest') locationMultiplier = 1.2
  if (hitLocation === 'abdomen') locationMultiplier = 1.0
  if (hitLocation === 'arms' || hitLocation === 'legs') locationMultiplier = 0.8

  // Margin bonus: +1 damage per 10 margin above 0
  const marginBonus = Math.max(0, Math.floor(margin / 10))
  const critMultiplier = isCritical ? 1.5 : 1.0

  const rawDamage = Math.floor((baseDamage + marginBonus) * locationMultiplier * critMultiplier)
  const effectiveDamage = Math.max(1, rawDamage - targetArmor)

  return {
    damage: rawDamage,
    effectiveDamage,
    locationMultiplier
  }
}

export function updateWoundState(currentWP: number, maxWP: number): WoundState {
  if (currentWP <= -maxWP) return 'Dead'
  if (currentWP <= 0) return 'Down'
  const ratio = currentWP / maxWP
  if (ratio <= 0.25) return 'Critical'
  if (ratio <= 0.5) return 'Wounded'
  if (ratio < 1.0) return 'Grazed'
  return 'Fine'
}

export function getWoundModifier(state: WoundState): number {
  switch (state) {
    case 'Fine':
    case 'Grazed':
      return 0
    case 'Wounded':
      return -10
    case 'Critical':
      return -30
    case 'Down':
    case 'Dead':
      return -99
  }
}
