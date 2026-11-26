'use client'

import React from 'react'
import { useGameStore } from '@/lib/store'

export const CRTOverlay: React.FC = () => {
  const crtEffect = useGameStore((s) => s.crtEffect)
  const filmGrain = useGameStore((s) => s.filmGrain)

  return (
    <>
      {/* 1. CRT Scanlines & Screen Curvature */}
      {crtEffect && (
        <div
          className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none"
          aria-hidden="true"
        >
          {/* Subtle Scanlines */}
          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.75) 50%)',
              backgroundSize: '100% 4px'
            }}
          />

          {/* CRT Radial Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_55%,rgba(0,0,0,0.65)_100%)]" />

          {/* Faint Horizontal Phosphor Sweep */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent animate-pulse" />
        </div>
      )}

      {/* 2. Microscopic Film Grain Texture */}
      {filmGrain && (
        <div
          className="pointer-events-none fixed inset-0 z-40 opacity-[0.06] select-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
          aria-hidden="true"
        />
      )}
    </>
  )
}
