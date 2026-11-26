import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '../../store'
import { COLD_WAR_GADGETS, CAMPAIGN_CITIES } from '../gadgets'
import { Agent } from '../../schemas'

describe('Black Dossier 5 Expansion Systems (§14 Integration Tests)', () => {
  beforeEach(() => {
    // Reset test agent in store
    const testAgent: Agent = {
      id: 'agent_test_exp',
      codename: 'ECHO-9',
      realName: 'REDACTED',
      nationality: 'United Kingdom',
      age: 34,
      division: 'Section K — Kinetic Ops',
      background: 'Ex-military',
      contact: 'Station Chief Vienna',
      attributes: { MGT: 60, RFX: 70, NRV: 65, STA: 60, INT: 65, PER: 75, PRS: 50 },
      skills: {
        Firearms: 75, Stealth: 80, Athletics: 65, Melee: 60, Search: 75,
        Lockpicking: 70, Surveillance: 70, Driving: 65, Demolitions: 45,
        'First Aid': 55, Electronics: 50, Computers: 55, Persuasion: 45,
        Deception: 60, Forgery: 40, Languages: 50, Disguise: 55, Interrogation: 65
      },
      currentWP: 16,
      maxWP: 16,
      currentComposure: 11,
      maxComposure: 11,
      initiative: 72,
      coverIntegrity: 100,
      woundState: 'Fine',
      edgePoints: 3,
      merit: 20,
      funds: 5000,
      clearanceLevel: 1,
      inventory: [],
      portrait: {
        faceShape: 1,
        skinTone: '#E0AC69',
        hairStyle: 3,
        hairColor: '#2B1A09',
        glasses: false,
        sunglasses: true,
        scar: true,
        facialHair: 1,
        clothingStyle: 'Trench Coat',
        clothingColor: '#1A1E24'
      },
      status: 'Active'
    }

    useGameStore.setState({
      agent: testAgent,
      alertLevel: 2,
      revealedClues: []
    })
  })

  // 1. Dynamic Sentries
  it('1. Sentries are tracked and can be neutralized quietly', () => {
    const store = useGameStore.getState()
    expect(store.sentries.length).toBeGreaterThan(0)
    const activeSentry = store.sentries[0]
    expect(activeSentry.status).toBe('patrolling')

    // Neutralize sentry
    store.neutralizeSentry(activeSentry.id)
    const updated = useGameStore.getState().sentries.find(s => s.id === activeSentry.id)
    expect(updated?.status).toBe('neutralized')
  })

  // 2. SIGINT Oscilloscope Decoder
  it('2. SIGINT tunes frequency and decrypts signals into revealed clues', () => {
    const store = useGameStore.getState()
    const targetChannel = store.sigintChannels[0] // 4.62 MHz

    // Tune frequency
    store.setTunedFrequency(targetChannel.frequencyMHz)
    expect(useGameStore.getState().tunedFrequency).toBe(targetChannel.frequencyMHz)

    // Decrypt channel
    store.decryptChannel(targetChannel.id)
    const after = useGameStore.getState()
    const decrypted = after.sigintChannels.find(c => c.id === targetChannel.id)
    expect(decrypted?.isDecrypted).toBe(true)
    expect(after.revealedClues).toContain(targetChannel.intelContent)
    // Signal decryption also reduces alert!
    expect(after.alertLevel).toBeLessThan(2)
  })

  // 3. Quartermaster Gadget Loadout
  it('3. Attaché Armory allows purchasing authentic Cold War gadgets with Black Budget funds', () => {
    const store = useGameStore.getState()
    const initialFunds = store.agent!.funds
    const camera = COLD_WAR_GADGETS[0] // Minox Camera ($450)

    const success = store.buyGadget(camera)
    expect(success).toBe(true)

    const updatedAgent = useGameStore.getState().agent!
    expect(updatedAgent.funds).toBe(initialFunds - camera.cost)
    expect(updatedAgent.inventory.some(i => i.id === camera.id)).toBe(true)
  })

  // 4. Polygraph Interrogation
  it('4. Galvanic Polygraph interrogation accumulates stress until suspect breaks and reveals secret', () => {
    const store = useGameStore.getState()
    expect(store.interrogationSubject).not.toBeNull()
    const initialStress = store.interrogationSubject!.stress

    // Apply Blackmail Threat tactic
    const res = store.conductInterrogation('Blackmail Threat')
    expect(res.success).toBe(true)
    const subject = useGameStore.getState().interrogationSubject!
    expect(subject.stress).toBeGreaterThan(initialStress)
    expect(subject.currentBPM).toBeGreaterThan(76)

    // Repeated tactics to reach break threshold (85%)
    store.conductInterrogation('Blunt Intimidation')
    store.conductInterrogation('Ideological Pressure')
    const finalSubject = useGameStore.getState().interrogationSubject!
    expect(finalSubject.isBroken).toBe(true)
    expect(useGameStore.getState().revealedClues).toContain(finalSubject.secretRevealed)
  })

  // 5. Global Campaign Atlas
  it('5. Campaign Atlas tracks 5 Cold War theaters and deploys operative to target city', () => {
    const store = useGameStore.getState()
    expect(store.campaignCities.length).toBe(5)
    expect(CAMPAIGN_CITIES.map(c => c.name)).toEqual(
      expect.arrayContaining(['Vienna', 'East Berlin', 'Tangier', 'Moscow', 'Havana'])
    )

    // Select Berlin
    store.selectCampaignCity('city_berlin')
    const state = useGameStore.getState()
    expect(state.activeCityId).toBe('city_berlin')
    expect(state.blueprint?.city).toBe('East Berlin')
  })
})
