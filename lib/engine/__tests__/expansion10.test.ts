import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '../../store'
import { Agent } from '../../schemas'

describe('Ten Expansion Systems Mechanics & Gameplay Balance', () => {
  beforeEach(() => {
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
    useGameStore.setState({ agent: testAgent })
  })

  // 1. Microfilm Darkroom
  it('advances microfilm rolls through darkroom baths and reveals magnified microdot clues', () => {
    const store = useGameStore.getState()
    const rollId = 'roll_stasi_cables'
    
    // Initial stage is raw
    expect(store.darkroomRolls.find(r => r.id === rollId)?.stage).toBe('raw')

    // Advance to developer -> stop_bath -> fixer -> developed
    store.advanceDarkroomStage(rollId)
    expect(useGameStore.getState().darkroomRolls.find(r => r.id === rollId)?.stage).toBe('developer')

    store.advanceDarkroomStage(rollId)
    store.advanceDarkroomStage(rollId)
    store.advanceDarkroomStage(rollId)
    expect(useGameStore.getState().darkroomRolls.find(r => r.id === rollId)?.stage).toBe('developed')

    // Inspect microdot
    const initialClues = useGameStore.getState().revealedClues.length
    useGameStore.getState().inspectDarkroomMicrodot(rollId)

    const updated = useGameStore.getState()
    expect(updated.darkroomRolls.find(r => r.id === rollId)?.isInspected).toBe(true)
    expect(updated.revealedClues.length).toBeGreaterThan(initialClues)
  })

  // 2. Passport & Cover Legends
  it('switches cover legends and applies consular border entry stamps', () => {
    const store = useGameStore.getState()
    const targetLegendId = 'legend_swiss_watchmaker'

    store.switchCoverLegend(targetLegendId)
    const activeLegend = useGameStore.getState().coverLegends.find(l => l.isActive)
    expect(activeLegend?.id).toBe(targetLegendId)

    const initialSuspicion = activeLegend?.suspicionPercent || 0
    store.stampVisa('GDR Diplomatic Corridor')
    const updatedLegend = useGameStore.getState().coverLegends.find(l => l.id === targetLegendId)
    expect(updatedLegend?.visaStamps).toContain('GDR Diplomatic Corridor')
    expect(updatedLegend?.suspicionPercent).toBeLessThanOrEqual(initialSuspicion)
  })

  // 3. Dead-Drop & Asset Network
  it('retrieves clandestine dead-drops and orders local asset sabotage', () => {
    const store = useGameStore.getState()
    const dropId = 'drop_opera_brick'
    const initialFunds = store.agent?.funds || 0

    store.retrieveDeadDrop(dropId)
    const updatedDrop = useGameStore.getState().deadDropSites.find(d => d.id === dropId)
    expect(updatedDrop?.status).toBe('retrieved')
    expect(useGameStore.getState().agent?.funds).toBe(initialFunds + 350)

    // Order sabotage
    store.orderAssetSabotage('drop_park_lion')
    const sabDrop = useGameStore.getState().deadDropSites.find(d => d.id === 'drop_park_lion')
    expect(sabDrop?.status).toBe('sabotage_ordered')
    expect(useGameStore.getState().sentries[0].status).toBe('neutralized')
  })

  // 4. Counter-Surveillance Tail
  it('executes dry-cleaning maneuvers to shake hostile surveillance tails', () => {
    const store = useGameStore.getState()
    expect(store.surveillanceTail.activeTail).toBe(true)
    const initialThreat = store.surveillanceTail.threatLevelPercent

    store.executeDryCleanManeuver('u_bahn')
    expect(useGameStore.getState().surveillanceTail.threatLevelPercent).toBeLessThan(initialThreat)

    // Second sprint clears tail completely
    store.executeDryCleanManeuver('alley_sprint')
    expect(useGameStore.getState().surveillanceTail.threatLevelPercent).toBe(0)
    expect(useGameStore.getState().surveillanceTail.activeTail).toBe(false)
  })

  // 5. Stethoscope Wall Safe
  it('cracks mechanical wall safe by dialing combination steps', () => {
    const store = useGameStore.getState()
    const [c1, c2, c3] = store.safeCrackingState.targetCombo

    // Dial step 1
    store.rotateSafeDial(c1)
    const step1Success = store.testSafeCombination()
    expect(step1Success).toBe(true)
    expect(useGameStore.getState().safeCrackingState.crackedSteps).toBe(1)

    // Dial step 2
    useGameStore.getState().rotateSafeDial(c2 - useGameStore.getState().safeCrackingState.currentDial)
    useGameStore.getState().testSafeCombination()
    expect(useGameStore.getState().safeCrackingState.crackedSteps).toBe(2)

    // Dial step 3 (final)
    useGameStore.getState().rotateSafeDial(c3 - useGameStore.getState().safeCrackingState.currentDial)
    const cracked = useGameStore.getState().testSafeCombination()
    expect(cracked).toBe(true)
    expect(useGameStore.getState().safeCrackingState.isCracked).toBe(true)
  })

  // 6. Chemical Lab Synthesis
  it('crafts clandestine chemical compounds and slots them into gear', () => {
    const store = useGameStore.getState()
    const compoundId = 'chem_truth_serum'
    const initialReagents = store.chemicalReagentsCount
    const initialInventory = store.agent?.inventory.length || 0

    store.craftChemicalCompound(compoundId)
    const updated = useGameStore.getState()
    expect(updated.chemicalReagentsCount).toBeLessThan(initialReagents)
    expect(updated.chemicalCompounds.find(c => c.id === compoundId)?.crafted).toBe(true)
    expect(updated.agent?.inventory.length).toBe(initialInventory + 1)
  })

  // 7. Internal Mole Hunt
  it('audits suspect files and exposes the true station mole', () => {
    const store = useGameStore.getState()
    const trueMole = store.moleSuspects.find(s => s.isTrueMole)
    expect(trueMole).toBeDefined()

    const initialFunds = store.agent?.funds || 0
    const result = store.accuseStationMole(trueMole!.id)
    expect(result).toBe(true)

    const updated = useGameStore.getState()
    expect(updated.moleSuspects.find(s => s.id === trueMole!.id)?.isFormallyAccused).toBe(true)
    expect(updated.agent?.funds).toBe(initialFunds + 1000)
  })

  // 8. Embassy Gala Social Eavesdropping
  it('eavesdrops on diplomatic guests at high-society galas', () => {
    const store = useGameStore.getState()
    const guestId = 'guest_kozlov'
    const initialSecrets = store.embassyGalaState.secretsExtracted

    store.eavesdropGalaGuest(guestId)
    const updated = useGameStore.getState()
    expect(updated.embassyGalaState.secretsExtracted).toBe(initialSecrets + 1)
    expect(updated.galaGuests.find(g => g.id === guestId)?.eavesdropped).toBe(true)
  })

  // 9. Emergency Border Exfiltration
  it('plans and executes emergency Cold War border crossings', () => {
    const store = useGameStore.getState()
    const routeId = 'exfil_glienicke_swap'

    store.executeBorderExfiltration(routeId)
    const updated = useGameStore.getState()
    expect(updated.exfiltrationRoutes.find(r => r.id === routeId)?.isExecuted).toBe(true)
    expect(updated.exfiltrationRoutes.find(r => r.id === routeId)?.outcomeNarrative).toBeDefined()
  })

  // 10. Operative Service Record
  it('appends official service citations, scars, and career commendations', () => {
    const store = useGameStore.getState()
    const initialCount = store.careerRecords.length

    store.awardCareerRecord({
      id: 'rec_berlin_hero',
      title: 'Distinguished Intelligence Cross',
      type: 'medal',
      citation: 'Single-handedly extracted deep-cover asset from East Berlin.',
      dateAwarded: '1984-09-22',
      statModifier: '+15 Stealth & Ballistic Focus'
    })

    const updated = useGameStore.getState()
    expect(updated.careerRecords.length).toBe(initialCount + 1)
    expect(updated.careerRecords[updated.careerRecords.length - 1].title).toBe('Distinguished Intelligence Cross')
  })
})
