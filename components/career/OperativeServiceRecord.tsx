'use client'

import React from 'react'
import { motion } from 'motion/react'
import { useGameStore } from '@/lib/store'
import { Award, ShieldAlert, HeartPulse, FileText, Stamp, CheckCircle2 } from 'lucide-react'

export const OperativeServiceRecord: React.FC = () => {
  const agent = useGameStore((s) => s.agent)
  const careerRecords = useGameStore((s) => s.careerRecords)

  if (!agent) return null

  return (
    <div className="relative w-full h-full min-h-[460px] flex flex-col justify-between p-4 bg-[#14120e] border-2 border-stone-800 rounded-2xl overflow-hidden font-mono shadow-2xl text-stone-300">
      {/* Top Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between border-b border-stone-800 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-950/80 border border-amber-600/60 text-amber-400">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-black tracking-widest text-amber-300 uppercase">
              OPERATIVE SERVICE RECORD // COMMENDATIONS & TRAUMA DOSSIER
            </div>
            <div className="text-[10px] text-stone-500">
              CENTRAL DIRECTIVE SECTION ARCHIVES // EYES ONLY
            </div>
          </div>
        </div>

        <div className="text-xs text-stone-400">
          CLEARANCE LEVEL: <span className="text-amber-400 font-bold">LEVEL {agent.clearanceLevel}</span>
        </div>
      </div>

      {/* Main Dossier Content */}
      <div className="relative z-10 my-4 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto">
        {/* Left: Operative Personnel Stats */}
        <div className="p-4 rounded-xl border border-stone-800 bg-[#191612] flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>ACTIVE SERVICE DOSSIER OVERVIEW:</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-stone-800/80 pb-1">
                <span className="text-stone-500">CODENAME:</span>
                <span className="font-bold text-amber-300">{agent.codename}</span>
              </div>
              <div className="flex justify-between border-b border-stone-800/80 pb-1">
                <span className="text-stone-500">DIVISION:</span>
                <span className="text-stone-300">{agent.division}</span>
              </div>
              <div className="flex justify-between border-b border-stone-800/80 pb-1">
                <span className="text-stone-500">OPERATIONAL FUNDS:</span>
                <span className="font-bold text-emerald-400">${agent.funds}</span>
              </div>
              <div className="flex justify-between border-b border-stone-800/80 pb-1">
                <span className="text-stone-500">MERIT POINTS:</span>
                <span className="font-bold text-blue-400">{agent.merit}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-stone-500">STATUS:</span>
                <span className="font-bold text-emerald-400 uppercase">{agent.status}</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-stone-500 mt-2">
            Medals and scars confer persistent tradecraft modifiers across Cold War campaigns.
          </div>
        </div>

        {/* Right: Career Records & Scars List */}
        <div className="p-4 rounded-xl border border-stone-800 bg-[#191612] flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>SERVICE CITATIONS, SCARS & NEUROSES:</span>
            </div>

            <div className="space-y-2.5">
              {careerRecords.map((rec) => {
                const isMedal = rec.type === 'medal'
                const isScar = rec.type === 'scar'

                return (
                  <div
                    key={rec.id}
                    className={`p-2.5 rounded-lg border text-xs ${
                      isMedal
                        ? 'border-amber-600/40 bg-amber-950/20'
                        : isScar
                        ? 'border-red-800/40 bg-red-950/20'
                        : 'border-purple-800/40 bg-purple-950/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-stone-200">{rec.title}</span>
                      <span className="text-[9px] text-stone-500">{rec.dateAwarded}</span>
                    </div>
                    <div className="text-[11px] text-stone-400 mb-1.5 leading-relaxed">
                      {rec.citation}
                    </div>
                    <div className="text-[10px] font-bold text-amber-300">
                      TRAIT: {rec.statModifier}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 pt-2 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-500">
        <span>TRADE-CRAFT: LIFELONG FIELD COMMENDATIONS & COMBAT PSYCHOLOGY</span>
        <span>TOTAL RECORDED CITATIONS: {careerRecords.length}</span>
      </div>
    </div>
  )
}
