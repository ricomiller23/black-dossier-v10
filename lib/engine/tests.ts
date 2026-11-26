import { SkillName, TestResult } from '../schemas'
import { SeededRNG } from './rng'

export interface TestParams {
  actor: string
  skill: SkillName
  skillRating: number
  modifier?: number
  reason: string
  rng?: SeededRNG
}

export function resolveTest({
  actor,
  skill,
  skillRating,
  modifier = 0,
  reason,
  rng = new SeededRNG()
}: TestParams): TestResult {
  const clampedMod = Math.min(30, Math.max(-40, modifier))
  const target = Math.min(99, Math.max(5, skillRating + clampedMod))
  const roll = rng.rollD100()
  const margin = target - roll

  let outcome: 'CRITICAL' | 'SUCCESS' | 'FAILURE' | 'FUMBLE'

  const critThreshold = Math.max(1, Math.floor(target / 10))

  if (roll <= critThreshold) {
    outcome = 'CRITICAL'
  } else if (roll <= target) {
    outcome = 'SUCCESS'
  } else if (roll >= 96) {
    outcome = 'FUMBLE'
  } else {
    outcome = 'FAILURE'
  }

  return {
    roll,
    target,
    modifier: clampedMod,
    margin,
    outcome,
    actor,
    skill,
    reason
  }
}

export function resolveOpposedTest(
  actor1Test: TestParams,
  actor2Test: TestParams,
  rng: SeededRNG = new SeededRNG()
): {
  actor1Result: TestResult
  actor2Result: TestResult
  winner: string | 'stalemate'
  winningMargin: number
} {
  const actor1Result = resolveTest({ ...actor1Test, rng })
  const actor2Result = resolveTest({ ...actor2Test, rng })

  const a1Success = actor1Result.outcome === 'SUCCESS' || actor1Result.outcome === 'CRITICAL'
  const a2Success = actor2Result.outcome === 'SUCCESS' || actor2Result.outcome === 'CRITICAL'

  if (a1Success && !a2Success) {
    return {
      actor1Result,
      actor2Result,
      winner: actor1Test.actor,
      winningMargin: actor1Result.margin
    }
  }

  if (!a1Success && a2Success) {
    return {
      actor1Result,
      actor2Result,
      winner: actor2Test.actor,
      winningMargin: actor2Result.margin
    }
  }

  if (a1Success && a2Success) {
    if (actor1Result.margin > actor2Result.margin) {
      return {
        actor1Result,
        actor2Result,
        winner: actor1Test.actor,
        winningMargin: actor1Result.margin - actor2Result.margin
      }
    } else if (actor2Result.margin > actor1Result.margin) {
      return {
        actor1Result,
        actor2Result,
        winner: actor2Test.actor,
        winningMargin: actor2Result.margin - actor1Result.margin
      }
    } else {
      // Tie goes to critical or coin flip
      if (actor1Result.outcome === 'CRITICAL' && actor2Result.outcome !== 'CRITICAL') {
        return { actor1Result, actor2Result, winner: actor1Test.actor, winningMargin: 1 }
      }
      if (actor2Result.outcome === 'CRITICAL' && actor1Result.outcome !== 'CRITICAL') {
        return { actor1Result, actor2Result, winner: actor2Test.actor, winningMargin: 1 }
      }
      return { actor1Result, actor2Result, winner: 'stalemate', winningMargin: 0 }
    }
  }

  // Both failed
  return {
    actor1Result,
    actor2Result,
    winner: 'stalemate',
    winningMargin: 0
  }
}
