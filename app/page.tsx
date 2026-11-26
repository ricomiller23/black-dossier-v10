'use client'

import React, { useEffect } from 'react'
import { useGameStore } from '@/lib/store'
import { TitleScreen } from '@/components/dossier/TitleScreen'
import { CharacterCreation } from '@/components/dossier/CharacterCreation'
import { BriefingView } from '@/components/dossier/BriefingView'
import { PlayCockpit } from '@/components/dossier/PlayCockpit'
import { DebriefView } from '@/components/dossier/DebriefView'
import { CRTOverlay } from '@/components/fx/CRTOverlay'

export default function Home() {
  const { phase, theme, boot } = useGameStore()

  useEffect(() => {
    boot()
  }, [boot])

  // Theme styling selector
  const getThemeClass = () => {
    switch (theme) {
      case 'crt_green':
        return 'theme-crt-green bg-[#031408] text-emerald-300'
      case 'crt_amber':
        return 'theme-crt-amber bg-[#140b03] text-amber-300'
      case 'night_ops':
        return 'theme-night-ops bg-[#030914] text-sky-200'
      case 'manila':
      default:
        return 'theme-manila bg-[#06090e] text-zinc-300'
    }
  }

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 ${getThemeClass()}`}>
      {/* Visual Overlay: CRT Scanlines & Film Grain */}
      <CRTOverlay />

      {/* Main Game State Machine Router */}
      {phase === 'TITLE' && <TitleScreen />}
      {phase === 'CREATION' && <CharacterCreation />}
      {phase === 'BRIEFING' && <BriefingView />}
      {(phase === 'PLAY_EXPLORATION' || phase === 'PLAY_COMBAT' || phase === 'PLAY_CHASE') && <PlayCockpit />}
      {phase === 'DEBRIEF' && <DebriefView />}
    </div>
  )
}
