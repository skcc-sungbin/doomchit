import {
  type BeatPattern,
  type BeatTrack,
  type HarmonyMode,
  type SoundKit,
  type TrackId,
  harmonyModes,
  soundKits,
  stepCount,
  trackIds,
} from '../types'

export type BeatPatternInput = Omit<Partial<BeatPattern>, 'tracks'> & {
  tracks?: Partial<Record<TrackId, BeatTrack>>
}

export function clonePattern(pattern: BeatPattern) {
  return JSON.parse(JSON.stringify(pattern)) as BeatPattern
}

export function clamp(value: unknown, min: number, max: number) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return min
  return Math.max(min, Math.min(max, numeric))
}

function pickOption<T extends string>(value: unknown, options: readonly T[], fallback: T) {
  return options.includes(value as T) ? value as T : fallback
}

export function normalizePattern(input: BeatPatternInput): BeatPattern {
  const tracks = {} as BeatPattern['tracks']

  for (const trackId of trackIds) {
    const source = Array.isArray(input.tracks?.[trackId]) ? input.tracks[trackId] : []
    tracks[trackId] = Array.from({ length: stepCount }, (_, index) => {
      return clamp(source[index] ?? 0, 0, 1)
    })
  }

  return {
    name: String(input.name || 'Untitled Beat'),
    soundKit: pickOption<SoundKit>(input.soundKit, soundKits, 'clean'),
    harmony: pickOption<HarmonyMode>(input.harmony, harmonyModes, 'minor'),
    bpm: Math.round(clamp(input.bpm ?? 92, 60, 140)),
    swing: Math.round(clamp(input.swing ?? 0, 0, 45)),
    focus: Math.round(clamp(input.focus ?? 70, 0, 100)),
    playful: Math.round(clamp(input.playful ?? 50, 0, 100)),
    tracks,
  }
}
