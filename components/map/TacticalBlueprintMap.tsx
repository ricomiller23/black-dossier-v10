'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGameStore } from '@/lib/store'
import {
  Shield,
  Eye,
  AlertTriangle,
  Key,
  Terminal,
  Radio,
  Navigation,
  CheckCircle2,
  Footprints,
  Crosshair,
  Skull
} from 'lucide-react'

export const TacticalBlueprintMap: React.FC = () => {
  const blueprint = useGameStore((s) => s.blueprint)
  const agent = useGameStore((s) => s.agent)
  const currentScene = useGameStore((s) => s.currentScene)
  const moveToScene = useGameStore((s) => s.moveToScene)
  const alertLevel = useGameStore((s) => s.alertLevel)
  const revealedClues = useGameStore((s) => s.revealedClues)
  const visitedSceneIds = useGameStore((s) => s.visitedSceneIds || [])
  const latestActionOutcome = useGameStore((s) => s.latestActionOutcome)
  const sentries = useGameStore((s) => s.sentries)
  const neutralizeSentry = useGameStore((s) => s.neutralizeSentry)

  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [selectedHidingSpot, setSelectedHidingSpot] = useState<string | null>(null)

  if (!blueprint) return null

  // Coordinates for all nodes on the 840x480 blueprint canvas
  const scenePositions: Record<string, { x: number; y: number; label: string; sector: string }> = {
    scene_1_approach: { x: 130, y: 350, label: 'APPROACH', sector: 'SECTOR A: SERVICE DECK' },
    scene_2_interior: { x: 350, y: 340, label: 'SUB-LEVEL', sector: 'SECTOR B-1: STEAM GALLERY' },
    scene_2_social: { x: 350, y: 160, label: 'MEZZANINE', sector: 'SECTOR B-2: MEZZANINE SALON' },
    scene_3_vault: { x: 590, y: 240, label: 'VAULT', sector: 'SECTOR C: REINFORCED VAULT' },
    scene_4_extraction: { x: 730, y: 130, label: 'EXFIL', sector: 'SECTOR D: ROOFTOP HELIPAD' }
  }

  const currentPos = currentScene && scenePositions[currentScene.id] ? scenePositions[currentScene.id] : { x: 130, y: 350, label: 'APPROACH', sector: 'SECTOR A' }

  return (
    <div className="relative w-full h-full min-h-[460px] sm:min-h-[540px] md:min-h-[620px] rounded-xl overflow-hidden border border-[#0ea5e9]/40 bg-[#040d1a] shadow-[0_0_50px_rgba(14,165,233,0.18)] select-none flex flex-col justify-between">
      {/* 1. Blueprint Grid Lines */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #0ea5e9 1px, transparent 1px), linear-gradient(to bottom, #0ea5e9 1px, transparent 1px)',
          backgroundSize: '36px 36px'
        }}
      />

      {/* 2. Top Status HUD Bar */}
      <div className="relative top-0 inset-x-0 p-3 flex flex-wrap items-center justify-between text-[11px] sm:text-xs font-mono z-30 bg-[#081b33]/90 border-b border-[#0ea5e9]/30 gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#081b33] border border-[#0ea5e9]/50 text-[#38bdf8]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] animate-ping" />
            <span className="font-bold uppercase tracking-wider text-xs sm:text-sm">
              CAD BLUEPRINT // {blueprint.city.toUpperCase()}
            </span>
          </div>

          <div className="px-2.5 py-1 rounded bg-amber-950/70 border border-amber-600/60 text-amber-300 font-bold text-[11px] flex items-center gap-1.5 shadow">
            <Navigation className="w-3.5 h-3.5 text-amber-400" />
            <span>YOU ARE IN: <strong className="text-white">{currentPos.sector}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 border border-stone-800 text-[10px] text-stone-300">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>HOSTILE PATROLS: {sentries.filter(s => s.status === 'patrolling').length} ACTIVE</span>
          </div>
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded border text-[10px] sm:text-xs font-bold ${
            alertLevel >= 3
              ? 'border-red-500/80 bg-red-950/80 text-red-300 animate-pulse'
              : 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300'
          }`}>
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>ALERT: LVL {alertLevel}</span>
          </div>
        </div>
      </div>

      {/* 2.5 Active Sentries Quick Takedown Strip */}
      <div className="relative z-30 px-3 py-1.5 bg-[#090f1a]/90 border-b border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-stone-400 text-[11px]">
          <Crosshair className="w-3.5 h-3.5 text-red-400" />
          <span>SENTRY TARGETING:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {sentries.map((s) => (
            <div key={s.id} className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 border border-stone-800 text-[10px]">
              <span className={s.status === 'patrolling' ? 'text-amber-300 font-bold' : 'text-stone-600 line-through'}>
                {s.name} [{s.status.toUpperCase()}]
              </span>
              {s.status === 'patrolling' && (
                <button
                  type="button"
                  onClick={() => neutralizeSentry(s.id)}
                  className="px-2 py-0.5 rounded bg-red-950 hover:bg-red-900 border border-red-700 text-red-200 text-[9px] font-bold uppercase transition-all cursor-pointer active:scale-95 shadow"
                >
                  SILENT TAKEDOWN
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Sweeping Radar Beam Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] origin-center pointer-events-none"
          style={{
            background:
              'conic-gradient(from 0deg at 50% 50%, rgba(14, 165, 233, 0.22) 0deg, rgba(14, 165, 233, 0) 50deg, transparent 360deg)'
          }}
        />
      </div>

      {/* 4. Interactive SVG Architectural Floorplan with Sentry Patrols */}
      <div className="relative flex-1 w-full flex items-center justify-center p-2 z-20">
        <svg
          viewBox="0 0 840 480"
          className="w-full h-full max-h-[75vh]"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="amberGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="redGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="roomSpotlight" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#0ea5e9" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="sentryFlashlight" cx="0%" cy="50%" r="100%">
              <stop offset="0%" stopColor="#facc15" stopOpacity="0.6" />
              <stop offset="70%" stopColor="#eab308" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Outer Venue Perimeter Walls */}
          <rect
            x="40"
            y="40"
            width="760"
            height="400"
            rx="14"
            fill="#06182e"
            fillOpacity="0.75"
            stroke="#0ea5e9"
            strokeWidth="2"
            strokeDasharray="8 4"
          />

          {/* Sector Compartments */}
          {/* Sector A: Entry Corridors */}
          <rect
            x="65"
            y="270"
            width="230"
            height="150"
            fill={currentScene?.id === 'scene_1_approach' ? '#0f3869' : '#0b2342'}
            fillOpacity="0.65"
            stroke={currentScene?.id === 'scene_1_approach' ? '#38bdf8' : '#0ea5e9'}
            strokeWidth={currentScene?.id === 'scene_1_approach' ? 2 : 1.2}
          />
          <text x="75" y="295" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace" opacity="0.9">SECTOR A: ALLEYWAY & SERVICE DECK</text>

          {/* Sector B1: Maintenance Sub-Level */}
          <rect
            x="320"
            y="270"
            width="230"
            height="150"
            fill={currentScene?.id === 'scene_2_interior' ? '#0f3869' : '#0b2342'}
            fillOpacity="0.65"
            stroke={currentScene?.id === 'scene_2_interior' ? '#38bdf8' : '#0ea5e9'}
            strokeWidth={currentScene?.id === 'scene_2_interior' ? 2 : 1.2}
          />
          <text x="330" y="295" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace" opacity="0.9">SECTOR B-1: STEAM GALLERY</text>

          {/* Sector B2: VIP Reception */}
          <rect
            x="320"
            y="60"
            width="230"
            height="190"
            fill={currentScene?.id === 'scene_2_social' ? '#0f3869' : '#0b2342'}
            fillOpacity="0.65"
            stroke={currentScene?.id === 'scene_2_social' ? '#38bdf8' : '#0ea5e9'}
            strokeWidth={currentScene?.id === 'scene_2_social' ? 2 : 1.2}
          />
          <text x="330" y="85" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace" opacity="0.9">SECTOR B-2: MEZZANINE SALON</text>

          {/* Sector C: Vault & Archive */}
          <rect
            x="570"
            y="160"
            width="210"
            height="180"
            fill={currentScene?.id === 'scene_3_vault' ? '#0f3869' : '#0b2342'}
            fillOpacity="0.65"
            stroke={currentScene?.id === 'scene_3_vault' ? '#38bdf8' : '#0ea5e9'}
            strokeWidth={currentScene?.id === 'scene_3_vault' ? 2 : 1.2}
          />
          <text x="580" y="185" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace" opacity="0.9">SECTOR C: REINFORCED VAULT</text>

          {/* Sector D: Rooftop Extraction */}
          <rect
            x="570"
            y="60"
            width="210"
            height="85"
            fill={currentScene?.id === 'scene_4_extraction' ? '#14462e' : '#08281a'}
            fillOpacity="0.65"
            stroke={currentScene?.id === 'scene_4_extraction' ? '#34d399' : '#10b981'}
            strokeWidth={currentScene?.id === 'scene_4_extraction' ? 2 : 1.2}
          />
          <text x="580" y="85" fill="#34d399" fontSize="11" fontWeight="bold" fontFamily="monospace" opacity="0.9">SECTOR D: ROOFTOP HELIPAD</text>

          {/* Laser Tripwires */}
          <line x1="320" y1="260" x2="550" y2="260" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.85">
            <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite" />
          </line>

          {/* Security Cameras */}
          <path d="M 65 60 L 160 140 L 220 70 Z" fill="#ef4444" fillOpacity="0.12" stroke="#ef4444" strokeWidth="0.8">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="-15 65 60; 25 65 60; -15 65 60"
              dur="6s"
              repeatCount="indefinite"
            />
          </path>
          <circle cx="65" cy="60" r="5" fill="#ef4444" />

          {/* Corridor Connection Paths */}
          {blueprint.scenes.map((scene) => {
            const start = scenePositions[scene.id]
            if (!start) return null

            return scene.nextScenes.map((targetId) => {
              const end = scenePositions[targetId]
              if (!end) return null
              const isUnlocked = currentScene?.id === scene.id || currentScene?.id === targetId

              return (
                <g key={`path-${scene.id}-${targetId}`}>
                  <line
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke={isUnlocked ? '#38bdf8' : '#1e3a5f'}
                    strokeWidth={isUnlocked ? 3 : 1.5}
                    strokeDasharray={isUnlocked ? '6 4' : '3 4'}
                  />
                  {currentScene?.id === scene.id && (
                    <circle
                      cx={(start.x + end.x) / 2}
                      cy={(start.y + end.y) / 2}
                      r="4"
                      fill="#38bdf8"
                      className="animate-pulse"
                    />
                  )}
                </g>
              )
            })
          })}

          {/* Static Scene Target Nodes */}
          {blueprint.scenes.map((scene) => {
            const pos = scenePositions[scene.id]
            if (!pos) return null

            const isCurrent = currentScene?.id === scene.id
            const isVisited = visitedSceneIds.includes(scene.id)
            const isAccessible = currentScene?.nextScenes.includes(scene.id)
            const isExtraction = scene.type === 'extraction'
            const isClimax = scene.type === 'climax'

            return (
              <g
                key={scene.id}
                className="cursor-pointer group"
                onClick={() => {
                  if (isAccessible) moveToScene(scene.id)
                }}
                onMouseEnter={() => setHoveredNode(scene.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="22"
                  fill={isCurrent ? '#0369a1' : isExtraction ? '#15803d' : isClimax ? '#b91c1c' : isVisited ? '#1e293b' : '#0f172a'}
                  stroke={isAccessible ? '#38bdf8' : isVisited ? '#10b981' : '#334155'}
                  strokeWidth={isAccessible ? 3 : 1.5}
                />
                <text
                  x={pos.x}
                  y={pos.y + 5}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#ffffff"
                  fontWeight="bold"
                  fontFamily="monospace"
                  pointerEvents="none"
                >
                  {isExtraction ? 'EXT' : isClimax ? 'OBJ' : isVisited && !isCurrent ? '✓' : scene.type === 'approach' ? '01' : '02'}
                </text>
                <rect
                  x={pos.x - 75}
                  y={pos.y + 28}
                  width="150"
                  height="20"
                  rx="4"
                  fill="#030712"
                  fillOpacity="0.9"
                  stroke={isAccessible ? '#38bdf8' : isVisited ? '#10b981' : '#1e293b'}
                  strokeWidth="1.2"
                />
                <text
                  x={pos.x}
                  y={pos.y + 42}
                  textAnchor="middle"
                  fill={isAccessible ? '#38bdf8' : isVisited ? '#a7f3d0' : '#94a3b8'}
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="monospace"
                  pointerEvents="none"
                >
                  {scene.type.toUpperCase()}: {scene.venueName.substring(0, 15)}
                </text>
              </g>
            )
          })}

          {/* ===============================================================
              DYNAMIC SENTRY PATROLS & FLASHLIGHT CONES (§14 Feature 1)
              =============================================================== */}
          {sentries.map((sentry) => {
            if (sentry.status === 'neutralized') {
              return (
                <g key={sentry.id} transform={`translate(${sentry.x}, ${sentry.y})`}>
                  <circle cx="0" cy="0" r="14" fill="#1c1917" stroke="#dc2626" strokeWidth="1.5" opacity="0.6" />
                  <line x1="-8" y1="-8" x2="8" y2="8" stroke="#dc2626" strokeWidth="2" />
                  <line x1="8" y1="-8" x2="-8" y2="8" stroke="#dc2626" strokeWidth="2" />
                  <text x="0" y="24" textAnchor="middle" fill="#ef4444" fontSize="9" fontFamily="monospace">
                    NEUTRALIZED
                  </text>
                </g>
              )
            }

            return (
              <g
                key={sentry.id}
                transform={`translate(${sentry.x}, ${sentry.y})`}
                className="cursor-pointer"
                onClick={() => neutralizeSentry(sentry.id)}
              >
                {/* Rotating Flashlight Vision Cone */}
                <path
                  d="M 0 0 L -45 -110 L 45 -110 Z"
                  fill="url(#sentryFlashlight)"
                  stroke="#facc15"
                  strokeWidth="0.8"
                  strokeOpacity="0.4"
                  className="animate-pulse"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="-30 0 0; 30 0 0; -30 0 0"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                </path>

                {/* Sentry Body Disc */}
                <circle cx="0" cy="0" r="15" fill="#991b1b" stroke="#fca5a5" strokeWidth="2" filter="url(#redGlow)" />
                <circle cx="0" cy="0" r="8" fill="#ffffff" />
                <line x1="0" y1="0" x2="0" y2="-12" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />

                {/* Sentry Tag */}
                <g transform="translate(0, 24)">
                  <rect x="-55" y="-8" width="110" height="18" rx="4" fill="#000000" fillOpacity="0.85" stroke="#ef4444" strokeWidth="1" />
                  <text x="0" y="4" textAnchor="middle" fill="#fca5a5" fontSize="8" fontWeight="bold" fontFamily="monospace">
                    [SENTRY // TAP TO SILENT TAKEDOWN]
                  </text>
                </g>
              </g>
            )
          })}

          {/* ===============================================================
              VISUAL OPERATIVE TOKEN (ME / PLAYER TRAVERSING VENUE)
              =============================================================== */}
          <motion.g
            animate={{ x: currentPos.x, y: currentPos.y }}
            transition={{ type: 'spring', damping: 22, stiffness: 130 }}
            className="pointer-events-none z-40"
          >
            {/* Glowing Ambient Spotlight */}
            <circle cx="0" cy="0" r="70" fill="url(#roomSpotlight)" />

            {/* Radar Pulse Expanding Waves */}
            <circle cx="0" cy="0" r="32" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-ping opacity-60" />
            <circle cx="0" cy="0" r="26" fill="none" stroke="#38bdf8" strokeWidth="2.5" className="animate-pulse" />

            {/* Outer Operative Disc */}
            <circle cx="0" cy="0" r="20" fill="#f59e0b" stroke="#ffffff" strokeWidth="3" filter="url(#amberGlow)" />

            {/* Operative Spy Silhouette */}
            <path
              d="M -7 -2 C -7 -6 -3 -9 0 -9 C 3 -9 7 -6 7 -2 C 7 3 3 6 0 6 C -3 6 -7 3 -7 -2 Z"
              fill="#06090e"
            />
            <line x1="-5" y1="-2" x2="-1" y2="-2" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            <line x1="1" y1="-2" x2="5" y2="-2" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            <path d="M -9 11 L 0 6 L 9 11 Z" fill="#06090e" />

            {/* High-Contrast "YOU ARE HERE" Banner */}
            <g transform="translate(0, -38)">
              <rect
                x="-80"
                y="-14"
                width="160"
                height="24"
                rx="6"
                fill="#0b0e14"
                stroke="#f59e0b"
                strokeWidth="2"
                filter="url(#cyanGlow)"
              />
              <circle cx="-68" cy="-2" r="3.5" fill="#22c55e" className="animate-ping" />
              <circle cx="-68" cy="-2" r="3.5" fill="#22c55e" />
              <text
                x="6"
                y="2"
                textAnchor="middle"
                fill="#fbbf24"
                fontSize="11"
                fontWeight="900"
                fontFamily="monospace"
                letterSpacing="1"
              >
                YOU: {agent?.codename || 'OPERATIVE'}
              </text>
            </g>
          </motion.g>
        </svg>
      </div>

      {/* 5. Floating Tactical Action Result Toast */}
      <AnimatePresence>
        {latestActionOutcome && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-14 left-4 right-4 z-30 p-2.5 rounded-lg bg-[#0b101b]/95 border-2 border-[#38bdf8] shadow-2xl flex items-center justify-between font-mono text-xs text-white"
          >
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                  latestActionOutcome.result.outcome === 'CRITICAL'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                    : latestActionOutcome.result.outcome === 'SUCCESS'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-600'
                    : latestActionOutcome.result.outcome === 'FUMBLE'
                    ? 'bg-red-950 text-red-300 border border-red-600 animate-pulse'
                    : 'bg-amber-950 text-amber-300 border border-amber-600'
                }`}
              >
                {latestActionOutcome.result.outcome} ({latestActionOutcome.result.margin >= 0 ? `+${latestActionOutcome.result.margin}` : latestActionOutcome.result.margin})
              </span>
              <span className="text-stone-300 line-clamp-1">{latestActionOutcome.response}</span>
            </div>
            <span className="text-[10px] text-stone-500 hidden sm:inline">{latestActionOutcome.timestamp}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Bottom Interactive Node Inspector Drawer */}
      <div className="relative bottom-0 inset-x-0 p-3 flex flex-wrap items-center justify-between bg-[#071322]/95 border-t border-[#0ea5e9]/40 text-xs sm:text-sm font-mono z-30 gap-2">
        <div className="flex items-center gap-2">
          <Footprints className="w-4 h-4 text-amber-400" />
          <span className="text-stone-400">OPERATIVE LOCATION: </span>
          <strong className="text-[#38bdf8] text-sm">{currentScene?.venueName || 'Outer Perimeter'}</strong>
        </div>

        <div className="flex items-center gap-2">
          {currentScene?.nextScenes.map((targetId) => {
            const nextSc = blueprint.scenes.find((s) => s.id === targetId)
            if (!nextSc) return null

            return (
              <button
                key={targetId}
                type="button"
                onClick={() => moveToScene(targetId)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#0284c7] to-[#0369a1] hover:from-[#38bdf8] hover:to-[#0284c7] text-white text-xs sm:text-sm font-bold tracking-wider active:scale-95 transition-all shadow-lg cursor-pointer flex items-center gap-1.5"
              >
                <span>MOVE OPERATIVE TO {nextSc.type.toUpperCase()}</span>
                <span>→</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
