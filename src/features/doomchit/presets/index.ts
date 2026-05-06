import { type BeatPattern, type BeatPreset } from '../types'
import { normalizePattern } from '../patterns/schema'

const deepWork = normalizePattern({
  name: 'Deep Work',
  soundKit: 'clean',
  harmony: 'minor',
  bpm: 88,
  swing: 10,
  focus: 82,
  playful: 34,
  tracks: {
    kick: [1, 0, 0, 0, 0.75, 0, 0, 0, 1, 0, 0, 0, 0.65, 0, 0, 0],
    snare: [0, 0, 0, 0, 0.45, 0, 0, 0, 0, 0, 0, 0, 0.55, 0, 0, 0],
    hat: [0.28, 0, 0.22, 0, 0.3, 0, 0.24, 0, 0.32, 0, 0.22, 0, 0.28, 0, 0.24, 0],
    perc: [0, 0, 0, 0.18, 0, 0, 0, 0, 0, 0.15, 0, 0, 0, 0, 0.2, 0],
    pluck: [0.55, 0, 0, 0, 0.38, 0, 0.48, 0, 0.52, 0, 0, 0, 0.42, 0, 0.6, 0],
  },
})

const sparkSprint = normalizePattern({
  name: 'Spark Sprint',
  soundKit: 'arcade',
  harmony: 'bright',
  bpm: 108,
  swing: 18,
  focus: 62,
  playful: 78,
  tracks: {
    kick: [1, 0, 0.35, 0, 0.8, 0, 0, 0.25, 1, 0, 0.4, 0, 0.7, 0, 0, 0.3],
    snare: [0, 0, 0, 0, 0.85, 0, 0, 0, 0, 0, 0, 0, 0.9, 0, 0, 0.25],
    hat: [0.4, 0.22, 0.35, 0.18, 0.42, 0.24, 0.36, 0.2, 0.45, 0.26, 0.38, 0.2, 0.44, 0.24, 0.36, 0.3],
    perc: [0, 0.35, 0, 0, 0, 0, 0.4, 0, 0, 0.32, 0, 0, 0, 0, 0.5, 0],
    pluck: [0.7, 0, 0.45, 0, 0, 0.58, 0, 0.36, 0.65, 0, 0.48, 0, 0, 0.55, 0, 0.44],
  },
})

const nightCoding = normalizePattern({
  name: 'Night Coding',
  soundKit: 'ambient',
  harmony: 'dreamy',
  bpm: 76,
  swing: 6,
  focus: 88,
  playful: 24,
  tracks: {
    kick: [0.9, 0, 0, 0, 0, 0, 0, 0, 0.72, 0, 0, 0, 0, 0, 0, 0],
    snare: [0, 0, 0, 0, 0.36, 0, 0, 0, 0, 0, 0, 0, 0.42, 0, 0, 0],
    hat: [0.18, 0, 0, 0, 0.2, 0, 0, 0, 0.18, 0, 0, 0, 0.24, 0, 0, 0],
    perc: [0, 0, 0, 0, 0, 0, 0.16, 0, 0, 0, 0, 0, 0, 0, 0.18, 0],
    pluck: [0.5, 0, 0, 0, 0, 0, 0.44, 0, 0.52, 0, 0, 0, 0.4, 0, 0, 0],
  },
})

const calmPulse = normalizePattern({
  name: 'Calm Pulse',
  soundKit: 'ambient',
  harmony: 'minor',
  bpm: 82,
  swing: 8,
  focus: 90,
  playful: 28,
  tracks: {
    kick: [0.82, 0, 0, 0, 0.55, 0, 0, 0, 0.78, 0, 0, 0, 0.5, 0, 0, 0],
    snare: [0, 0, 0, 0, 0.28, 0, 0, 0, 0, 0, 0, 0, 0.32, 0, 0, 0],
    hat: [0.18, 0, 0.16, 0, 0.2, 0, 0.16, 0, 0.18, 0, 0.16, 0, 0.2, 0, 0.16, 0],
    perc: [0, 0, 0, 0, 0, 0.14, 0, 0, 0, 0, 0, 0.12, 0, 0, 0, 0],
    pluck: [0.62, 0, 0, 0, 0.46, 0, 0, 0, 0.58, 0, 0, 0, 0.42, 0, 0, 0],
  },
})

