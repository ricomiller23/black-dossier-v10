'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGameStore } from '@/lib/store'
import { HitLocation } from '@/lib/schemas'
import { STANDARD_WEAPONS } from '@/lib/engine/combat'
import { Crosshair, Shield, Zap, RefreshCw, AlertOctagon } from 'lucide-react'

export const BallisticCombatView: React.FC = () => {
  const agent = useGameStore((s) => s.agent)
  const applyDamage = useGameStore((s) => s.applyDamage)
  const healAgent = useGameStore((s) => s.healAgent)
  const submitAction = useGameStore((s) => s.submitAction)
  const diceResult = useGameStore((s) => s.diceResult)
  const isRollingDice = useGameStore((s) => s.isRollingDice)
  const useEdgePoint = useGameStore((s) => s.useEdgePoint)

  const [selectedWeapon, setSelectedWeapon] = useState(STANDARD_WEAPONS[1])
  const [targetLocation, setTargetLocation] = useState<HitLocation>('chest')

  if (!agent) return null

  const handleShoot = () => {
    submitAction(`Engage hostile with ${selectedWeapon.name} aiming for the ${targetLocation}`)
  }

  return (
    <div className="relative w-full h-full min-h-[500px] sm:min-h-[580px] md:min-h-[660px] rounded-2xl overflow-hidden border border-rose-900/50 bg-[#090b10] shadow-[0_0_60px_rgba(225,29,72,0.18)] p-4 flex flex-col justify-between select-none">
      {/* 1. Combat Header HUD */}
      <div className="relative z-20 flex flex-wrap items-center justify-between pb-3 border-b border-rose-900/40 gap-2">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded bg-rose-950/80 border border-rose-600 text-rose-300 font-mono text-xs sm:text-sm font-black tracking-widest uppercase flex items-center gap-1.5 shadow">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            BALLISTIC ENGAGEMENT // KINETIC COMBAT
          </div>
          <span className="text-xs sm:text-sm font-mono text-stone-300">
            WOUND CONDITION:{' '}
            <strong
              className={
                agent.woundState === 'Fine'
                  ? 'text-emerald-400'
                  : agent.woundState === 'Grazed'
                  ? 'text-yellow-400'
                  : 'text-rose-500 font-black animate-pulse'
              }
            >
              {agent.woundState.toUpperCase()}
            </strong>
          </span>
        </div>

        {/* Edge Point Reroll Button */}
        <button
          type="button"
          disabled={agent.edgePoints <= 0}
          onClick={() => useEdgePoint()}
          className={`px-3.5 py-1.5 rounded-lg border text-xs sm:text-sm font-mono font-bold flex items-center gap-1.5 transition-all ${
            agent.edgePoints > 0
              ? 'bg-amber-950/70 border-amber-500 text-amber-300 hover:bg-amber-900 active:scale-95 cursor-pointer shadow-lg'
              : 'bg-stone-900/60 border-stone-800 text-stone-600 cursor-not-allowed'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>USE EDGE POINT ({agent.edgePoints} AVAIL)</span>
        </button>
      </div>

      {/* 2. Main Combat Arena: Anatomical Mannequin (Left) & 3D Dice Tray (Right) */}
      <div className="relative flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center my-3 min-h-[360px] sm:min-h-[440px]">
        {/* Left: Holographic Wireframe Anatomical Hit Location Target */}
        <div className="relative h-full flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-black/70 border border-stone-800">
          <span className="text-xs font-mono text-rose-400 font-bold mb-2 uppercase tracking-wider">
            ANATOMICAL TARGET MATRIX // SELECT HIT LOCATION
          </span>

          <div className="relative w-56 sm:w-64 md:w-80 h-72 sm:h-80 md:h-[360px] flex items-center justify-center">
            {/* SVG Wireframe Mannequin */}
            <svg viewBox="0 0 160 220" className="w-full h-full drop-shadow-xl" preserveAspectRatio="xMidYMid meet">
              {/* Head */}
              <motion.circle
                cx="80"
                cy="30"
                r="18"
                className="cursor-pointer"
                fill={targetLocation === 'head' ? '#e11d48' : '#1e293b'}
                stroke={targetLocation === 'head' ? '#fda4af' : '#64748b'}
                strokeWidth="2.5"
                whileHover={{ scale: 1.1 }}
                onClick={() => setTargetLocation('head')}
              />
              <text x="80" y="34" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold" pointerEvents="none">
                HEAD (2.0x)
              </text>

              {/* Chest */}
              <motion.path
                d="M55 52 L105 52 L98 95 L62 95 Z"
                className="cursor-pointer"
                fill={targetLocation === 'chest' ? '#e11d48' : '#1e293b'}
                stroke={targetLocation === 'chest' ? '#fda4af' : '#64748b'}
                strokeWidth="2.5"
                whileHover={{ scale: 1.06 }}
                onClick={() => setTargetLocation('chest')}
              />
              <text x="80" y="75" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold" pointerEvents="none">
                CHEST (1.2x)
              </text>

              {/* Abdomen */}
              <motion.path
                d="M62 98 L98 98 L92 135 L68 135 Z"
                className="cursor-pointer"
                fill={targetLocation === 'abdomen' ? '#e11d48' : '#1e293b'}
                stroke={targetLocation === 'abdomen' ? '#fda4af' : '#64748b'}
                strokeWidth="2.5"
                whileHover={{ scale: 1.06 }}
                onClick={() => setTargetLocation('abdomen')}
              />
              <text x="80" y="118" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold" pointerEvents="none">
                ABDOMEN
              </text>

              {/* Arms */}
              <motion.path
                d="M50 56 L30 115 L40 120 L55 68 Z"
                className="cursor-pointer"
                fill={targetLocation === 'arms' ? '#e11d48' : '#1e293b'}
                stroke={targetLocation === 'arms' ? '#fda4af' : '#64748b'}
                strokeWidth="2.5"
                whileHover={{ scale: 1.06 }}
                onClick={() => setTargetLocation('arms')}
              />
              <motion.path
                d="M110 56 L130 115 L120 120 L105 68 Z"
                className="cursor-pointer"
                fill={targetLocation === 'arms' ? '#e11d48' : '#1e293b'}
                stroke={targetLocation === 'arms' ? '#fda4af' : '#64748b'}
                strokeWidth="2.5"
                whileHover={{ scale: 1.06 }}
                onClick={() => setTargetLocation('arms')}
              />

              {/* Legs */}
              <motion.path
                d="M66 138 L60 210 L74 210 L78 138 Z"
                className="cursor-pointer"
                fill={targetLocation === 'legs' ? '#e11d48' : '#1e293b'}
                stroke={targetLocation === 'legs' ? '#fda4af' : '#64748b'}
                strokeWidth="2.5"
                whileHover={{ scale: 1.06 }}
                onClick={() => setTargetLocation('legs')}
              />
              <motion.path
                d="M94 138 L100 210 L86 210 L82 138 Z"
                className="cursor-pointer"
                fill={targetLocation === 'legs' ? '#e11d48' : '#1e293b'}
                stroke={targetLocation === 'legs' ? '#fda4af' : '#64748b'}
                strokeWidth="2.5"
                whileHover={{ scale: 1.06 }}
                onClick={() => setTargetLocation('legs')}
              />
            </svg>
          </div>

          <div className="mt-2 text-xs sm:text-sm font-mono text-[#F2D06B]">
            CURRENT TARGET: <strong className="uppercase">{targetLocation}</strong>
          </div>
        </div>

        {/* Right: 3D Rolling Dice Tray & Outcome Display */}
        <div className="relative h-full flex flex-col items-center justify-between p-4 rounded-xl bg-[#0f172a]/95 border border-cyan-900/60 shadow-inner">
          <span className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider">
            FELT BALLISTIC DICE TRAY // d100 TEST
          </span>

          {/* Animated 3D Dice Display */}
          <div className="relative w-48 sm:w-56 h-48 sm:h-56 rounded-2xl bg-[#031526] border-2 border-cyan-500/50 shadow-[inset_0_0_30px_rgba(14,165,233,0.35)] flex flex-col items-center justify-center overflow-hidden my-2">
            <AnimatePresence mode="wait">
              {isRollingDice ? (
                <motion.div
                  key="rolling"
                  animate={{
                    rotate: [0, 90, 180, 270, 360],
                    scale: [0.8, 1.15, 0.9, 1.05, 1]
                  }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-700 shadow-2xl flex items-center justify-center border-2 border-white/50 text-white font-black text-3xl font-mono"
                >
                  ??
                </motion.div>
              ) : diceResult ? (
                <motion.div
                  key="result"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center text-center p-3"
                >
                  <span className="text-xs font-mono text-stone-400">ROLL / TARGET</span>
                  <div className="text-5xl sm:text-6xl font-black font-mono my-1 tracking-tight">
                    <span
                      className={
                        diceResult.outcome === 'CRITICAL'
                          ? 'text-emerald-400'
                          : diceResult.outcome === 'SUCCESS'
                          ? 'text-cyan-300'
                          : diceResult.outcome === 'FUMBLE'
                          ? 'text-red-500'
                          : 'text-amber-400'
                      }
                    >
                      {diceResult.roll}
                    </span>
                    <span className="text-xl sm:text-2xl text-stone-500"> / {diceResult.target}</span>
                  </div>

                  <div
                    className={`mt-1 px-3 py-1 rounded text-xs sm:text-sm font-black font-mono uppercase tracking-wider ${
                      diceResult.outcome === 'CRITICAL'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                        : diceResult.outcome === 'SUCCESS'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-600'
                        : diceResult.outcome === 'FUMBLE'
                        ? 'bg-red-950 text-red-300 border border-red-600'
                        : 'bg-amber-950 text-amber-300 border border-amber-600'
                    }`}
                  >
                    {diceResult.outcome} ({diceResult.margin >= 0 ? `+${diceResult.margin}` : diceResult.margin})
                  </div>
                </motion.div>
              ) : (
                <div className="text-center font-mono text-xs sm:text-sm text-stone-400 p-4">
                  READY TO ENGAGE
                  <div className="text-[10px] sm:text-xs text-stone-500 mt-1">Select weapon & target, then fire</div>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="text-[11px] font-mono text-stone-400 text-center">
            SUCCESS MARGIN SCALES DAMAGE DIRECTLY
          </div>
        </div>
      </div>

      {/* 3. Bottom Hardware & Firing Controls */}
      <div className="relative z-20 pt-3 border-t border-rose-900/40 flex flex-wrap items-center justify-between gap-3">
        {/* Weapon Selector */}
        <div className="flex items-center gap-2 font-mono text-xs sm:text-sm">
          <span className="text-stone-400">SIDEARM:</span>
          <select
            value={selectedWeapon.id}
            onChange={(e) => {
              const wep = STANDARD_WEAPONS.find((w) => w.id === e.target.value)
              if (wep) setSelectedWeapon(wep)
            }}
            className="p-2 rounded-lg bg-black/80 border border-stone-700 text-stone-200 focus:outline-none focus:border-rose-500 text-xs sm:text-sm font-bold"
          >
            {STANDARD_WEAPONS.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} (Dmg: {w.baseDamage})
              </option>
            ))}
          </select>
        </div>

        {/* Firing Trigger Button */}
        <button
          type="button"
          onClick={handleShoot}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-mono font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 active:scale-95 transition-all shadow-xl cursor-pointer"
        >
          <Crosshair className="w-4 h-4" />
          <span>FIRE AT {targetLocation.toUpperCase()}</span>
        </button>
      </div>
    </div>
  )
}
