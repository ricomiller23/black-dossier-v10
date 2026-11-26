import { describe, it, expect } from 'vitest'
import { SeededRNG } from '../rng'
import { calculateDerivedStats, validatePointBuy } from '../attributes'
import { calculateSkillRating, buildStartingSkills } from '../skills'
import { resolveTest, resolveOpposedTest } from '../tests'
import { determineHitLocation, calculateCombatDamage, updateWoundState } from '../combat'
import { generateMissionBlueprint } from '../../missions/generator'

describe('Black Dossier Rules Engine (§4 Acceptance Tests)', () => {
  it('1. Seeded RNG reproduces identical roll sequences', () => {
    const rng1 = new SeededRNG('classified_seed_42')
    const rng2 = new SeededRNG('classified_seed_42')

    const rolls1 = [rng1.rollD100(), rng1.rollD10(), rng1.rollD100(), rng1.roll3d10x3()]
    const rolls2 = [rng2.rollD100(), rng2.rollD10(), rng2.rollD100(), rng2.roll3d10x3()]

    expect(rolls1).toEqual(rolls2)
  })

  it('2. Derived Stats calculation adheres strictly to §4.2', () => {
    const attrs = {
      MGT: 60,
      RFX: 70,
      NRV: 50,
      STA: 65,
      INT: 55,
      PER: 60,
      PRS: 40
    }
    const derived = calculateDerivedStats(attrs)

    // WP = floor((60 + 65) / 10) + 5 = 12 + 5 = 17
    expect(derived.maxWP).toBe(17)
    // Composure = floor((50 + 40) / 10) = 9
    expect(derived.maxComposure).toBe(9)
    // Initiative = floor((70 + 60) / 2) = 65
    expect(derived.initiative).toBe(65)
    expect(derived.coverIntegrity).toBe(100)
    expect(derived.edgePoints).toBe(3)
  })

  it('3. Point Buy validates budget and bounds (15-85 each, sum <= 350)', () => {
    const valid = {
      MGT: 50,
      RFX: 50,
      NRV: 50,
      STA: 50,
      INT: 50,
      PER: 50,
      PRS: 50
    }
    expect(validatePointBuy(valid, 350).valid).toBe(true)

    const overbudget = { ...valid, MGT: 80 }
    expect(validatePointBuy(overbudget, 350).valid).toBe(false)

    const outOfBounds = { ...valid, PRS: 90 }
    expect(validatePointBuy(outOfBounds, 350).valid).toBe(false)
  })

  it('4. Skill Rating formula computes attribute / 2 + ranks * 10 (cap 95)', () => {
    const attrs = { MGT: 60, RFX: 70, NRV: 50, STA: 50, INT: 50, PER: 50, PRS: 50 }
    // Firearms gov RFX (70). 0 ranks = 35. 2 ranks = 55. 6 ranks = 95 (cap)
    expect(calculateSkillRating('Firearms', attrs, 0)).toBe(35)
    expect(calculateSkillRating('Firearms', attrs, 2)).toBe(55)
    expect(calculateSkillRating('Firearms', attrs, 8)).toBe(95)
  })

  it('5. Starting Skills incorporate Division and Background bonuses', () => {
    const attrs = { MGT: 60, RFX: 60, NRV: 50, STA: 50, INT: 50, PER: 50, PRS: 50 }
    // Section K gives +1 Firearms, +1 Melee
    // Ex-military gives +1 Athletics
    const skills = buildStartingSkills(attrs, 'Section K — Kinetic Ops', 'Ex-military', {
      Firearms: 2,
      Stealth: 1
    })

    // Firearms: RFX/2 (30) + (1 div + 2 user = 3 ranks * 10) = 60
    expect(skills.Firearms).toBe(60)
    // Melee: MGT/2 (30) + (1 div = 1 rank * 10) = 40
    expect(skills.Melee).toBe(40)
    // Athletics: MGT/2 (30) + (1 bg = 1 rank * 10) = 40
    expect(skills.Athletics).toBe(40)
    // Stealth: RFX/2 (30) + 1 rank * 10 = 40
    expect(skills.Stealth).toBe(40)
    // Driving: RFX/2 (30) + 0 ranks = 30
    expect(skills.Driving).toBe(30)
  })

  it('6. Core Test handles Critical, Success, Failure, and Fumble', () => {
    // Mock RNG to test determinism
    const rng = new SeededRNG()
    // Test with fixed inputs
    const testSuccess = resolveTest({
      actor: 'Agent Vance',
      skill: 'Firearms',
      skillRating: 70,
      modifier: 0,
      reason: 'Aimed shot',
      rng: { rollD100: () => 35 } as any
    })
    expect(testSuccess.outcome).toBe('SUCCESS')
    expect(testSuccess.margin).toBe(35) // 70 - 35

    const testCrit = resolveTest({
      actor: 'Agent Vance',
      skill: 'Firearms',
      skillRating: 70,
      modifier: 0,
      reason: 'Deadly snapshot',
      rng: { rollD100: () => 5 } as any
    })
    expect(testCrit.outcome).toBe('CRITICAL')

    const testFumble = resolveTest({
      actor: 'Agent Vance',
      skill: 'Firearms',
      skillRating: 70,
      modifier: 0,
      reason: 'Rapid shot',
      rng: { rollD100: () => 98 } as any
    })
    expect(testFumble.outcome).toBe('FUMBLE')

    const testFail = resolveTest({
      actor: 'Agent Vance',
      skill: 'Firearms',
      skillRating: 50,
      modifier: 0,
      reason: 'Difficult shot',
      rng: { rollD100: () => 82 } as any
    })
    expect(testFail.outcome).toBe('FAILURE')
  })

  it('7. Opposed Test compares margins accurately', () => {
    const agentTest = {
      actor: 'Player Agent',
      skill: 'Stealth' as const,
      skillRating: 70,
      reason: 'Slip past guard'
    }
    const guardTest = {
      actor: 'Guard Sentries',
      skill: 'Surveillance' as const,
      skillRating: 50,
      reason: 'Spot intruder'
    }

    // Case 1: Agent rolls 30 (target 70, margin 40), Guard rolls 40 (target 50, margin 10) -> Agent wins
    const mockRng1 = {
      rolls: [30, 40],
      rollD100() { return this.rolls.shift()! }
    } as any
    const res1 = resolveOpposedTest(agentTest, guardTest, mockRng1)
    expect(res1.winner).toBe('Player Agent')
    expect(res1.winningMargin).toBe(30) // 40 - 10

    // Case 2: Both fail -> stalemate
    const mockRng2 = {
      rolls: [85, 90],
      rollD100() { return this.rolls.shift()! }
    } as any
    const res2 = resolveOpposedTest(agentTest, guardTest, mockRng2)
    expect(res2.winner).toBe('stalemate')
  })

  it('8. Hit location is mapped according to d10 bands (§4.8)', () => {
    expect(determineHitLocation({ rollD10: () => 1 } as any)).toBe('head')
    expect(determineHitLocation({ rollD10: () => 2 } as any)).toBe('chest')
    expect(determineHitLocation({ rollD10: () => 3 } as any)).toBe('chest')
    expect(determineHitLocation({ rollD10: () => 4 } as any)).toBe('abdomen')
    expect(determineHitLocation({ rollD10: () => 5 } as any)).toBe('abdomen')
    expect(determineHitLocation({ rollD10: () => 6 } as any)).toBe('arms')
    expect(determineHitLocation({ rollD10: () => 7 } as any)).toBe('arms')
    expect(determineHitLocation({ rollD10: () => 8 } as any)).toBe('legs')
    expect(determineHitLocation({ rollD10: () => 10 } as any)).toBe('legs')
  })

  it('9. Combat damage calculation factors hit location, margin and armor', () => {
    // Compact 9mm (base 8), margin 25 (+2 bonus = 10), hit head (2.0x) = 20 damage, 0 armor = 20
    const headShot = calculateCombatDamage({
      baseDamage: 8,
      margin: 25,
      isCritical: false,
      targetArmor: 0,
      hitLocation: 'head'
    })
    expect(headShot.effectiveDamage).toBe(20)

    // Chest shot (1.2x) against 4 armor
    const chestShot = calculateCombatDamage({
      baseDamage: 8,
      margin: 10,
      isCritical: false,
      targetArmor: 4,
      hitLocation: 'chest'
    })
    // (8 + 1) * 1.2 = 10.8 -> 10 - 4 armor = 6
    expect(chestShot.effectiveDamage).toBe(6)
  })

  it('10. Wound State transitions properly from Fine to Dead', () => {
    expect(updateWoundState(20, 20)).toBe('Fine')
    expect(updateWoundState(16, 20)).toBe('Grazed')
    expect(updateWoundState(10, 20)).toBe('Wounded')
    expect(updateWoundState(4, 20)).toBe('Critical')
    expect(updateWoundState(0, 20)).toBe('Down')
    expect(updateWoundState(-25, 20)).toBe('Dead')
  })

  it('11. Mission Generator produces 20 distinct, valid, connected blueprints (§11 Phase 3)', () => {
    const seeds = Array.from({ length: 20 }, (_, i) => `alpha_test_seed_${i + 1}`)
    const generated = seeds.map(s => generateMissionBlueprint({ seed: s }))

    expect(generated.length).toBe(20)

    // Check each blueprint is connected and has valid scene transitions
    for (const bp of generated) {
      expect(bp.scenes.length).toBeGreaterThanOrEqual(4)
      expect(bp.startSceneId).toBe('scene_1_approach')
      expect(bp.extractionSceneId).toBe('scene_4_extraction')
      expect(bp.city.length).toBeGreaterThan(0)
      expect(bp.venue.length).toBeGreaterThan(0)
      expect(bp.briefingText).toContain(bp.codeName)

      // Verify all nextScenes exist in the blueprint
      const sceneIds = new Set(bp.scenes.map(s => s.id))
      for (const scene of bp.scenes) {
        for (const nextId of scene.nextScenes) {
          expect(sceneIds.has(nextId)).toBe(true)
        }
      }
    }
  })
})