const cafeLoFi = normalizePattern({
  name: 'Cafe Lo-Fi',
  soundKit: 'lofi',
  harmony: 'dreamy',
  bpm: 92,
  swing: 22,
  focus: 70,
  playful: 48,
  tracks: {
    kick: [0.95, 0, 0, 0.24, 0.62, 0, 0.28, 0, 0.9, 0, 0, 0.2, 0.58, 0, 0.22, 0],
    snare: [0, 0, 0, 0, 0.72, 0, 0, 0.2, 0, 0, 0, 0, 0.78, 0, 0, 0.18],
    hat: [0.28, 0, 0.22, 0.18, 0.3, 0, 0.24, 0.16, 0.3, 0, 0.22, 0.14, 0.34, 0, 0.24, 0.18],
    perc: [0, 0.18, 0, 0, 0, 0, 0.22, 0, 0, 0.2, 0, 0, 0, 0, 0.24, 0],
    pluck: [0.68, 0, 0.38, 0, 0, 0.5, 0, 0, 0.62, 0, 0.35, 0, 0, 0.46, 0, 0],
  },
})

const codeFlow = normalizePattern({
  name: 'Code Flow',
  soundKit: 'analog',
  harmony: 'minor',
  bpm: 100,
  swing: 12,
  focus: 76,
  playful: 58,
  tracks: {
    kick: [1, 0, 0, 0, 0.7, 0, 0.35, 0, 0.92, 0, 0, 0, 0.72, 0, 0.3, 0],
    snare: [0, 0, 0, 0, 0.82, 0, 0, 0, 0, 0, 0, 0, 0.86, 0, 0, 0],
    hat: [0.34, 0.18, 0.28, 0.16, 0.36, 0.18, 0.28, 0.16, 0.34, 0.18, 0.3, 0.16, 0.38, 0.18, 0.3, 0.2],
    perc: [0, 0, 0.22, 0, 0, 0, 0, 0.28, 0, 0, 0.2, 0, 0, 0, 0, 0.32],
    pluck: [0.58, 0, 0, 0.42, 0, 0.46, 0, 0, 0.6, 0, 0, 0.4, 0, 0.48, 0, 0],
  },
})

const microBreak = normalizePattern({
  name: 'Micro Break',
  soundKit: 'ambient',
  harmony: 'dreamy',
  bpm: 68,
  swing: 4,
  focus: 72,
  playful: 36,
  tracks: {
    kick: [0.78, 0, 0, 0, 0, 0, 0, 0, 0.58, 0, 0, 0, 0, 0, 0, 0],
    snare: [0, 0, 0, 0, 0.24, 0, 0, 0, 0, 0, 0, 0, 0.28, 0, 0, 0],
    hat: [0.12, 0, 0, 0, 0.14, 0, 0, 0, 0.12, 0, 0, 0, 0.14, 0, 0, 0],
    perc: [0, 0, 0, 0, 0, 0, 0, 0.12, 0, 0, 0, 0, 0, 0, 0, 0.14],
    pluck: [0.5, 0, 0, 0, 0, 0, 0.42, 0, 0.46, 0, 0, 0, 0, 0, 0.44, 0],
  },
})

const arcadeFocus = normalizePattern({
  name: 'Arcade Focus',
  soundKit: 'arcade',
  harmony: 'bright',
  bpm: 118,
  swing: 14,
  focus: 58,
  playful: 88,
  tracks: {
    kick: [1, 0, 0.44, 0, 0.82, 0, 0.36, 0, 1, 0, 0.48, 0, 0.8, 0, 0.42, 0],
    snare: [0, 0, 0, 0, 0.86, 0, 0, 0.26, 0, 0, 0, 0, 0.9, 0, 0, 0.28],
    hat: [0.42, 0.28, 0.38, 0.24, 0.44, 0.28, 0.38, 0.24, 0.46, 0.3, 0.4, 0.24, 0.48, 0.3, 0.42, 0.28],
    perc: [0, 0.3, 0, 0.22, 0, 0, 0.34, 0, 0, 0.32, 0, 0.24, 0, 0, 0.38, 0],
    pluck: [0.76, 0, 0.56, 0, 0.42, 0.62, 0, 0.5, 0.78, 0, 0.58, 0, 0.44, 0.64, 0, 0.52],
  },
})

const synthRain = normalizePattern({
  name: 'Synth Rain',
  soundKit: 'ambient',
  harmony: 'dreamy',
  bpm: 84,
  swing: 16,
  focus: 86,
  playful: 42,
  tracks: {
    kick: [0.72, 0, 0, 0, 0.42, 0, 0, 0, 0.7, 0, 0, 0, 0.38, 0, 0, 0],
    snare: [0, 0, 0, 0, 0.28, 0, 0, 0, 0, 0, 0, 0, 0.34, 0, 0, 0],
    hat: [0.16, 0, 0.14, 0, 0.18, 0, 0.14, 0, 0.16, 0, 0.14, 0, 0.2, 0, 0.14, 0],
    shaker: [0, 0.12, 0, 0.1, 0, 0.14, 0, 0.08, 0, 0.12, 0, 0.1, 0, 0.16, 0, 0.1],
    perc: [0, 0, 0, 0.12, 0, 0, 0, 0, 0, 0.14, 0, 0, 0, 0, 0.16, 0],
    bass: [0.55, 0, 0, 0, 0, 0, 0.36, 0, 0.52, 0, 0, 0, 0.42, 0, 0, 0],
    pluck: [0.42, 0, 0, 0.28, 0, 0.34, 0, 0, 0.4, 0, 0, 0.3, 0, 0.36, 0, 0],
    pad: [0.48, 0, 0, 0, 0, 0, 0, 0, 0.44, 0, 0, 0, 0, 0, 0, 0],
  },
})

