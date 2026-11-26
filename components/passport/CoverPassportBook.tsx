'use client'

import React from 'react'
import { motion } from 'motion/react'
import { useGameStore } from '@/lib/store'
import { ShieldCheck, FileBadge, Stamp, Flame, CheckCircle, AlertOctagon, User } from 'lucide-react'

export const CoverPassportBook: React.FC = () => {
  const coverLegends = useGameStore((s) => s.coverLegends)
  const switchCoverLegend = useGameStore((s) => s.switchCoverLegend)
  const stampVisa = useGameStore((s) => s.stampVisa)
  const burnCoverLegend = useGameStore((s) => s.burnCoverLegend)

  const activeLegend = coverLegends.find((l) => l.isActive) || coverLegends[0]

  if (!activeLegend) return null

  return (
    <div className="relative w-full h-full min-h-[460px] flex flex-col justify-between p-4 bg-[#141210] border-2 border-amber-900/40 rounded-2xl overflow-hidden font-mono shadow-2xl text-stone-300">
      {/* Top Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between border-b border-amber-900/30 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-950/80 border border-amber-600/60 text-amber-400">
            <FileBadge className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-black tracking-widest text-amber-300 uppercase">
              CONSULAR COVER LEGENDS // DIPLOMATIC PASSPORT BOOK
            </div>
            <div className="text-[10px] text-stone-500">
              IDENTITY FABRICATION & VISA BORDER CONTROL SECTION
            </div>
          </div>
        </div>

        {/* Legend Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {coverLegends.map((leg) => (
            <button
              key={leg.id}
              type="button"
              disabled={leg.isBurned}
              onClick={() => switchCoverLegend(leg.id)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                leg.id === activeLegend.id
                  ? 'bg-amber-600 text-black shadow-md'
                  : leg.isBurned
                  ? 'bg-stone-900 text-stone-600 border border-stone-800 line-through cursor-not-allowed'
                  : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-white'
              }`}
            >
              {leg.aliasName.toUpperCase()} {leg.isBurned && '(BURNED)'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Passport View */}
      <div className="relative z-10 my-4 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {/* Left: Passport Identity Page */}
        <div className="p-4 rounded-xl border border-amber-800/40 bg-[#1c1917] flex flex-col justify-between shadow-inner">
          <div>
            <div className="flex items-center justify-between border-b border-amber-800/30 pb-2 mb-3">
              <span className="text-[10px] text-amber-500/80 font-bold tracking-widest">
                OFFICIAL IDENTITY CREDENTIALS
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">
                SUSPICION: {activeLegend.suspicionPercent}%
              </span>
            </div>

            <div className="flex gap-3">
              {/* Fake Photo Frame */}
              <div className="w-20 h-24 rounded border border-amber-700/50 bg-black flex flex-col items-center justify-center p-1 text-center shrink-0">
                <User className="w-10 h-10 text-stone-500" />
                <span className="text-[8px] text-amber-500/80 mt-1 uppercase">AUTHENTICATED</span>
              </div>

              {/* Bio Details */}
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-[10px] text-stone-500">FULL ALIAS NAME:</span>
                  <div className="font-bold text-amber-200">{activeLegend.aliasName}</div>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500">NATIONALITY:</span>
                  <div className="font-bold text-stone-300">{activeLegend.nationality}</div>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500">COVER PROFESSION:</span>
                  <div className="font-bold text-stone-300">{activeLegend.occupation}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Burn Legend Emergency Button */}
          <div className="pt-3 border-t border-amber-900/30">
            <button
              type="button"
              onClick={() => burnCoverLegend(activeLegend.id)}
              className="w-full py-2 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-700/80 text-red-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Flame className="w-3.5 h-3.5 text-red-400" />
              <span>BURN COVER IDENTITY (EMERGENCY COMPROMISE)</span>
            </button>
          </div>
        </div>

        {/* Right: Visa Stamps Page */}
        <div className="p-4 rounded-xl border border-amber-800/40 bg-[#1c1917] flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
              <Stamp className="w-3.5 h-3.5 text-amber-400" />
              <span>CONSULAR VISA STAMPS:</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {activeLegend.visaStamps.map((v, i) => (
                <div
                  key={i}
                  className="p-2 rounded border border-amber-600/40 bg-amber-950/20 text-amber-300 text-xs font-bold rotate-[-2deg] flex items-center gap-1 shadow"
                >
                  <Stamp className="w-3 h-3 text-amber-500" />
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stamp Action Controls */}
          <div className="pt-3 border-t border-amber-900/30">
            <div className="text-[11px] text-stone-400 mb-2">APPLY NEW CONSULAR BORDER ENTRY STAMP:</div>
            <div className="flex flex-wrap gap-1.5">
              {['East Berlin Checkpoint', 'Vienna Diplomatic Zone', 'Tangier Maritime Border', 'Moscow Transit Visa'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => stampVisa(c)}
                  className="px-2.5 py-1 rounded bg-stone-900 hover:bg-amber-950 border border-stone-800 hover:border-amber-600 text-stone-300 hover:text-amber-200 text-xs font-bold transition-all cursor-pointer"
                >
                  + {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 pt-2 border-t border-amber-900/30 flex items-center justify-between text-[11px] text-stone-500">
        <span>ACTIVE LEGEND: {activeLegend.aliasName} ({activeLegend.nationality})</span>
        <span>BENEFIT: +15 SOCIAL INFILTRATION</span>
      </div>
    </div>
  )
}
