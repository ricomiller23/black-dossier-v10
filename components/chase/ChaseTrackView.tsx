'use client'

import React from 'react'
import { motion } from 'motion/react'
import { useGameStore } from '@/lib/store'
import { Shield, Zap, AlertTriangle, ArrowRight, Gauge, Radio } from 'lucide-react'

export const ChaseTrackView: React.FC = () => {
  const chaseProgress = useGameStore((s) => s.chaseProgress)
  const setChase = useGameStore((s) => s.setChase)
  const submitAction = useGameStore((s) => s.submitAction)
  const agent = useGameStore((s) => s.agent)

  const handleManeuver = (action: string, delta: number) => {
    setChase(delta)
    submitAction(`Execute tactical driving maneuver: ${action}`)
  }

  return (
    <div className="relative w-full h-full min-h-[460px] sm:min-h-[540px] md:min-h-[620px] rounded-2xl overflow-hidden border border-amber-900/50 bg-[#0a0705] shadow-[0_0_50px_rgba(245,158,11,0.18)] p-4 flex flex-col justify-between select-none">
      {/* 1. Chase Header HUD */}
      <div className="relative z-20 flex flex-wrap items-center justify-between pb-3 border-b border-amber-900/40 gap-2">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded bg-amber-950/80 border border-amber-500 text-amber-300 font-mono text-xs sm:text-sm font-black tracking-widest uppercase flex items-center gap-1.5 shadow">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            HIGH-SPEED VEHICULAR PURSUIT // CHASE TRACK
          </div>
          <span className="text-xs sm:text-sm font-mono text-stone-300">
            DISTANCE INDEX: <strong className="text-[#F2D06B] text-base">{chaseProgress} / 10</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-amber-400 font-bold bg-black/60 px-3 py-1 rounded border border-stone-800">
          <Gauge className="w-4 h-4 text-amber-400 animate-spin" />
          <span>TELEMETRY: 145 KM/H</span>
        </div>
      </div>

      {/* 2. Animated Highway / Asphalt Track Canvas */}
      <div className="relative flex-1 my-4 rounded-xl border border-stone-800 bg-[#120f0d] overflow-hidden flex flex-col justify-center px-6 min-h-[260px] sm:min-h-[320px]">
        {/* Animated Speed Lines Background */}
        <div className="absolute inset-0 opacity-25 pointer-events-none overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-0.5 bg-amber-400"
              style={{
                top: `${(i + 1) * 8}%`,
                left: 0,
                width: '35%'
              }}
              animate={{ x: ['100vw', '-30vw'] }}
              transition={{
                duration: 0.7 + (i % 3) * 0.2,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.1
              }}
            />
          ))}
        </div>

        {/* Center Dashed Highway Dividing Line */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 border-t-2 border-dashed border-amber-500/40" />

        {/* 0 to 10 Progress Road Markers */}
        <div className="relative z-10 flex justify-between items-center w-full px-4">
          {Array.from({ length: 11 }).map((_, step) => {
            const isAgentHere = chaseProgress === step
            const isAhead = step > chaseProgress

            return (
              <div key={step} className="flex flex-col items-center">
                <span className="text-[10px] sm:text-xs font-mono text-stone-500 mb-1 font-bold">{step}</span>
                <div
                  className={`w-4 sm:w-5 h-4 sm:h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                    isAgentHere
                      ? 'bg-amber-500 border-white shadow-[0_0_20px_#f59e0b] scale-125'
                      : isAhead
                      ? 'bg-red-950 border-red-800'
                      : 'bg-emerald-950 border-emerald-800'
                  }`}
                >
                  {isAgentHere && <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
                </div>
                <span className="text-[9px] font-mono text-stone-600 mt-1 uppercase">
                  {step === 0 ? 'CRASH' : step === 10 ? 'EVADED' : ''}
                </span>
              </div>
            )
          })}
        </div>

        {/* Operative Chase Vehicle Indicator */}
        <div className="relative z-20 mt-6 flex justify-between items-center text-xs sm:text-sm font-mono px-4">
          <div className="flex items-center gap-2 text-rose-400 font-bold bg-black/70 px-3 py-1.5 rounded border border-rose-900">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>HOSTILE PURSUIT CARS</span>
          </div>

          <div className="flex items-center gap-2 text-emerald-400 font-bold bg-black/70 px-3 py-1.5 rounded border border-emerald-900">
            <span>OPERATIVE GETAWAY VEHICLE</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>

      {/* 3. Bottom Tactical Driving Maneuver Action Bar */}
      <div className="relative z-20 pt-3 border-t border-amber-900/40 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs sm:text-sm font-mono text-stone-300">
          SELECT VEHICULAR MANEUVER:
        </span>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleManeuver('Evasive Swerve into oncoming traffic', 1)}
            className="px-3.5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 border border-amber-600/50 text-amber-300 text-xs sm:text-sm font-mono font-bold active:scale-95 transition-all cursor-pointer shadow"
          >
            EVASIVE SWERVE (+1)
          </button>
          <button
            type="button"
            onClick={() => handleManeuver('Deploy Caltrops / Oil slick', 2)}
            className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-black text-xs sm:text-sm font-mono font-black active:scale-95 transition-all cursor-pointer shadow-lg"
          >
            DEPLOY COUNTERMEASURE (+2)
          </button>
          <button
            type="button"
            onClick={() => handleManeuver('PIT Maneuver / Ram pursuer', -1)}
            className="px-3.5 py-2 rounded-lg bg-red-950 hover:bg-red-900 border border-red-700 text-red-300 text-xs sm:text-sm font-mono font-bold active:scale-95 transition-all cursor-pointer shadow"
          >
            TACTICAL RAM (-1)
          </button>
        </div>
      </div>
    </div>
  )
}
