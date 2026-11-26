'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGameStore } from '@/lib/store'
import {
  Agent,
  Attributes,
  Division,
  Background,
  PortraitConfig,
  SkillName
} from '@/lib/schemas'
import { calculateDerivedStats, validatePointBuy } from '@/lib/engine/attributes'
import { buildStartingSkills, SKILL_GOVERNING_ATTRIBUTE } from '@/lib/engine/skills'
import { STANDARD_WEAPONS, STANDARD_ARMOR } from '@/lib/engine/combat'
import { SeededRNG } from '@/lib/engine/rng'
import { AgentPortrait } from './AgentPortrait'
import { sound } from '@/lib/audio'
import { Dices, CheckCircle, Shield, Briefcase, FileBadge, ArrowRight, ArrowLeft } from 'lucide-react'

export const CharacterCreation: React.FC = () => {
  const saveAgent = useGameStore((s) => s.saveAgent)
  const setPhase = useGameStore((s) => s.setPhase)

  const [step, setStep] = useState(1)

  // Step 1: Identity
  const [codename, setCodename] = useState('VANCE')
  const [realName, setRealName] = useState('Johnathan R. Vance')
  const [nationality, setNationality] = useState('United Kingdom')
  const [age, setAge] = useState(34)
  const [portrait, setPortrait] = useState<PortraitConfig>({
    faceShape: 0,
    skinTone: '#E0AC69',
    hairStyle: 1,
    hairColor: '#2B1A09',
    glasses: false,
    sunglasses: true,
    scar: false,
    facialHair: 0,
    clothingStyle: 'Trench Coat',
    clothingColor: '#1A1E24'
  })

  // Step 2: Attributes
  const [attributes, setAttributes] = useState<Attributes>({
    MGT: 50,
    RFX: 60,
    NRV: 50,
    STA: 50,
    INT: 50,
    PER: 50,
    PRS: 40
  })

  // Step 3: Division
  const [division, setDivision] = useState<Division>('Section K — Kinetic Ops')

  // Step 4: Background
  const [background, setBackground] = useState<Background>('Ex-military')

  // Step 5: Skills allocated ranks (6 ranks max to distribute)
  const [allocatedRanks, setAllocatedRanks] = useState<Partial<Record<SkillName, number>>>({
    Firearms: 2,
    Stealth: 2,
    Lockpicking: 1,
    Surveillance: 1
  })

  // Step 6: Loadout
  const [selectedGear, setSelectedGear] = useState([STANDARD_WEAPONS[1], STANDARD_ARMOR[0]])

  const derived = calculateDerivedStats(attributes)
  const finalSkills = buildStartingSkills(attributes, division, background, allocatedRanks)

  // Roll Random 3d10x3 Attributes
  const handleRollAttributes = () => {
    sound.playDiceRoll()
    const rng = new SeededRNG()
    setAttributes({
      MGT: rng.roll3d10x3(),
      RFX: rng.roll3d10x3(),
      NRV: rng.roll3d10x3(),
      STA: rng.roll3d10x3(),
      INT: rng.roll3d10x3(),
      PER: rng.roll3d10x3(),
      PRS: rng.roll3d10x3()
    })
  }

  const handleNext = () => {
    sound.playTypewriter()
    setStep((s) => Math.min(7, s + 1))
  }

  const handlePrev = () => {
    sound.playTypewriter()
    setStep((s) => Math.max(1, s - 1))
  }

  const handleFinish = () => {
    const newAgent: Agent = {
      id: `agent_${Date.now()}`,
      codename,
      realName,
      nationality,
      age,
      division,
      background,
      contact: 'Field Contact Classified',
      attributes,
      skills: finalSkills,
      maxWP: derived.maxWP,
      currentWP: derived.maxWP,
      maxComposure: derived.maxComposure,
      currentComposure: derived.maxComposure,
      initiative: derived.initiative,
      coverIntegrity: 100,
      edgePoints: 3,
      woundState: 'Fine',
      clearanceLevel: 1,
      merit: 0,
      funds: 1500,
      inventory: selectedGear,
      portrait,
      status: 'Active'
    }

    saveAgent(newAgent)
  }

  return (
    <div className="relative min-h-screen w-full bg-[#08090C] text-[#EDE5D8] p-4 sm:p-8 flex flex-col items-center justify-center select-none overflow-y-auto">
      {/* Background Dossier Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#1E232A_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

      {/* Main Multi-Step Folder Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-4xl p-6 sm:p-8 rounded-2xl bg-[#12151B] border-2 border-[#C9A227]/40 shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col justify-between"
      >
        {/* Step Tabs Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#C9A227]/30 mb-6 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-red-950/80 border border-red-600 text-red-400 font-mono text-[10px] font-black uppercase tracking-widest">
              SECURITY CLEARANCE: FORM 84-A
            </span>
            <h1 className="font-serif font-black text-xl sm:text-2xl text-[#F2D06B]">
              OPERATIVE DOSSIER REGISTRATION
            </h1>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono text-stone-400">
            <span>STEP {step} OF 7</span>
            <div className="flex gap-1 ml-2">
              {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                <div
                  key={s}
                  className={`w-3 h-1.5 rounded-sm ${
                    s === step ? 'bg-[#F2D06B]' : s < step ? 'bg-amber-700' : 'bg-stone-800'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Step Content */}
        <div className="min-h-[380px] flex flex-col justify-center">
          {/* STEP 1: IDENTITY & PROCEDURAL PORTRAIT */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="flex flex-col gap-3 font-mono text-xs">
                <div>
                  <label className="text-stone-400 block mb-1 uppercase tracking-wider">CODENAME</label>
                  <input
                    type="text"
                    value={codename}
                    onChange={(e) => setCodename(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded bg-black/60 border border-stone-700 text-[#F2D06B] font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1 uppercase tracking-wider">CIVILIAN IDENTITY</label>
                  <input
                    type="text"
                    value={realName}
                    onChange={(e) => setRealName(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-black/60 border border-stone-700 text-white text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-stone-400 block mb-1 uppercase tracking-wider">NATIONALITY</label>
                    <input
                      type="text"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-black/60 border border-stone-700 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-stone-400 block mb-1 uppercase tracking-wider">AGE</label>
                    <input
                      type="number"
                      value={age}
                      min={21}
                      max={65}
                      onChange={(e) => setAge(parseInt(e.target.value, 10) || 30)}
                      className="w-full px-3 py-2 rounded bg-black/60 border border-stone-700 text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Live Spy Portrait Customizer */}
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-black/40 border border-stone-800">
                <AgentPortrait portrait={portrait} size="lg" className="mb-4" />
                <div className="flex items-center gap-2 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setPortrait((p) => ({ ...p, sunglasses: !p.sunglasses }))}
                    className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer"
                  >
                    TOGGLE SUNGLASSES
                  </button>
                  <button
                    type="button"
                    onClick={() => setPortrait((p) => ({ ...p, scar: !p.scar }))}
                    className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer"
                  >
                    TOGGLE SCAR
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ATTRIBUTES (D100/3D10 ROLLS OR POINT-BUY) */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <span className="text-xs font-mono text-stone-400">
                  ATTRIBUTE MATRIX (15–90 EACH // POINT-BUY OR 3D10×3)
                </span>
                <button
                  type="button"
                  onClick={handleRollAttributes}
                  className="px-3 py-1 rounded bg-[#C9A227]/20 border border-[#C9A227] hover:bg-[#C9A227]/30 text-[#F2D06B] font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Dices className="w-4 h-4" />
                  <span>ROLL 3d10 × 3</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                {(Object.keys(attributes) as Array<keyof Attributes>).map((attr) => (
                  <div key={attr} className="p-3 rounded-lg bg-black/50 border border-stone-800 flex flex-col items-center">
                    <span className="text-stone-400 font-bold mb-1">{attr}</span>
                    <span className="font-serif font-black text-2xl text-[#F2D06B]">{attributes[attr]}</span>
                    <input
                      type="range"
                      min={15}
                      max={85}
                      value={attributes[attr]}
                      onChange={(e) =>
                        setAttributes((prev) => ({
                          ...prev,
                          [attr]: parseInt(e.target.value, 10)
                        }))
                      }
                      className="w-full mt-2 accent-[#C9A227]"
                    />
                  </div>
                ))}
              </div>

              {/* Derived Stats Panel */}
              <div className="p-3 rounded-lg bg-[#0F172A]/80 border border-cyan-800/60 flex items-center justify-around font-mono text-xs">
                <div>MAX WP: <strong className="text-emerald-400">{derived.maxWP}</strong></div>
                <div>COMPOSURE: <strong className="text-cyan-400">{derived.maxComposure}</strong></div>
                <div>INITIATIVE: <strong className="text-[#F2D06B]">{derived.initiative}</strong></div>
                <div>EDGE: <strong className="text-amber-400">{derived.edgePoints}</strong></div>
              </div>
            </div>
          )}

          {/* STEP 3: DIVISION */}
          {step === 3 && (
            <div className="flex flex-col gap-3">
              <span className="text-xs font-mono text-stone-400 mb-2">
                SELECT OPERATIONAL DIVISION ASSIGNMENT
              </span>

              {[
                { name: 'Section K — Kinetic Ops', desc: 'Direct action, hostage neutralization, tactical assault (+1 Firearms, +1 Melee)' },
                { name: 'Section F — Field Recovery', desc: 'Covert document exfiltration, lock bypass, asset recovery (+1 Lockpicking, +1 Search)' },
                { name: 'Section S — Signals & Inquiry', desc: 'Electronic surveillance, interception, interrogation (+1 Electronics, +1 Surveillance)' },
                { name: 'Section V — Veil', desc: 'Deep-cover infiltration, psychological persuasion, disguise (+1 Disguise, +1 Deception)' }
              ].map((div) => (
                <div
                  key={div.name}
                  onClick={() => setDivision(div.name as Division)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    division === div.name
                      ? 'border-[#C9A227] bg-[#C9A227]/10 text-white shadow-lg'
                      : 'border-stone-800 bg-black/40 text-stone-400 hover:text-white'
                  }`}
                >
                  <div className="font-serif font-black text-base text-[#F2D06B]">{div.name}</div>
                  <div className="text-xs font-mono mt-1 text-stone-300">{div.desc}</div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 4: BACKGROUND */}
          {step === 4 && (
            <div className="flex flex-col gap-3">
              <span className="text-xs font-mono text-stone-400 mb-2">
                SELECT OPERATIVE PRE-RECRUITMENT BACKGROUND
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                {[
                  'Ex-military',
                  'Academic',
                  'Journalist',
                  'Career criminal',
                  "Diplomat's child",
                  'Hacker',
                  'Athlete',
                  'Medic'
                ].map((bg) => (
                  <div
                    key={bg}
                    onClick={() => setBackground(bg as Background)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      background === bg
                        ? 'border-[#C9A227] bg-[#C9A227]/10 text-[#F2D06B] font-bold'
                        : 'border-stone-800 bg-black/40 text-stone-400 hover:text-white'
                    }`}
                  >
                    {bg}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: SKILL RATINGS */}
          {step === 5 && (
            <div className="flex flex-col gap-3">
              <span className="text-xs font-mono text-stone-400 mb-2">
                FINAL COMPUTED SKILL RATINGS (D100 TARGET VALUES)
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs max-h-72 overflow-y-auto pr-1">
                {Object.entries(finalSkills).map(([skill, val]) => (
                  <div key={skill} className="p-2 rounded bg-black/50 border border-stone-800 flex justify-between items-center">
                    <span className="text-stone-300">{skill}</span>
                    <strong className="text-[#F2D06B] font-bold">{val}%</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: BRIEFCASE LOADOUT */}
          {step === 6 && (
            <div className="flex flex-col gap-3">
              <span className="text-xs font-mono text-stone-400 mb-2">
                FIELD BRIEFCASE EQUIPMENT // STANDARD ALLOCATION
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                {STANDARD_WEAPONS.slice(0, 4).map((wep) => (
                  <div key={wep.id} className="p-3 rounded-xl bg-black/50 border border-stone-800">
                    <div className="font-bold text-[#F2D06B]">{wep.name}</div>
                    <div className="text-stone-400 text-[11px] mt-1">{wep.description}</div>
                    <div className="text-emerald-400 mt-2 text-[10px]">
                      DAMAGE: {wep.baseDamage} // NOISE: {wep.noise} // CONCEAL: {wep.concealability}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: REVIEW & APPROVAL */}
          {step === 7 && (
            <div className="flex flex-col items-center justify-center p-6 text-center font-mono">
              <AgentPortrait portrait={portrait} size="lg" className="mb-4" />
              <div className="font-serif font-black text-2xl text-[#F2D06B]">
                OPERATIVE: {codename}
              </div>
              <div className="text-xs text-stone-400 mt-1">
                {division} // {background} // WP: {derived.maxWP}
              </div>

              <div className="my-6 px-4 py-2 rounded border-2 border-emerald-500 bg-emerald-950/40 text-emerald-400 font-black text-sm tracking-widest uppercase rotate-[-3deg] shadow-lg">
                STATUS: APPROVED FOR ACTIVE DEPLOYMENT
              </div>
            </div>
          )}
        </div>

        {/* Step Navigation Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[#C9A227]/30 mt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2 rounded-xl border border-stone-700 bg-stone-900 text-stone-300 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>PREVIOUS</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPhase('TITLE')}
              className="px-4 py-2 rounded-xl border border-stone-700 bg-stone-900 text-stone-300 font-mono text-xs font-bold cursor-pointer"
            >
              CANCEL
            </button>
          )}

          {step < 7 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#F2D06B] via-[#FFE28A] to-[#C9A227] text-black font-mono text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg active:scale-95 cursor-pointer"
            >
              <span>NEXT STEP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-mono text-sm font-black uppercase tracking-wider shadow-[0_0_25px_rgba(52,211,153,0.5)] active:scale-95 cursor-pointer"
            >
              STAMP &amp; ACTIVATE DOSSIER
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
