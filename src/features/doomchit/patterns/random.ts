import { type BeatPattern, harmonyModes, soundKits, stepCount, trackIds } from '../types'
import { normalizePattern } from './schema'

export function makeRandomPattern(): BeatPattern {
  const focus = Math.round(55 + Math.random() * 40)
  const playful = Math.round(25 + Math.random() * 70)
  const density = 0.15 + playful / 500 - focus / 900
  const generated = normalizePattern({
    name: `Random Focus ${Math.floor(Math.random() * 900 + 100)}`,
    bpm: Math.round(76 + Math.random() * 38),
    swing: Math.round(Math.random() * 24),
    focus,
    playful,
    soundKit: randomItem(soundKits),
    harmony: randomItem(harmonyModes),
  })

  for (const trackId of trackIds) {
    generated.tracks[trackId] = Array.from({ length: stepCount }, (_, index) => {
      if (trackId === 'kick') {
        return index % 8 === 0 || Math.random() < density * 0.45 ? randomVelocity(0.55, 1) : 0
      }
      if (trackId === 'snare') {
        return index % 8 === 4 ? randomVelocity(0.45, 0.9) : Math.random() < density * 0.18 ? 0.28 : 0
      }
      if (trackId === 'clap') {
        return index % 8 === 4 && Math.random() < 0.35 + playful / 220 ? randomVelocity(0.25, 0.68) : 0
      }
      if (trackId === 'hat') {
        return index % 2 === 0 || Math.random() < density ? randomVelocity(0.14, 0.48) : 0
      }
      if (trackId === 'openHat') {
        return index % 8 === 6 && Math.random() < 0.35 + playful / 240 ? randomVelocity(0.16, 0.55) : 0
      }
      if (trackId === 'ride') {
        return focus < 72 && index % 4 === 2 && Math.random() < 0.45 ? randomVelocity(0.08, 0.28) : 0
      }
      if (trackId === 'shaker') {
        return index % 2 === 1 && Math.random() < 0.38 + playful / 260 ? randomVelocity(0.08, 0.32) : 0
      }
      if (trackId === 'perc') {
        return Math.random() < density * 0.55 ? randomVelocity(0.15, 0.55) : 0
      }
      if (trackId === 'bass') {
        return index % 8 === 0 || (index % 8 === 6 && Math.random() < density) ? randomVelocity(0.35, 0.82) : 0
      }
      if (trackId === 'pluck') {
        return Math.random() < density * 0.62 ? randomVelocity(0.28, 0.76) : 0
      }
      if (trackId === 'chord') {
        return index % 8 === 0 || Math.random() < density * 0.14 ? randomVelocity(0.2, 0.52) : 0
      }
      if (trackId === 'pad') {
        return index % 8 === 0 || Math.random() < density * 0.2 ? randomVelocity(0.22, 0.55) : 0
      }
      return index % 16 === 15 && Math.random() < 0.28 + playful / 320 ? randomVelocity(0.28, 0.62) : 0
    })
  }

  return generated
}

function randomVelocity(min: number, max: number) {
  return Number((min + Math.random() * (max - min)).toFixed(2))
}

function randomItem<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)]
}
