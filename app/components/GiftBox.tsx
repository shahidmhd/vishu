'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BurstParticles } from './Particles'

interface GiftBoxProps {
  name?: string
  onOpen?: () => void
  onReplay?: () => void
}

// The gift box SVG — closed state
function ClosedBox({ isHovered }: { isHovered: boolean }) {
  return (
    <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Drop shadow */}
      <ellipse cx="90" cy="170" rx="65" ry="10" fill="rgba(0,0,0,0.3)" />

      {/* Box body */}
      <rect x="20" y="90" width="140" height="80" rx="6" fill="#c8780a" />
      <rect x="20" y="90" width="140" height="80" rx="6" fill="url(#bodyGradient)" />

      {/* Box body shine */}
      <rect x="24" y="94" width="132" height="72" rx="4" fill="none" stroke="#f4c430" strokeWidth="1" opacity="0.4" />

      {/* Lid */}
      <rect x="12" y="68" width="156" height="28" rx="6" fill="#d4870b" />
      <rect x="12" y="68" width="156" height="28" rx="6" fill="url(#lidGradient)" />
      <rect x="16" y="72" width="148" height="20" rx="4" fill="none" stroke="#ffd700" strokeWidth="1" opacity="0.5" />

      {/* Vertical ribbon on body */}
      <rect x="78" y="90" width="24" height="80" fill="#8B0000" opacity="0.85" />
      <rect x="82" y="90" width="16" height="80" fill="#b00000" opacity="0.7" />
      <line x1="90" y1="90" x2="90" y2="170" stroke="#ff4444" strokeWidth="2" opacity="0.5" />

      {/* Horizontal ribbon on lid */}
      <rect x="12" y="75" width="156" height="14" fill="#8B0000" opacity="0.85" />
      <rect x="12" y="78" width="156" height="8" fill="#b00000" opacity="0.7" />
      <line x1="12" y1="82" x2="168" y2="82" stroke="#ff4444" strokeWidth="2" opacity="0.5" />

      {/* Bow left loop */}
      <ellipse
        cx="68"
        cy="65"
        rx="22"
        ry="14"
        fill="#b00000"
        transform="rotate(-20 68 65)"
      />
      <ellipse
        cx="68"
        cy="65"
        rx="14"
        ry="8"
        fill="#cc0000"
        transform="rotate(-20 68 65)"
        opacity="0.7"
      />

      {/* Bow right loop */}
      <ellipse
        cx="112"
        cy="65"
        rx="22"
        ry="14"
        fill="#b00000"
        transform="rotate(20 112 65)"
      />
      <ellipse
        cx="112"
        cy="65"
        rx="14"
        ry="8"
        fill="#cc0000"
        transform="rotate(20 112 65)"
        opacity="0.7"
      />

      {/* Bow center knot */}
      <ellipse cx="90" cy="68" rx="12" ry="10" fill="#8B0000" />
      <ellipse cx="90" cy="68" rx="7" ry="6" fill="#cc0000" />
      <circle cx="90" cy="68" r="3" fill="#ff6666" />

      {/* Bow tails */}
      <path d="M 84 74 Q 75 88 68 92" stroke="#8B0000" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M 96 74 Q 105 88 112 92" stroke="#8B0000" strokeWidth="6" fill="none" strokeLinecap="round" />

      {/* Stars / polka dots on box */}
      {[[45, 110], [55, 145], [125, 115], [135, 148], [90, 132]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill="#ffd700" opacity="0.6" />
      ))}

      {/* Glow when hovered */}
      {isHovered && (
        <ellipse cx="90" cy="120" rx="80" ry="60" fill="rgba(244,196,48,0.08)" />
      )}

      {/* Gradient defs */}
      <defs>
        <linearGradient id="bodyGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8920c" />
          <stop offset="50%" stopColor="#c8780a" />
          <stop offset="100%" stopColor="#a05e08" />
        </linearGradient>
        <linearGradient id="lidGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e89a10" />
          <stop offset="100%" stopColor="#b0700a" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// The gift box lid — flies off during open animation
