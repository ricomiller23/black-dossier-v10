'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Award, ShieldAlert, CheckCircle, XCircle, AlertTriangle, ArrowRight, DollarSign, Download, Star } from 'lucide-react'
import { useGameStore } from '@/lib/store'
import { AgentPortrait } from './AgentPortrait'
import { sound } from '@/lib/audio'
import { upgradeAttribute } from '@/lib/engine/advancement'
import { AttributeName } from '@/lib/schemas'

export const DebriefView: React.FC = () => {
  const { agent, blueprint, lastRewards, setPhase, saveAgent } = useGameStore()
  const [selectedAttr, setSelectedAttr] = useState<AttributeName>('RFX')
  const [upgradeMsg, setUpgradeMsg] = useState<string | null>(null)

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center font-mono">
        <div>
          <p className="text-zinc-500 mb-4">No active operative dossier found.</p>
          <button
            onClick={() => setPhase('TITLE')}
            className="px-4 py-2 bg-amber-600 text-zinc-950 font-bold rounded"
          >
            RETURN TO TITLE
          </button>
        </div>
      </div>
    )
  }

  const meritEarned = lastRewards?.merit || 0
  const fundsEarned = lastRewards?.funds || 0
  const clearanceAdvance = lastRewards?.clearanceAdvance || false

  const handleUpgrade = () => {
    sound.playStamp()
    const res = upgradeAttribute(agent, selectedAttr, 15)
    if (res.success) {
      saveAgent(res.agent)
      setUpgradeMsg(`SUCCESS: ${selectedAttr} upgraded by +5!`)
      setTimeout(() => setUpgradeMsg(null), 3000)
    } else {
      setUpgradeMsg(`ERROR: ${res.error}`)
      setTimeout(() => setUpgradeMsg(null), 3000)
    }
  }

  const handleReturnHQ = () => {
    sound.playTypewriter()
    setPhase('TITLE')
  }

  const handleExportAAR = () => {
    sound.playTypewriter()
    const report = {
      codename: agent.codename,
      division: agent.division,
      missionCodename: blueprint?.codeName || 'OPERATION CLASSIFIED',
      venue: blueprint?.venue || 'UNKNOWN SECTOR',
      meritAwarded: meritEarned,
      fundsAwarded: fundsEarned,
      clearancePromotion: clearanceAdvance,
      date: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `AAR_${blueprint?.codeName || 'MISSION'}_${agent.codename}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-[#06090e] text-zinc-300 p-4 sm:p-8 flex flex-col justify-between font-mono">
      {/* Classification Banner */}
      <header className="border-b border-zinc-800 pb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-amber-950 border border-amber-600/50 flex items-center justify-center text-amber-400">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-amber-500 font-bold tracking-widest">
              AFTER-ACTION DEBRIEFING REPORT // SECTION K
            </div>
            <div className="text-[10px] text-zinc-500">
              MISSION CODE: {blueprint?.codeName || 'OPERATION UNTITLED'}
            </div>
          </div>
        </div>

        <button
          onClick={handleExportAAR}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-amber-500 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>EXPORT AAR</span>
        </button>
      </header>

      {/* Main Debriefing Card */}
      <main className="my-8 max-w-3xl mx-auto w-full space-y-6">
        {/* Rubber Stamp Header */}
        <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-950/70 shadow-2xl relative overflow-hidden">
          {/* Status Watermark Stamp */}
          <div className="absolute right-4 top-4 border-4 border-emerald-600/60 rounded px-4 py-2 text-emerald-500 font-black text-lg tracking-widest transform rotate-[-8deg] opacity-80 pointer-events-none">
            DEBRIEF CONCLUDED
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-24 rounded border border-zinc-700 bg-zinc-900 overflow-hidden flex-shrink-0 flex items-center justify-center">
              <AgentPortrait agent={agent} size="sm" />
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs text-zinc-500 font-bold">OPERATIVE DOSSIER</div>
              <div className="text-2xl font-black text-zinc-100">{agent.codename}</div>
              <div className="text-xs text-amber-400">{agent.division}</div>
              <div className="text-xs text-zinc-400">
                Current Status: <span className="text-emerald-400 font-bold">{agent.woundState}</span> • WP: {agent.currentWP}/{agent.maxWP}
              </div>
            </div>
          </div>
        </div>

        {/* Operational Rewards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded border border-emerald-800/50 bg-emerald-950/20 text-center">
            <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
              MERIT COMMENDATION
            </div>
            <div className="text-3xl font-black text-emerald-300 my-1">
              +{meritEarned}
            </div>
            <div className="text-[10px] text-zinc-400">
              Total Accrued: {agent.merit} PTS
            </div>
          </div>

          <div className="p-4 rounded border border-amber-800/50 bg-amber-950/20 text-center">
            <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              BLACK BUDGET FUNDS
            </div>
            <div className="text-3xl font-black text-amber-300 my-1">
              +${fundsEarned.toLocaleString()}
            </div>
            <div className="text-[10px] text-zinc-400">
              Account Balance: ${agent.funds.toLocaleString()}
            </div>
          </div>

          <div className="p-4 rounded border border-blue-800/50 bg-blue-950/20 text-center">
            <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
              SECURITY CLEARANCE
            </div>
            <div className="text-3xl font-black text-blue-300 my-1">
              LVL {agent.clearanceLevel}
            </div>
            <div className="text-[10px] text-zinc-400">
              {clearanceAdvance ? 'PROMOTION GRANTED' : 'PROMOTION PENDING'}
            </div>
          </div>
        </div>

        {/* Field Training & Advancement */}
        <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-950/70 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
            <Star className="w-4 h-4" />
            FIELD ADVANCEMENT (COST: 15 MERIT PER +5 ATTRIBUTE)
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedAttr}
              onChange={(e) => setSelectedAttr(e.target.value as AttributeName)}
              className="p-2 bg-zinc-900 border border-zinc-700 rounded text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
            >
              <option value="MGT">Might (MGT: {agent.attributes.MGT})</option>
              <option value="RFX">Reflexes (RFX: {agent.attributes.RFX})</option>
              <option value="NRV">Nerve (NRV: {agent.attributes.NRV})</option>
              <option value="STA">Stamina (STA: {agent.attributes.STA})</option>
              <option value="INT">Intellect (INT: {agent.attributes.INT})</option>
              <option value="PER">Perception (PER: {agent.attributes.PER})</option>
              <option value="PRS">Presence (PRS: {agent.attributes.PRS})</option>
            </select>

            <button
              onClick={handleUpgrade}
              disabled={agent.merit < 15}
              className={`px-4 py-2 rounded font-bold text-xs transition-colors ${
                agent.merit >= 15
                  ? 'bg-amber-600 hover:bg-amber-500 text-zinc-950'
                  : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
              }`}
            >
              PURCHASE INTENSIVE TRAINING (+5)
            </button>
          </div>

          {upgradeMsg && (
            <div className="text-xs font-bold text-amber-400 mt-2">
              {upgradeMsg}
            </div>
          )}
        </div>
      </main>

      {/* Return to HQ Footer Button */}
      <footer className="border-t border-zinc-800 pt-4 flex justify-center">
        <button
          onClick={handleReturnHQ}
          className="flex items-center gap-2 px-6 py-3 rounded bg-amber-600 hover:bg-amber-500 text-zinc-950 font-black tracking-wider transition-transform active:scale-95 shadow-lg shadow-amber-600/20"
        >
          <span>RETURN TO DIRECTORATE HEADQUARTERS</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  )
}
