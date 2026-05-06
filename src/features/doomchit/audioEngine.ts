import { type BeatPattern, type SoundKit, stepCount, trackIds } from './types'

type AudioGraph = {
  context: AudioContext
  masterGain: GainNode
  filterNode: BiquadFilterNode
  noiseBuffer: AudioBuffer
}

export type BeatEngine = {
  play: (
    pattern: BeatPattern,
    onStep: (step: number) => void,
    options?: { loop?: boolean; onEnded?: () => void },
  ) => Promise<void>
  pause: () => void
  stop: () => void
  setLoop: (loop: boolean) => void
  updatePattern: (pattern: BeatPattern) => void
  isPlaying: () => boolean
  isPaused: () => boolean
}

export function createBeatEngine(): BeatEngine {
  let graph: AudioGraph | undefined
  let activePattern: BeatPattern
  let timer: number | undefined
  let nextStepTime = 0
  let currentStep = 0
  let playing = false
  let paused = false
  let loopEnabled = true
  let playbackSerial = 0
  let stepListener: (step: number) => void = () => {}
  let endedListener: () => void = () => {}

  function ensureGraph() {
    if (graph) return graph

    const context = new AudioContext()
    const masterGain = context.createGain()
    const filterNode = context.createBiquadFilter()
    const delayNode = context.createDelay(0.35)
    const delayGain = context.createGain()
    const sharedNoiseBuffer = noiseBuffer(context)

    masterGain.gain.value = 0.76
    filterNode.type = 'lowpass'
    filterNode.frequency.value = 7600
    delayNode.delayTime.value = 0.18
    delayGain.gain.value = 0.13

    masterGain.connect(filterNode)
    filterNode.connect(context.destination)
    masterGain.connect(delayNode)
    delayNode.connect(delayGain)
    delayGain.connect(filterNode)

    graph = { context, masterGain, filterNode, noiseBuffer: sharedNoiseBuffer }
    return graph
  }

  function scheduler() {
    if (!activePattern || !graph) return

    while (nextStepTime < graph.context.currentTime + 0.12) {
      const scheduledStep = currentStep
      const scheduledTime = nextStepTime
      scheduleStep(activePattern, scheduledStep, scheduledTime, graph)
      window.setTimeout(
        () => stepListener(scheduledStep),
        Math.max(0, (scheduledTime - graph.context.currentTime) * 1000),
      )

      const baseDuration = 60 / activePattern.bpm / 4
      const swingOffset = scheduledStep % 2 === 0 ? 0 : baseDuration * (activePattern.swing / 100)
      nextStepTime += baseDuration + swingOffset
      currentStep = (currentStep + 1) % stepCount

      if (!loopEnabled && scheduledStep === stepCount - 1) {
        const timeoutSerial = playbackSerial
        window.setTimeout(
          () => {
            if (timeoutSerial !== playbackSerial || !playing) return
            stopInternal({ reset: true })
            endedListener()
          },
          Math.max(0, (nextStepTime - graph.context.currentTime) * 1000),
        )
        break
      }
    }
  }

  function stopInternal({ reset }: { reset: boolean }) {
    playbackSerial += 1
    playing = false
    paused = !reset
    if (reset) currentStep = 0
    window.clearInterval(timer)
    stepListener(-1)
  }

  return {
    async play(pattern, onStep, options) {
      activePattern = pattern
      stepListener = onStep
      loopEnabled = options?.loop ?? true
      endedListener = options?.onEnded ?? (() => {})
      const nextGraph = ensureGraph()
      await nextGraph.context.resume()
      if (playing) return
      const resumeFromPause = paused

      nextGraph.filterNode.frequency.setTargetAtTime(
        4200 + activePattern.focus * 48,
        nextGraph.context.currentTime,
        0.05,
      )
      playbackSerial += 1
      playing = true
      paused = false
      if (resumeFromPause) {
        currentStep %= stepCount
      } else {
        currentStep = 0
      }
      nextStepTime = nextGraph.context.currentTime + 0.06
      timer = window.setInterval(scheduler, 25)
    },
    pause() {
      if (!playing) return
      stopInternal({ reset: false })
    },
    stop() {
      stopInternal({ reset: true })
    },
    setLoop(loop) {
      loopEnabled = loop
    },
    updatePattern(pattern) {
      activePattern = pattern
      if (graph) {
        graph.filterNode.frequency.setTargetAtTime(
          4200 + activePattern.focus * 48,
          graph.context.currentTime,
          0.05,
        )
      }
    },
    isPlaying() {
      return playing
    },
    isPaused() {
      return paused
    },
  }
}

