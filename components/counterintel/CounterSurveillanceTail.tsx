'use client'

import React from 'react'
import { motion } from 'motion/react'
import { useGameStore } from '@/lib/store'
import { Eye, ShieldAlert, Train, Compass, ShieldCheck, AlertTriangle, ArrowRight } from 'lucide-react'

export const CounterSurveillanceTail: React.FC = () => {
  const surveillanceTail = useGameStore((s) => s.surveillanceTail)
  const executeDryCleanManeuver = useGameStore((s) => s.executeDryCleanManeuver)

  const isClear = !surveillanceTail.activeTail || surveillanceTail.threatLevelPercent === 0

  return (
    <div className="relative w-full h-full min-h-[460px] flex flex-col justify-between p-4 bg-[#0a0c10] border-2 border-stone-800 rounded-2xl overflow-hidden font-mono shadow-2xl text-stone-300">
      {/* Top Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between border-b border-stone-800 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg border ${
            isClear ? 'bg-emerald-950/80 border-emerald-600/60 text-emerald-400' : 'bg-red-950/80 border-red-600/60 text-red-400'
          }`}>
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-black tracking-widest text-stone-200 uppercase">
              COUNTER-SURVEILLANCE // DRY-CLEANING TRANSIT ROUTE
            </div>
            <div className="text-[10px] text-stone-500">
              ABTEILUNG VIII TAIL IDENTIFICATION & DISPERSAL PROTOCOL
            </div>
          </div>
        </div>

        {/* Threat Level Badge */}
        <div className={`px-3 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 ${
          isClear
            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
            : surveillanceTail.threatLevelPercent >= 50
            ? 'bg-red-950/80 border-red-500 text-red-300 animate-pulse'
            : 'bg-amber-950/80 border-amber-500 text-amber-300'
        }`}>
          {isClear ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
          <span>{isClear ? 'TAIL DUMPED // CLEAR' : `HOSTILE TAIL: ${surveillanceTail.threatLevelPercent}%`}</span>
        </div>
      </div>

      {/* Main Center: Rearview Mirror & Threat Meter */}
      <div className="relative z-10 my-4 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {/* Left: Rearview Mirror HUD */}
        <div className="p-4 rounded-xl border border-stone-800 bg-[#0f131a] flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-stone-400 mb-2 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>SHOP-WINDOW REFLECTION // REARVIEW TELEMETRY:</span>
            </div>

            {/* Simulated Convex Mirror Screen */}
            <div className="relative p-4 rounded-lg bg-black/80 border border-stone-700/60 h-36 flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-radial from-transparent to-black/60 pointer-events-none" />

              {!isClear ? (
                <div className="text-center z-10 space-y-1">
                  <div className="text-red-400 text-xs font-bold tracking-widest animate-pulse">
                    [HOSTILE TAIL DETECTED IN REAR GLASS]
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Two overcoated agents maintaining 30m distance behind trolley car.
                  </div>
                  <div className="text-[10px] text-stone-500">
                    AGENCY: {surveillanceTail.tailAgency.toUpperCase()}
                  </div>
                </div>
              ) : (
                <div className="text-center z-10 space-y-1">
                  <div className="text-emerald-400 text-xs font-bold tracking-widest">
                    [NO TAILS IN RETICULE // ROUTE UNCOMPROMISED]
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Rearward observation confirms zero trailing shadows across 3 blocks.
                  </div>
                </div>
              )}
            </div>

            {/* Last Maneuver Feedback */}
            {surveillanceTail.lastManeuver && (
              <div className="mt-3 p-2.5 rounded bg-black/40 border border-stone-800 text-[11px] text-stone-300">
                <span className="text-amber-400 font-bold">PREVIOUS ACTION: </span>
                {surveillanceTail.lastManeuver}
              </div>
            )}
          </div>

          <div className="text-[10px] text-stone-500">
            WARNING: Entering safehouse with active tail triggers immediate tactical raid.
          </div>
        </div>

        {/* Right: Dry-Cleaning Maneuvers Selector */}
        <div className="p-4 rounded-xl border border-stone-800 bg-[#0f131a] flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
              <Train className="w-3.5 h-3.5 text-amber-400" />
              <span>EXECUTE DRY-CLEANING MANEUVER:</span>
            </div>

            <div className="space-y-2">
              {[
                {
                  id: 'u_bahn' as const,
                  title: 'Last-Second U-Bahn Boarding',
                  desc: 'Wait until pneumatic doors begin closing, then slip onto departing subway train.',
                  drop: '-45% Threat'
                },
                {
                  id: 'coat_reverse' as const,
                  title: 'Reversible Trench-Coat Swap',
                  desc: 'Enter public department store washroom; flip khaki coat to charcoal lining.',
                  drop: '-30% Threat'
                },
                {
                  id: 'alley_sprint' as const,
                  title: 'Butcher Alley Sprint & Fence Vault',
                  desc: 'High-speed foot evasion through cobblestone passageways and locked courtyard gates.',
                  drop: '-50% Threat'
                }
              ].map((m) => (
                <div
                  key={m.id}
                  className="p-2.5 rounded-lg border border-stone-800 bg-black/40 flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="text-xs font-bold text-stone-200">{m.title}</div>
                    <div className="text-[10px] text-stone-400 leading-tight">{m.desc}</div>
                  </div>
                  <button
                    type="button"
                    disabled={isClear}
                    onClick={() => executeDryCleanManeuver(m.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isClear
                        ? 'bg-stone-900 text-stone-600 border border-stone-800 cursor-not-allowed'
                        : 'bg-amber-600 hover:bg-amber-500 text-black shadow active:scale-95'
                    }`}
                  >
                    {m.drop}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-stone-500 mt-2">
            BENEFIT: Clears safehouse heat and awards +10 initiative to next scene.
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 pt-2 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-500">
        <span>TRADE-CRAFT: BDR COUNTER-SURVEILLANCE "DRY RUN"</span>
        <span>STATUS: {isClear ? 'DUMPED' : 'EVADING TAIL'}</span>
      </div>
    </div>
  )
}
