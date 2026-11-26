import { Agent, AttributeName, SkillName } from '../schemas'
import { calculateDerivedStats } from './attributes'
import { calculateSkillRating, SKILL_GOVERNING_ATTRIBUTE } from './skills'

export function calculateMissionRewards(
  clearance: number,
  outcome: 'success' | 'partial' | 'failure',
  alertLevel: number
): { merit: number; funds: number; clearanceAdvance: boolean } {
  let baseMerit = clearance * 10
  let baseFunds = clearance * 1000

  if (outcome === 'success') {
    // Stealth bonus
    if (alertLevel <= 1) {
      baseMerit += 5
      baseFunds += 500
    }
  } else if (outcome === 'partial') {
    baseMerit = Math.floor(baseMerit * 0.6)
    baseFunds = Math.floor(baseFunds * 0.5)
  } else {
    baseMerit = Math.floor(baseMerit * 0.2)
    baseFunds = 0
  }

  const clearanceAdvance = outcome === 'success' && clearance < 5

  return {
    merit: baseMerit,
    funds: baseFunds,
    clearanceAdvance
  }
}

export function upgradeAttribute(agent: Agent, attr: AttributeName, cost = 15): { success: boolean; agent: Agent; error?: string } {
  if (agent.merit < cost) {
    return { success: false, agent, error: `Insufficient Merit (${agent.merit} < ${cost})` }
  }
  const currentVal = agent.attributes[attr]
  if (currentVal >= 95) {
    return { success: false, agent, error: `${attr} is already at max (95)` }
  }

  const newAttrs = { ...agent.attributes, [attr]: Math.min(95, currentVal + 5) }
  const derived = calculateDerivedStats(newAttrs)

  const updatedAgent: Agent = {
    ...agent,
    merit: agent.merit - cost,
    attributes: newAttrs,
    maxWP: derived.maxWP,
    currentWP: Math.min(derived.maxWP, agent.currentWP),
    maxComposure: derived.maxComposure,
    initiative: derived.initiative
  }

  return { success: true, agent: updatedAgent }
}