const neonBass = normalizePattern({
  name: 'Neon Bass',
  soundKit: 'arcade',
  harmony: 'bright',
  bpm: 112,
  swing: 12,
  focus: 64,
  playful: 82,
  tracks: {
    kick: [1, 0, 0, 0.26, 0.78, 0, 0.34, 0, 1, 0, 0.42, 0, 0.76, 0, 0, 0.3],
    snare: [0, 0, 0, 0, 0.86, 0, 0, 0.2, 0, 0, 0, 0, 0.9, 0, 0, 0.24],
    hat: [0.34, 0.2, 0.3, 0.18, 0.36, 0.22, 0.3, 0.2, 0.38, 0.22, 0.32, 0.18, 0.4, 0.24, 0.32, 0.22],
    shaker: [0, 0.24, 0, 0.18, 0, 0.26, 0, 0.2, 0, 0.24, 0, 0.18, 0, 0.3, 0, 0.22],
    perc: [0, 0, 0.22, 0, 0, 0.28, 0, 0, 0, 0, 0.24, 0, 0, 0.3, 0, 0.26],
    bass: [0.86, 0, 0.38, 0, 0.62, 0, 0, 0.44, 0.9, 0, 0.42, 0, 0.66, 0, 0.34, 0],
    pluck: [0.58, 0, 0.42, 0, 0, 0.5, 0, 0.36, 0.62, 0, 0.44, 0, 0, 0.52, 0, 0.4],
    pad: [0.24, 0, 0, 0, 0, 0, 0, 0, 0.28, 0, 0, 0, 0, 0, 0, 0],
  },
})

const tapeChords = normalizePattern({
  name: 'Tape Chords',
  soundKit: 'lofi',
  harmony: 'dreamy',
  bpm: 90,
  swing: 26,
  focus: 74,
  playful: 52,
  tracks: {
    kick: [0.9, 0, 0, 0.18, 0.58, 0, 0, 0, 0.84, 0, 0.24, 0, 0.56, 0, 0, 0],
    snare: [0, 0, 0, 0, 0.54, 0, 0, 0.18, 0, 0, 0, 0, 0.62, 0, 0, 0.16],
    clap: [0, 0, 0, 0, 0.28, 0, 0, 0, 0, 0, 0, 0, 0.34, 0, 0, 0],
    hat: [0.22, 0, 0.18, 0.14, 0.24, 0, 0.18, 0, 0.22, 0, 0.18, 0.12, 0.26, 0, 0.2, 0.14],
    openHat: [0, 0, 0, 0, 0, 0, 0.28, 0, 0, 0, 0, 0, 0, 0, 0.22, 0],
    shaker: [0, 0.16, 0, 0.12, 0, 0.18, 0, 0.14, 0, 0.16, 0, 0.12, 0, 0.2, 0, 0.14],
    bass: [0.64, 0, 0, 0, 0, 0, 0.38, 0, 0.58, 0, 0, 0, 0.42, 0, 0, 0],
    chord: [0.52, 0, 0, 0, 0, 0, 0, 0, 0.46, 0, 0, 0, 0, 0, 0, 0],
    pluck: [0, 0, 0.3, 0, 0, 0.36, 0, 0, 0, 0, 0.28, 0, 0, 0.34, 0, 0],
    pad: [0.34, 0, 0, 0, 0, 0, 0, 0, 0.32, 0, 0, 0, 0, 0, 0, 0],
    fx: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.34],
  },
})

