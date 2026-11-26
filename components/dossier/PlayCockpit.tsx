'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGameStore } from '@/lib/store'
import { TacticalBlueprintMap } from '../map/TacticalBlueprintMap'
import { EvidenceCorkboard } from './EvidenceCorkboard'
import { BallisticCombatView } from '../combat/BallisticCombatView'
import { ChaseTrackView } from '../chase/ChaseTrackView'
import { AudioInterceptDecoder } from '../sigint/AudioInterceptDecoder'
import { BriefcaseLoadout } from '../armory/BriefcaseLoadout'
import { PolygraphInterrogation } from '../dialogue/PolygraphInterrogation'
import { GlobalCampaignAtlas } from '../campaign/GlobalCampaignAtlas'
import { MicrofilmDarkroom } from '../forensics/MicrofilmDarkroom'
import { CoverPassportBook } from '../passport/CoverPassportBook'
import { DeadDropNetwork } from '../deaddrop/DeadDropNetwork'
import { CounterSurveillanceTail } from '../counterintel/CounterSurveillanceTail'
import { StethoscopeSafeVault } from '../safecracking/StethoscopeSafeVault'
import { ClandestineChemLab } from '../lab/ClandestineChemLab'
import { StationMoleHuntBoard } from '../molehunt/StationMoleHuntBoard'
import { EmbassyGalaEavesdrop } from '../social/EmbassyGalaEavesdrop'
import { BorderExfiltrationRun } from '../exfiltration/BorderExfiltrationRun'
import { OperativeServiceRecord } from '../career/OperativeServiceRecord'
import { AgentPortrait } from './AgentPortrait'
import {
  Shield,
  AlertTriangle,
  Send,
  Zap,
  MapPin,
  FolderOpen,
  Crosshair,
  Volume2,
  VolumeX,
  Tv,
  LogOut,
  FileText,
  Maximize2,
  Minimize2,
  Expand,
  CheckCircle2,
  Footprints,
  Sparkles,
  Radio,
  Briefcase,
  Activity,
  Globe,
  Camera,
  FileBadge,
  Compass,
  Lock,
  Droplets,
  UserX,
  Wine,
  Award,
  FlaskConical,
  Flag,
  Eye
} from 'lucide-react'

export type DeckTab =
  | 'map'
  | 'combat'
  | 'chase'
  | 'safecracking'
  | 'exfiltration'
  | 'sigint'
  | 'countertail'
  | 'deaddrop'
  | 'embassygala'
  | 'darkroom'
  | 'chemlab'
  | 'interrogate'
  | 'corkboard'
  | 'passport'
  | 'armory'
  | 'molehunt'
  | 'servicerecord'
  | 'atlas'

export type ConsoleDepartment = 'field' | 'surveillance' | 'forensics' | 'hq'

