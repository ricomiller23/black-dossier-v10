'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGameStore } from '@/lib/store'
import { Globe, MapPin, ShieldAlert, Award, Star, ArrowRight, Radio, Flag } from 'lucide-react'
import { CampaignCity } from '@/lib/schemas'

export const GlobalCampaignAtlas: React.FC = () => {
  const campaignCities = useGameStore((s) => s.campaignCities)
  const activeCityId = useGameStore((s) => s.activeCityId)
  const selectCampaignCity = useGameStore((s) => s.selectCampaignCity)
  const agent = useGameStore((s) => s.agent)

  const [selectedCity, setSelectedCity] = useState<CampaignCity>(
    campaignCities.find((c) => c.id === activeCityId) || campaignCities[0]
  )

  return (
    <div className="relative w-full h-full min-h-[480px] sm:min-h-[560px] md:min-h-[640px] rounded-2xl overflow-hidden border border-blue-900/50 bg-[#050b14] shadow-[0_0_60px_rgba(59,130,246,0.18)] p-4 flex flex-col justify-between font-mono select-none">
      {/* 1. Header: Global Crisis HUD */}
      <div className="relative z-20 flex flex-wrap items-center justify-between pb-3 border-b border-blue-900/40 gap-2">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded bg-blue-950/80 border border-blue-600 text-blue-300 text-xs sm:text-sm font-black tracking-widest uppercase flex items-center gap-1.5 shadow">
            <Globe className="w-4 h-4 text-blue-400 animate-spin" />
            <span>GLOBAL CAMPAIGN ATLAS // COLD WAR CRISIS THEATERS</span>
          </div>
          <span className="text-xs text-stone-400">
            CLEARANCE: <strong className="text-amber-400">LEVEL {agent?.clearanceLevel || 1}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-400 bg-black/60 px-3 py-1 rounded border border-stone-800">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>ACTIVE THEATERS: 5 GLOBAL SECTORS</span>
        </div>
      </div>

      {/* 2. Main World Map Vector Canvas & Hotspot Pins */}
      <div className="relative flex-1 my-3 rounded-xl border border-blue-950 bg-[#07101e] overflow-hidden flex flex-col justify-between p-3 min-h-[280px] sm:min-h-[340px]">
        {/* World Map Background SVG */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
          <svg viewBox="0 0 1000 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* World Continents Outlines */}
            <path
              d="M150,120 Q200,80 260,100 T300,160 T250,220 T180,200 Z"
              fill="#1e293b"
              stroke="#3b82f6"
              strokeWidth="1.5"
            />
            {/* North America */}
            <path
              d="M160,140 Q220,130 240,180 T200,240 T150,220 Z"
              fill="#1e3a5f"
              stroke="#60a5fa"
              strokeWidth="1"
            />
            {/* Europe */}
            <path
              d="M450,110 Q520,90 560,130 T540,190 T470,180 Z"
              fill="#1e3a5f"
              stroke="#60a5fa"
              strokeWidth="1.5"
            />
            {/* Asia & USSR */}
            <path
              d="M560,90 Q720,70 820,120 T800,220 T620,240 T540,160 Z"
              fill="#1e3a5f"
              stroke="#ef4444"
              strokeWidth="1.5"
            />
            {/* Africa */}
            <path
              d="M460,220 Q540,210 550,290 T500,380 T430,300 Z"
              fill="#1e293b"
              stroke="#3b82f6"
              strokeWidth="1"
            />
            {/* Iron Curtain Dividing Line */}
            <line x1="490" y1="100" x2="480" y2="200" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="6 3" />
            <text x="495" y="150" fill="#ef4444" fontSize="10" fontFamily="monospace" fontWeight="bold">IRON CURTAIN</text>
          </svg>
        </div>

        {/* Global Cities Interactive Pins */}
        <div className="absolute inset-0 z-20">
          {campaignCities.map((city) => {
            const isSelected = selectedCity.id === city.id
            const isActive = activeCityId === city.id

            return (
              <motion.div
                key={city.id}
                style={{ left: `${city.x}%`, top: `${city.y}%` }}
                whileHover={{ scale: 1.15 }}
                onClick={() => setSelectedCity(city)}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer flex flex-col items-center group"
              >
                {/* Pin Aura */}
                <div
                  className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                    isSelected
                      ? 'bg-amber-500 border-white shadow-[0_0_20px_#f59e0b] scale-125'
                      : isActive
                      ? 'bg-blue-600 border-blue-300'
                      : 'bg-stone-900 border-stone-600'
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>

                {/* City Tag Pill */}
                <div
                  className={`mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase transition-all shadow-md ${
                    isSelected
                      ? 'bg-amber-500 text-black font-black'
                      : 'bg-black/80 text-stone-300 border border-stone-800'
                  }`}
                >
                  {city.name}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Overlay: Selected City Intelligence Dossier Card */}
        <div className="relative z-30 mt-auto p-4 rounded-xl bg-black/85 border border-blue-600/50 shadow-2xl backdrop-blur-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                TARGET THEATER:
              </span>
              <span className="text-base font-black text-white">
                {selectedCity.name}, {selectedCity.country}
              </span>
              <div className="flex items-center gap-0.5 ml-2">
                {Array.from({ length: selectedCity.threatLevel }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                ))}
              </div>
            </div>

            <div className="text-xs text-amber-300 font-bold">
              SYNDICATE PRESENCE: <span className="text-white">{selectedCity.syndicateCell}</span>
            </div>

            <p className="text-xs text-stone-300 leading-snug">
              OPERATIONAL DIRECTIVE: {selectedCity.objective}
            </p>
          </div>

          <button
            type="button"
            onClick={() => selectCampaignCity(selectedCity.id)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-mono font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 transition-all shadow-xl active:scale-95 shrink-0 cursor-pointer"
          >
            <span>DEPLOY TO {selectedCity.name.toUpperCase()}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Bottom Campaign Status */}
      <div className="relative z-20 pt-2 border-t border-blue-900/40 flex flex-wrap justify-between items-center text-xs text-stone-400 gap-2">
        <span>STRATEGIC COMMAND: DIRECTORATE CLANDESTINE SERVICES</span>
        <span className="text-[#F2D06B]">COLD WAR GEOPOLITICAL THEATER v1.0</span>
      </div>
    </div>
  )
}
