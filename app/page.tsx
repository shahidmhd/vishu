'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import Background from './components/Background'
import GiftBox from './components/GiftBox'
import { FloatingPetals } from './components/Particles'

// Lazy-load music toggle (uses Web Audio API — not SSR-safe)
const MusicToggle = dynamic(() => import('./components/MusicToggle'), { ssr: false })

export default function HomePage() {
  const [isOpened, setIsOpened] = useState(false)

  const handleOpen = useCallback(() => {
    setIsOpened(true)
  }, [])

  const handleReplay = useCallback(() => {
    setIsOpened(false)
  }, [])

  return (
    <main
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ minHeight: '100dvh' }}
    >
      {/* Fixed background layer */}
      <Background />

      {/* Floating petals (canvas) */}
      <FloatingPetals />

      {/* Music toggle */}
      <MusicToggle />

      {/* Main content — sits above background */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full px-4 py-12 min-h-screen gap-6">

        {/* Header */}
        <AnimatePresence>
          {!isOpened && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40, scale: 0.9 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              {/* Decorative top ornament */}
              <motion.div
                className="flex items-center justify-center gap-3 mb-2"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="text-amber-400 text-lg">✦</span>
                <span className="text-amber-300 text-xs tracking-[0.4em] uppercase font-light">
                  Kerala Festival
                </span>
                <span className="text-amber-400 text-lg">✦</span>
              </motion.div>

              <h1
                className="text-3xl md:text-5xl font-bold shimmer-text"
                style={{ fontFamily: 'Georgia, serif', lineHeight: 1.3 }}
              >
                Vishu 2026
              </h1>

              <motion.p
                className="text-amber-200 text-xs md:text-sm mt-1 tracking-wider"
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                വിഷു ആശംസകൾ
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Opened header */}
        <AnimatePresence>
          {isOpened && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.div
                className="flex items-center justify-center gap-3"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-amber-400 text-2xl">✦</span>
                <span className="text-amber-300 text-sm tracking-[0.3em] uppercase font-light">
                  Vishu Kaineetam 2026
                </span>
                <span className="text-amber-400 text-2xl">✦</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gift box — center stage */}
        <div className="flex items-center justify-center">
          <GiftBox onOpen={handleOpen} onReplay={handleReplay} />
        </div>

        {/* Decorative divider */}
        <motion.div
          className="flex items-center gap-3 w-full max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #f4c430)' }} />
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M7 0 L7.5 6 L14 7 L7.5 8 L7 14 L6.5 8 L0 7 L6.5 6 Z" fill="#f4c430" />
          </svg>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #f4c430)' }} />
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        className="fixed bottom-4 left-0 right-0 text-center z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <p
          className="text-xs text-amber-700"
          style={{ textShadow: '0 0 8px rgba(120,80,0,0.5)' }}
        >
          Made with ❤️ for Vishu
        </p>
      </motion.footer>
    </main>
  )
}
