'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGameStore } from '@/lib/store'
import { Radio, Lock, Unlock, Volume2, ShieldCheck, Zap, Activity, HelpCircle } from 'lucide-react'

export const AudioInterceptDecoder: React.FC = () => {
  const tunedFrequency = useGameStore((s) => s.tunedFrequency)
  const setTunedFrequency = useGameStore((s) => s.setTunedFrequency)
  const sigintChannels = useGameStore((s) => s.sigintChannels)
  const decryptChannel = useGameStore((s) => s.decryptChannel)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Find channel in range
  const matchedChannel = sigintChannels.find(
    (ch) => Math.abs(ch.frequencyMHz - tunedFrequency) <= ch.requiredTuningTolerance
  )

  const lockPercentage = matchedChannel
    ? Math.max(0, Math.min(100, Math.floor((1 - Math.abs(matchedChannel.frequencyMHz - tunedFrequency) / matchedChannel.requiredTuningTolerance) * 100)))
    : 0

  // Animate oscilloscope waveform
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let phase = 0

    const render = () => {
      ctx.fillStyle = '#031408'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Oscilloscope Green Grid
      ctx.strokeStyle = '#053315'
      ctx.lineWidth = 1
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Draw Waveform
      ctx.beginPath()
      ctx.lineWidth = 2.5
      ctx.strokeStyle = matchedChannel ? (lockPercentage > 85 ? '#22c55e' : '#eab308') : '#15803d'
      ctx.shadowColor = matchedChannel && lockPercentage > 85 ? '#22c55e' : '#15803d'
      ctx.shadowBlur = 8

      const centerY = canvas.height / 2
      const freqFactor = tunedFrequency * 1.5

      for (let x = 0; x < canvas.width; x++) {
        let y = centerY
        if (matchedChannel) {
          if (matchedChannel.waveform === 'pulse') {
            y += Math.sin((x * freqFactor + phase) * 0.05) > 0 ? 35 : -35
          } else if (matchedChannel.waveform === 'sawtooth') {
            y += ((x * 0.1 * freqFactor + phase * 0.1) % 40) - 20
          } else {
            y += Math.sin((x * 0.05 * freqFactor) + phase) * (30 + (lockPercentage / 4))
          }
        } else {
          // Ambient Radio Noise
          y += Math.sin((x * 0.08) + phase) * 15 + (Math.random() * 8 - 4)
        }

        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      phase += 0.08
      animationId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animationId)
  }, [tunedFrequency, matchedChannel, lockPercentage])

  return (
    <div className="relative w-full h-full min-h-[480px] sm:min-h-[560px] md:min-h-[640px] rounded-2xl overflow-hidden border border-emerald-900/60 bg-[#020d06] shadow-[0_0_60px_rgba(34,197,94,0.18)] p-4 flex flex-col justify-between font-mono select-none">
      {/* 1. Header CRT Signal Monitor HUD */}
      <div className="relative z-20 flex flex-wrap items-center justify-between pb-3 border-b border-emerald-900/40 gap-2">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-xs sm:text-sm font-black tracking-widest uppercase flex items-center gap-1.5 shadow">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>SIGINT OSCILLOSCOPE // COPPER & RADIO DECODER</span>
          </div>
          <span className="text-xs text-stone-400">
            TUNED: <strong className="text-emerald-400 text-sm">{tunedFrequency.toFixed(2)} MHz</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1 rounded border text-xs font-bold flex items-center gap-1.5 ${
              lockPercentage > 85
                ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-[0_0_15px_#22c55e]'
                : lockPercentage > 40
                ? 'bg-yellow-950 border-yellow-500 text-yellow-300'
                : 'bg-stone-900 border-stone-800 text-stone-500'
            }`}
          >
            {lockPercentage > 85 ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span>SIGNAL LOCK: {lockPercentage}%</span>
          </div>
        </div>
      </div>

      {/* 2. Main Oscilloscope CRT Screen */}
      <div className="relative flex-1 my-3 rounded-xl border-2 border-emerald-700/60 bg-[#031408] overflow-hidden flex flex-col justify-between p-3 min-h-[260px] sm:min-h-[320px]">
        {/* Canvas Oscilloscope Waveform */}
        <canvas ref={canvasRef} width={800} height={240} className="w-full h-44 rounded-lg bg-[#031408]" />

        {/* Decrypted Intel Cable / Audio Transcript Overlay */}
        <div className="mt-3 p-3 rounded-lg bg-black/70 border border-emerald-900/60 min-h-[90px] flex flex-col justify-between">
          {matchedChannel ? (
            <div>
              <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-1">
                <span>CHANNEL IDENT: {matchedChannel.name}</span>
                <span>STATUS: {matchedChannel.isDecrypted ? 'DECRYPTED & LOGGED' : 'ENCRYPTED SIGNAL DETECTED'}</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed whitespace-pre-wrap">
                {matchedChannel.isDecrypted ? matchedChannel.intelContent : '██████ [ENCRYPTED RF TRANSMISSION] — ALIGN FREQUENCY TO DECRYPT ██████'}
              </p>
            </div>
          ) : (
            <div className="text-xs text-stone-500 flex items-center justify-center h-full">
              SWEEP FREQUENCY DIAL TO INTERCEPT CLANDESTINE TRANSMISSIONS
            </div>
          )}

          {matchedChannel && !matchedChannel.isDecrypted && (
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                disabled={lockPercentage < 80}
                onClick={() => decryptChannel(matchedChannel.id)}
                className={`px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                  lockPercentage >= 80
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/30 active:scale-95'
                    : 'bg-stone-900 text-stone-600 border border-stone-800 cursor-not-allowed'
                }`}
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>DECRYPT INTEL CABLE & LOWER ALERT</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Bottom Frequency Tuning Knobs & Presets */}
      <div className="relative z-20 pt-3 border-t border-emerald-900/40 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Dial Slider */}
        <div className="flex items-center gap-3 w-full sm:w-1/2">
          <span className="text-xs text-stone-400 shrink-0">FREQ DIAL:</span>
          <input
            type="range"
            min="4.00"
            max="16.00"
            step="0.05"
            value={tunedFrequency}
            onChange={(e) => setTunedFrequency(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Quick Station Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-stone-500 mr-1">PRESETS:</span>
          {sigintChannels.map((ch) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => setTunedFrequency(ch.frequencyMHz)}
              className={`px-2.5 py-1 rounded text-xs transition-all cursor-pointer ${
                Math.abs(tunedFrequency - ch.frequencyMHz) < 0.1
                  ? 'bg-emerald-600 text-black font-bold shadow'
                  : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800'
              }`}
            >
              {ch.frequencyMHz} MHz
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
