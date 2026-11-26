'use client'

import React from 'react'
import { motion } from 'motion/react'
import { useGameStore } from '@/lib/store'
import { FlaskConical, Droplet, Sparkles, CheckCircle2, Flame, ShieldCheck, Beaker } from 'lucide-react'

export const ClandestineChemLab: React.FC = () => {
  const chemicalCompounds = useGameStore((s) => s.chemicalCompounds)
  const chemicalReagentsCount = useGameStore((s) => s.chemicalReagentsCount)
  const craftChemicalCompound = useGameStore((s) => s.craftChemicalCompound)

  return (
    <div className="relative w-full h-full min-h-[460px] flex flex-col justify-between p-4 bg-[#080d0d] border-2 border-emerald-950/60 rounded-2xl overflow-hidden font-mono shadow-2xl text-stone-300">
      {/* Top Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between border-b border-emerald-900/40 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-600/60 text-emerald-400">
            <FlaskConical className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <div className="text-xs font-black tracking-widest text-emerald-300 uppercase">
              SAFEHOUSE APOTHECARY // CLANDESTINE CHEMICAL LAB
            </div>
            <div className="text-[10px] text-stone-500">
              CUSTOM PHARMACEUTICAL & CORROSIVE COMPOUND SYNTHESIS
            </div>
          </div>
        </div>

        {/* Reagent Vials Count */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs font-bold">
          <Beaker className="w-4 h-4 text-emerald-400" />
          <span>REAGENT VIALS: {chemicalReagentsCount}</span>
        </div>
      </div>

      {/* Compounds Synthesis Cards */}
      <div className="relative z-10 my-4 grid grid-cols-1 md:grid-cols-3 gap-3 flex-1 overflow-y-auto">
        {chemicalCompounds.map((comp) => {
          const canAfford = chemicalReagentsCount >= comp.costReagents

          return (
            <div
              key={comp.id}
              className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                comp.crafted
                  ? 'border-emerald-600/60 bg-[#081714]'
                  : 'border-emerald-900/40 bg-[#0a1210] hover:border-emerald-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-emerald-500/80 font-bold tracking-widest uppercase">
                    FORMULA: {comp.formula}
                  </span>
                  <span className="text-[10px] text-stone-400 font-bold">
                    COST: {comp.costReagents} VIALS
                  </span>
                </div>

                <div className="font-bold text-xs text-emerald-200 mb-1">{comp.name}</div>
                <div className="text-[11px] text-stone-400 leading-relaxed mb-3">
                  {comp.effect}
                </div>
              </div>

              {/* Crafting Action Button */}
              <div className="pt-3 border-t border-emerald-950">
                {comp.crafted ? (
                  <div className="p-2 rounded bg-emerald-950/60 border border-emerald-600 text-emerald-300 text-xs text-center font-bold flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>SYNTHESIZED & SLOTTED IN GEAR</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={!canAfford}
                    onClick={() => craftChemicalCompound(comp.id)}
                    className={`w-full py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-black shadow active:scale-95'
                        : 'bg-stone-900 text-stone-600 border border-stone-800 cursor-not-allowed'
                    }`}
                  >
                    <Droplet className="w-3.5 h-3.5" />
                    <span>SYNTHESIZE COMPOUND ({comp.costReagents} VIALS)</span>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer Info */}
      <div className="relative z-10 pt-2 border-t border-emerald-900/40 flex items-center justify-between text-[11px] text-stone-500">
        <span>TRADE-CRAFT: CHEMICAL AGENTS // ZERO TRACE BIOLOGICALS</span>
        <span>BENEFIT: ENHANCES INTERROGATION & SILENT COMBAT</span>
      </div>
    </div>
  )
}
