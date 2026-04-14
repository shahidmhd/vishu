'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

// Generate a simple festive melody using Web Audio API
function createFestiveAudio(): AudioContext | null {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    return new AudioContextClass()
  } catch {
    return null
  }
}

// Simple Kerala-inspired melodic sequence (pentatonic scale notes)
const MELODY_NOTES = [
  // Sa Re Ga Ma Pa (C major pentatonic-ish)
  { freq: 523.25, dur: 0.3, delay: 0 },       // C5
  { freq: 587.33, dur: 0.3, delay: 0.35 },    // D5
  { freq: 659.25, dur: 0.3, delay: 0.7 },     // E5
  { freq: 783.99, dur: 0.3, delay: 1.05 },    // G5
  { freq: 880.00, dur: 0.3, delay: 1.4 },     // A5
  { freq: 783.99, dur: 0.3, delay: 1.75 },    // G5
  { freq: 659.25, dur: 0.4, delay: 2.1 },     // E5
  { freq: 587.33, dur: 0.3, delay: 2.6 },     // D5
  { freq: 523.25, dur: 0.5, delay: 2.95 },    // C5
  // Second phrase
  { freq: 659.25, dur: 0.3, delay: 3.6 },     // E5
  { freq: 783.99, dur: 0.3, delay: 3.95 },    // G5
  { freq: 880.00, dur: 0.3, delay: 4.3 },     // A5
  { freq: 1046.5, dur: 0.4, delay: 4.65 },    // C6
  { freq: 880.00, dur: 0.3, delay: 5.15 },    // A5
  { freq: 783.99, dur: 0.3, delay: 5.5 },     // G5
  { freq: 659.25, dur: 0.3, delay: 5.85 },    // E5
  { freq: 523.25, dur: 0.6, delay: 6.2 },     // C5
]

const MELODY_TOTAL = 7.2 // seconds

function playNote(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  gain: number = 0.15
) {
  const osc = ctx.createOscillator()
  const gainNode = ctx.createGain()
  const reverb = ctx.createConvolver()

  osc.connect(gainNode)
  gainNode.connect(ctx.destination)

  osc.type = 'sine'
  osc.frequency.setValueAtTime(freq, startTime)

  // Slight vibrato
  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  lfo.connect(lfoGain)
  lfoGain.connect(osc.frequency)
  lfo.frequency.value = 5
  lfoGain.gain.value = 3
  lfo.start(startTime)
  lfo.stop(startTime + duration + 0.1)

  gainNode.gain.setValueAtTime(0, startTime)
  gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.05)
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

  osc.start(startTime)
  osc.stop(startTime + duration + 0.05)

  // Add a harmony (a third above)
  const harmOsc = ctx.createOscillator()
  const harmGain = ctx.createGain()
  harmOsc.connect(harmGain)
  harmGain.connect(ctx.destination)
  harmOsc.type = 'sine'
  harmOsc.frequency.setValueAtTime(freq * 1.25, startTime)
  harmGain.gain.setValueAtTime(0, startTime)
  harmGain.gain.linearRampToValueAtTime(gain * 0.4, startTime + 0.05)
  harmGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
  harmOsc.start(startTime)
  harmOsc.stop(startTime + duration + 0.05)
}

export default function MusicToggle() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const loopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isPlayingRef = useRef(false)

  const stopAll = useCallback(() => {
    if (loopTimerRef.current) {
      clearTimeout(loopTimerRef.current)
      loopTimerRef.current = null
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close()
      audioCtxRef.current = null
    }
    isPlayingRef.current = false
  }, [])

  const playMelody = useCallback((ctx: AudioContext) => {
    const now = ctx.currentTime
    MELODY_NOTES.forEach(({ freq, dur, delay }) => {
      playNote(ctx, freq, now + delay, dur)
    })

    loopTimerRef.current = setTimeout(() => {
      if (isPlayingRef.current && audioCtxRef.current) {
        playMelody(audioCtxRef.current)
      }
    }, MELODY_TOTAL * 1000 + 500)
  }, [])

  const toggle = useCallback(() => {
    if (isPlayingRef.current) {
      stopAll()
      setIsPlaying(false)
    } else {
      const ctx = createFestiveAudio()
      if (!ctx) return
      audioCtxRef.current = ctx
      isPlayingRef.current = true
      setIsPlaying(true)
      // Resume if suspended (browser autoplay policy)
      if (ctx.state === 'suspended') {
        ctx.resume().then(() => playMelody(ctx))
      } else {
        playMelody(ctx)
      }
    }
  }, [stopAll, playMelody])

  useEffect(() => {
    return () => stopAll()
  }, [stopAll])

  return (
    <motion.button
      onClick={toggle}
      className="fixed top-3 right-3 md:top-4 md:right-4 z-50 flex items-center gap-2 px-3 md:px-4 py-2 rounded-full backdrop-blur-sm"
      style={{
        background: 'rgba(13, 43, 30, 0.7)',
        border: '1px solid rgba(244,196,48,0.4)',
        color: '#f4c430',
        boxShadow: '0 0 12px rgba(244,196,48,0.15)',
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: '0 0 20px rgba(244,196,48,0.3)',
        borderColor: 'rgba(244,196,48,0.7)',
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5 }}
      aria-label={isPlaying ? 'Mute music' : 'Play festive music'}
    >
      {/* Sound wave bars */}
      <div className="flex items-center gap-0.5 h-4">
        {[1, 2, 3, 4].map((bar) => (
          <motion.div
            key={bar}
            className="w-0.5 rounded-full bg-amber-400"
            style={{ height: isPlaying ? '100%' : '30%' }}
            animate={
              isPlaying
                ? {
                    height: ['30%', '100%', '50%', '80%', '30%'],
                  }
                : { height: '30%' }
            }
            transition={
              isPlaying
                ? {
                    duration: 0.6 + bar * 0.1,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: bar * 0.1,
                  }
                : {}
            }
          />
        ))}
      </div>
      <span className="text-xs font-medium">
        {isPlaying ? 'Music On' : 'Music Off'}
      </span>
    </motion.button>
  )
}
