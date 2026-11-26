'use client'

import React from 'react'
import { motion } from 'motion/react'
import { useGameStore } from '@/lib/store'
import { sound } from '@/lib/audio'
import { Globe, Shield, Terminal, ArrowRight, AlertTriangle } from 'lucide-react'

export const BriefingView: React.FC = () => {
  const blueprint = useGameStore((s) => s.blueprint)
  const setPhase = useGameStore((s) => s.setPhase)
  const agent = useGameStore((s) => s.agent)

  if (!blueprint) return null

  const handleCommence = () => {
    sound.playStamp()
    setPhase('PLAY_EXPLORATION')
  }

  return (
    <div className="relative min-h-screen w-full bg-[#05070A] text-[#EDE5D8] p-4 sm:p-8 flex flex-col items-center justify-center select-none overflow-y-auto">
      {/* Slide Projector Light Cone Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(242,208,107,0.06)_0%,transparent_75%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-3xl p-6 sm:p-10 rounded-2xl bg-[#0F131A] border-2 border-[#C9A227]/40 shadow-[0_0_80px_rgba(0,0,0,0.95)] flex flex-col justify-between"
      >
        {/* Classified Folder Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#C9A227]/30 mb-6 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-red-950/80 border border-red-600 text-red-400 font-mono text-[10px] font-black tracking-widest uppercase">
              TOP SECRET // EYES ONLY
            </span>
            <span className="text-xs font-mono text-stone-400">
              OPERATIVE: <strong className="text-white">{agent?.codename || 'VANCE'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
            <Globe className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>THEATER: {blueprint.city.toUpperCase()}, {blueprint.country.toUpperCase()}</span>
          </div>
        </div>

        {/* Projector Slide Briefing Text */}
        <div className="my-2 p-6 rounded-xl bg-black/60 border border-stone-800 font-mono text-xs sm:text-sm leading-relaxed text-[#D4C3B3]">
          <div className="text-sm sm:text-base font-serif font-black text-[#F2D06B] mb-4">
            MISSION DIRECTIVE // {blueprint.codeName}
          </div>

          <div className="mb-4 text-xs font-mono text-cyan-300 bg-cyan-950/30 p-2.5 rounded border border-cyan-800/40">
            <strong>PRIMARY OBJECTIVE:</strong> Execute tactical infiltration to {blueprint.objectiveType}. Target syndicate: <span className="text-white">{blueprint.faction}</span>.
          </div>

          <p className="whitespace-pre-line text-xs font-mono leading-relaxed mb-4 text-stone-300">
            {blueprint.briefingText}
          </p>

          <div className="p-3 rounded bg-amber-950/40 border border-amber-600/50 text-amber-300 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <strong className="block text-amber-200">CONFIDENTIAL THREAT COMPLICATION:</strong>
              {blueprint.twist}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-[#C9A227]/30 mt-4">
          <button
            type="button"
            onClick={() => setPhase('TITLE')}
            className="px-4 py-2 rounded-xl border border-stone-700 bg-stone-900 text-stone-300 font-mono text-xs font-bold cursor-pointer"
          >
            ABORT TO TITLE
          </button>

          <button
            type="button"
            onClick={handleCommence}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#F2D06B] via-[#FFE28A] to-[#C9A227] text-black font-mono text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 shadow-[0_0_30px_rgba(242,208,107,0.35)] active:scale-95 cursor-pointer"
          >
            <span>COMMENCE FIELD INFILTRATION</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  )
}
