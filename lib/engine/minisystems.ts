import { WoundState } from '../schemas'

export const ALERT_LEVEL_NAMES = [
  'Calm (Routine Patrol)',
  'Suspicious (Guards Alerted)',
  'Searching (Checkpoints Active)',
  'Alarm (Klaxons & Siren Call)',
  'Lockdown (Blast Doors & SWAT)',
  'Hunt (Full Lethal Protocol)'
] as const

export function adjustAlertLevel(current: number, delta: number): number {
  return Math.min(5, Math.max(0, current + delta))
}

export function adjustChaseProgress(current: number, delta: number): number {
  return Math.min(10, Math.max(0, current + delta))
}

export function adjustDisposition(current: number, delta: number): number {
  return Math.min(3, Math.max(-3, current + delta))
}

export function downgradeWound(state: WoundState): WoundState {
  switch (state) {
    case 'Critical':
      return 'Wounded'
    case 'Wounded':
      return 'Grazed'
    case 'Grazed':
      return 'Fine'
    case 'Down':
      return 'Critical'
    default:
      return state
  }
}
