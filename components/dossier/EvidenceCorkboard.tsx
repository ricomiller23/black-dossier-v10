'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGameStore } from '@/lib/store'
import { AgentPortrait } from './AgentPortrait'
import { Pin, FileText, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react'

export const EvidenceCorkboard: React.FC = () => {
  const blueprint = useGameStore((s) => s.blueprint)
  const revealedClues = useGameStore((s) => s.revealedClues)
  const currentScene = useGameStore((s) => s.currentScene)

  const [inspectedDoc, setInspectedDoc] = useState<string | null>(null)

  if (!blueprint) return null

  // Collect all clues across mission
  const allClues = blueprint.scenes.flatMap((s) => s.clues)

  return (
    <div className="relative w-full h-full min-h-[500px] sm:min-h-[580px] md:min-h-[660px] rounded-2xl overflow-hidden border-4 border-[#3D2918] bg-[#1E140C] shadow-2xl select-none p-4 flex flex-col justify-between">
      {/* 1. Realistic Corkboard Texture */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#4A3525 1.5px, transparent 1.5px), radial-gradient(#291C12 1.5px, #1E140C 1.5px)`,
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px'
        }}
      />

      {/* 2. Top Header Tape */}
      <div className="relative z-20 flex flex-wrap items-center justify-between pb-3 border-b border-[#C9A227]/30 gap-2">
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 bg-[#D97706]/20 border border-[#D97706] rounded text-[#F59E0B] font-mono text-xs sm:text-sm font-black uppercase tracking-widest shadow-sm">
            EVIDENCE CORKBOARD // REDACTED CLASSIFIED ATLAS
          </div>
          <span className="text-xs font-mono text-stone-300">
            DISCLOSED: <strong className="text-amber-400">{revealedClues.length}</strong> / {allClues.length} INTEL PACKETS
          </span>
        </div>

        <div className="text-xs font-mono text-stone-300 bg-black/60 px-3 py-1 rounded border border-stone-800">
          SYNDICATE TARGET: <strong className="text-[#F2D06B] text-sm">{blueprint.faction}</strong>
        </div>
      </div>

      {/* 3. Main Corkboard Canvas with Pinned Items & Red Strings */}
      <div className="relative flex-1 w-full my-3 overflow-hidden min-h-[380px] sm:min-h-[460px]">
        {/* SVG Animated Red String Lines */}
        <svg
          viewBox="0 0 800 440"
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Main Red String Connecting Target to Clues */}
          <motion.path
            d="M 400 95 Q 240 160 150 270"
            fill="none"
            stroke="#DC2626"
            strokeWidth="3"
            strokeDasharray="6 3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
          <motion.path
            d="M 400 95 Q 560 170 650 270"
            fill="none"
            stroke="#DC2626"
            strokeWidth="3"
            strokeDasharray="6 3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
          />
          <motion.path
            d="M 400 95 L 400 260"
            fill="none"
            stroke="#B91C1C"
            strokeWidth="2.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>

        {/* Center: Primary Target Mugshot & Dossier Card */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
          {/* Pushpin */}
          <div className="w-5 h-5 rounded-full bg-red-600 border-2 border-white shadow-xl -mb-2 z-30" />

          <motion.div
            whileHover={{ scale: 1.04, rotate: 1 }}
            className="w-64 sm:w-72 p-3.5 rounded-lg bg-[#FAF5EB] text-[#1C1917] shadow-2xl border border-stone-300 transform -rotate-1"
          >
            <div className="flex items-center gap-3 mb-2">
              <AgentPortrait
                size="sm"
                portrait={{
                  faceShape: 1,
                  skinTone: '#C68642',
                  hairStyle: 0,
                  hairColor: '#4A5568',
                  glasses: true,
                  sunglasses: false,
                  scar: true,
                  facialHair: 1,
                  clothingStyle: 'Trench Coat',
                  clothingColor: '#2D3748'
                }}
              />
              <div className="leading-tight">
                <div className="text-[10px] font-mono text-red-700 font-bold uppercase tracking-wider">
                  HIGH VALUE TARGET
                </div>
                <div className="font-serif font-black text-base text-stone-900">
                  {blueprint.scenes[3]?.npcs[0]?.name || 'Target Operative'}
                </div>
                <div className="text-[10px] text-stone-600 font-mono">
                  {blueprint.scenes[3]?.npcs[0]?.role || 'Chief Commander'}
                </div>
              </div>
            </div>

            {/* Secret Redaction Bar */}
            <div className="p-2 rounded bg-stone-200 text-xs font-mono">
              <span className="font-bold text-stone-700">DOSSIER CIPHER:</span>
              <div className="relative mt-1 text-[10px] text-stone-800">
                {revealedClues.length >= 2 ? (
                  <span className="text-emerald-700 font-bold">
                    {blueprint.scenes[3]?.npcs[0]?.secret}
                  </span>
                ) : (
                  <div className="h-5 bg-stone-900 rounded flex items-center px-2 text-white font-mono text-[9px] tracking-widest uppercase">
                    ████ TOP SECRET ████
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Left Side: Disclosed Intel Evidence Clue #1 */}
        <div className="absolute bottom-4 left-3 sm:left-6 z-20 flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-lg -mb-2 z-30" />

          <motion.div
            whileHover={{ scale: 1.05, rotate: -2 }}
            onClick={() => setInspectedDoc(allClues[0] || 'Surveillance Audio')}
            className="w-52 sm:w-60 p-3 rounded-lg bg-[#F5EBE1] text-[#2E2822] shadow-xl border border-stone-300 transform -rotate-3 cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-stone-500 mb-1">
              <FileText className="w-3.5 h-3.5 text-red-700" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                ITEM #01 // RECOVERED
              </span>
            </div>
            <p className="text-xs font-mono text-stone-800 line-clamp-3">
              {allClues[0] || 'Coded telex transcript detailing clandestine arms transfer at cargo terminal.'}
            </p>
            <div className="mt-2 text-[10px] font-mono text-amber-800 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>CLICK TO INSPECT TRANSCRIPT</span>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Disclosed Intel Evidence Clue #2 */}
        <div className="absolute bottom-4 right-3 sm:right-6 z-20 flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-cyan-500 border-2 border-white shadow-lg -mb-2 z-30" />

          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            onClick={() => setInspectedDoc(allClues[1] || 'Facial Telemetry')}
            className="w-52 sm:w-60 p-3 rounded-lg bg-[#F5EBE1] text-[#2E2822] shadow-xl border border-stone-300 transform rotate-2 cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-stone-500 mb-1">
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-800" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                ITEM #02 // INTERCEPT
              </span>
            </div>
            <p className="text-xs font-mono text-stone-800 line-clamp-3">
              {allClues[1] || 'Encrypted microfiche negatives documenting safehouse access codes and guard rotations.'}
            </p>
            <div className="mt-2 text-[10px] font-mono text-cyan-800 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>CLICK TO INSPECT TRANSCRIPT</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 4. Bottom Footer Note */}
      <div className="relative z-20 pt-2 border-t border-[#C9A227]/30 flex flex-wrap justify-between items-center text-xs font-mono text-stone-400 gap-2">
        <span>SECTOR: {currentScene?.venueName || 'Primary Venue'}</span>
        <span className="text-[#F2D06B]">INVESTIGATION STAGE: {revealedClues.length >= 2 ? 'COMPREHENSIVE' : 'INITIAL TRACE'}</span>
      </div>

      {/* 5. Document Inspection Modal */}
      <AnimatePresence>
        {inspectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FAF5EB] text-stone-900 border-4 border-stone-800 rounded-xl p-6 max-w-lg w-full font-mono shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 border-b-2 border-stone-400 mb-4">
                <span className="font-bold text-red-700 tracking-widest text-sm uppercase">
                  CLASSIFIED EVIDENCE TRANSCRIPT
                </span>
                <button
                  type="button"
                  onClick={() => setInspectedDoc(null)}
                  className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-white rounded text-xs font-bold"
                >
                  CLOSE [ESC]
                </button>
              </div>

              <div className="p-4 bg-stone-100 rounded border border-stone-300 text-sm leading-relaxed whitespace-pre-wrap">
                {inspectedDoc}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-300 flex justify-between items-center text-xs text-stone-600">
                <span>EVIDENCE INTEGRITY: VERIFIED</span>
                <button
                  type="button"
                  onClick={() => setInspectedDoc(null)}
                  className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded font-bold"
                >
                  ACKNOWLEDGE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
