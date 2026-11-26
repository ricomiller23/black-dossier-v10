'use client'

import React from 'react'
import { motion } from 'motion/react'
import { useGameStore } from '@/lib/store'
import { Lock, Unlock, Volume2, ShieldAlert, Sparkles, Key, RotateCcw, RotateCw } from 'lucide-react'

export const StethoscopeSafeVault: React.FC = () => {
  const safeCrackingState = useGameStore((s) => s.safeCrackingState)
  const rotateSafeDial = useGameStore((s) => s.rotateSafeDial)
  const testSafeCombination = useGameStore((s) => s.testSafeCombination)

  const { targetCombo, currentDial, crackedSteps, isCracked, alarmTripped, vaultBearerBonds, vaultClassifiedDoc } =
    safeCrackingState

  const currentTarget = targetCombo[crackedSteps] || targetCombo[2]
  const isSweetSpot = Math.abs(currentDial - currentTarget) <= 2

  return (
    <div className="relative w-full h-full min-h-[460px] flex flex-col justify-between p-4 bg-[#0a0d14] border-2 border-stone-800 rounded-2xl overflow-hidden font-mono shadow-2xl text-stone-300">
      {/* Top Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between border-b border-stone-800 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-600/60 text-cyan-400">
            {isCracked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </div>
          <div>
            <div className="text-xs font-black tracking-widest text-cyan-300 uppercase">
              EMBASSY WALL SAFE // STETHOSCOPE ACOUSTIC DECODER
            </div>
            <div className="text-[10px] text-stone-500">
              CHUBB 3-WHEEL MECHANICAL TUMBLER // ACOUSTIC SHEAR GATE
            </div>
          </div>
        </div>

        {/* Tumbler Progress Steps */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-stone-500">TUMBLER PINS:</span>
          {[0, 1, 2].map((step) => (
            <div
              key={step}
              className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${
                crackedSteps > step || isCracked
                  ? 'border-emerald-500 bg-emerald-950/80 text-emerald-300 shadow'
                  : 'border-stone-800 bg-black text-stone-600'
              }`}
            >
              {step + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Main Safe Dial Display */}
      <div className="relative z-10 my-4 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {/* Left: Interactive Brushed Steel Dial */}
        <div className="p-4 rounded-xl border border-stone-800 bg-[#0e131d] flex flex-col items-center justify-center">
          <div className="relative w-44 h-44 rounded-full border-4 border-stone-700 bg-gradient-to-br from-stone-800 via-stone-900 to-black flex items-center justify-center shadow-2xl">
            {/* Dial Tick Marks */}
            <div className="absolute inset-2 rounded-full border border-stone-700/50 pointer-events-none" />

            {/* Needle Indicator */}
            <div className="absolute top-1 w-1 h-3 bg-red-500 rounded" />

            {/* Current Dial Value */}
            <div className="text-center z-10">
              <div className="text-3xl font-black text-cyan-400 font-mono tracking-wider">
                {String(currentDial).padStart(2, '0')}
              </div>
              <div className="text-[9px] text-stone-500 tracking-widest">DIAL POSITION</div>
            </div>

            {/* Sweet-Spot Acoustic Pulse */}
            {isSweetSpot && !isCracked && (
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.9, 0.4] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="absolute inset-0 rounded-full border-2 border-cyan-400 pointer-events-none"
              />
            )}
          </div>

          {/* Dial Turn Buttons */}
          <div className="flex items-center gap-2 mt-4">
            <button
              type="button"
              disabled={isCracked}
              onClick={() => rotateSafeDial(-5)}
              className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>-5</span>
            </button>
            <button
              type="button"
              disabled={isCracked}
              onClick={() => rotateSafeDial(-1)}
              className="px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-bold transition-all cursor-pointer active:scale-95"
            >
              -1
            </button>
            <button
              type="button"
              disabled={isCracked}
              onClick={() => rotateSafeDial(1)}
              className="px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-bold transition-all cursor-pointer active:scale-95"
            >
              +1
            </button>
            <button
              type="button"
              disabled={isCracked}
              onClick={() => rotateSafeDial(5)}
              className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
            >
              <span>+5</span>
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Acoustic Waveform & Test Button */}
        <div className="p-4 rounded-xl border border-stone-800 bg-[#0e131d] flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-cyan-400 mb-2 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>STETHOSCOPE MICRO-ACOUSTICS:</span>
            </div>

            {/* Acoustic Audio Feedback Bar */}
            <div className="p-3 rounded-lg bg-black/70 border border-stone-800 flex items-center justify-between mb-3">
              <span className="text-[11px] text-stone-400 font-bold">TUMBLER AUDIO CLICK:</span>
              <span
                className={`text-xs font-black tracking-widest ${
                  isSweetSpot
                    ? 'text-cyan-400 animate-pulse'
                    : 'text-stone-600'
                }`}
              >
                {isSweetSpot ? '● AUDIBLE SHEAR CLICK DETECTED' : '○ FAINT METAL RATTLING'}
              </span>
            </div>

            {/* Target Hint Indicator */}
            <div className="p-2.5 rounded bg-cyan-950/20 border border-cyan-800/40 text-[11px] text-cyan-200">
              ALIGNING PIN {crackedSteps + 1} OF 3. Listen through stethoscope for mechanical resonance.
            </div>

            {/* Cracked Vault Spoils */}
            {isCracked && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3 p-3 rounded-lg bg-emerald-950/40 border border-emerald-600 text-xs text-emerald-200 space-y-1.5"
              >
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>VAULT OPEN // SPOILS SECURED:</span>
                </div>
                <div>• ${vaultBearerBonds} SWISS BEARER BONDS ADDED TO BLACK BUDGET</div>
                <div className="text-[10px] text-stone-300">• {vaultClassifiedDoc}</div>
              </motion.div>
            )}
          </div>

          {/* Test Combination Action */}
          {!isCracked ? (
            <button
              type="button"
              onClick={() => testSafeCombination()}
              className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xl active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" />
              <span>TEST MECHANICAL TUMBLER NOTCH</span>
            </button>
          ) : (
            <div className="mt-3 p-2 rounded-lg bg-emerald-950/60 border border-emerald-600 text-emerald-300 text-xs text-center font-bold">
              ✓ SAFE FULLY CRACKED // BEARER BONDS & INTEL RECOVERED
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 pt-2 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-500">
        <span>TRADE-CRAFT: PHYSICAL SAFE-CRACKING BYPASS</span>
        <span>STATUS: {isCracked ? 'OPEN' : `PIN ${crackedSteps}/3 LOCKED`}</span>
      </div>
    </div>
  )
}
