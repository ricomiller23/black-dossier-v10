import { SkillName, AttributeName, Attributes, Division, Background } from '../schemas'

export const SKILL_GOVERNING_ATTRIBUTE: Record<SkillName, AttributeName> = {
  Firearms: 'RFX',
  Melee: 'MGT',
  Stealth: 'RFX',
  Driving: 'RFX',
  Electronics: 'INT',
  Lockpicking: 'RFX',
  Forgery: 'INT',
  Languages: 'INT',
  Disguise: 'PRS',
  Persuasion: 'PRS',
  Deception: 'PRS',
  Surveillance: 'PER',
  Search: 'PER',
  'First Aid': 'INT',
  Demolitions: 'INT',
  Interrogation: 'NRV',
  Athletics: 'MGT',
  Computers: 'INT'
}

export const DIVISION_BONUSES: Record<Division, SkillName[]> = {
  'Section F — Field Recovery': ['Lockpicking', 'Search'],
  'Section K — Kinetic Ops': ['Firearms', 'Melee'],
  'Section S — Signals & Inquiry': ['Electronics', 'Surveillance'],
  'Section V — Veil': ['Disguise', 'Deception']
}

export const BACKGROUND_BONUSES: Record<Background, { skill: SkillName; contact: string }> = {
  'Ex-military': { skill: 'Athletics', contact: 'Quartermaster Sergeant Jack Vance' },
  Academic: { skill: 'Languages', contact: 'Archivist Dr. Elena Rostova' },
  Journalist: { skill: 'Surveillance', contact: 'Senior Editor Arthur Vance' },
  'Career criminal': { skill: 'Lockpicking', contact: 'Black Market Fence "Felix"' },
  "Diplomat's child": { skill: 'Persuasion', contact: 'Embassy Attaché Christian Dubois' },
  Hacker: { skill: 'Computers', contact: 'Underground BBS Sysop "ZeroNull"' },
  Athlete: { skill: 'Athletics', contact: 'Physical Trainer & Smuggler Dario Ramos' },
  Medic: { skill: 'First Aid', contact: 'Underground Field Surgeon Dr. Sarah Lin' }
}

export function calculateSkillRating(skill: SkillName, attrs: Attributes, ranks: number): number {
  const govAttr = SKILL_GOVERNING_ATTRIBUTE[skill]
  const baseAttr = attrs[govAttr]
  // Skill rating = governing attribute / 2 + training ranks * 10 (max 95)
  const rating = Math.floor(baseAttr / 2) + ranks * 10
  return Math.min(95, Math.max(5, rating))
}

export function buildStartingSkills(
  attrs: Attributes,
  division: Division,
  background: Background,
  allocatedRanks: Partial<Record<SkillName, number>> = {}
): Record<SkillName, number> {
  const result: Record<string, number> = {}

  // Base ranks for all skills = 0
  const totalRanks: Record<string, number> = {}
  const allSkills = Object.keys(SKILL_GOVERNING_ATTRIBUTE) as SkillName[]
  for (const s of allSkills) {
    totalRanks[s] = 0
  }

  // 1. Division bonus: +1 rank to 2 skills
  const divBonusSkills = DIVISION_BONUSES[division]
  for (const s of divBonusSkills) {
    totalRanks[s] = (totalRanks[s] || 0) + 1
  }

  // 2. Background bonus: +1 rank to 1 skill
  const bgBonus = BACKGROUND_BONUSES[background]
  totalRanks[bgBonus.skill] = (totalRanks[bgBonus.skill] || 0) + 1

  // 3. User distributed ranks (6 ranks max)
  for (const [s, r] of Object.entries(allocatedRanks)) {
    if (r) {
      totalRanks[s] = (totalRanks[s] || 0) + r
    }
  }

  // Calculate final ratings
  for (const s of allSkills) {
    result[s] = calculateSkillRating(s, attrs, totalRanks[s] || 0)
  }

  return result as Record<SkillName, number>
}