export const PlayCockpit: React.FC = () => {
  const agent = useGameStore((s) => s.agent)
  const blueprint = useGameStore((s) => s.blueprint)
  const currentScene = useGameStore((s) => s.currentScene)
  const alertLevel = useGameStore((s) => s.alertLevel)
  const coverIntegrity = useGameStore((s) => s.coverIntegrity)
  const logs = useGameStore((s) => s.logs)
  const suggestedActions = useGameStore((s) => s.suggestedActions)
  const submitAction = useGameStore((s) => s.submitAction)
  const setPhase = useGameStore((s) => s.setPhase)
  const soundMuted = useGameStore((s) => s.soundMuted)
  const toggleSound = useGameStore((s) => s.toggleSound)
  const toggleCRT = useGameStore((s) => s.toggleCRT)
  const finishMission = useGameStore((s) => s.finishMission)
  const latestActionOutcome = useGameStore((s) => s.latestActionOutcome)

  const [activeTab, setActiveTab] = useState<DeckTab>('map')
  const [customAction, setCustomAction] = useState('')
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [isDeckExpanded, setIsDeckExpanded] = useState(false)
  const [isTheaterOpen, setIsTheaterOpen] = useState(false)

  // Ref to automatically auto-scroll narrative feed down to the latest entry
  const logsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  // Listen for Escape key to close theater / collapse deck
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isTheaterOpen) setIsTheaterOpen(false)
        else if (isDeckExpanded) setIsDeckExpanded(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isTheaterOpen, isDeckExpanded])

  if (!blueprint || !agent) return null

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customAction.trim()) return
    submitAction(customAction.trim())
    setCustomAction('')
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'map':
        return <TacticalBlueprintMap />
      case 'combat':
        return <BallisticCombatView />
      case 'chase':
        return <ChaseTrackView />
      case 'safecracking':
        return <StethoscopeSafeVault />
      case 'exfiltration':
        return <BorderExfiltrationRun />
      case 'sigint':
        return <AudioInterceptDecoder />
      case 'countertail':
        return <CounterSurveillanceTail />
      case 'deaddrop':
        return <DeadDropNetwork />
      case 'embassygala':
        return <EmbassyGalaEavesdrop />
      case 'darkroom':
        return <MicrofilmDarkroom />
      case 'chemlab':
        return <ClandestineChemLab />
      case 'interrogate':
        return <PolygraphInterrogation />
      case 'corkboard':
        return <EvidenceCorkboard />
      case 'passport':
        return <CoverPassportBook />
      case 'armory':
        return <BriefcaseLoadout />
      case 'molehunt':
        return <StationMoleHuntBoard />
      case 'servicerecord':
        return <OperativeServiceRecord />
      case 'atlas':
        return <GlobalCampaignAtlas />
    }
  }

  const [selectedDept, setSelectedDept] = useState<ConsoleDepartment>('field')

  const deckTabs: { id: DeckTab; label: string; icon: any; dept: ConsoleDepartment }[] = [
    // Field Ops
    { id: 'map', label: 'MAP', icon: MapPin, dept: 'field' },
    { id: 'combat', label: 'COMBAT', icon: Crosshair, dept: 'field' },
    { id: 'chase', label: 'CHASE', icon: Zap, dept: 'field' },
    { id: 'safecracking', label: 'SAFE VAULT', icon: Lock, dept: 'field' },
    { id: 'exfiltration', label: 'BORDER EXFIL', icon: Flag, dept: 'field' },

    // Surveillance
    { id: 'sigint', label: 'SIGINT', icon: Radio, dept: 'surveillance' },
    { id: 'countertail', label: 'COUNTER-TAIL', icon: Eye, dept: 'surveillance' },
    { id: 'deaddrop', label: 'DEAD-DROP', icon: Compass, dept: 'surveillance' },
    { id: 'embassygala', label: 'EMBASSY GALA', icon: Wine, dept: 'surveillance' },

    // Forensics & Lab
    { id: 'darkroom', label: 'DARKROOM', icon: Camera, dept: 'forensics' },
    { id: 'chemlab', label: 'CHEM LAB', icon: FlaskConical, dept: 'forensics' },
    { id: 'interrogate', label: 'POLYGRAPH', icon: Activity, dept: 'forensics' },
    { id: 'corkboard', label: 'EVIDENCE', icon: FolderOpen, dept: 'forensics' },

    // HQ Archives & Personnel
    { id: 'passport', label: 'PASSPORT', icon: FileBadge, dept: 'hq' },
    { id: 'armory', label: 'ARMORY', icon: Briefcase, dept: 'hq' },
    { id: 'molehunt', label: 'MOLE HUNT', icon: UserX, dept: 'hq' },
    { id: 'servicerecord', label: 'SERVICE RECORD', icon: Award, dept: 'hq' },
    { id: 'atlas', label: 'ATLAS', icon: Globe, dept: 'hq' }
  ]

  const departments: { id: ConsoleDepartment; label: string }[] = [
    { id: 'field', label: 'FIELD OPS' },
    { id: 'surveillance', label: 'SURVEILLANCE' },
    { id: 'forensics', label: 'FORENSICS' },
    { id: 'hq', label: 'HQ ARCHIVES' }
  ]

  return (
    <div className="relative min-h-screen h-[100dvh] max-h-[100dvh] w-full bg-[#07090D] text-[#EDE5D8] flex flex-col justify-between overflow-hidden select-none">
      {/* 1. TOP COMMAND HEADER */}
      <header className="h-12 border-b border-[#C9A227]/30 bg-[#0F131A] px-3 sm:px-6 flex items-center justify-between text-xs font-mono z-30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-red-950/80 border border-red-600 text-red-400 font-black tracking-widest text-[10px]">
            BLACK DOSSIER
          </div>
          <span className="hidden sm:inline-block text-stone-400">
            OPERATION: <strong className="text-[#F2D06B]">{blueprint.codeName}</strong>
          </span>
          <span className="text-[10px] text-stone-500 font-bold hidden md:inline-block">
            [{blueprint.city.toUpperCase()}]
          </span>
          {/* Active Sector Location Tag in Top Bar */}
          <div className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-600 text-cyan-300 text-[10px] font-bold">
            <Footprints className="w-3 h-3 text-cyan-400" />
            <span>SECTOR: {currentScene?.venueName || 'Outer Perimeter'}</span>
          </div>
        </div>

        {/* Global Controls & Metrics */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-stone-400">ALERT:</span>
            <span
              className={`px-1.5 py-0.2 rounded font-bold ${
                alertLevel >= 3 ? 'bg-red-900 text-white animate-pulse' : 'bg-stone-800 text-stone-200'
              }`}
            >
              LVL {alertLevel}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] hidden sm:flex">
            <span className="text-stone-400">COVER:</span>
            <span className="font-bold text-cyan-400">{coverIntegrity}%</span>
          </div>

          <div className="h-4 w-[1px] bg-stone-700 mx-1 hidden sm:block" />

          {/* Quick Global Atlas shortcut */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('atlas')
              setIsTheaterOpen(true)
            }}
            title="Open Global Campaign Atlas"
            className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-blue-950/80 hover:bg-blue-900 border border-blue-600 text-blue-300 flex items-center gap-1 cursor-pointer hidden md:flex shadow"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>GLOBAL ATLAS</span>
          </button>

          {/* Expand View Quick Toggle */}
          <button
            type="button"
            onClick={() => setIsDeckExpanded(!isDeckExpanded)}
            title={isDeckExpanded ? 'Reset Column Width' : 'Expand Visual Deck Width'}
            className={`px-2.5 py-1 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer hidden lg:flex ${
              isDeckExpanded
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-600/40'
            }`}
          >
            {isDeckExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isDeckExpanded ? 'SHRINK DECK' : 'EXPAND DECK'}</span>
          </button>

          {/* CRT & Audio Toggles */}
          <button
            type="button"
            onClick={toggleCRT}
            title="Toggle CRT Screen Scanlines"
            className="p-1.5 rounded hover:bg-stone-800 text-stone-400 hover:text-white cursor-pointer"
          >
            <Tv className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={toggleSound}
            title="Toggle Audio Synthesizer"
            className="p-1.5 rounded hover:bg-stone-800 text-stone-400 hover:text-white cursor-pointer"
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
          <button
            type="button"
            onClick={() => finishMission('success')}
            className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-600 text-emerald-300 text-[10px] font-bold tracking-wider hover:bg-emerald-900 cursor-pointer hidden sm:block"
          >
            EXFILTRATE
          </button>
        </div>
      </header>

      {/* 2. MAIN 3-ZONE COCKPIT (Zone 3 expands dynamically) */}
      <div
        className={`flex-1 grid grid-cols-1 transition-all duration-300 ease-in-out gap-3 p-2 sm:p-4 overflow-hidden h-[calc(100dvh-100px)] ${
          isDeckExpanded
            ? 'lg:grid-cols-[0px_340px_1fr]'
            : 'lg:grid-cols-[240px_1fr_minmax(560px,1.35fr)] xl:grid-cols-[260px_1fr_minmax(660px,1.45fr)] 2xl:grid-cols-[280px_1fr_minmax(780px,1.6fr)]'
        }`}
      >
        {/* =====================================================================
            ZONE 1 (LEFT): OPERATIVE STATUS DOSSIER (Collapses when expanded)
            ===================================================================== */}
        <aside
          className={`flex-col justify-between p-3.5 rounded-xl bg-[#0D1016] border border-[#C9A227]/30 shadow-xl overflow-y-auto transition-all duration-300 ${
            isDeckExpanded ? 'hidden' : 'hidden lg:flex'
          }`}
        >
          <div>
            <div className="flex items-center gap-3 pb-3 border-b border-stone-800 mb-3">
              <AgentPortrait portrait={agent.portrait} size="md" />
              <div>
                <div className="text-[10px] font-mono text-red-500 font-bold uppercase tracking-wider">
                  OPERATIVE ACTIVE
                </div>
                <div className="font-serif font-black text-lg text-[#F2D06B]">
                  {agent.codename}
                </div>
                <div className="text-[11px] font-mono text-stone-400">
                  {agent.division.split('—')[0]}
                </div>
              </div>
            </div>

            {/* Vitals */}
            <div className="flex flex-col gap-2 font-mono text-xs">
              <div>
                <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                  <span>WOUND INTEGRITY</span>
                  <strong className="text-white">
                    {agent.currentWP} / {agent.maxWP} WP
                  </strong>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-900 border border-stone-700 overflow-hidden">
                  <div
                    className={`h-full ${
                      agent.currentWP > agent.maxWP * 0.5 ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'
                    }`}
                    style={{ width: `${Math.max(0, (agent.currentWP / agent.maxWP) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between p-2 rounded bg-black/40 border border-stone-800 mt-1">
                <span className="text-stone-400">COMPOSURE:</span>
                <strong className="text-cyan-400">{agent.currentComposure} / {agent.maxComposure}</strong>
              </div>

              <div className="flex justify-between p-2 rounded bg-black/40 border border-stone-800">
                <span className="text-stone-400">EDGE POINTS:</span>
                <strong className="text-amber-400">{agent.edgePoints}</strong>
              </div>

              <div className="flex justify-between p-2 rounded bg-black/40 border border-stone-800">
                <span className="text-stone-400">CLEARANCE:</span>
                <strong className="text-[#F2D06B]">LEVEL {agent.clearanceLevel}</strong>
              </div>
            </div>

            {/* Inventory List */}
            <div className="mt-4 pt-3 border-t border-stone-800">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest block mb-2">
                EQUIPPED HARDWARE ({agent.inventory.length})
              </span>
              <div className="flex flex-col gap-1.5 font-mono text-xs">
                {agent.inventory.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 rounded bg-black/50 border border-stone-800 flex justify-between items-center"
                  >
                    <span className="text-stone-300 font-bold">{item.name}</span>
                    <span className="text-[10px] text-stone-500">{item.concealability}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 text-[10px] font-mono text-stone-500 border-t border-stone-800">
            DISAVOWAL PROTOCOL ENFORCED
          </div>
        </aside>

        {/* =====================================================================
            ZONE 2 (CENTER): NARRATIVE FEED & IMMEDIATE ACTION RESULTS CONSOLE
            ===================================================================== */}
        <main className="flex flex-col justify-between h-full rounded-xl bg-[#0B0E14] border border-[#C9A227]/30 shadow-2xl p-3 sm:p-4 overflow-hidden">
          {/* Narrative Transcript Log (Auto-Scrolls Down Automatically) */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 font-mono text-xs sm:text-sm leading-relaxed">
            {logs.map((log) => (
              <div
                key={log.id}
                className={`p-3 rounded-lg border ${
                  log.speaker === 'HANDLER'
                    ? 'bg-[#10141D] border-cyan-900/60 text-[#EDE5D8]'
                    : log.speaker === 'SYSTEM'
                    ? 'bg-amber-950/20 border-amber-800/40 text-amber-300'
                    : 'bg-black/60 border-stone-800 text-stone-300'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 mb-1">
                  <span className="font-bold text-[#F2D06B] tracking-wider uppercase">
                    [{log.speaker}]
                  </span>
                  <span>{log.timestamp}</span>
                </div>
                <p className="whitespace-pre-line">{log.text}</p>
              </div>
            ))}
            {/* Auto-scroll anchor */}
            <div ref={logsEndRef} />
          </div>

          {/* ===================================================================
              IMMEDIATE ACTION RESULTS HUD BOX (Visible at once without scrolling!)
              =================================================================== */}
          <AnimatePresence>
            {latestActionOutcome && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="my-2 p-3 rounded-xl bg-gradient-to-r from-[#0d1627] to-[#0a1120] border-2 border-cyan-500/80 shadow-2xl font-mono shrink-0"
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-cyan-800/50 mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span>LATEST TACTICAL ACTION OUTCOME</span>
                  </div>
                  <span className="text-[10px] text-stone-400">{latestActionOutcome.timestamp}</span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex-1">
                    <div className="text-xs text-stone-300 font-bold">
                      ACTION: <span className="text-white">"{latestActionOutcome.action}"</span>
                    </div>
                    <p className="text-xs text-cyan-200 mt-1 leading-snug">
                      {latestActionOutcome.response}
                    </p>
                  </div>

                  {/* Dice Result Badge */}
                  <div
                    className={`px-3 py-1.5 rounded-lg border text-center font-black text-xs uppercase tracking-wider shrink-0 ${
                      latestActionOutcome.result.outcome === 'CRITICAL'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                        : latestActionOutcome.result.outcome === 'SUCCESS'
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                        : latestActionOutcome.result.outcome === 'FUMBLE'
                        ? 'bg-red-950 text-red-300 border-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                        : 'bg-amber-950 text-amber-300 border-amber-500'
                    }`}
                  >
                    <div>{latestActionOutcome.result.outcome}</div>
                    <div className="text-[10px] font-normal text-stone-300">
                      ROLL {latestActionOutcome.result.roll} / {latestActionOutcome.result.target}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Selector & Quick Tactical Buttons */}
          <div className="mt-2 pt-2 border-t border-stone-800 flex flex-col gap-2 shrink-0">
            {/* 3 Suggested Action Chips */}
            <div className="flex flex-col sm:flex-row gap-1.5">
              {suggestedActions.map((action, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => submitAction(action)}
                  className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#141923] hover:bg-[#1E2535] border border-cyan-800/40 text-left text-[11px] font-mono text-cyan-200 transition-all active:scale-95 cursor-pointer line-clamp-1 shadow"
                >
                  › {action}
                </button>
              ))}
            </div>

            {/* Free-Text Prompt Input Form */}
            <form onSubmit={handleCustomSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter tactical directive (e.g. 'Search desk for cipher key', 'Draw suppressed pistol')..."
                value={customAction}
                onChange={(e) => setCustomAction(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-xl bg-black/60 border border-stone-700 text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-[#F2D06B]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F2D06B] via-[#FFE28A] to-[#C9A227] text-black font-mono font-black text-xs uppercase tracking-wider flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-md"
              >
                <span>TRANSMIT</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </main>

        {/* =====================================================================
            ZONE 3 (RIGHT): EXPANDABLE INTERACTIVE DECK WITH 8 FULL THEATER SYSTEMS
            ===================================================================== */}
        <section className="hidden lg:flex flex-col justify-between h-full rounded-xl bg-[#0B0E14] border border-[#C9A227]/40 shadow-2xl p-3 overflow-hidden">
          {/* Deck Tab Bar & Expand Controls */}
          <div className="flex items-center justify-between pb-2.5 border-b border-stone-800 mb-2 font-mono text-xs">
            <div className="flex flex-col gap-1.5 flex-1 mr-2">
              {/* Department Console Selector */}
              <div className="flex items-center gap-1">
                {departments.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      setSelectedDept(d.id)
                      const firstInDept = deckTabs.find(t => t.dept === d.id)
                      if (firstInDept) setActiveTab(firstInDept.id)
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                      selectedDept === d.id
                        ? 'bg-[#C9A227] text-black shadow'
                        : 'bg-stone-900/80 text-stone-500 hover:text-stone-300'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              {/* Department Sub-Tabs */}
              <div className="flex flex-wrap gap-1">
                {deckTabs
                  .filter((tab) => tab.dept === selectedDept)
                  .map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-2 py-1 rounded-md font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer ${
                          activeTab === tab.id
                            ? 'bg-[#F2D06B] text-black shadow-md scale-105'
                            : 'bg-stone-900 text-stone-400 hover:text-white'
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                        <span>{tab.label}</span>
                      </button>
                    )
                  })}
              </div>
            </div>

            {/* Click-to-Expand / Theater Controls */}
            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <button
                type="button"
                onClick={() => setIsTheaterOpen(true)}
                title="Open Ultra-Large Theater View"
                className="px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-amber-600/40 text-[#F2D06B] text-xs font-bold font-mono flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow"
              >
                <Expand className="w-3.5 h-3.5" />
                <span>THEATER</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDeckExpanded(!isDeckExpanded)}
                title={isDeckExpanded ? 'Shrink Deck Column' : 'Expand Deck Column'}
                className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white transition-all cursor-pointer"
              >
                {isDeckExpanded ? <Minimize2 className="w-4 h-4 text-amber-400" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Active Viewport (Takes full available height) */}
          <div className="flex-1 overflow-y-auto rounded-lg">
            {renderActiveView()}
          </div>
        </section>
      </div>

      {/* 3. MOBILE BOTTOM NAVIGATION DOCK (Viewport < 1024px) */}
      <footer className="flex lg:hidden items-center justify-around h-14 border-t border-[#C9A227]/30 bg-[#0F131A] px-2 z-30 shrink-0 font-mono text-[9px]">
        {departments.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => {
              setSelectedDept(d.id)
              const firstInDept = deckTabs.find(t => t.dept === d.id)
              if (firstInDept) setActiveTab(firstInDept.id)
              setIsTheaterOpen(true)
            }}
            className={`flex flex-col items-center gap-0.5 cursor-pointer ${
              selectedDept === d.id ? 'text-[#F2D06B] font-bold' : 'text-stone-400'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{d.label}</span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="flex flex-col items-center gap-0.5 text-cyan-400 cursor-pointer"
        >
          <Shield className="w-4 h-4" />
          <span>STATUS</span>
        </button>
      </footer>

      {/* 4. FULL THEATER OVERLAY MODAL (When user clicks THEATER) */}
      <AnimatePresence>
        {isTheaterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full h-full max-w-7xl max-h-[96vh] rounded-2xl bg-[#080B10] border-2 border-[#C9A227] shadow-[0_0_120px_rgba(0,0,0,0.95)] flex flex-col p-3 sm:p-5 overflow-hidden"
            >
              {/* Theater Header with All 8 Navigation Tabs & Close */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-3 shrink-0 font-mono">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <div className="px-2.5 py-1 rounded bg-[#C9A227]/20 border border-[#C9A227] text-[#F2D06B] font-bold text-xs uppercase tracking-widest hidden sm:block">
                    MAXIMIZED THEATER
                  </div>
                  {/* Big Tabs */}
                  <div className="flex flex-col gap-1.5">
                    {/* Department Selector */}
                    <div className="flex items-center gap-1.5">
                      {departments.map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => {
                            setSelectedDept(d.id)
                            const first = deckTabs.find(t => t.dept === d.id)
                            if (first) setActiveTab(first.id)
                          }}
                          className={`px-2.5 py-1 rounded text-xs font-bold uppercase transition-all cursor-pointer ${
                            selectedDept === d.id
                              ? 'bg-[#C9A227] text-black shadow'
                              : 'bg-stone-900 text-stone-400 hover:text-white'
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>

                    {/* Department Sub-Tabs */}
                    <div className="flex flex-wrap gap-1 sm:gap-1.5">
                      {deckTabs
                        .filter((t) => t.dept === selectedDept)
                        .map((tab) => {
                          const Icon = tab.icon
                          return (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => setActiveTab(tab.id)}
                              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1 cursor-pointer ${
                                activeTab === tab.id
                                  ? 'bg-[#F2D06B] text-black shadow-lg scale-105'
                                  : 'bg-stone-900 text-stone-400 hover:text-white'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              <span>{tab.label}</span>
                            </button>
                          )
                        })}
                    </div>
                  </div>
                </div>

                {/* Close Theater Button */}
                <button
                  type="button"
                  onClick={() => setIsTheaterOpen(false)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-600 text-red-300 font-mono text-xs sm:text-sm font-bold tracking-wider transition-all active:scale-95 cursor-pointer shadow"
                >
                  <Minimize2 className="w-4 h-4" />
                  <span>CLOSE [ESC]</span>
                </button>
              </div>

              {/* Theater Viewport (Full Screen Size) */}
              <div className="flex-1 overflow-y-auto rounded-xl">
                {renderActiveView()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Mobile Drawer for Operative Status */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-end bg-black/80 backdrop-blur-sm lg:hidden">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full max-h-[80vh] p-5 rounded-t-2xl bg-[#0D1016] border-t-2 border-[#C9A227] flex flex-col gap-4 font-mono text-xs overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <span className="font-serif font-black text-lg text-[#F2D06B]">OPERATIVE STATUS</span>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 rounded text-stone-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center gap-3">
                <AgentPortrait portrait={agent.portrait} size="sm" />
                <div>
                  <div className="font-bold text-white text-base">{agent.codename}</div>
                  <div className="text-stone-400">{agent.division}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded bg-black/50 border border-stone-800">
                  <div className="text-stone-400 text-[10px]">VITALITY</div>
                  <strong className="text-emerald-400">{agent.currentWP} / {agent.maxWP} WP</strong>
                </div>
                <div className="p-2 rounded bg-black/50 border border-stone-800">
                  <div className="text-stone-400 text-[10px]">COMPOSURE</div>
                  <strong className="text-cyan-400">{agent.currentComposure}</strong>
                </div>
                <div className="p-2 rounded bg-black/50 border border-stone-800">
                  <div className="text-stone-400 text-[10px]">EDGE POINTS</div>
                  <strong className="text-amber-400">{agent.edgePoints}</strong>
                </div>
                <div className="p-2 rounded bg-black/50 border border-stone-800">
                  <div className="text-stone-400 text-[10px]">CLEARANCE</div>
                  <strong className="text-[#F2D06B]">LEVEL {agent.clearanceLevel}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="w-full py-2.5 rounded bg-stone-900 text-stone-300 font-bold"
              >
                CLOSE [ESC]
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
