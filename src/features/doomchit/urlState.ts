import lzString from 'lz-string'

const { compressToEncodedURIComponent, decompressFromEncodedURIComponent } = lzString

import { clonePattern, normalizePattern } from './patterns'
import { defaultPreset, presetList, presets } from './presets'
import { type BeatPattern } from './types'

const ENCODED_PREFIX = 'p='

export type HashLoadStatus = 'empty' | 'preset' | 'encoded' | 'unknown' | 'corrupt'

export type PlaybackFlags = {
  play: boolean
  loop: boolean
}

export const defaultPlayback: PlaybackFlags = { play: false, loop: true }

export type HashLoadResult = {
  pattern: BeatPattern
  status: HashLoadStatus
  presetId?: string
  playback: PlaybackFlags
}

export function readHashState(): HashLoadResult {
  if (typeof window === 'undefined') {
    return {
      pattern: clonePattern(defaultPreset.pattern),
      status: 'empty',
      playback: { ...defaultPlayback },
    }
  }

  const raw = window.location.hash.replace(/^#/, '')
  if (!raw) {
    return {
      pattern: clonePattern(defaultPreset.pattern),
      status: 'empty',
      playback: { ...defaultPlayback },
    }
  }

  const segments = raw.split('&')
  const patternSegment = segments[0] ?? ''
  const playback = parsePlaybackFlags(segments.slice(1))
  const patternPart = parsePatternSegment(patternSegment)

  return { ...patternPart, playback }
}

function parsePatternSegment(segment: string): Omit<HashLoadResult, 'playback'> {
  if (!segment) {
    return { pattern: clonePattern(defaultPreset.pattern), status: 'empty' }
  }
  if (segment.startsWith(ENCODED_PREFIX)) {
    const payload = segment.slice(ENCODED_PREFIX.length)
    try {
      const json = decompressFromEncodedURIComponent(payload)
      if (!json) throw new Error('empty payload')
      const parsed = JSON.parse(json) as Partial<BeatPattern>
      return { pattern: normalizePattern(parsed), status: 'encoded' }
    } catch {
      return { pattern: clonePattern(defaultPreset.pattern), status: 'corrupt' }
    }
  }
  const preset = presets[segment]
  if (preset) {
    return { pattern: clonePattern(preset), status: 'preset', presetId: segment }
  }
  return { pattern: clonePattern(defaultPreset.pattern), status: 'unknown' }
}

function parsePlaybackFlags(segments: string[]): PlaybackFlags {
  const flags: PlaybackFlags = { ...defaultPlayback }
  for (const segment of segments) {
    const eq = segment.indexOf('=')
    if (eq === -1) continue
    const key = segment.slice(0, eq)
    const value = segment.slice(eq + 1)
    if (key === 'play') flags.play = value === '1'
    else if (key === 'loop') flags.loop = value !== '0'
  }
  return flags
}

export function findMatchingPresetId(pattern: BeatPattern): string | undefined {
  const target = JSON.stringify(pattern)
  for (const preset of presetList) {
    if (JSON.stringify(preset.pattern) === target) return preset.id
  }
  return undefined
}

export function buildHashForState(pattern: BeatPattern, playback: PlaybackFlags): string {
  const presetId = findMatchingPresetId(pattern)
  const patternSegment = presetId ?? ENCODED_PREFIX + compressToEncodedURIComponent(JSON.stringify(pattern))
  const flagSegments: string[] = []
  if (playback.play !== defaultPlayback.play) flagSegments.push(`play=${playback.play ? 1 : 0}`)
  if (playback.loop !== defaultPlayback.loop) flagSegments.push(`loop=${playback.loop ? 1 : 0}`)
  return [patternSegment, ...flagSegments].join('&')
}
