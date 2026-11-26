'use client'

import React from 'react'
import { motion } from 'motion/react'
import { useGameStore } from '@/lib/store'
import { ShieldCheck, Flag, Siren, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react'

export const BorderExfiltrationRun: React.FC = () => {
  const exfiltrationRoutes = useGameStore((s) => s.exfiltrationRoutes)
  const alertLevel = useGameStore((s) => s.alertLevel)
  const executeBorderExfiltration = useGameStore((s) => s.executeBorderExfiltration)

  return (
    <div className="relative w-full h-full min-h-[460px] flex flex-col justify-between p-4 bg-[#0a0f12] border-2 border-stone-800 rounded-2xl overflow-hidden font-mono shadow-2xl text-stone-300">
      {/* Top Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between border-b border-stone-800 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-950/80 border border-blue-600/60 text-blue-400">
            <Flag className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-black tracking-widest text-blue-300 uppercase">
              EMERGENCY EXFILTRATION // BORDER CROSSING DEMARCATION
            </div>
            <div className="text-[10px] text-stone-500">
              COLD WAR EXTRACTION VECTORS // CHECKPOINT CHARLIE & SECTOR WALL
            </div>
          </div>
        </div>

        {/* Current Alert Modifier */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-stone-400">BORDER SECURITY SURGE:</span>
          <span className="text-red-400 font-bold">-{alertLevel * 8}% SUCCESS PENALTY</span>
        </div>
      </div>

      {/* Routes Grid */}
      <div className="relative z-10 my-4 grid grid-cols-1 md:grid-cols-3 gap-3 flex-1 overflow-y-auto">
        {exfiltrationRoutes.map((route) => {
          const adjustedRate = Math.max(20, route.baseSuccessRate - (alertLevel * 8))

          return (
            <div
              key={route.id}
              className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                route.isExecuted
                  ? 'border-blue-600/60 bg-[#0d1c26]'
                  : 'border-stone-800 bg-[#0d1419] hover:border-stone-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-blue-400 font-bold uppercase">{route.borderLocation}</span>
                  <span className="text-[10px] text-emerald-400 font-bold">ODDS: {adjustedRate}%</span>
                </div>

                <div className="font-bold text-xs text-stone-200 mb-1">{route.name}</div>
                <div className="text-[11px] text-stone-400 leading-relaxed mb-2">
                  {route.description}
                </div>

                <div className="text-[10px] text-stone-500 mb-2">
                  REQUIREMENT: <span className="text-stone-300">{route.requiredConcealment}</span>
                </div>

                {/* Outcome Narrative */}
                {route.outcomeNarrative && (
                  <div className="p-2 rounded bg-black/60 border border-blue-800 text-[11px] text-blue-200">
                    {route.outcomeNarrative}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-stone-800 mt-3">
                {!route.isExecuted ? (
                  <button
                    type="button"
                    onClick={() => executeBorderExfiltration(route.id)}
                    className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow active:scale-95"
                  >
                    <span>EXECUTE BORDER CROSSING</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="p-1.5 rounded bg-blue-950/60 border border-blue-600 text-blue-300 text-[10px] text-center font-bold">
                    ✓ EXFILTRATION RUN ATTEMPTED
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer Info */}
      <div className="relative z-10 pt-2 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-500">
        <span>TRADE-CRAFT: EMERGENCY EXTRACTION ROUTE EXECUTION</span>
        <span>BENEFIT: SAFELY ARCHIVES OPERATIVE & ADVANCES CAMPAIGN THEATER</span>
      </div>
    </div>
  )
}
