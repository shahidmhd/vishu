'use client'

import { motion } from 'framer-motion'

// Nilavilakku (Kerala lamp) SVG component
function Nilavilakku({ scale = 1, className = '' }: { scale?: number; className?: string }) {
  return (
    <svg
      width={80 * scale}
      height={160 * scale}
      viewBox="0 0 80 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`lamp-glow ${className}`}
    >
      {/* Flame */}
      <ellipse cx="40" cy="18" rx="7" ry="12" fill="#ff6b00" className="flame" />
      <ellipse cx="40" cy="22" rx="4" ry="8" fill="#ffdd00" className="flame" />
      {/* Wick holder / oil cup */}
      <ellipse cx="40" cy="32" rx="14" ry="5" fill="#c8a007" />
      <path d="M26 32 Q28 42 30 45 L50 45 Q52 42 54 32 Z" fill="#b8900a" />
      {/* Cup ring */}
      <ellipse cx="40" cy="45" rx="10" ry="3.5" fill="#d4a80a" />
      {/* Stem segments */}
      <rect x="37" y="45" width="6" height="14" fill="#c8a007" rx="2" />
      <ellipse cx="40" cy="59" rx="12" ry="4" fill="#d4a80a" />
      <rect x="37.5" y="59" width="5" height="12" fill="#c8a007" rx="2" />
      <ellipse cx="40" cy="71" rx="10" ry="3.5" fill="#d4a80a" />
      <rect x="38" y="71" width="4" height="10" fill="#c8a007" rx="1.5" />
      {/* Bell-shaped base */}
      <path d="M28 81 Q20 95 18 115 Q17 125 40 128 Q63 125 62 115 Q60 95 52 81 Z" fill="#b8900a" />
      <path d="M30 81 Q23 93 21 110 Q20 120 40 122 Q60 120 59 110 Q57 93 50 81 Z" fill="#c8a007" />
      {/* Base platform */}
      <ellipse cx="40" cy="128" rx="22" ry="6" fill="#a07808" />
      <ellipse cx="40" cy="130" rx="28" ry="5" fill="#8a6606" />
      <ellipse cx="40" cy="132" rx="34" ry="5" fill="#7a5a04" />
      {/* Glow halo around flame */}
      <ellipse cx="40" cy="25" rx="18" ry="18" fill="#ffaa0020" />
      <ellipse cx="40" cy="25" rx="12" ry="12" fill="#ffaa0030" />
    </svg>
  )
}

// Konna (Golden Shower) flower cluster
function KonnaFlower({ x = 0, delay = 0 }: { x?: number; delay?: number }) {
  const petals = Array.from({ length: 12 }, (_, i) => i)
  return (
    <motion.g
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 1 }}
    >
      {petals.map((i) => {
        const angle = (i / petals.length) * Math.PI * 2
        const r = 22
        const px = x + Math.cos(angle) * r
        const py = Math.sin(angle) * r
        return (
          <ellipse
            key={i}
            cx={px}
            cy={py}
            rx="5"
            ry="9"
            fill={i % 3 === 0 ? '#ffd700' : i % 3 === 1 ? '#ffaa00' : '#f4c430'}
            opacity="0.9"
            transform={`rotate(${(angle * 180) / Math.PI + 90}, ${px}, ${py})`}
          />
        )
      })}
      <circle cx={x} cy={0} r="8" fill="#ff8c00" />
      <circle cx={x} cy={0} r="4" fill="#ffd700" />
    </motion.g>
  )
}

// Hanging Konna branch
function KonnaBranch({ side = 'left' }: { side?: 'left' | 'right' }) {
  const isLeft = side === 'left'
  return (
    <motion.div
      className={`absolute top-0 ${isLeft ? 'left-0' : 'right-0'} pointer-events-none`}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
    >
      <svg
        width="200"
        height="380"
        viewBox="0 0 200 380"
        className="konna-branch"
        style={{ transform: isLeft ? 'scaleX(1)' : 'scaleX(-1)' }}
      >
        {/* Main branch */}
        <path
          d="M 20 0 Q 30 60 25 120 Q 20 180 30 240"
          stroke="#5c3d11"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        {/* Sub-branches with flower clusters */}
        {[40, 80, 120, 160, 200, 240].map((y, i) => (
          <g key={i}>
            {/* Branch arm */}
            <path
              d={`M 25 ${y} Q ${40 + i * 8} ${y + 15} ${55 + i * 10} ${y + 10}`}
              stroke="#5c3d11"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            {/* Flower cluster hanging down */}
            {[0, 1, 2].map((j) => (
              <g key={j} transform={`translate(${55 + i * 10 + j * 14}, ${y + 10})`}>
                {/* Stem */}
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2={20 + j * 8}
                  stroke="#5c3d11"
                  strokeWidth="1.5"
                />
                {/* Flower */}
                {[0, 72, 144, 216, 288].map((rot, k) => (
                  <ellipse
                    key={k}
                    cx={Math.cos((rot * Math.PI) / 180) * 5}
                    cy={20 + j * 8 + Math.sin((rot * Math.PI) / 180) * 5}
                    rx="4"
                    ry="7"
                    fill={k % 2 === 0 ? '#ffd700' : '#ffaa00'}
                    opacity="0.9"
                    transform={`rotate(${rot}, ${Math.cos((rot * Math.PI) / 180) * 5}, ${20 + j * 8 + Math.sin((rot * Math.PI) / 180) * 5})`}
                  />
                ))}
                <circle cx="0" cy={20 + j * 8} r="3" fill="#ff8c00" />
              </g>
            ))}
          </g>
        ))}
        {/* Leaves */}
        {[30, 70, 110, 150].map((y, i) => (
          <ellipse
            key={i}
            cx={28 + i * 3}
            cy={y}
            rx="12"
            ry="6"
            fill="#2d6a4f"
            opacity="0.7"
            transform={`rotate(${isLeft ? 30 : -30}, ${28 + i * 3}, ${y})`}
          />
        ))}
      </svg>
    </motion.div>
  )
}