const openSky = normalizePattern({
  name: 'Open Sky',
  soundKit: 'ambient',
  harmony: 'bright',
  bpm: 96,
  swing: 10,
  focus: 80,
  playful: 46,
  tracks: {
    kick: [0.72, 0, 0, 0, 0.44, 0, 0, 0, 0.68, 0, 0, 0, 0.42, 0, 0, 0],
    snare: [0, 0, 0, 0, 0.32, 0, 0, 0, 0, 0, 0, 0, 0.36, 0, 0, 0],
    ride: [0.18, 0, 0.16, 0, 0.18, 0, 0.16, 0, 0.2, 0, 0.16, 0, 0.2, 0, 0.18, 0],
    openHat: [0, 0, 0, 0, 0, 0, 0.22, 0, 0, 0, 0, 0, 0, 0, 0.24, 0],
    shaker: [0, 0.1, 0, 0.08, 0, 0.12, 0, 0.08, 0, 0.1, 0, 0.08, 0, 0.12, 0, 0.08],
    bass: [0.46, 0, 0, 0, 0, 0, 0, 0, 0.42, 0, 0, 0, 0, 0, 0, 0],
    chord: [0.44, 0, 0, 0, 0.3, 0, 0, 0, 0.42, 0, 0, 0, 0.32, 0, 0, 0],
    pad: [0.58, 0, 0, 0, 0, 0, 0, 0, 0.56, 0, 0, 0, 0, 0, 0, 0],
    fx: [0.24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.28],
  },
})

const analogClap = normalizePattern({
  name: 'Analog Clap',
  soundKit: 'analog',
  harmony: 'tense',
  bpm: 104,
  swing: 18,
  focus: 68,
  playful: 66,
  tracks: {
    kick: [0.96, 0, 0, 0, 0.68, 0, 0.34, 0, 0.94, 0, 0, 0.3, 0.7, 0, 0, 0.32],
    snare: [0, 0, 0, 0, 0.62, 0, 0, 0, 0, 0, 0, 0, 0.66, 0, 0, 0],
    clap: [0, 0, 0, 0, 0.72, 0, 0, 0.22, 0, 0, 0, 0, 0.78, 0, 0, 0.24],
    hat: [0.3, 0.18, 0.26, 0.16, 0.32, 0.18, 0.26, 0.16, 0.32, 0.2, 0.28, 0.16, 0.34, 0.2, 0.3, 0.18],
    openHat: [0, 0, 0, 0, 0, 0, 0.38, 0, 0, 0, 0, 0, 0, 0, 0.42, 0],
    perc: [0, 0.22, 0, 0, 0, 0, 0.26, 0, 0, 0.22, 0, 0, 0, 0, 0.3, 0],
    bass: [0.74, 0, 0.36, 0, 0.54, 0, 0, 0, 0.78, 0, 0.38, 0, 0.58, 0, 0, 0],
    pluck: [0.44, 0, 0, 0.34, 0, 0.38, 0, 0, 0.46, 0, 0, 0.36, 0, 0.42, 0, 0],
    fx: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.42],
  },
})

export const presetList: BeatPreset[] = [
  { id: 'deep', title: 'Deep Work', description: '낮은 킥, 얇은 하이햇, 부드러운 패드', pattern: deepWork },
  { id: 'spark', title: 'Spark Sprint', description: '짧은 루프와 밝은 멜로디로 빠르게 몰입', pattern: sparkSprint },
  { id: 'night', title: 'Night Coding', description: '느린 템포, 넓은 공간감, 적은 음수', pattern: nightCoding },
  { id: 'calm', title: 'Calm Pulse', description: '긴 작업 전에 호흡을 안정시키는 낮은 밀도', pattern: calmPulse },
  { id: 'cafe', title: 'Cafe Lo-Fi', description: '스윙 있는 드럼과 따뜻한 반복음', pattern: cafeLoFi },
  { id: 'code', title: 'Code Flow', description: '타이핑 리듬에 맞는 중간 템포 루프', pattern: codeFlow },
  { id: 'break', title: 'Micro Break', description: '짧은 휴식과 재정렬을 위한 느린 패턴', pattern: microBreak },
  { id: 'arcade', title: 'Arcade Focus', description: '게임처럼 가볍고 반짝이는 고에너지 루프', pattern: arcadeFocus },
  { id: 'rain', title: 'Synth Rain', description: '부드러운 패드와 얕은 베이스가 깔리는 집중 루프', pattern: synthRain },
  { id: 'neon', title: 'Neon Bass', description: '베이스와 플럭이 앞서는 밝은 고에너지 패턴', pattern: neonBass },
  { id: 'tape', title: 'Tape Chords', description: 'Lo-Fi 킷, 클랩, 코드, 짧은 FX 전환', pattern: tapeChords },
  { id: 'sky', title: 'Open Sky', description: 'Ambient 킷과 라이드가 만드는 넓은 하모니', pattern: openSky },
  { id: 'analog', title: 'Analog Clap', description: '클랩과 오픈햇이 강조된 긴장감 있는 루프', pattern: analogClap },
]

export const presets = Object.fromEntries(
  presetList.map((preset) => [preset.id, preset.pattern]),
) as Record<string, BeatPattern>

export const defaultPreset = presetList[0]
