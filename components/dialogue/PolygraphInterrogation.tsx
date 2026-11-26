'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGameStore } from '@/lib/store'
import { Activity, Heart, ShieldAlert, AlertTriangle, UserCheck, MessageSquare, Flame, CheckCircle2 } from 'lucide-react'
import { InterrogationTactic } from '@/lib/schemas'

export const PolygraphInterrogation: React.FC = () => {
  const interrogationSubject = useGameStore((s) => s.interrogationSubject)
  const conductInterrogation = useGameStore((s) => s.conductInterrogation)

  const [lastResponse, setLastResponse] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Animated Polygraph Chart Paper
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let offset = 0
    const points: number[] = []

    // Populate initial points
    for (let i = 0; i < 200; i++) {
      points.push(50)
    }

    const render = () => {
      // Paper Background (Off-white graph grid)
      ctx.fillStyle = '#faf6ed'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Green Grid Lines
      ctx.strokeStyle = '#d4e2d4'
      ctx.lineWidth = 1
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Add new point based on current stress
      const currentStress = interrogationSubject?.stress || 25
      const jitter = (Math.random() - 0.5) * (currentStress * 0.4)
      const pulse = Math.sin(offset * 0.15) * (currentStress * 0.3)
      const newY = Math.max(10, Math.min(canvas.height - 10, canvas.height / 2 + pulse + jitter))

      points.shift()
      points.push(newY)

      // Draw Red Ink Needle Trace
      ctx.beginPath()
      ctx.strokeStyle = currentStress > 70 ? '#dc2626' : currentStress > 45 ? '#d97706' : '#2563eb'
      ctx.lineWidth = 2
      ctx.lineJoin = 'round'

      for (let i = 0; i < points.length; i++) {
        const x = (i / points.length) * canvas.width
        const y = points[i]
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Polygraph Stylus Needle Head
      const lastX = canvas.width - 2
      const lastY = points[points.length - 1]
      ctx.fillStyle = '#1c1917'
      ctx.beginPath()
      ctx.arc(lastX, lastY, 4, 0, Math.PI * 2)
      ctx.fill()

      offset++
      animationId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animationId)
  }, [interrogationSubject?.stress])

  if (!interrogationSubject) return null

  const handleTactic = (tactic: InterrogationTactic) => {
    const res = conductInterrogation(tactic)
    setLastResponse(res.text)
  }

  const tactics: { name: InterrogationTactic; desc: string }[] = [
    { name: 'Cold Logic', desc: 'Dismantle their timeline and conflicting alibis with forensic precision.' },
    { name: 'Ideological Pressure', desc: 'Exploit their fear of betrayal by high command.' },
    { name: 'Blackmail Threat', desc: 'Present intercepted Swiss bank account ledger receipts.' },
    { name: 'Bribery & Safe Passage', desc: 'Offer classified extraction passports for their family.' },
    { name: 'Blunt Intimidation', desc: 'Direct psychological coercion (Risk: may trigger alarm spike).' }
  ]

  return (
    <div className="relative w-full h-full min-h-[480px] sm:min-h-[560px] md:min-h-[640px] rounded-2xl overflow-hidden border border-amber-900/50 bg-[#0c0e14] shadow-[0_0_60px_rgba(217,119,6,0.18)] p-4 flex flex-col justify-between font-mono select-none">
      {/* 1. Header: Polygraph Galvanic Monitor HUD */}
      <div className="relative z-20 flex flex-wrap items-center justify-between pb-3 border-b border-amber-900/40 gap-2">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded bg-amber-950/80 border border-amber-600 text-amber-300 text-xs sm:text-sm font-black tracking-widest uppercase flex items-center gap-1.5 shadow">
            <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>GALVANIC POLYGRAPH // PSYCHOLOGICAL INTERROGATION</span>
          </div>
          <span className="text-xs text-stone-400">
            SUBJECT: <strong className="text-white">{interrogationSubject.name}</strong> ({interrogationSubject.alias})
          </span>
        </div>

        {/* Biometrics Display */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-black/60 border border-stone-800 text-rose-400 font-bold text-xs sm:text-sm shadow">
            <Heart className="w-4 h-4 text-rose-500 animate-ping" />
            <span>HEART RATE: {interrogationSubject.currentBPM} BPM</span>
          </div>
          <div
            className={`px-3 py-1 rounded border text-xs font-bold ${
              interrogationSubject.isBroken
                ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-[0_0_15px_#22c55e]'
                : interrogationSubject.stress > 60
                ? 'bg-red-950 border-red-500 text-red-300 animate-pulse'
                : 'bg-stone-900 border-stone-800 text-stone-300'
            }`}
          >
            <span>STRESS INDEX: {interrogationSubject.stress}%</span>
          </div>
        </div>
      </div>

      {/* 2. Main Polygraph Drum Canvas & Dialogue Log */}
      <div className="relative flex-1 my-3 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[260px] sm:min-h-[320px]">
        {/* Left: Mechanical Rolling Drum Graph Canvas */}
        <div className="p-3 rounded-xl border border-stone-800 bg-[#161a24] shadow-inner flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
            <span>KEELER-MODEL 6308 ROLLING DRUM</span>
            <span className="text-amber-400 font-bold">
              {interrogationSubject.isBroken ? 'DEFENSES COLLAPSED' : 'DEFENSIVE COVER ACTIVE'}
            </span>
          </div>

          <canvas ref={canvasRef} width={500} height={180} className="w-full h-44 rounded border border-stone-400 shadow-md" />

          {/* Stress Meter Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-stone-400 mb-1">
              <span>BREAK THRESHOLD:</span>
              <strong className={interrogationSubject.stress >= 85 ? 'text-emerald-400' : 'text-amber-400'}>
                {interrogationSubject.stress} / {interrogationSubject.breakThreshold}%
              </strong>
            </div>
            <div className="w-full h-3 rounded-full bg-stone-900 border border-stone-700 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  interrogationSubject.stress >= 85
                    ? 'bg-emerald-500'
                    : interrogationSubject.stress > 50
                    ? 'bg-red-500'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${interrogationSubject.stress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Dialogue Exchange & Confession Transcript */}
        <div className="p-4 rounded-xl border border-stone-800 bg-[#0f121a] flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" />
              <span>INTERROGATION ROOM TRANSCRIPT</span>
            </div>

            {interrogationSubject.isBroken ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-600 text-emerald-200 text-xs sm:text-sm leading-relaxed"
              >
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>SUSPECT BREAKS COLD WAR SILENCE</span>
                </div>
                {interrogationSubject.secretRevealed}
              </motion.div>
            ) : lastResponse ? (
              <div className="p-3 rounded-lg bg-black/60 border border-stone-800 text-stone-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                {lastResponse}
              </div>
            ) : (
              <div className="text-xs text-stone-500 p-4 text-center">
                Select an interrogation angle below to break Victor Rostov's cover alibi.
              </div>
            )}
          </div>

          <div className="pt-2 text-[11px] text-stone-500 border-t border-stone-800">
            CONFRONTATION PROTOCOL: SECTION S SIGNALS & INQUIRY
          </div>
        </div>
      </div>

      {/* 3. Bottom Tactics Selector Buttons */}
      <div className="relative z-20 pt-3 border-t border-amber-900/40 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-stone-400">CHOOSE INTERROGATION TACTIC:</span>

        <div className="flex flex-wrap items-center gap-2">
          {tactics.map((t) => (
            <button
              key={t.name}
              type="button"
              disabled={interrogationSubject.isBroken}
              onClick={() => handleTactic(t.name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                interrogationSubject.isBroken
                  ? 'bg-stone-900 text-stone-600 border border-stone-800 cursor-not-allowed'
                  : 'bg-amber-600/20 hover:bg-amber-600 border border-amber-500/60 text-amber-300 hover:text-black shadow active:scale-95'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
