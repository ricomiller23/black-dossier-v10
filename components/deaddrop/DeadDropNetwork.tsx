'use client'

import React from 'react'
import { motion } from 'motion/react'
import { useGameStore } from '@/lib/store'
import { MapPin, PackageCheck, Zap, AlertTriangle, CheckCircle2, ShieldAlert, DollarSign } from 'lucide-react'

export const DeadDropNetwork: React.FC = () => {
  const deadDropSites = useGameStore((s) => s.deadDropSites)
  const retrieveDeadDrop = useGameStore((s) => s.retrieveDeadDrop)
  const orderAssetSabotage = useGameStore((s) => s.orderAssetSabotage)

  return (
    <div className="relative w-full h-full min-h-[460px] flex flex-col justify-between p-4 bg-[#0d1117] border-2 border-stone-800 rounded-2xl overflow-hidden font-mono shadow-2xl text-stone-300">
      {/* Top Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between border-b border-stone-800 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-600/60 text-emerald-400">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-black tracking-widest text-emerald-300 uppercase">
              CLANDESTINE DEAD-DROP & HUMINT ASSET NETWORK
            </div>
            <div className="text-[10px] text-stone-500">
              ZERO-ELECTRONIC CONTACT // CONCEALED PHYSICAL DROPPOINTS
            </div>
          </div>
        </div>

        <div className="text-xs text-stone-400">
          ACTIVE NETWORK DROPS: <span className="text-emerald-400 font-bold">{deadDropSites.length}</span>
        </div>
      </div>

      {/* Dead-Drop Cards Grid */}
      <div className="relative z-10 my-4 grid grid-cols-1 md:grid-cols-3 gap-3 flex-1 overflow-y-auto">
        {deadDropSites.map((site) => {
          const isRetrieved = site.status === 'retrieved'
          const isSabotaged = site.status === 'sabotage_ordered'

          return (
            <div
              key={site.id}
              className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                isRetrieved
                  ? 'border-emerald-700/50 bg-[#091510]'
                  : isSabotaged
                  ? 'border-amber-700/50 bg-[#17130a]'
                  : 'border-stone-800 bg-[#12161f] hover:border-stone-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-stone-500 uppercase font-bold">
                    LOCATION SEC-0{site.id.slice(-1)}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      isRetrieved
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                        : isSabotaged
                        ? 'bg-amber-950 text-amber-400 border border-amber-700'
                        : 'bg-stone-900 text-stone-400 border border-stone-800'
                    }`}
                  >
                    {site.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="font-bold text-xs text-stone-200 mb-1">{site.name}</div>
                <div className="text-[11px] text-stone-400 mb-2 leading-relaxed">
                  {site.locationDesc}
                </div>

                <div className="text-[10px] text-stone-500 mb-2">
                  INFORMANT: <strong className="text-stone-300">{site.assetContact}</strong>
                </div>

                {/* Intel & Bounty */}
                <div className="p-2 rounded bg-black/50 border border-stone-800/80 text-[11px] space-y-1">
                  <div className="flex items-center gap-1 text-emerald-400 font-bold">
                    <DollarSign className="w-3 h-3" />
                    <span>${site.cashReward} BLACK BUDGET CASH</span>
                  </div>
                  <div className="text-stone-400 text-[10px] line-clamp-2">
                    {site.intelPayload}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-800/60 mt-3 space-y-1.5">
                {!isRetrieved && !isSabotaged ? (
                  <>
                    <button
                      type="button"
                      onClick={() => retrieveDeadDrop(site.id)}
                      className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow transition-all active:scale-95"
                    >
                      <PackageCheck className="w-3.5 h-3.5" />
                      <span>RETRIEVE DROP & INTEL</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => orderAssetSabotage(site.id)}
                      className="w-full py-1.5 rounded-lg bg-stone-900 hover:bg-amber-950 border border-stone-800 hover:border-amber-600 text-stone-300 hover:text-amber-200 font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>ORDER ASSET SABOTAGE</span>
                    </button>
                  </>
                ) : isRetrieved ? (
                  <div className="p-2 rounded bg-emerald-950/40 border border-emerald-700/60 text-emerald-300 text-[10px] text-center font-bold">
                    ✓ CACHE RETRIEVED // INTEL ON CORKBOARD
                  </div>
                ) : (
                  <div className="p-2 rounded bg-amber-950/40 border border-amber-700/60 text-amber-300 text-[10px] text-center font-bold">
                    ⚡ ASSET EXECUTED POWER BLACKOUT
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer Info */}
      <div className="relative z-10 pt-2 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-500">
        <span>STRATEGY: DEAD-DROPS BYPASS SATELLITE & RADIO INTERCEPTION</span>
        <span>BENEFIT: AWARDS HARD CURRENCY & DIRECT SABOTAGE</span>
      </div>
    </div>
  )
}
