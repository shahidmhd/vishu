'use client'

import { useState, useCallback, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'

const Background              = dynamic(() => import('./components/Background'),   { ssr: false })
const GiftBox                 = dynamic(() => import('./components/GiftBox'),      { ssr: false })
const FloatingPetalsComponent = dynamic(
  () => import('./components/Particles').then(m => ({ default: m.FloatingPetals })),
  { ssr: false }
)
const MusicToggle      = dynamic(() => import('./components/MusicToggle'),      { ssr: false })
const PersonalizePanel = dynamic(() => import('./components/PersonalizePanel'), { ssr: false })
const KaineetamPay     = dynamic(() => import('./components/KaineetamPay'),     { ssr: false })

function CopyUrlButton() {
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [])
  return (
    <motion.button
      onClick={handleCopy}
      className="fixed bottom-10 right-4 z-40 flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-sm"
      style={{
        background: 'rgba(13,43,30,0.75)',
        border: '1px solid rgba(244,196,48,0.35)',
        color: copied ? '#4ade80' : '#f4c430',
        boxShadow: '0 0 12px rgba(244,196,48,0.15)',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2 }}
      whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(244,196,48,0.3)' }}
      whileTap={{ scale: 0.95 }}
      aria-label="Copy page URL"
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.svg key="check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
          >
            <polyline points="20 6 9 17 4 12" />
          </motion.svg>
        ) : (
          <motion.svg key="copy" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
          >
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </motion.svg>
        )}
      </AnimatePresence>
      <span className="text-xs font-medium">{copied ? 'Copied!' : 'Copy Link'}</span>
    </motion.button>
  )
}

function HomeContent() {
  const searchParams = useSearchParams()

  // URL params
  const paramTo   = searchParams.get('to')
  const paramUpi  = searchParams.get('upi')
  const paramFrom = searchParams.get('from')
  const paramAmt  = searchParams.get('amt')

  const [recipientName, setRecipientName] = useState(paramTo || '')
  const [recipientPhoto, setRecipientPhoto] = useState<string | null>(null)
  const [isOpened, setIsOpened] = useState(false)

  // Load saved photo from localStorage
  useEffect(() => {
    const name = searchParams.get('to') || ''
    setRecipientName(name)
    try {
      const stored = localStorage.getItem(`vishu_photo_${name}`)
      if (stored) setRecipientPhoto(stored)
    } catch {}
  }, [searchParams])

  const handleOpen   = useCallback(() => setIsOpened(true),  [])
  const handleReplay = useCallback(() => setIsOpened(false), [])

  return (
    <main
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ minHeight: '100dvh' }}
    >
      <Background />
      <FloatingPetalsComponent />
      <MusicToggle />
      <CopyUrlButton />
      <PersonalizePanel
        currentName={recipientName}
        onNameChange={setRecipientName}
        onPhotoChange={setRecipientPhoto}
        currentPhoto={recipientPhoto}
      />

      <div className="relative z-20 flex flex-col items-center justify-center w-full px-4 py-12 min-h-screen gap-6">

        {/* Header before open */}
        <AnimatePresence>
          {!isOpened && (
            <motion.div className="text-center"
              initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40, scale: 0.9 }} transition={{ duration: 1 }}
            >
              <motion.div className="flex items-center justify-center gap-3 mb-2"
                animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="text-amber-400 text-lg">✦</span>
                <span className="text-amber-300 text-xs tracking-[0.4em] uppercase font-light">Kerala Festival</span>
                <span className="text-amber-400 text-lg">✦</span>
              </motion.div>
              <h1 className="text-3xl md:text-5xl font-bold shimmer-text" style={{ fontFamily: 'Georgia, serif', lineHeight: 1.3 }}>
                Vishu 2026
              </h1>
              <motion.p className="text-amber-200 text-xs md:text-sm mt-1 tracking-wider"
                animate={{ opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 4, repeat: Infinity }}
              >
                വിഷു ആശംസകൾ
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header after open */}
        <AnimatePresence>
          {isOpened && (
            <motion.div className="text-center"
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.div className="flex items-center justify-center gap-3"
                animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-amber-400 text-2xl">✦</span>
                <span className="text-amber-300 text-sm tracking-[0.3em] uppercase font-light">Vishu Kaineetam 2026</span>
                <span className="text-amber-400 text-2xl">✦</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recipient photo (shown after open) */}
        <AnimatePresence>
          {isOpened && recipientPhoto && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              className="relative"
            >
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden"
                style={{ border: '3px solid rgba(244,196,48,0.6)', boxShadow: '0 0 20px rgba(244,196,48,0.4)' }}
              >
                <img src={recipientPhoto} alt={recipientName} className="w-full h-full object-cover" />
              </div>
              <motion.div className="absolute inset-0 rounded-full"
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ border: '2px solid rgba(244,196,48,0.4)' }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gift box */}
        <GiftBox name={recipientName} onOpen={handleOpen} onReplay={handleReplay} />

        {/* Kaineetam pay button — only shown after open, only if UPI in URL */}
        <AnimatePresence>
          {isOpened && paramUpi && (
            <KaineetamPay
              upiId={paramUpi}
              fromName={paramFrom || ''}
              amount={paramAmt || ''}
            />
          )}
        </AnimatePresence>

        {/* Divider */}
        <motion.div className="flex items-center gap-3 w-full max-w-xs"
          initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 1.5 }}
        >
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #f4c430)' }} />
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 0 L7.5 6 L14 7 L7.5 8 L7 14 L6.5 8 L0 7 L6.5 6 Z" fill="#f4c430" /></svg>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #f4c430)' }} />
        </motion.div>
      </div>

      <motion.footer className="fixed bottom-4 left-0 right-0 text-center z-30"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
      >
        <p className="text-xs text-amber-700">Made with ❤️ for Vishu</p>
      </motion.footer>
    </main>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d2b1e' }}>
        <div className="text-amber-400 text-sm animate-pulse">Loading...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}
