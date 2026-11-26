'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  ShieldAlert,
  Terminal,
  FileText,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Tv,
  Download,
  Upload,
  BookOpen,
  Award,
  Zap,
  Globe,
  Radio
} from 'lucide-react'
import { useGameStore } from '@/lib/store'
import { AgentPortrait } from './AgentPortrait'
import { sound } from '@/lib/audio'
import { Agent } from '@/lib/schemas'
import { STANDARD_WEAPONS, STANDARD_ARMOR } from '@/lib/engine/combat'

export const TitleScreen: React.FC = () => {
  const {
    agent,
    theme,
    crtEffect,
    soundMuted,
    setTheme,
    toggleCRT,
    toggleSound,
    startNewAgent,
    saveAgent,
    launchMission,
    exportSaveDossier,
    importSaveDossier
  } = useGameStore()

  const [showRules, setShowRules] = useState(false)
  const [showArchive, setShowArchive] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [importText, setImportText] = useState('')
  const [importStatus, setImportStatus] = useState<string | null>(null)
  const [selectedEra, setSelectedEra] = useState<'1980s Cold War' | 'Modern Day'>('1980s Cold War')
  const [selectedMode, setSelectedMode] = useState<'solo' | 'ally' | 'rival' | 'mole'>('solo')

  // Generate Quick Start Operative
  const handleQuickStart = () => {
    sound.playStamp()
    const quickAgent: Agent = {
      id: `agent_quick_${Date.now()}`,
      codename: 'ECHO-9',
      realName: 'REDACTED // FIELD ASSET',
      nationality: 'United Kingdom',
      age: 34,
      division: 'Section K — Kinetic Ops',
      background: 'Ex-military',
      contact: 'Station Chief Vienna',
      attributes: {
        MGT: 55,
        RFX: 70,
        NRV: 65,
        STA: 60,
        INT: 65,
        PER: 75,
        PRS: 50
      },
      skills: {
        Firearms: 75,
        Stealth: 80,
        Athletics: 65,
        Melee: 60,
        Search: 75,
        Lockpicking: 70,
        Surveillance: 70,
        Driving: 65,
        Demolitions: 45,
        'First Aid': 55,
        Electronics: 50,
        Computers: 55,
        Persuasion: 45,
        Deception: 60,
        Forgery: 40,
        Languages: 50,
        Disguise: 55,
        Interrogation: 60
      },
      currentWP: 16,
      maxWP: 16,
      currentComposure: 11,
      maxComposure: 11,
      initiative: 72,
      coverIntegrity: 100,
      woundState: 'Fine',
      edgePoints: 3,
      merit: 15,
      funds: 5000,
      clearanceLevel: 1,
      inventory: [
        STANDARD_WEAPONS[0], // Suppressed .22 Pistol
        STANDARD_ARMOR[0],   // Concealable Kevlar Vest
        {
          id: 'gear_picks',
          name: 'Titanium Lock Tension Set',
          category: 'gear',
          description: 'Non-magnetic pick set for pin-tumbler bypass.',
          concealability: 'Pocket',
          cost: 150,
          noise: 'Silent'
        }
      ],
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
    saveAgent(quickAgent)
    launchMission(undefined, selectedEra, selectedMode)
  }

  const handleLaunchSaved = () => {
    sound.playStamp()
    launchMission(undefined, selectedEra, selectedMode)
  }

  const handleExport = () => {
    sound.playTypewriter()
    const json = exportSaveDossier()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `black_dossier_${agent?.codename || 'operative'}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportSubmit = () => {
    if (!importText.trim()) return
    const success = importSaveDossier(importText)
    if (success) {
      setImportStatus('DOSSIER DECRYPTED & AUTHENTICATED')
      setTimeout(() => {
        setShowImport(false)
        setImportStatus(null)
      }, 1000)
    } else {
      setImportStatus('DECRYPTION FAILURE: INVALID DOSSIER JSON')
    }
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-4 sm:p-8 bg-[#06090e] text-zinc-300">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-zinc-950/60 to-[#06090e]" />
      <div className="pointer-events-none absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Top Classification Header */}
      <header className="relative z-10 w-full flex flex-wrap items-center justify-between border-b border-zinc-800/80 pb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-red-950/80 border border-red-700/60 text-red-400">
            <ShieldAlert className="w-4 h-4 animate-tactical-pulse" />
          </div>
          <div>
            <div className="text-[10px] sm:text-xs tracking-widest text-red-500 font-bold uppercase">
              TOP SECRET // ORCON // NOFORN
            </div>
            <div className="text-[9px] text-zinc-500 font-mono tracking-wider">
              CENTRAL DIRECTIVE 84-K // EYES ONLY
            </div>
          </div>
        </div>

        {/* Global Utility Controls */}
        <div className="flex items-center gap-2">
          {/* Theme Selector */}
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as any)}
            className="text-xs bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-zinc-400 hover:text-zinc-200 focus:outline-none focus:border-amber-500"
          >
            <option value="manila">Theme: Manila Folder</option>
            <option value="crt_green">Theme: Green Phosphor</option>
            <option value="crt_amber">Theme: Amber Phosphor</option>
            <option value="night_ops">Theme: Night Ops Blue</option>
          </select>

          {/* CRT Toggle */}
          <button
            onClick={toggleCRT}
            title="Toggle Scanline Simulation"
            className={`p-1.5 rounded border text-xs transition-colors ${
              crtEffect
                ? 'bg-amber-950/40 border-amber-600/60 text-amber-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500'
            }`}
          >
            <Tv className="w-4 h-4" />
          </button>

          {/* Audio Toggle */}
          <button
            onClick={toggleSound}
            title={soundMuted ? 'Unmute Audio' : 'Mute Audio'}
            className={`p-1.5 rounded border text-xs transition-colors ${
              !soundMuted
                ? 'bg-amber-950/40 border-amber-600/60 text-amber-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500'
            }`}
          >
            {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Title Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center my-8 max-w-4xl mx-auto w-full">
        {/* Dossier Code Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-600/40 text-amber-400 text-xs tracking-widest font-mono">
            <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>SOLO ESPIONAGE TABLETOP RPG ENGINE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-zinc-100 font-mono">
            BLACK <span className="text-amber-500">DOSSIER</span>
          </h1>

          <p className="max-w-xl mx-auto text-xs sm:text-sm text-zinc-400 font-mono leading-relaxed">
            High-stakes tactical tradecraft in the shadow of global covert conflict.
            Direct your operative through classified blueprints, unmask syndicates on the corkboard,
            and resolve lethal firefights with deterministic d100 rules.
          </p>
        </motion.div>

        {/* Active Operative Badge (if any) */}
        {agent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-4 rounded border border-amber-700/50 bg-amber-950/20 flex flex-col sm:flex-row items-center gap-4 max-w-md w-full text-left"
          >
            <div className="w-16 h-20 rounded overflow-hidden border border-amber-600/40 bg-zinc-950 flex-shrink-0 flex items-center justify-center">
              <AgentPortrait agent={agent} size="sm" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                ACTIVE CLASSIFIED DOSSIER
              </div>
              <div className="text-lg font-bold text-zinc-100 truncate font-mono">
                {agent.codename}
              </div>
              <div className="text-xs text-zinc-400 truncate">
                {agent.division}
              </div>
              <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                Clearance Lvl {agent.clearanceLevel} • Merit {agent.merit} • Funds ${agent.funds}
              </div>
            </div>
          </motion.div>
        )}

        {/* Mission Setup Selector */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 rounded px-3 py-1.5">
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-zinc-500">ERA:</span>
            <select
              value={selectedEra}
              onChange={(e) => setSelectedEra(e.target.value as any)}
              className="bg-transparent text-zinc-300 font-bold focus:outline-none"
            >
              <option value="1980s Cold War">1980s Cold War</option>
              <option value="Modern Day">Modern Day Black Ops</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 rounded px-3 py-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-zinc-500">MODE:</span>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value as any)}
              className="bg-transparent text-zinc-300 font-bold focus:outline-none"
            >
              <option value="solo">Solo Operative (Strict)</option>
              <option value="ally">AI Specialist Relay</option>
              <option value="rival">Hostile Shadow Rival</option>
              <option value="mole">Suspected Infiltrator / Mole</option>
            </select>
          </div>
        </div>

        {/* Action Button Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
          {agent ? (
            <button
              onClick={handleLaunchSaved}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold font-mono tracking-wider transition-all shadow-lg shadow-amber-600/20 active:scale-95"
            >
              <Play className="w-4 h-4 fill-zinc-950" />
              <span>DEPLOY ACTIVE OPERATIVE</span>
            </button>
          ) : (
            <button
              onClick={handleQuickStart}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold font-mono tracking-wider transition-all shadow-lg shadow-amber-600/20 active:scale-95"
            >
              <Zap className="w-4 h-4 fill-zinc-950" />
              <span>QUICK-START: ECHO-9</span>
            </button>
          )}

          <button
            onClick={startNewAgent}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-amber-500 text-zinc-200 font-mono tracking-wider transition-all active:scale-95"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>CREATE NEW DOSSIER</span>
          </button>

          <button
            onClick={() => setShowRules(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-mono transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
            <span>FIELD MANUAL & MECHANICS</span>
          </button>

          {agent && (
            <button
              onClick={() => setShowArchive(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-mono transition-all"
            >
              <Award className="w-3.5 h-3.5 text-zinc-400" />
              <span>CLEARANCE ARCHIVE</span>
            </button>
          )}

          <button
            onClick={handleExport}
            disabled={!agent}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded border text-xs font-mono transition-all ${
              agent
                ? 'bg-zinc-900/60 hover:bg-zinc-800 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                : 'bg-zinc-950 border-zinc-900 text-zinc-600 cursor-not-allowed'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT DOSSIER JSON</span>
          </button>

          <button
            onClick={() => setShowImport(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-mono transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>IMPORT DOSSIER JSON</span>
          </button>
        </div>
      </main>

      {/* Footer System Telemetry */}
      <footer className="relative z-10 w-full flex flex-wrap items-center justify-between border-t border-zinc-800/80 pt-4 text-[11px] font-mono text-zinc-500 gap-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-amber-500" />
          <span>BLACK DOSSIER v1.0.0 // DETERMINISTIC d100 TABLETOP CORE</span>
        </div>
        <div>STRICT COMPLIANCE: ZERO TRADEMARKS // ORIGINAL SYSTEM</div>
      </footer>

      {/* Rules Modal */}
      <AnimatePresence>
        {showRules && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-amber-600/50 rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 font-mono text-xs text-zinc-300 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="text-amber-400 font-bold tracking-wider text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  FIELD MANUAL: OPERATIONAL PROTOCOLS
                </div>
                <button
                  onClick={() => setShowRules(false)}
                  className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded"
                >
                  CLOSE [ESC]
                </button>
              </div>

              <div className="space-y-3 leading-relaxed">
                <div>
                  <h4 className="font-bold text-amber-300 uppercase tracking-wide">1. Resolution Mechanic (d100)</h4>
                  <p className="text-zinc-400 mt-1">
                    Roll 1d100 equal to or lower than your Effective Skill Rating to succeed.
                    Margin of Success = Rating - Roll.
                    Rolls &le; 1/10th of rating are <strong className="text-emerald-400">CRITICAL SUCCESSES</strong>.
                    Rolls &ge; 96 are <strong className="text-red-400">FUMBLES</strong>.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-amber-300 uppercase tracking-wide">2. Hit Locations & Wounds</h4>
                  <p className="text-zinc-400 mt-1">
                    Attacks strike 1 of 5 anatomical zones (1-2: Legs, 3-5: Abdomen, 6-7: Chest, 8-9: Arms, 10: Head).
                    Damage reduces Wound Points (WP). Condition degrades from Fine &rarr; Grazed &rarr; Wounded &rarr; Critical &rarr; Down &rarr; Dead.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-amber-300 uppercase tracking-wide">3. Edge Points</h4>
                  <p className="text-zinc-400 mt-1">
                    Spend 1 Edge Point to force an immediate reroll of any failed test, or downgrade a lethal wound state by one tier.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-amber-300 uppercase tracking-wide">4. Tactical Blueprints & Red Strings</h4>
                  <p className="text-zinc-400 mt-1">
                    Explore nodes on architectural CAD maps. Gather intelligence clues to link suspects, safehouses, and syndicates on the corkboard.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end">
                <button
                  onClick={() => setShowRules(false)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold rounded"
                >
                  ACKNOWLEDGE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Archive Modal */}
      <AnimatePresence>
        {showArchive && agent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-700 rounded-lg max-w-xl w-full p-6 font-mono text-xs text-zinc-300 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="text-amber-400 font-bold tracking-wider text-sm flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  CLASSIFIED SERVICE RECORD
                </div>
                <button
                  onClick={() => setShowArchive(false)}
                  className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded"
                >
                  CLOSE
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-zinc-950 rounded border border-zinc-800">
                  <div className="text-zinc-500">CODENAME</div>
                  <div className="text-base font-bold text-zinc-100">{agent.codename}</div>
                </div>
                <div className="p-3 bg-zinc-950 rounded border border-zinc-800">
                  <div className="text-zinc-500">SECURITY CLEARANCE</div>
                  <div className="text-base font-bold text-amber-400">LEVEL {agent.clearanceLevel}</div>
                </div>
                <div className="p-3 bg-zinc-950 rounded border border-zinc-800">
                  <div className="text-zinc-500">ACCRUED MERIT</div>
                  <div className="text-base font-bold text-emerald-400">{agent.merit} PTS</div>
                </div>
                <div className="p-3 bg-zinc-950 rounded border border-zinc-800">
                  <div className="text-zinc-500">BLACK BUDGET FUNDS</div>
                  <div className="text-base font-bold text-zinc-100">${agent.funds.toLocaleString()}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end">
                <button
                  onClick={() => setShowArchive(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded"
                >
                  DISMISS
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Import Modal */}
      <AnimatePresence>
        {showImport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-700 rounded-lg max-w-xl w-full p-6 font-mono text-xs text-zinc-300 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="text-amber-400 font-bold tracking-wider text-sm flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  IMPORT CLASSIFIED DOSSIER JSON
                </div>
                <button
                  onClick={() => setShowImport(false)}
                  className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded"
                >
                  CANCEL
                </button>
              </div>

              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste exported dossier JSON payload here..."
                rows={8}
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded font-mono text-xs text-zinc-300 focus:outline-none focus:border-amber-500"
              />

              {importStatus && (
                <div
                  className={`p-2 rounded text-center font-bold ${
                    importStatus.includes('FAILURE')
                      ? 'bg-red-950 text-red-400 border border-red-700'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                  }`}
                >
                  {importStatus}
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setShowImport(false)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleImportSubmit}
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold rounded"
                >
                  DECRYPT & LOAD
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
