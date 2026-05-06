import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Pause, Play, Repeat2, Shuffle, Square } from 'lucide-react'

import { createBeatEngine, type BeatEngine } from './audioEngine'
import {
  clonePattern,
  makeRandomPattern,
  normalizePattern,
} from './patterns'
import { defaultPreset, presetList, presets } from './presets'
import {
  type BeatPattern,
  type BeatPreset,
  type HarmonyMode,
  type SoundKit,
  harmonyModes,
  soundKits,
  stepCount,
  trackIds,
  trackMeta,
} from './types'
import { buildHashForPattern, readPatternFromHash } from './urlState'

type PanelMode = 'json' | 'presets'

const soundKitLabels: Record<SoundKit, string> = {
  clean: 'Clean',
  lofi: 'Lo-Fi',
  arcade: 'Arcade',
  ambient: 'Ambient',
  analog: 'Analog',
}

const harmonyLabels: Record<HarmonyMode, string> = {
  minor: 'Minor',
  dreamy: 'Dreamy',
  bright: 'Bright',
  tense: 'Tense',
}

export function Doomchit() {
  const [pattern, setPattern] = useState<BeatPattern>(() => normalizePattern(clonePattern(defaultPreset.pattern)))
  const [jsonValue, setJsonValue] = useState(() => JSON.stringify(defaultPreset.pattern, null, 2))
  const [message, setMessage] = useState('JSON을 편집하거나 랜덤 버튼으로 시작하세요.')
  const [error, setError] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [looping, setLooping] = useState(true)
  const [playhead, setPlayhead] = useState(-1)
  const [mode, setMode] = useState<PanelMode>('presets')
  const engineRef = useRef<BeatEngine | undefined>(undefined)
  const initialHashRef = useRef<string | null>(null)
  const hasPushedHistoryRef = useRef(false)

  const stepEnergy = useMemo(() => {
    return Array.from({ length: stepCount }, (_, step) => {
      const energy = trackIds.reduce((sum, trackId) => sum + pattern.tracks[trackId][step], 0)
      return Math.min(1, energy / 2.8)
    })
  }, [pattern])

  useEffect(() => {
    engineRef.current = createBeatEngine()
    return () => engineRef.current?.stop()
  }, [])

  useEffect(() => {
    engineRef.current?.updatePattern(pattern)
  }, [pattern])

  useEffect(() => {
    engineRef.current?.setLoop(looping)
  }, [looping])

  useEffect(() => {
    initialHashRef.current = window.location.hash

    function applyHash() {
      const result = readPatternFromHash()
      setPattern(result.pattern)
      setJsonValue(JSON.stringify(result.pattern, null, 2))
      setError(false)
      switch (result.status) {
        case 'preset':
          setMessage(`${result.pattern.name} 프리셋을 불러왔습니다.`)
          break
        case 'encoded':
          setMessage(`공유 링크에서 ${result.pattern.name} 패턴을 불러왔습니다.`)
          break
        case 'corrupt':
          setMessage('공유 링크가 손상되어 기본 프리셋을 불러왔습니다.')
          break
        case 'unknown':
          setMessage('알 수 없는 프리셋이라 기본을 불러왔습니다.')
          break
        case 'empty':
          break
      }
    }

    applyHash()

    window.addEventListener('popstate', applyHash)
    return () => window.removeEventListener('popstate', applyHash)
  }, [])

  useEffect(() => {
    if (initialHashRef.current === null) return
    const handle = window.setTimeout(() => {
      const next = '#' + buildHashForPattern(pattern)
      if (window.location.hash === next) return
      if (!hasPushedHistoryRef.current && next !== initialHashRef.current) {
        window.history.pushState(null, '', next)
        hasPushedHistoryRef.current = true
      } else {
        window.history.replaceState(null, '', next)
      }
    }, 250)
    return () => window.clearTimeout(handle)
  }, [pattern])

  function commitPattern(nextPattern: BeatPattern, nextMessage: string) {
    const normalized = normalizePattern(nextPattern)
    setPattern(normalized)
    setJsonValue(JSON.stringify(normalized, null, 2))
    setMessage(nextMessage)
    setError(false)
  }

  const togglePlayback = useCallback(async () => {
    const engine = engineRef.current
    if (!engine) return

    if (engine.isPlaying()) {
      engine.pause()
      setPlaying(false)
      setMessage('일시정지됨')
      return
    }

    const wasPaused = engine.isPaused()

    await engine.play(pattern, setPlayhead, {
      loop: looping,
      onEnded: () => {
        setPlaying(false)
        setMessage(`${pattern.name} 한 바퀴 재생 완료`)
      },
    })
    setPlaying(true)
    setMessage(`${pattern.name} ${wasPaused ? '이어서 재생 중' : looping ? '루프 재생 중' : '한 바퀴 재생 중'}`)
  }, [looping, pattern])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.code !== 'Space' || event.repeat) return
      if (isTypingTarget(event.target)) return

      event.preventDefault()
      void togglePlayback()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [togglePlayback])

  function stopPlayback() {
    engineRef.current?.stop()
    setPlaying(false)
    setMessage('정지됨')
  }

  function applyJson() {
    try {
      const parsed = JSON.parse(jsonValue) as Partial<BeatPattern>
      commitPattern(normalizePattern(parsed), 'JSON 패턴을 적용했습니다.')
    } catch (caught) {
      const nextError = caught instanceof Error ? caught.message : '알 수 없는 오류'
      setMessage(`JSON 오류: ${nextError}`)
      setError(true)
    }
  }

  function updateSetting(key: 'bpm' | 'swing' | 'focus' | 'playful', value: number) {
    const nextPattern = normalizePattern({ ...pattern, [key]: value })
    setPattern(nextPattern)
    setJsonValue(JSON.stringify(nextPattern, null, 2))
  }

  function updateToneSetting(key: 'soundKit' | 'harmony', value: SoundKit | HarmonyMode) {
    const nextPattern = normalizePattern({ ...pattern, [key]: value })
    setPattern(nextPattern)
    setJsonValue(JSON.stringify(nextPattern, null, 2))
  }

  function toggleStep(trackId: (typeof trackIds)[number], step: number) {
    const nextPattern = clonePattern(pattern)
    nextPattern.tracks[trackId][step] = nextPattern.tracks[trackId][step] > 0 ? 0 : 0.8
    commitPattern(nextPattern, `${trackMeta[trackId].label} ${step + 1} 스텝을 변경했습니다.`)
  }

  async function copyPattern() {
    const nextJson = JSON.stringify(pattern, null, 2)
    setJsonValue(nextJson)
    await navigator.clipboard.writeText(nextJson)
    setMessage('현재 패턴 JSON을 클립보드에 복사했습니다.')
    setError(false)
  }

  return (
    <main className="app">
      <section className="stage">
        <div className="topbar">
          <div>
            <p className="eyebrow">몰입을 위한 프로그래머블 비트</p>
            <h1>Doomchit</h1>
          </div>
          <div className="transport">
            <button
              className="primary iconButton"
              type="button"
              onClick={togglePlayback}
              aria-label={playing ? '일시정지' : '재생'}
              title={playing ? '일시정지' : '재생'}
            >
              {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
            </button>
            <button className="iconButton" type="button" onClick={stopPlayback} aria-label="정지" title="정지">
              <Square aria-hidden="true" />
            </button>
            <button
              className={`iconButton ${looping ? 'active' : ''}`}
              type="button"
              onClick={() => setLooping((current) => !current)}
              aria-pressed={looping}
              aria-label={looping ? '루프 켜짐' : '루프 꺼짐'}
              title={looping ? '루프 켜짐' : '루프 꺼짐'}
            >
              <Repeat2 aria-hidden="true" />
            </button>
            <button
              className="iconButton"
              type="button"
              onClick={() => commitPattern(makeRandomPattern(), '랜덤 집중 비트를 만들었습니다.')}
              aria-label="랜덤 패턴"
              title="랜덤 패턴"
            >
              <Shuffle aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="meters" aria-hidden="true">
          {stepEnergy.map((energy, index) => (
            <span
              key={index}
              className={index === playhead && playing ? 'active' : ''}
              style={{ height: `${12 + energy * 36 + (index % 4 === 0 ? 20 : 0)}%` }}
            />
          ))}
        </div>

        <section className="controls" aria-label="비트 컨트롤">
          <SelectControl
            label="사운드"
            value={pattern.soundKit}
            options={soundKits}
            labels={soundKitLabels}
            onChange={(value) => updateToneSetting('soundKit', value)}
          />
          <SelectControl
            label="하모니"
            value={pattern.harmony}
            options={harmonyModes}
            labels={harmonyLabels}
            onChange={(value) => updateToneSetting('harmony', value)}
          />
          <RangeControl label="BPM" value={pattern.bpm} min={60} max={140} onChange={(value) => updateSetting('bpm', value)} />
          <RangeControl label="스윙" value={pattern.swing} min={0} max={45} suffix="%" onChange={(value) => updateSetting('swing', value)} />
          <RangeControl label="집중감" value={pattern.focus} min={0} max={100} onChange={(value) => updateSetting('focus', value)} />
          <RangeControl label="재미" value={pattern.playful} min={0} max={100} onChange={(value) => updateSetting('playful', value)} />
        </section>

        <section className="sequencer" aria-label="스텝 시퀀서">
          <div className="grid">
            {trackIds.map((trackId) => (
              <TrackRow
                key={trackId}
                pattern={pattern}
                playhead={playhead}
                playing={playing}
                trackId={trackId}
                onToggle={toggleStep}
              />
            ))}
          </div>
        </section>
      </section>

      <aside className="panel">
        <div className="tabs" role="tablist" aria-label="편집 모드">
          <button className={mode === 'presets' ? 'active' : ''} type="button" onClick={() => setMode('presets')}>
            프리셋
          </button>
          <button className={mode === 'json' ? 'active' : ''} type="button" onClick={() => setMode('json')}>
            JSON
          </button>
        </div>

        {mode === 'json' ? (
          <div className="jsonPane">
            <textarea value={jsonValue} onChange={(event) => setJsonValue(event.target.value)} spellCheck={false} />
            <div className="panelActions">
              <button className="primary" type="button" onClick={applyJson}>
                적용
              </button>
              <button type="button" onClick={copyPattern}>
                현재 패턴 복사
              </button>
            </div>
            <p className={`message ${error ? 'error' : ''}`} role="status">
              {message}
            </p>
          </div>
        ) : (
          <div className="guidePane">
            {presetList.map((preset) => (
              <PresetButton key={preset.id} preset={preset} onSelect={commitPattern} />
            ))}
          </div>
        )}
      </aside>
    </main>
  )
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const tagName = target.tagName.toLowerCase()
  return target.isContentEditable || tagName === 'input' || tagName === 'textarea' || tagName === 'select'
}

