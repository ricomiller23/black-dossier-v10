'use client'

import React from 'react'
import { motion } from 'motion/react'
import { useGameStore } from '@/lib/store'
import { Briefcase, Shield, Zap, DollarSign, Check, Plus, Package } from 'lucide-react'
import { Item } from '@/lib/schemas'

export const BriefcaseLoadout: React.FC = () => {
  const agent = useGameStore((s) => s.agent)
  const availableGadgets = useGameStore((s) => s.availableGadgets)
  const buyGadget = useGameStore((s) => s.buyGadget)

  if (!agent) return null

  const isEquipped = (id: string) => agent.inventory.some((i) => i.id === id)

  return (
    <div className="relative w-full h-full min-h-[480px] sm:min-h-[560px] md:min-h-[640px] rounded-2xl overflow-hidden border-4 border-[#3a3d45] bg-[#12141a] shadow-[0_0_60px_rgba(0,0,0,0.8)] p-4 flex flex-col justify-between font-mono select-none">
      {/* 1. Header: Attaché Briefcase Rim */}
      <div className="relative z-20 flex flex-wrap items-center justify-between pb-3 border-b border-stone-700/80 gap-2">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded bg-zinc-800 border border-zinc-600 text-zinc-200 text-xs sm:text-sm font-black tracking-widest uppercase flex items-center gap-1.5 shadow">
            <Briefcase className="w-4 h-4 text-amber-400" />
            <span>ALUMINUM ATTACHÉ CASE // FOAM CUTOUT LOADOUT</span>
          </div>
          <span className="text-xs text-stone-400">
            OPERATIVE: <strong className="text-white">{agent.codename}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-black/60 border border-amber-600/50 text-amber-300 font-bold text-xs sm:text-sm shadow">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>BLACK BUDGET: ${agent.funds.toLocaleString()}</span>
        </div>
      </div>

      {/* 2. Main Attaché Foam Cutout Grid */}
      <div className="relative flex-1 my-3 p-4 rounded-xl border-2 border-stone-700 bg-[#0a0c10] shadow-[inset_0_0_40px_rgba(0,0,0,0.9)] overflow-y-auto">
        {/* Foam Cutout Egg-Crate Texture */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '16px 16px'
          }}
        />

        {/* Section: Currently Equipped Hardware in Foam Cutouts */}
        <div className="relative z-10 mb-6">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Package className="w-4 h-4" />
            <span>CURRENTLY SLOTTED IN FIELD ATTACHÉ ({agent.inventory.length} ITEMS)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {agent.inventory.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                className="p-3 rounded-lg border-2 border-stone-800 bg-[#141720] shadow-inner flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-stone-400 uppercase mb-1">
                    <span className="font-bold text-[#F2D06B]">{item.category}</span>
                    <span>{item.concealability}</span>
                  </div>
                  <div className="text-sm font-bold text-white">{item.name}</div>
                  <p className="text-xs text-stone-400 mt-1 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-stone-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    SLOTTED
                  </span>
                  {item.baseDamage && <span className="text-rose-400 font-bold">DMG: {item.baseDamage}</span>}
                  {item.armorPoints && <span className="text-cyan-400 font-bold">ARMOR: {item.armorPoints}</span>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section: Quartermaster Requisition Catalog */}
        <div className="relative z-10 pt-4 border-t border-stone-800">
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Zap className="w-4 h-4" />
            <span>QUARTERMASTER BLACK BUDGET GADGET CATALOG</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {availableGadgets.map((gadget) => {
              const equipped = isEquipped(gadget.id)
              const canAfford = agent.funds >= gadget.cost

              return (
                <div
                  key={gadget.id}
                  className={`p-3 rounded-lg border transition-all flex flex-col justify-between ${
                    equipped
                      ? 'bg-stone-900/40 border-stone-800 opacity-60'
                      : 'bg-[#10141e] border-cyan-900/60 shadow-lg'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-stone-400 uppercase mb-1">
                      <span className="font-bold text-cyan-400">{gadget.category}</span>
                      <span className="text-emerald-400 font-bold">${gadget.cost}</span>
                    </div>
                    <div className="text-sm font-bold text-white">{gadget.name}</div>
                    <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                      {gadget.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-800 flex justify-end">
                    {equipped ? (
                      <span className="text-xs text-stone-500 font-bold">ALREADY EQUIPPED</span>
                    ) : (
                      <button
                        type="button"
                        disabled={!canAfford}
                        onClick={() => buyGadget(gadget)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          canAfford
                            ? 'bg-amber-600 hover:bg-amber-500 text-black shadow active:scale-95'
                            : 'bg-stone-900 text-stone-600 border border-stone-800 cursor-not-allowed'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>REQUISITION (${gadget.cost})</span>
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 3. Bottom Hardware Notice */}
      <div className="relative z-20 pt-2 border-t border-stone-700/80 flex flex-wrap justify-between items-center text-xs text-stone-400 gap-2">
        <span>SECURITY SPECIFICATION: MIL-SPEC TYPE III ANODIZED ALUMINUM</span>
        <span className="text-[#F2D06B]">DIRECTORATE QUARTERMASTER LOGISTICS CORPS</span>
      </div>
    </div>
  )
}