function scheduleStep(pattern: BeatPattern, step: number, time: number, graph: AudioGraph) {
  for (const trackId of trackIds) {
    const velocity = pattern.tracks[trackId][step]
    if (!velocity) continue

    const humanize = (Math.random() - 0.5) * (0.004 + pattern.playful / 20000)
    const playTime = time + humanize

    if (trackId === 'kick') playKick(graph, playTime, velocity, pattern)
    if (trackId === 'snare') playSnare(graph, playTime, velocity, pattern)
    if (trackId === 'clap') playClap(graph, playTime, velocity, pattern)
    if (trackId === 'hat') playHat(graph, playTime, velocity, pattern)
    if (trackId === 'openHat') playOpenHat(graph, playTime, velocity, pattern)
    if (trackId === 'ride') playRide(graph, playTime, velocity, pattern)
    if (trackId === 'shaker') playShaker(graph, playTime, velocity, pattern)
    if (trackId === 'perc') playPerc(graph, playTime, velocity, pattern)
    if (trackId === 'bass') playBass(graph, playTime, velocity, step, pattern)
    if (trackId === 'pluck') playPluck(graph, playTime, velocity, step, pattern)
    if (trackId === 'chord') playChord(graph, playTime, velocity, step, pattern)
    if (trackId === 'pad') playPad(graph, playTime, velocity, step, pattern)
    if (trackId === 'fx') playFx(graph, playTime, velocity, step, pattern)
  }
}

const kitSettings: Record<SoundKit, { noise: number; tone: number; brightness: number; decay: number }> = {
  clean: { noise: 1, tone: 1, brightness: 1, decay: 1 },
  lofi: { noise: 0.82, tone: 0.86, brightness: 0.58, decay: 1.18 },
  arcade: { noise: 0.92, tone: 1.18, brightness: 1.28, decay: 0.82 },
  ambient: { noise: 0.68, tone: 0.72, brightness: 0.74, decay: 1.55 },
  analog: { noise: 1.04, tone: 1.08, brightness: 0.9, decay: 1.08 },
}

function kit(pattern: BeatPattern) {
  return kitSettings[pattern.soundKit]
}

function envelopeGain(graph: AudioGraph, time: number, level: number, attack: number, decay: number) {
  const gain = graph.context.createGain()
  gain.gain.setValueAtTime(0.0001, time)
  gain.gain.exponentialRampToValueAtTime(Math.max(level, 0.0001), time + attack)
  gain.gain.exponentialRampToValueAtTime(0.0001, time + attack + decay)
  gain.connect(graph.masterGain)
  return gain
}

function noiseBuffer(context: AudioContext) {
  const buffer = context.createBuffer(1, context.sampleRate * 0.35, context.sampleRate)
  const data = buffer.getChannelData(0)
  for (let index = 0; index < data.length; index += 1) {
    data[index] = Math.random() * 2 - 1
  }
  return buffer
}

function playKick(graph: AudioGraph, time: number, velocity: number, pattern: BeatPattern) {
  const settings = kit(pattern)
  const osc = graph.context.createOscillator()
  const gain = envelopeGain(graph, time, 0.9 * settings.tone * velocity, 0.004, 0.34 * settings.decay)
  osc.type = pattern.soundKit === 'arcade' ? 'triangle' : 'sine'
  osc.frequency.setValueAtTime(128, time)
  osc.frequency.exponentialRampToValueAtTime(42, time + 0.22)
  osc.connect(gain)
  osc.start(time)
  osc.stop(time + 0.36)
}

function playSnare(graph: AudioGraph, time: number, velocity: number, pattern: BeatPattern) {
  const settings = kit(pattern)
  const source = graph.context.createBufferSource()
  const filter = graph.context.createBiquadFilter()
  const gain = envelopeGain(graph, time, 0.42 * settings.noise * velocity, 0.002, 0.18 * settings.decay)
  source.buffer = graph.noiseBuffer
  filter.type = 'bandpass'
  filter.frequency.value = 1650 * settings.brightness
  filter.Q.value = 0.9
  source.connect(filter)
  filter.connect(gain)
  source.start(time)
  source.stop(time + 0.2)
}