function RangeControl({
  label,
  value,
  min,
  max,
  suffix = '',
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  suffix?: string
  onChange: (value: number) => void
}) {
  return (
    <label>
      <span>{label}</span>
      <output>{value}{suffix}</output>
      <input type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  )
}

function SelectControl<T extends string>({
  label,
  value,
  options,
  labels,
  onChange,
}: {
  label: string
  value: T
  options: readonly T[]
  labels: Record<T, string>
  onChange: (value: T) => void
}) {
  return (
    <label>
      <span>{label}</span>
      <output>{labels[value]}</output>
      <select value={value} onChange={(event) => onChange(event.target.value as T)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {labels[option]}
          </option>
        ))}
      </select>
    </label>
  )
}

function TrackRow({
  pattern,
  playhead,
  playing,
  trackId,
  onToggle,
}: {
  pattern: BeatPattern
  playhead: number
  playing: boolean
  trackId: (typeof trackIds)[number]
  onToggle: (trackId: (typeof trackIds)[number], step: number) => void
}) {
  const meta = trackMeta[trackId]

  return (
    <>
      <div className="trackName">{meta.label}</div>
      {pattern.tracks[trackId].map((value, step) => (
        <button
          key={step}
          type="button"
          className={`step ${value > 0 ? 'on' : ''} ${playing && playhead === step ? 'playhead' : ''}`}
          style={{ '--accent': meta.color } as CSSProperties}
          title={`${meta.label} ${step + 1}`}
          onClick={() => onToggle(trackId, step)}
        />
      ))}
    </>
  )
}

function PresetButton({
  preset,
  onSelect,
}: {
  preset: BeatPreset
  onSelect: (pattern: BeatPattern, message: string) => void
}) {
  return (
    <button
      className="preset"
      type="button"
      onClick={() => {
        const nextPattern = presets[preset.id] ?? defaultPreset.pattern
        onSelect(clonePattern(nextPattern), `${nextPattern.name} 프리셋을 불러왔습니다.`)
      }}
    >
      <strong>{preset.title}</strong>
      <span>{preset.description}</span>
    </button>
  )
}
