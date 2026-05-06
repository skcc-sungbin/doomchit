export const stepCount = 16

export const soundKits = ['clean', 'lofi', 'arcade', 'ambient', 'analog'] as const

export type SoundKit = (typeof soundKits)[number]

export const harmonyModes = ['minor', 'dreamy', 'bright', 'tense'] as const

export type HarmonyMode = (typeof harmonyModes)[number]

export const trackIds = [
  'kick',
  'snare',
  'clap',
  'hat',
  'openHat',
  'ride',
  'shaker',
  'perc',
  'bass',
  'pluck',
  'chord',
  'pad',
  'fx',
] as const

export type TrackId = (typeof trackIds)[number]

export type BeatTrack = number[]

export type BeatPattern = {
  name: string
  soundKit: SoundKit
  harmony: HarmonyMode
  bpm: number
  swing: number
  focus: number
  playful: number
  tracks: Record<TrackId, BeatTrack>
}

export type BeatPreset = {
  id: string
  title: string
  description: string
  pattern: BeatPattern
}

export type TrackMeta = {
  label: string
  color: string
}

export const trackMeta: Record<TrackId, TrackMeta> = {
  kick: { label: 'Kick', color: '#4fd1a5' },
  snare: { label: 'Snare', color: '#f6b44b' },
  clap: { label: 'Clap', color: '#ffd36f' },
  hat: { label: 'Hat', color: '#d9ffe9' },
  openHat: { label: 'Open Hat', color: '#b8ffe7' },
  ride: { label: 'Ride', color: '#e7f6ff' },
  shaker: { label: 'Shaker', color: '#c5f56f' },
  perc: { label: 'Perc', color: '#ff7aa8' },
  bass: { label: 'Bass', color: '#7de0ff' },
  pluck: { label: 'Pluck', color: '#79a8ff' },
  chord: { label: 'Chord', color: '#ff9ef0' },
  pad: { label: 'Pad', color: '#c99cff' },
  fx: { label: 'FX', color: '#ffffff' },
}