function playClap(graph: AudioGraph, time: number, velocity: number, pattern: BeatPattern) {
  const settings = kit(pattern)
  for (const offset of [0, 0.012, 0.025]) {
    const source = graph.context.createBufferSource()
    const filter = graph.context.createBiquadFilter()
    const gain = envelopeGain(graph, time + offset, 0.13 * settings.noise * velocity, 0.001, 0.11 * settings.decay)
    source.buffer = graph.noiseBuffer
    filter.type = 'bandpass'
    filter.frequency.value = 1900 * settings.brightness
    filter.Q.value = 0.7
    source.connect(filter)
    filter.connect(gain)
    source.start(time + offset)
    source.stop(time + offset + 0.12)
  }
}

function playHat(graph: AudioGraph, time: number, velocity: number, pattern: BeatPattern) {
  const settings = kit(pattern)
  const source = graph.context.createBufferSource()
  const filter = graph.context.createBiquadFilter()
  const gain = envelopeGain(graph, time, 0.18 * settings.noise * velocity, 0.001, 0.055 * settings.decay)
  source.buffer = graph.noiseBuffer
  filter.type = 'highpass'
  filter.frequency.value = 7200 * settings.brightness
  source.connect(filter)
  filter.connect(gain)
  source.start(time)
  source.stop(time + 0.07)
}

function playOpenHat(graph: AudioGraph, time: number, velocity: number, pattern: BeatPattern) {
  const settings = kit(pattern)
  const source = graph.context.createBufferSource()
  const filter = graph.context.createBiquadFilter()
  const gain = envelopeGain(graph, time, 0.14 * settings.noise * velocity, 0.002, 0.32 * settings.decay)
  source.buffer = graph.noiseBuffer
  filter.type = 'highpass'
  filter.frequency.value = 5600 * settings.brightness
  source.connect(filter)
  filter.connect(gain)
  source.start(time)
  source.stop(time + 0.36)
}

function playRide(graph: AudioGraph, time: number, velocity: number, pattern: BeatPattern) {
  const settings = kit(pattern)
  const gain = envelopeGain(graph, time, 0.08 * settings.tone * velocity, 0.002, 0.48 * settings.decay)
  for (const ratio of [1, 1.49, 2.01]) {
    const osc = graph.context.createOscillator()
    osc.type = 'triangle'
    osc.frequency.value = 1320 * ratio * settings.brightness
    osc.connect(gain)
    osc.start(time)
    osc.stop(time + 0.5)
  }
}

function playShaker(graph: AudioGraph, time: number, velocity: number, pattern: BeatPattern) {
  const settings = kit(pattern)
  const source = graph.context.createBufferSource()
  const filter = graph.context.createBiquadFilter()
  const gain = envelopeGain(graph, time, 0.1 * settings.noise * velocity, 0.002, 0.16 * settings.decay)
  source.buffer = graph.noiseBuffer
  filter.type = 'bandpass'
  filter.frequency.value = (5100 + Math.random() * 800) * settings.brightness
  filter.Q.value = 1.8
  source.connect(filter)
  filter.connect(gain)
  source.start(time)
  source.stop(time + 0.18)
}

function playPerc(graph: AudioGraph, time: number, velocity: number, pattern: BeatPattern) {
  const settings = kit(pattern)
  const osc = graph.context.createOscillator()
  const gain = envelopeGain(graph, time, 0.22 * settings.tone * velocity, 0.002, 0.11 * settings.decay)
  osc.type = pattern.soundKit === 'analog' ? 'sawtooth' : 'triangle'
  osc.frequency.setValueAtTime(520 + Math.random() * 420, time)
  osc.frequency.exponentialRampToValueAtTime(220, time + 0.1)
  osc.connect(gain)
  osc.start(time)
  osc.stop(time + 0.13)
}

function playBass(
  graph: AudioGraph,
  time: number,
  velocity: number,
  step: number,
  pattern: BeatPattern,
) {
  const settings = kit(pattern)
  const notes = rootNotes(pattern).map((note) => note / 4)
  const osc = graph.context.createOscillator()
  const gain = envelopeGain(graph, time, 0.34 * settings.tone * velocity, 0.008, 0.3 * settings.decay)
  const note = notes[(Math.floor(step / 4) + Math.round(pattern.focus / 35)) % notes.length]
  osc.type = pattern.soundKit === 'arcade' ? 'square' : 'sine'
  osc.frequency.setValueAtTime(note, time)
  osc.frequency.exponentialRampToValueAtTime(
    note * 0.78,
    time + 0.28,
  )
  osc.connect(gain)
  osc.start(time)
  osc.stop(time + 0.36)
}

