'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGameStore } from '@/lib/store'
import { Eye, Droplets, Camera, CheckCircle2, AlertTriangle, ZoomIn, Sparkles, HelpCircle } from 'lucide-react'

export const MicrofilmDarkroom: React.FC = () => {
  const darkroomRolls = useGameStore((s) => s.darkroomRolls)
  const advanceDarkroomStage = useGameStore((s) => s.advanceDarkroomStage)
  const inspectDarkroomMicrodot = useGameStore((s) => s.inspectDarkroomMicrodot)

  const [selectedRollId, setSelectedRollId] = useState<string>(darkroomRolls[0]?.id || '')
  const [loupeZoom, setLoupeZoom] = useState(false)

  const selectedRoll = darkroomRolls.find((r) => r.id === selectedRollId) || darkroomRolls[0]

  if (!selectedRoll) return null

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'raw': return 'text-amber-500 border-amber-500/40 bg-amber-950/30'
      case 'developer': return 'text-orange-400 border-orange-500/40 bg-orange-950/30'
      case 'stop_bath': return 'text-blue-400 border-blue-500/40 bg-blue-950/30'
      case 'fixer': return 'text-purple-400 border-purple-500/40 bg-purple-950/30'
      case 'developed': return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30'
      default: return 'text-stone-400 border-stone-800 bg-stone-900'
    }
  }

  return (
    <div className="relative w-full h-full min-h-[460px] flex flex-col justify-between p-4 bg-[#0a0505] border-2 border-red-950 rounded-2xl overflow-hidden font-mono shadow-2xl">
      {/* Red Safelight Ambience Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-black to-red-950/30 pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between border-b border-red-900/40 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-950/80 border border-red-700/60 text-red-400">
            <Camera className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-black tracking-widest text-red-300 uppercase">
              SAFEHOUSE DARKROOM // MICROFILM CHEMICAL BATHS
            </div>
            <div className="text-[10px] text-red-500/80">
              SAFELIGHT 620nm RED // MINOX 8x11mm GRAIN MAGNIFICATION
            </div>
          </div>
        </div>

        {/* Film Canister Selector */}
        <div className="flex items-center gap-1.5">
          {darkroomRolls.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedRollId(r.id)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                r.id === selectedRoll.id
                  ? 'bg-red-600 text-black shadow-lg shadow-red-600/40'
                  : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-white'
              }`}
            >
              {r.id === 'roll_stasi_cables' ? 'CANISTER 04-A' : 'CANISTER 12-X'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chemical Tank & 35mm Negative Strip */}
      <div className="relative z-10 my-4 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {/* Left: Chemical Tank Sequence */}
        <div className="p-4 rounded-xl border border-red-900/30 bg-[#120707] flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-red-400 mb-2 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-red-400" />
              <span>CHEMICAL TANK PROGRESSION:</span>
            </div>

            <div className="space-y-2">
              {[
                { stage: 'raw', label: '1. Unprocessed Film Negative' },
                { stage: 'developer', label: '2. Hydroquinone Developer Bath' },
                { stage: 'stop_bath', label: '3. Acetic Acid Stop Bath' },
                { stage: 'fixer', label: '4. Ammonium Thiosulfate Fixer' },
                { stage: 'developed', label: '5. Dried & Ready for Magnification' }
              ].map((step, idx) => {
                const isPassed =
                  selectedRoll.stage === 'developed' ||
                  (selectedRoll.stage === 'fixer' && idx <= 3) ||
                  (selectedRoll.stage === 'stop_bath' && idx <= 2) ||
                  (selectedRoll.stage === 'developer' && idx <= 1) ||
                  (selectedRoll.stage === 'raw' && idx === 0)
                const isCurrent = selectedRoll.stage === step.stage

                return (
                  <div
                    key={step.stage}
                    className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                      isCurrent
                        ? 'border-red-500 bg-red-950/60 text-red-200 font-bold shadow'
                        : isPassed
                        ? 'border-red-900/50 bg-black/60 text-stone-400'
                        : 'border-stone-900 bg-black/40 text-stone-600'
                    }`}
                  >
                    <span>{step.label}</span>
                    {isCurrent && <span className="text-[10px] text-red-400 animate-pulse font-mono">ACTIVE BATH</span>}
                    {isPassed && !isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action Button: Advance Chemical Bath */}
          {selectedRoll.stage !== 'developed' ? (
            <button
              type="button"
              onClick={() => advanceDarkroomStage(selectedRoll.id)}
              className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xl active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Droplets className="w-4 h-4" />
              <span>ADVANCE TO NEXT CHEMICAL BATH</span>
            </button>
          ) : (
            <div className="mt-3 p-2 rounded-lg bg-emerald-950/40 border border-emerald-600/60 text-emerald-300 text-xs text-center font-bold">
              ✓ FILM FULLY DEVELOPED & FIXED
            </div>
          )}
        </div>

        {/* Right: 35mm Negative Strip & Loupe Magnifier */}
        <div className="p-4 rounded-xl border border-red-900/30 bg-[#0f0505] flex flex-col justify-between overflow-hidden">
          <div>
            <div className="text-xs font-bold text-red-400 mb-2 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-red-400" />
              <span>35mm NEGATIVE EMULSION // FORENSIC LOUPE:</span>
            </div>

            {/* Negative Film Strip Graphic */}
            <div className="relative p-3 rounded-lg bg-black border border-stone-800 flex items-center justify-center overflow-hidden h-36">
              {/* Film Sprocket Holes Top & Bottom */}
              <div className="absolute top-1 inset-x-2 flex justify-between">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-2 h-1.5 bg-stone-800 rounded-sm" />
                ))}
              </div>
              <div className="absolute bottom-1 inset-x-2 flex justify-between">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-2 h-1.5 bg-stone-800 rounded-sm" />
                ))}
              </div>

              {selectedRoll.stage === 'developed' ? (
                <div
                  onClick={() => setLoupeZoom(!loupeZoom)}
                  className="cursor-pointer relative z-10 flex flex-col items-center justify-center text-center p-2 group"
                >
                  <div className="w-16 h-16 rounded-full border-2 border-red-500 bg-red-950/80 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <ZoomIn className="w-8 h-8 text-red-300" />
                  </div>
                  <span className="text-[10px] text-red-400 mt-1">CLICK LOUPE TO INSPECT MICRODOT</span>
                </div>
              ) : (
                <div className="text-center text-xs text-stone-600">
                  NEGATIVE STILL IN CHEMICAL PROCESSING
                </div>
              )}
            </div>

            {/* Revealed Intel Output */}
            {selectedRoll.isInspected ? (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3 rounded-lg bg-red-950/40 border border-red-600 text-xs text-red-200 leading-relaxed"
              >
                <div className="flex items-center gap-1.5 font-bold text-red-400 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>MAGNIFIED MICRODOT INTEL:</span>
                </div>
                {selectedRoll.clueRevealed}
              </motion.div>
            ) : selectedRoll.stage === 'developed' ? (
              <div className="mt-3 text-xs text-stone-400 text-center">
                Microfilm is ready. Align brass loupe over frame to reveal hidden text.
              </div>
            ) : null}
          </div>

          {selectedRoll.stage === 'developed' && !selectedRoll.isInspected && (
            <button
              type="button"
              onClick={() => inspectDarkroomMicrodot(selectedRoll.id)}
              className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-xl active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>MAGNIFY MICRODOT & EXTRACT CLUE</span>
            </button>
          )}
        </div>
      </div>

      {/* Footer Info Bar */}
      <div className="relative z-10 pt-2 border-t border-red-900/30 flex items-center justify-between text-[11px] text-red-500/80">
        <span>TRADE-CRAFT: MINOX EMULSION GRAIN EXTRACTION</span>
        <span>STATUS: {selectedRoll.stage.toUpperCase()}</span>
      </div>
    </div>
  )
}