function LidFlying() {
  return (
    <svg width="180" height="50" viewBox="0 0 180 50" fill="none">
      <rect x="0" y="10" width="156" height="28" rx="6" fill="#d4870b" />
      <rect x="0" y="10" width="156" height="28" rx="6" fill="url(#lidGradient2)" />
      <rect x="4" y="14" width="148" height="20" rx="4" fill="none" stroke="#ffd700" strokeWidth="1" opacity="0.5" />
      <rect x="0" y="17" width="156" height="14" fill="#8B0000" opacity="0.85" />
      <rect x="0" y="20" width="156" height="8" fill="#b00000" opacity="0.7" />

      {/* Bow left loop */}
      <ellipse cx="56" cy="8" rx="22" ry="12" fill="#b00000" transform="rotate(-20 56 8)" />
      <ellipse cx="56" cy="8" rx="14" ry="7" fill="#cc0000" transform="rotate(-20 56 8)" opacity="0.7" />
      {/* Bow right loop */}
      <ellipse cx="100" cy="8" rx="22" ry="12" fill="#b00000" transform="rotate(20 100 8)" />
      <ellipse cx="100" cy="8" rx="14" ry="7" fill="#cc0000" transform="rotate(20 100 8)" opacity="0.7" />
      {/* Center knot */}
      <ellipse cx="78" cy="10" rx="12" ry="8" fill="#8B0000" />
      <ellipse cx="78" cy="10" rx="7" ry="5" fill="#cc0000" />
      <circle cx="78" cy="10" r="3" fill="#ff6666" />

      <defs>
        <linearGradient id="lidGradient2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e89a10" />
          <stop offset="100%" stopColor="#b0700a" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// Open box body (without lid)
function OpenBoxBody() {
  return (
    <svg width="180" height="110" viewBox="0 0 180 110" fill="none">
      <ellipse cx="90" cy="100" rx="65" ry="10" fill="rgba(0,0,0,0.3)" />
      {/* Body */}
      <rect x="20" y="0" width="140" height="95" rx="6" fill="#c8780a" />
      <rect x="20" y="0" width="140" height="95" rx="6" fill="url(#openBodyGrad)" />
      <rect x="24" y="4" width="132" height="87" rx="4" fill="none" stroke="#f4c430" strokeWidth="1" opacity="0.4" />

      {/* Interior glow */}
      <ellipse cx="90" cy="10" rx="55" ry="20" fill="rgba(255,215,0,0.5)" />
      <ellipse cx="90" cy="8" rx="40" ry="14" fill="rgba(255,240,100,0.7)" />

      {/* Vertical ribbon on body */}
      <rect x="78" y="0" width="24" height="95" fill="#8B0000" opacity="0.85" />
      <rect x="82" y="0" width="16" height="95" fill="#b00000" opacity="0.7" />
      <line x1="90" y1="0" x2="90" y2="95" stroke="#ff4444" strokeWidth="2" opacity="0.5" />

      {/* Stars */}
      {[[45, 30], [55, 65], [125, 35], [135, 68], [90, 52]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill="#ffd700" opacity="0.6" />
      ))}
      <defs>
        <linearGradient id="openBodyGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8920c" />
          <stop offset="50%" stopColor="#c8780a" />
          <stop offset="100%" stopColor="#a05e08" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function GiftBox({ name = '', onOpen, onReplay }: GiftBoxProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isOpened, setIsOpened] = useState(false)
  const [showBurst, setShowBurst] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = useCallback(() => {
    if (isAnimating || isOpened) return
    setIsAnimating(true)
    setShowBurst(true)
    setTimeout(() => {
      setIsOpened(true)
      setIsAnimating(false)
    }, 600)
    onOpen?.()
  }, [isAnimating, isOpened, onOpen])

  const handleReplay = useCallback(() => {
    setIsOpened(false)
    setShowBurst(false)
    setIsAnimating(false)
    setTimeout(() => {
      onReplay?.()
    }, 300)
  }, [onReplay])

  return (
    <>
      <BurstParticles active={showBurst} count={100} />

      <div className="flex flex-col items-center gap-4 md:gap-8 w-full px-4">
        {/* Pre-open hint text */}
        <AnimatePresence>
          {!isOpened && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-amber-300 text-sm md:text-base tracking-widest uppercase font-light text-center"
              style={{ textShadow: '0 0 10px rgba(251,191,36,0.5)' }}
            >
              ✦ Your Vishu Gift Awaits ✦
            </motion.p>
          )}
        </AnimatePresence>

        {/* The Gift Box */}
        <div className="relative flex items-center justify-center">
          {/* Glow ring behind box */}
          <motion.div
            className="absolute rounded-full"
            animate={
              isOpened
                ? { scale: [1, 2.5], opacity: [0.6, 0] }
                : {
                    scale: isHovered ? [1, 1.15, 1] : [1, 1.08, 1],
                    opacity: isHovered ? 0.5 : 0.3,
                  }
            }
            transition={
              isOpened
                ? { duration: 0.6 }
                : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            }
            style={{
              width: 220,
              height: 220,
              background: 'radial-gradient(circle, rgba(244,196,48,0.35) 0%, transparent 70%)',
            }}
          />

          {/* Second glow ring */}
          <motion.div
            className="absolute rounded-full"
            animate={
              !isOpened
                ? {
                    scale: [1.1, 1.25, 1.1],
                    opacity: [0.15, 0.25, 0.15],
                  }
                : {}
            }
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            style={{
              width: 300,
              height: 300,
              background: 'radial-gradient(circle, rgba(255,170,0,0.2) 0%, transparent 70%)',
            }}
          />

          {/* Closed box */}
          <AnimatePresence>
            {!isOpened && (
              <motion.div
                className="relative cursor-pointer select-none z-20 scale-75 sm:scale-90 md:scale-100"
                initial={{ scale: 0, rotate: -10 }}
                animate={{
                  scale: 1,
                  rotate: 0,
                  y: isHovered ? -8 : 0,
                }}
                exit={{ scale: 0.5, opacity: 0 }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                  y: { duration: 0.3 },
                }}
                onClick={handleClick}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                role="button"
                aria-label="Open your Vishu gift"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleClick()}
              >
                {/* Float animation wrapper */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ClosedBox isHovered={isHovered} />

                  {/* Hover sparkles */}
                  <AnimatePresence>
                    {isHovered && (
                      <>
                        {[
                          { x: -20, y: -20, delay: 0 },
                          { x: 200, y: -15, delay: 0.1 },
                          { x: -25, y: 160, delay: 0.2 },
                          { x: 205, y: 150, delay: 0.15 },
                        ].map((pos, i) => (
                          <motion.div
                            key={i}
                            className="absolute"
                            style={{ left: pos.x, top: pos.y }}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, delay: pos.delay, repeat: Infinity }}
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16">
                              <path
                                d="M8 0 L8.7 7 L16 8 L8.7 9 L8 16 L7.3 9 L0 8 L7.3 7 Z"
                                fill="#ffd700"
                              />
                            </svg>
                          </motion.div>
                        ))}
                      </>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Opened box */}
          <AnimatePresence>
            {isOpened && (
              <motion.div
                className="relative z-20"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                {/* Lid flying off */}
                <motion.div
                  className="absolute left-3"
                  style={{ top: 0 }}
                  initial={{ y: 0, rotate: 0, opacity: 1 }}
                  animate={{ y: -180, rotate: -35, opacity: 0, x: -40 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  <LidFlying />
                </motion.div>

                {/* Open body */}
                <motion.div
                  initial={{ y: -10 }}
                  animate={{ y: 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  style={{ marginTop: 50 }}
                >
                  <OpenBoxBody />
                </motion.div>

                {/* Light beam shooting up from box */}
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2"
                  style={{ top: 30, zIndex: 30 }}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: [0, 0.8, 0] }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                >
                  <div
                    style={{
                      width: 3,
                      height: 300,
                      background: 'linear-gradient(to top, #ffd700, #fffacd, transparent)',
                      transformOrigin: 'bottom center',
                    }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA Button (before open) */}
        <AnimatePresence>
          {!isOpened && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              onClick={handleClick}
              disabled={isAnimating}
              className="relative group px-8 py-3 rounded-full font-semibold text-base tracking-wide overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #f4c430 0%, #ffaa00 50%, #ff8c00 100%)',
                boxShadow: '0 0 20px rgba(244,196,48,0.5), 0 0 40px rgba(255,170,0,0.3)',
                color: '#3d1f00',
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(244,196,48,0.7), 0 0 60px rgba(255,170,0,0.4)' }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Shimmer sweep */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                  backgroundSize: '200% 100%',
                }}
                animate={{ backgroundPosition: ['-100% 0', '300% 0'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
              <span className="relative z-10">Open Your Vishu Gift 🎁</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Revealed message */}
        <AnimatePresence>
          {isOpened && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                delay: 0.4,
                duration: 0.8,
                type: 'spring',
                stiffness: 150,
                damping: 12,
              }}
              className="text-center px-4"
            >
              {/* Malayalam greeting */}
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="text-amber-300 text-sm tracking-widest uppercase mb-2"
                style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.3em' }}
              >
                ✦ വിഷുക്കൈനീട്ടം ✦
              </motion.p>

              {/* Main message */}
              <motion.h2
                className="text-4xl sm:text-5xl md:text-7xl font-bold mb-3 shimmer-text glow-text"
                style={{ fontFamily: 'Georgia, serif', lineHeight: 1.2 }}
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                Happy Vishu
              </motion.h2>

              <motion.h3
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.6, type: 'spring' }}
                className="text-3xl sm:text-4xl md:text-6xl font-bold shimmer-text"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {name}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="text-amber-200 text-sm md:text-base mt-4 max-w-sm mx-auto leading-relaxed"
                style={{ textShadow: '0 0 8px rgba(251,191,36,0.4)' }}
              >
                May this Vishu bring you joy, prosperity, and all the happiness in the world. 🌸
              </motion.p>

              {/* Replay button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 0.6 }}
                onClick={handleReplay}
                className="mt-6 px-6 py-2 rounded-full text-sm font-medium border border-amber-400 text-amber-300 hover:bg-amber-400 hover:text-green-950 transition-all duration-300"
                style={{ boxShadow: '0 0 10px rgba(244,196,48,0.2)' }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(244,196,48,0.4)' }}
                whileTap={{ scale: 0.97 }}
              >
                ↺ Open Again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
