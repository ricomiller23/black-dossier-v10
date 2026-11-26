'use client'

import React from 'react'
import { Agent, PortraitConfig } from '@/lib/schemas'

interface AgentPortraitProps {
  agent?: Agent | null
  portrait?: PortraitConfig
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showStamp?: boolean
}

export const AgentPortrait: React.FC<AgentPortraitProps> = ({
  agent,
  portrait,
  size = 'md',
  className = '',
  showStamp = true
}) => {
  const cfg: PortraitConfig = agent?.portrait || portrait || {
    faceShape: 0,
    skinTone: '#E0AC69',
    hairStyle: 1,
    hairColor: '#2B1A09',
    glasses: false,
    sunglasses: true,
    scar: false,
    facialHair: 0,
    clothingStyle: 'Trench Coat',
    clothingColor: '#1A1E24'
  }

  const dimensions = {
    sm: 'w-12 h-16',
    md: 'w-24 h-32',
    lg: 'w-36 h-48',
    xl: 'w-48 h-64'
  }[size]

  return (
    <div
      className={`relative ${dimensions} rounded border border-stone-800 bg-[#0c0d10] overflow-hidden select-none shadow-md ${className}`}
    >
      {/* Film Grain & Photo Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-10 pointer-events-none" />

      {/* SVG Vector Spy Portrait */}
      <svg
        viewBox="0 0 100 130"
        className="w-full h-full object-cover"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E232A" />
            <stop offset="100%" stopColor="#0B0D10" />
          </linearGradient>
          <linearGradient id="coatGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2A303A" />
            <stop offset="100%" stopColor="#12151A" />
          </linearGradient>
        </defs>

        {/* Background Neutral Wall */}
        <rect width="100" height="130" fill="url(#bgGrad)" />

        {/* Height Measurement Grid Lines */}
        <g stroke="#ffffff0a" strokeWidth="0.5">
          <line x1="0" y1="20" x2="100" y2="20" />
          <line x1="0" y1="40" x2="100" y2="40" />
          <line x1="0" y1="60" x2="100" y2="60" />
          <line x1="0" y1="80" x2="100" y2="80" />
          <line x1="0" y1="100" x2="100" y2="100" />
        </g>

        {/* Shoulders / Torso / Coat */}
        <path
          d="M 12 130 C 14 100 28 88 50 88 C 72 88 86 100 88 130 Z"
          fill={cfg.clothingColor || '#1A1E24'}
        />
        {/* Collar & Tie / Lapel */}
        <path d="M 40 88 L 50 102 L 60 88 Z" fill="#E2E8F0" />
        <path d="M 48 98 L 52 98 L 51 120 L 49 120 Z" fill="#991B1B" />
        <path d="M 32 88 L 45 110 L 38 130" stroke="#0f1115" strokeWidth="2" fill="none" />
        <path d="M 68 88 L 55 110 L 62 130" stroke="#0f1115" strokeWidth="2" fill="none" />

        {/* Neck */}
        <rect x="42" y="70" width="16" height="22" fill={cfg.skinTone} />

        {/* Head / Face */}
        <path
          d={
            cfg.faceShape === 1
              ? 'M 30 52 C 30 30 70 30 70 52 C 70 74 62 82 50 82 C 38 82 30 74 30 52 Z' // Square
              : cfg.faceShape === 2
              ? 'M 32 50 C 32 28 68 28 68 50 C 68 76 58 84 50 84 C 42 84 32 76 32 50 Z' // Sharp
              : 'M 30 50 C 30 28 70 28 70 50 C 70 72 60 80 50 80 C 40 80 30 72 30 50 Z' // Oval
          }
          fill={cfg.skinTone}
        />

        {/* Ears */}
        <ellipse cx="29" cy="54" rx="3" ry="6" fill={cfg.skinTone} />
        <ellipse cx="71" cy="54" rx="3" ry="6" fill={cfg.skinTone} />

        {/* Hair Styles */}
        {cfg.hairStyle === 0 && (
          // Receded / Bald
          <path d="M 30 46 C 30 38 34 32 40 32 C 45 40 55 40 60 32 C 66 32 70 38 70 46" fill="none" stroke={cfg.hairColor} strokeWidth="3" />
        )}
        {cfg.hairStyle === 1 && (
          // Slicked Back
          <path d="M 28 48 C 28 26 72 26 72 48 C 65 34 35 34 28 48 Z" fill={cfg.hairColor} />
        )}
        {cfg.hairStyle === 2 && (
          // Parted / Executive
          <path d="M 27 50 C 27 25 73 25 73 50 C 68 32 46 32 42 40 C 36 34 30 40 27 50 Z" fill={cfg.hairColor} />
        )}
        {cfg.hairStyle === 3 && (
          // Cropped Military
          <path d="M 29 44 C 30 28 70 28 71 44 C 65 38 35 38 29 44 Z" fill={cfg.hairColor} />
        )}
        {cfg.hairStyle >= 4 && (
          // Shaggy / Disheveled
          <path d="M 26 52 C 26 24 74 24 74 52 C 70 36 60 30 50 34 C 40 30 30 36 26 52 Z" fill={cfg.hairColor} />
        )}

        {/* Facial Hair */}
        {cfg.facialHair === 1 && (
          // Stubble
          <path d="M 38 68 C 42 74 58 74 62 68 C 60 76 40 76 38 68 Z" fill="#00000030" />
        )}
        {cfg.facialHair === 2 && (
          // Neat Mustache
          <path d="M 42 66 C 46 64 54 64 58 66 C 54 69 46 69 42 66 Z" fill={cfg.hairColor} />
        )}
        {cfg.facialHair === 3 && (
          // Full Cover Beard
          <path d="M 33 58 C 33 80 44 86 50 86 C 56 86 67 80 67 58 C 60 62 50 62 33 58 Z" fill={cfg.hairColor} />
        )}

        {/* Eyebrows */}
        <line x1="38" y1="45" x2="46" y2="46" stroke={cfg.hairColor} strokeWidth="2" strokeLinecap="round" />
        <line x1="54" y1="46" x2="62" y2="45" stroke={cfg.hairColor} strokeWidth="2" strokeLinecap="round" />

        {/* Eyes & Glasses */}
        {cfg.sunglasses ? (
          // Aviator / Wayfarer Shades
          <g>
            <path d="M 36 49 C 36 46 47 46 47 50 C 47 56 36 56 36 49 Z" fill="#090A0D" stroke="#333" strokeWidth="0.8" />
            <path d="M 53 50 C 53 46 64 46 64 49 C 64 56 53 56 53 50 Z" fill="#090A0D" stroke="#333" strokeWidth="0.8" />
            <line x1="47" y1="50" x2="53" y2="50" stroke="#444" strokeWidth="1" />
            {/* Specular White Glint */}
            <line x1="38" y1="48" x2="42" y2="54" stroke="#ffffff40" strokeWidth="1" />
            <line x1="55" y1="48" x2="59" y2="54" stroke="#ffffff40" strokeWidth="1" />
          </g>
        ) : (
          <g>
            {/* Left Eye */}
            <ellipse cx="42" cy="51" rx="3.5" ry="2" fill="#FFFFFF" />
            <circle cx="42" cy="51" r="1.5" fill="#1C1917" />
            {/* Right Eye */}
            <ellipse cx="58" cy="51" rx="3.5" ry="2" fill="#FFFFFF" />
            <circle cx="58" cy="51" r="1.5" fill="#1C1917" />

            {/* Clear Wire Glasses */}
            {cfg.glasses && (
              <g stroke="#94A3B8" strokeWidth="1" fill="none">
                <circle cx="42" cy="51" r="5" />
                <circle cx="58" cy="51" r="5" />
                <line x1="47" y1="51" x2="53" y2="51" />
              </g>
            )}
          </g>
        )}

        {/* Nose */}
        <path d="M 50 49 L 48 60 L 52 60" fill="none" stroke="#00000040" strokeWidth="1.2" strokeLinecap="round" />

        {/* Mouth */}
        <line x1="45" y1="68" x2="55" y2="68" stroke="#00000060" strokeWidth="1.5" strokeLinecap="round" />

        {/* Facial Scar */}
        {cfg.scar && (
          <path d="M 40 42 L 38 58" stroke="#991B1B80" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="1,1" />
        )}
      </svg>

      {/* Red Classified Stamp */}
      {showStamp && (
        <div className="absolute bottom-1 right-1 border border-red-600/70 bg-red-950/80 px-1 py-0.5 text-[8px] font-mono font-bold tracking-widest text-red-400 rotate-[-12deg] z-20 shadow">
          CLEARED
        </div>
      )}
    </div>
  )
}
