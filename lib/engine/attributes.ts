import { Attributes, AttributeName } from '../schemas'

export const ATTRIBUTE_LIST: AttributeName[] = ['MGT', 'RFX', 'NRV', 'STA', 'INT', 'PER', 'PRS']

export const ATTRIBUTE_NAMES_EXPANDED: Record<AttributeName, string> = {
  MGT: 'Might (Physical Power & Melee)',
  RFX: 'Reflex (Agility, Firearms & Dodging)',
  NRV: 'Nerve (Composure, Interrogation Resistance)',
  STA: 'Stamina (Endurance & Toughness)',
  INT: 'Intellect (Tech, Forgery & Analysis)',
  PER: 'Perception (Surveillance & Intuition)',
  PRS: 'Presence (Disguise, Seduction & Cover)'
}

export function calculateDerivedStats(attrs: Attributes) {
  // Wound Points (WP) = floor((MGT + STA) / 10) + 5
  const maxWP = Math.floor((attrs.MGT + attrs.STA) / 10) + 5
  // Composure = floor((NRV + PRS) / 10)
  const maxComposure = Math.floor((attrs.NRV + attrs.PRS) / 10)
  // Initiative = floor((RFX + PER) / 2)
  const initiative = Math.floor((attrs.RFX + attrs.PER) / 2)

  return {
    maxWP,
    maxComposure,
    initiative,
    coverIntegrity: 100,
    edgePoints: 3
  }
}

export function validatePointBuy(attrs: Attributes, maxPoints = 350): { valid: boolean; total: number; error?: string } {
  const values = Object.values(attrs)
  const total = values.reduce((sum, v) => sum + v, 0)
  for (const [k, v] of Object.entries(attrs)) {
    if (v < 15 || v > 85) {
      return { valid: false, total, error: `${k} must be between 15 and 85 in point-buy` }
    }
  }
  if (total > maxPoints) {
    return { valid: false, total, error: `Total points (${total}) exceeds budget of ${maxPoints}` }
  }
  return { valid: true, total }
}
