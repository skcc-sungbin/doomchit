import lzString from 'lz-string'

const { compressToEncodedURIComponent, decompressFromEncodedURIComponent } = lzString

import { clonePattern, normalizePattern } from './patterns'
import { defaultPreset, presetList, presets } from './presets'
import { type BeatPattern } from './types'

const ENCODED_PREFIX = 'p='

export type HashLoadStatus = 'empty' | 'preset' | 'encoded' | 'unknown' | 'corrupt'

export type HashLoadResult = {
  pattern: BeatPattern
  status: HashLoadStatus
  presetId?: string
}

export function readPatternFromHash(): HashLoadResult {
  if (typeof window === 'undefined') {
    return { pattern: clonePattern(defaultPreset.pattern), status: 'empty' }
  }

  const raw = window.location.hash.replace(/^#/, '')
  if (!raw) {
    return { pattern: clonePattern(defaultPreset.pattern), status: 'empty' }
  }

  if (raw.startsWith(ENCODED_PREFIX)) {
    const payload = raw.slice(ENCODED_PREFIX.length)
    try {
      const json = decompressFromEncodedURIComponent(payload)
      if (!json) throw new Error('empty payload')
      const parsed = JSON.parse(json) as Partial<BeatPattern>
      return { pattern: normalizePattern(parsed), status: 'encoded' }
    } catch {
      return { pattern: clonePattern(defaultPreset.pattern), status: 'corrupt' }
    }
  }

  const preset = presets[raw]
  if (preset) {
    return { pattern: clonePattern(preset), status: 'preset', presetId: raw }
  }
  return { pattern: clonePattern(defaultPreset.pattern), status: 'unknown' }
}

export function findMatchingPresetId(pattern: BeatPattern): string | undefined {
  const target = JSON.stringify(pattern)
  for (const preset of presetList) {
    if (JSON.stringify(preset.pattern) === target) return preset.id
  }
  return undefined
}

export function buildHashForPattern(pattern: BeatPattern): string {
  const presetId = findMatchingPresetId(pattern)
  if (presetId) return presetId
  return ENCODED_PREFIX + compressToEncodedURIComponent(JSON.stringify(pattern))
}
