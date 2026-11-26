'use client'

import React from 'react'
import { motion } from 'motion/react'
import { useGameStore } from '@/lib/store'
import { Wine, Mic, Radio, ShieldAlert, Sparkles, CheckCircle2, UserCheck } from 'lucide-react'

export const EmbassyGalaEavesdrop: React.FC = () => {
  const galaGuests = useGameStore((s) => s.galaGuests)
  const embassyGalaState = useGameStore((s) => s.embassyGalaState)
  const eavesdropGalaGuest = useGameStore((s) => s.eavesdropGalaGuest)

  return (
    <div className="relative w-full h-full min-h-[460px] flex flex-col justify-between p-4 bg-[#121018] border-2 border-purple-950/60 rounded-2xl overflow-hidden font-mono shadow-2xl text-stone-300">
      {/* Top Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between border-b border-purple-900/40 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-950/80 border border-purple-600/60 text-purple-400">
            <Wine className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-black tracking-widest text-purple-300 uppercase">
              HIGH-SOCIETY EMBASSY GALA // DIRECTIONAL MIC
            </div>
            <div className="text-[10px] text-stone-500">
              SOCIAL INFILTRATION // PARABOLIC AUDIO INTERCEPT
            </div>
          </div>
        </div>

        {/* Composure vs Suspicion Gauges */}
        <div className="flex items-center gap-3">
          <div className="text-xs text-purple-300">
            COMPOSURE: <strong>{embassyGalaState.composure}%</strong>
          </div>
          <div className="text-xs text-red-400">
            SUSPICION: <strong>{embassyGalaState.suspicion}%</strong>
          </div>
        </div>
      </div>

      {/* Diplomatic Guests Grid */}
      <div className="relative z-10 my-4 grid grid-cols-1 md:grid-cols-3 gap-3 flex-1 overflow-y-auto">
        {galaGuests.map((guest) => (
          <div
            key={guest.id}
            className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
              guest.eavesdropped
                ? 'border-purple-600/60 bg-[#1e142e]'
                : 'border-purple-900/40 bg-[#161220] hover:border-purple-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-purple-400 font-bold uppercase">{guest.faction}</span>
                <span className="text-[9px] text-red-400 font-bold">RISK: +{guest.suspicionRisk}%</span>
              </div>

              <div className="font-bold text-xs text-stone-200 mb-0.5">{guest.name}</div>
              <div className="text-[10px] text-stone-400 mb-2">{guest.title}</div>

              {/* Secret Transcript */}
              {guest.eavesdropped ? (
                <div className="p-2.5 rounded bg-black/60 border border-purple-800 text-[11px] text-purple-200 leading-relaxed">
                  <span className="font-bold text-purple-400 block mb-0.5">INTERCEPTED WHISPER:</span>
                  {guest.whisperedSecret}
                </div>
              ) : (
                <div className="p-2.5 rounded bg-black/40 border border-stone-800 text-[10px] text-stone-500 text-center">
                  Target conversing quietly by the marble column. Aim parabolic mic to intercept audio.
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="pt-3 border-t border-purple-950 mt-3">
              {!guest.eavesdropped ? (
                <button
                  type="button"
                  onClick={() => eavesdropGalaGuest(guest.id)}
                  className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow active:scale-95"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>AIM DIRECTIONAL MIC & LISTEN</span>
                </button>
              ) : (
                <div className="p-1.5 rounded bg-purple-950/60 border border-purple-600 text-purple-300 text-[10px] text-center font-bold">
                  ✓ SECRET EXTRACTED TO CORKBOARD
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="relative z-10 pt-2 border-t border-purple-900/40 flex items-center justify-between text-[11px] text-stone-500">
        <span>TRADE-CRAFT: AMBASSADORIAL BLACK-TIE INFILTRATION</span>
        <span>SECRETS EXTRACTED: {embassyGalaState.secretsExtracted}</span>
      </div>
    </div>
  )
}