// Stars in background
function Stars() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 60,
    size: Math.random() * 2.5 + 0.5,
    delay: Math.random() * 3,
    duration: Math.random() * 2 + 1.5,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-yellow-100"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.4, 0.8],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// Ground glow / ambient light
function AmbientGlow() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Top sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(255,170,0,0.08) 0%, transparent 60%)',
        }}
      />
      {/* Bottom ground glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/3"
        style={{
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(244,196,48,0.15) 0%, transparent 70%)',
        }}
      />
      {/* Center hero glow */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div
          className="w-96 h-96 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(244,196,48,0.12) 0%, transparent 70%)',
          }}
        />
      </motion.div>
    </div>
  )
}

// Floating sparkles
function FloatingSparkles() {
  const sparkles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: 20 + Math.random() * 70,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path
              d="M6 0 L6.5 5 L12 6 L6.5 7 L6 12 L5.5 7 L0 6 L5.5 5 Z"
              fill="#ffd700"
              opacity="0.8"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

// Bottom lamps row
function LampsRow() {
  return (
    <div className="absolute bottom-0 left-0 right-0 flex justify-between items-end px-4 md:px-12 pointer-events-none">
      {/* Left lamp */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="hidden sm:block"
      >
        <Nilavilakku scale={0.7} />
      </motion.div>

      {/* Extra lamp left-center */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 1 }}
        className="hidden md:block"
      >
        <Nilavilakku scale={0.55} />
      </motion.div>

      {/* Center spacer */}
      <div className="flex-1" />

      {/* Extra lamp right-center */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 1 }}
        className="hidden md:block"
      >
        <Nilavilakku scale={0.55} />
      </motion.div>

      {/* Right lamp */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="hidden sm:block"
      >
        <Nilavilakku scale={0.7} />
      </motion.div>
    </div>
  )
}

export default function Background() {
  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: 'linear-gradient(180deg, #060e08 0%, #0d2b1e 25%, #1a3a28 50%, #0d2b1e 75%, #060e08 100%)' }}>
      <Stars />
      <AmbientGlow />
      <KonnaBranch side="left" />
      <KonnaBranch side="right" />
      <FloatingSparkles />
      <LampsRow />

      {/* Decorative arch / mandala-inspired top ornament */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1.2 }}
      >
        <svg width="320" height="80" viewBox="0 0 320 80" fill="none">
          {/* Arch */}
          <path
            d="M 10 80 Q 160 -20 310 80"
            stroke="#f4c430"
            strokeWidth="2"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M 30 80 Q 160 0 290 80"
            stroke="#ffaa00"
            strokeWidth="1"
            fill="none"
            opacity="0.3"
          />
          {/* Hanging dots */}
          {[40, 80, 120, 160, 200, 240, 280].map((x, i) => {
            const t = (x - 10) / 300
            const y = 80 - 4 * t * (1 - t) * 100
            return (
              <g key={i}>
                <circle cx={x} cy={y + 5} r="3" fill="#ffd700" opacity="0.8" />
                <circle cx={x} cy={y + 14} r="2" fill="#ffaa00" opacity="0.6" />
              </g>
            )
          })}
        </svg>
      </motion.div>

      {/* Subtle rangoli-inspired ground pattern */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 1, duration: 2 }}
      >
        <svg width="400" height="100" viewBox="0 0 400 100" fill="none">
          {[0, 30, 60, 90, 120, 150].map((r, i) => (
            <ellipse
              key={i}
              cx="200"
              cy="100"
              rx={50 + i * 25}
              ry={20 + i * 6}
              stroke="#f4c430"
              strokeWidth="1"
              fill="none"
              opacity={0.8 - i * 0.1}
            />
          ))}
        </svg>
      </motion.div>
    </div>
  )
}
