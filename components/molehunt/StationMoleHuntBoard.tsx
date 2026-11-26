'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'
import { useGameStore } from '@/lib/store'
import { ShieldAlert, UserX, FileSearch, CheckCircle2, AlertOctagon, HelpCircle, DollarSign } from 'lucide-react'

export const StationMoleHuntBoard: React.FC = () => {
  const moleSuspects = useGameStore((s) => s.moleSuspects)
  const auditMoleSuspect = useGameStore((s) => s.auditMoleSuspect)
  const accuseStationMole = useGameStore((s) => s.accuseStationMole)

  const [selectedSuspectId, setSelectedSuspectId] = useState<string>(moleSuspects[0]?.id || '')

  const selectedSuspect = moleSuspects.find((s) => s.id === selectedSuspectId) || moleSuspects[0]

  if (!selectedSuspect) return null

  return (
    <div className="relative w-full h-full min-h-[460px] flex flex-col justify-between p-4 bg-[#14100c] border-2 border-amber-950/70 rounded-2xl overflow-hidden font-mono shadow-2xl text-stone-300">
      {/* Top Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between border-b border-amber-900/40 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-950/80 border border-red-600/60 text-red-400">
            <UserX className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-black tracking-widest text-amber-300 uppercase">
              INTERNAL MOLE HUNT // COUNTER-INTELLIGENCE PINBOARD
            </div>
            <div className="text-[10px] text-stone-500">
              CROSS-REFERENCING STATION LEAKS, ZURICH ACCOUNTS & CIPHER TELEGRAMS
            </div>
          </div>
        </div>

        <div className="text-xs text-amber-400 font-bold">
          DIRECTORATE AWARD: $1,000 CASH + PERMANENT ALERT REDUCTION
        </div>
      </div>

      {/* Main Suspects Board */}
      <div className="relative z-10 my-4 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {/* Left: Suspect Roster List */}
        <div className="p-4 rounded-xl border border-amber-900/30 bg-[#1a140f] flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
              <FileSearch className="w-3.5 h-3.5 text-amber-400" />
              <span>STATION PERSONNEL DOSSIER FILES:</span>
            </div>

            <div className="space-y-2">
              {moleSuspects.map((suspect) => {
                const isSelected = suspect.id === selectedSuspect.id

                return (
                  <div
                    key={suspect.id}
                    onClick={() => {
                      setSelectedSuspectId(suspect.id)
                      auditMoleSuspect(suspect.id)
                    }}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-950/50 shadow'
                        : suspect.isFormallyAccused
                        ? 'border-stone-800 bg-black/60 opacity-60'
                        : 'border-stone-800 bg-black/40 hover:border-stone-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-stone-200">{suspect.name}</div>
                      <div className="text-[10px] text-stone-400">{suspect.stationRole}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-red-400 font-bold">
                        SUSPICION: {suspect.suspicionScore}%
                      </span>
                      {suspect.isFormallyAccused && (
                        <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-300 text-[9px] font-bold">
                          ACCUSED
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="text-[10px] text-stone-500 mt-2">
            Click suspect to open wiretap transcripts & examine financial telemetry.
          </div>
        </div>

        {/* Right: Selected Suspect Evidence & Accusation */}
        <div className="p-4 rounded-xl border border-amber-900/30 bg-[#1a140f] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-amber-900/30 pb-2 mb-3">
              <span className="font-bold text-amber-300 text-xs">{selectedSuspect.name.toUpperCase()}</span>
              <span className="text-[10px] text-stone-400">{selectedSuspect.stationRole}</span>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-2.5 rounded bg-black/60 border border-stone-800">
                <span className="text-[10px] text-stone-500 font-bold block mb-1">STATION BACKGROUND:</span>
                <span className="text-stone-300">{selectedSuspect.dossierSnippet}</span>
              </div>

              <div className="p-2.5 rounded bg-red-950/30 border border-red-900/50">
                <span className="text-[10px] text-red-400 font-bold block mb-1">INTERCEPTED EVIDENCE:</span>
                <span className="text-red-200">{selectedSuspect.interceptProof}</span>
              </div>
            </div>
          </div>

          {/* Formally Accuse Action */}
          <div className="pt-3 border-t border-amber-900/30">
            {!selectedSuspect.isFormallyAccused ? (
              <button
                type="button"
                onClick={() => accuseStationMole(selectedSuspect.id)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xl active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>FORMALLY ACCUSE & ARREST AS SYNDICATE MOLE</span>
              </button>
            ) : (
              <div className="p-2 rounded bg-stone-900 border border-stone-800 text-stone-400 text-xs text-center font-bold">
                PROCEEDING CLOSED // ACCUSATION DELIVERED
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 pt-2 border-t border-amber-900/40 flex items-center justify-between text-[11px] text-stone-500">
        <span>TRADE-CRAFT: INTERNAL COUNTER-ESPIONAGE // MI6 INVESTIGATION</span>
        <span>BENEFIT: STOPS SYNDICATE SURVEILLANCE & LEAKS</span>
      </div>
    </div>
  )
}
