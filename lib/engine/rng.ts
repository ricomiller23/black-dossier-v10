import seedrandom from 'seedrandom'

export class SeededRNG {
  private prng: seedrandom.PRNG
  private seedString: string

  constructor(seed?: string) {
    this.seedString = seed || Math.random().toString(36).substring(2)
    this.prng = seedrandom(this.seedString)
  }

  getSeed(): string {
    return this.seedString
  }

  // Returns float in [0, 1)
  random(): number {
    return this.prng()
  }

  // Integer in [min, max] inclusive
  range(min: number, max: number): number {
    return Math.floor(this.prng() * (max - min + 1)) + min
  }

  // d10: 1 to 10
  rollD10(): number {
    return this.range(1, 10)
  }

  // d100: 1 to 100
  rollD100(): number {
    return this.range(1, 100)
  }

  // 3d10 * 3 for attribute generation
  roll3d10x3(): number {
    const r1 = this.rollD10()
    const r2 = this.rollD10()
    const r3 = this.rollD10()
    const raw = (r1 + r2 + r3) * 3
    return Math.min(90, Math.max(15, raw))
  }
}