function playPluck(
  graph: AudioGraph,
  time: number,
  velocity: number,
  step: number,
  pattern: BeatPattern,
) {
  const settings = kit(pattern)
  const notes = melodyNotes(pattern)
  const osc = graph.context.createOscillator()
  const filter = graph.context.createBiquadFilter()
  const gain = envelopeGain(graph, time, 0.16 * settings.tone * velocity, 0.006, 0.26 * settings.decay)
  osc.type = pattern.soundKit === 'arcade' ? 'square' : pattern.focus > 70 ? 'triangle' : 'sawtooth'
  osc.frequency.value = notes[(step + Math.round(pattern.playful / 20)) % notes.length]
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime((1400 + pattern.playful * 38) * settings.brightness, time)
  filter.frequency.exponentialRampToValueAtTime(420, time + 0.2)
  osc.connect(filter)
  filter.connect(gain)
  osc.start(time)
  osc.stop(time + 0.3)
}

function playChord(
  graph: AudioGraph,
  time: number,
  velocity: number,
  step: number,
  pattern: BeatPattern,
) {
  const settings = kit(pattern)
  const root = rootNotes(pattern)[Math.floor(step / 4) % rootNotes(pattern).length]
  const gain = envelopeGain(graph, time, 0.1 * settings.tone * velocity, 0.025, 0.42 * settings.decay)
  const filter = graph.context.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = (1050 + pattern.playful * 18) * settings.brightness
  filter.connect(gain)

  for (const ratio of chordRatios(pattern)) {
    const osc = graph.context.createOscillator()
    osc.type = pattern.soundKit === 'analog' ? 'sawtooth' : 'triangle'
    osc.frequency.value = root * ratio
    osc.connect(filter)
    osc.start(time)
    osc.stop(time + 0.5)
  }
}

function playPad(
  graph: AudioGraph,
  time: number,
  velocity: number,
  step: number,
  pattern: BeatPattern,
) {
  const settings = kit(pattern)
  const roots = rootNotes(pattern)
  const root = roots[Math.floor(step / 4) % roots.length]
  const gain = envelopeGain(graph, time, 0.07 * settings.tone * velocity, 0.08, 0.68 * settings.decay)
  const filter = graph.context.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = (900 + pattern.focus * 15) * settings.brightness
  filter.connect(gain)

  for (const ratio of chordRatios(pattern)) {
    const osc = graph.context.createOscillator()
    osc.type = pattern.soundKit === 'ambient' ? 'sine' : 'triangle'
    osc.frequency.value = root * ratio
    osc.connect(filter)
    osc.start(time)
    osc.stop(time + 0.82)
  }
}

function playFx(
  graph: AudioGraph,
  time: number,
  velocity: number,
  step: number,
  pattern: BeatPattern,
) {
  const settings = kit(pattern)
  const source = graph.context.createBufferSource()
  const filter = graph.context.createBiquadFilter()
  const gain = envelopeGain(graph, time, 0.16 * settings.noise * velocity, 0.02, 0.5 * settings.decay)
  source.buffer = graph.noiseBuffer
  source.playbackRate.value = step % 8 === 0 ? 0.42 : 0.8
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(420 * settings.brightness, time)
  filter.frequency.exponentialRampToValueAtTime(5200 * settings.brightness, time + 0.42)
  filter.Q.value = 1.1
  source.connect(filter)
  filter.connect(gain)
  source.start(time)
  source.stop(time + 0.56)
}

function rootNotes(pattern: BeatPattern) {
  if (pattern.harmony === 'dreamy') return [130.81, 164.81, 196, 246.94]
  if (pattern.harmony === 'bright') return [146.83, 185, 220, 293.66]
  if (pattern.harmony === 'tense') return [130.81, 155.56, 174.61, 233.08]
  return [130.81, 146.83, 164.81, 196]
}

function melodyNotes(pattern: BeatPattern) {
  if (pattern.harmony === 'dreamy') return [196, 220, 246.94, 293.66, 329.63, 392]
  if (pattern.harmony === 'bright') return [220, 246.94, 277.18, 329.63, 369.99, 440]
  if (pattern.harmony === 'tense') return [196, 207.65, 233.08, 261.63, 311.13, 392]
  return [196, 220, 246.94, 293.66, 329.63, 392]
}

function chordRatios(pattern: BeatPattern) {
  if (pattern.harmony === 'bright') return [1, 1.25, 1.5]
  if (pattern.harmony === 'tense') return [1, 1.189, 1.498]
  if (pattern.harmony === 'dreamy') return [1, 1.26, 1.68]
  return [1, 1.2, 1.5]
}
