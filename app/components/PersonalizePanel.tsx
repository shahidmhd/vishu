'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCode from 'qrcode'

interface PersonalizePanelProps {
  currentName: string
  onNameChange: (name: string) => void
  onPhotoChange: (dataUrl: string | null) => void
  currentPhoto: string | null
}

type Step = 'form' | 'upi' | 'share'

const PRESET_AMOUNTS = ['11', '51', '101', '201', '501']

export default function PersonalizePanel({
  currentName,
  onNameChange,
  onPhotoChange,
  currentPhoto,
}: PersonalizePanelProps) {
  const [isOpen, setIsOpen]       = useState(false)
  const [step, setStep]           = useState<Step>('form')

  // Gift details
  const [nameInput, setNameInput] = useState(currentName || '')
  const [photo, setPhoto]         = useState<string | null>(currentPhoto)

  // UPI details (sender)
  const [upiId, setUpiId]         = useState('')
  const [senderName, setSenderName] = useState('')
  const [amount, setAmount]       = useState('101')
  const [skipUpi, setSkipUpi]     = useState(false)

  // Share
  const [shareUrl, setShareUrl]   = useState('')
  const [giftQr, setGiftQr]       = useState<string | null>(null)   // QR for gift link
  const [upiQr, setUpiQr]         = useState<string | null>(null)   // QR for UPI pay
  const [copied, setCopied]       = useState(false)
  const [upiError, setUpiError]   = useState('')

  const fileRef = useRef<HTMLInputElement>(null)

  // Load saved UPI
  useEffect(() => {
    try {
      const saved = localStorage.getItem('vishu_sender')
      if (saved) {
        const { upiId: u, senderName: n, amount: a } = JSON.parse(saved)
        if (u) setUpiId(u)
        if (n) setSenderName(n)
        if (a) setAmount(a)
      }
    } catch {}
  }, [])

  // Build share URL whenever relevant state changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    const base = window.location.origin + window.location.pathname
    const params = new URLSearchParams()
    if (nameInput.trim()) params.set('to', nameInput.trim())
    if (!skipUpi && upiId.trim()) {
      params.set('upi', upiId.trim())
      if (senderName.trim()) params.set('from', senderName.trim())
      if (amount) params.set('amt', amount)
    }
    setShareUrl(`${base}?${params.toString()}`)
  }, [nameInput, upiId, senderName, amount, skipUpi])

  // Generate gift QR
  useEffect(() => {
    if (!shareUrl) return
    QRCode.toDataURL(shareUrl, {
      width: 220, margin: 2, errorCorrectionLevel: 'M',
      color: { dark: '#1a4731', light: '#fffbeb' },
    }).then(setGiftQr).catch(() => {})
  }, [shareUrl])

  // Generate UPI QR (shown on recipient side, but preview here too)
  useEffect(() => {
    if (skipUpi || !upiId.trim()) { setUpiQr(null); return }
    const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId.trim())}&pn=${encodeURIComponent(senderName.trim() || upiId)}&cu=INR&tn=Happy+Vishu+Kaineetam+%F0%9F%92%9B${amount ? `&am=${amount}` : ''}`
    QRCode.toDataURL(upiUrl, {
      width: 200, margin: 2, errorCorrectionLevel: 'M',
      color: { dark: '#1a4731', light: '#fffbeb' },
    }).then(setUpiQr).catch(() => {})
  }, [upiId, senderName, amount, skipUpi])

  // Photo upload + compress
  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX = 300
        const ratio = Math.min(MAX / img.width, MAX / img.height, 1)
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
        const compressed = canvas.toDataURL('image/jpeg', 0.8)
        setPhoto(compressed)
        onPhotoChange(compressed)
        try { localStorage.setItem(`vishu_photo_${nameInput.trim()}`, compressed) } catch {}
      }
      img.src = ev.target?.result as string
    }
    reader.readAsDataURL(file)
  }, [nameInput, onPhotoChange])

  const goToUpiStep = useCallback(() => {
    const name = nameInput.trim()
    onNameChange(name)
    const url = new URL(window.location.href)
    url.searchParams.set('to', name)
    window.history.replaceState({}, '', url.toString())
    setStep('upi')
  }, [nameInput, onNameChange])

  const goToShare = useCallback(() => {
    setUpiError('')
    if (!skipUpi && upiId.trim()) {
      if (!/^[\w.\-+]+@[\w]+$/.test(upiId.trim())) {
        setUpiError('Invalid UPI ID (e.g. name@gpay, name@paytm)')
        return
      }
      try { localStorage.setItem('vishu_sender', JSON.stringify({ upiId, senderName, amount })) } catch {}
    }
    // Push final URL
    const url = new URL(shareUrl)
    window.history.replaceState({}, '', url.toString())
    setStep('share')
  }, [skipUpi, upiId, senderName, amount, shareUrl])

  const handleShare = useCallback(async () => {
    const name = nameInput.trim()
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Happy Vishu ${name} 💛`,
          text: `🌸 I sent you a special Vishu gift! Open it here 🎁`,
          url: shareUrl,
        })
        return
      } catch {}
    }
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2500)
    })
  }, [nameInput, shareUrl])

  const downloadQR = useCallback(() => {
    if (!giftQr) return
    const a = document.createElement('a')
    a.href = giftQr
    a.download = `vishu-gift-${nameInput.trim() || 'greeting'}.png`
    a.click()
  }, [giftQr, nameInput])

  const close = () => { setIsOpen(false); setStep('form') }

  return (
    <>
      {/* Trigger button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm"
        style={{
          background: 'rgba(13,43,30,0.75)',
          border: '1px solid rgba(244,196,48,0.4)',
          color: '#f4c430',
          boxShadow: '0 0 12px rgba(244,196,48,0.15)',
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        whileHover={{ scale: 1.05, boxShadow: '0 0 24px rgba(244,196,48,0.35)' }}
        whileTap={{ scale: 0.95 }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
          <polyline points="16 6 12 2 8 6"/>
          <line x1="12" y1="2" x2="12" y2="15"/>
        </svg>
        <span className="text-xs font-medium">Send Gift</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={close}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-[70] mx-auto max-w-md rounded-t-3xl overflow-hidden relative"
              style={{
                background: 'linear-gradient(170deg, #071a10 0%, #0d2b1e 100%)',
                border: '1px solid rgba(244,196,48,0.2)',
                maxHeight: '92vh', overflowY: 'auto',
                boxShadow: '0 -8px 50px rgba(0,0,0,0.7)',
              }}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            >
              <div className="h-0.5 w-full"
                style={{ background: 'linear-gradient(90deg, transparent, #f4c430 40%, #ffaa00 60%, transparent)' }}
              />

              {/* Step indicator */}
              <div className="flex items-center justify-center gap-2 pt-5 pb-1">
                {(['form', 'upi', 'share'] as Step[]).map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                      style={{
                        background: step === s ? 'linear-gradient(135deg, #f4c430, #ffaa00)'
                          : (['form', 'upi', 'share'].indexOf(step) > i) ? 'rgba(244,196,48,0.3)' : 'rgba(255,255,255,0.06)',
                        color: step === s ? '#3d1f00' : '#f4c430',
                        border: '1px solid rgba(244,196,48,0.3)',
                      }}
                    >
                      {['form', 'upi', 'share'].indexOf(step) > i ? '✓' : i + 1}
                    </div>
                    {i < 2 && <div className="w-8 h-px" style={{ background: 'rgba(244,196,48,0.2)' }} />}
                  </div>
                ))}
              </div>

              <div className="p-6 pb-10">
                {/* Close button */}
                <button
                  onClick={close}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(244,196,48,0.2)', color: '#f4c430' }}
                  aria-label="Close"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
                <div className="w-10 h-1 rounded-full bg-amber-700/40 mx-auto mb-4" />

                <AnimatePresence mode="wait">

                  {/* ── STEP 1: Gift details ── */}
                  {step === 'form' && (
                    <motion.div key="form"
                      initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}
                    >
                      <div className="text-center mb-5">
                        <p className="text-2xl mb-1">🎁</p>
                        <h2 className="text-amber-400 font-bold text-lg">Personalise Gift</h2>
                        <p className="text-amber-700 text-xs mt-0.5">Set recipient name &amp; photo</p>
                      </div>

                      {/* Photo row */}
                      <div className="flex items-center gap-4 mb-5">
                        <button onClick={() => fileRef.current?.click()}
                          className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
                          style={{
                            background: photo ? 'transparent' : 'rgba(244,196,48,0.08)',
                            border: photo ? '2px solid rgba(244,196,48,0.6)' : '2px dashed rgba(244,196,48,0.3)',
                          }}
                        >
                          {photo
                            ? <img src={photo} alt="" className="w-full h-full object-cover" />
                            : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f4c430" strokeWidth="1.5" opacity="0.6"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                          }
                        </button>
                        <div>
                          <p className="text-amber-300 text-xs font-medium">{photo ? 'Photo added ✓' : 'Add recipient photo'}</p>
                          <p className="text-amber-800 text-xs">{photo ? 'Tap to change' : 'Optional · shown after gift opens'}</p>
                          {photo && <button onClick={() => { setPhoto(null); onPhotoChange(null) }} className="text-red-500/60 text-xs mt-1 underline">Remove</button>}
                        </div>
                      </div>
                      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />

                      {/* Name */}
                      <div className="mb-5">
                        <label className="block text-amber-300 text-xs font-medium mb-1.5 tracking-widest uppercase">Recipient's Name</label>
                        <input
                          type="text" value={nameInput} onChange={e => setNameInput(e.target.value)}
                          placeholder="e.g. Shanu, Arun, Priya…" maxLength={30} autoFocus
                          className="w-full px-4 py-3 rounded-xl text-amber-100 placeholder-amber-800 outline-none text-base"
                          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(244,196,48,0.3)', caretColor: '#f4c430' }}
                          onKeyDown={e => e.key === 'Enter' && nameInput.trim() && goToUpiStep()}
                        />
                      </div>

                      {nameInput.trim() && (
                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 px-4 py-2 rounded-full mb-5 w-fit mx-auto"
                          style={{ background: 'rgba(244,196,48,0.1)', border: '1px solid rgba(244,196,48,0.25)' }}
                        >
                          <span className="text-amber-600 text-xs">Preview:</span>
                          <span className="text-amber-300 text-xs font-semibold">Happy Vishu {nameInput.trim()}</span>
                        </motion.div>
                      )}

                      <motion.button onClick={goToUpiStep} disabled={!nameInput.trim()}
                        className="w-full py-3.5 rounded-xl font-bold text-base"
                        style={{
                          background: nameInput.trim() ? 'linear-gradient(135deg, #f4c430, #ffaa00)' : 'rgba(244,196,48,0.15)',
                          color: nameInput.trim() ? '#3d1f00' : '#7a6020',
                          cursor: nameInput.trim() ? 'pointer' : 'not-allowed',
                        }}
                        whileHover={nameInput.trim() ? { scale: 1.02 } : {}}
                        whileTap={nameInput.trim() ? { scale: 0.97 } : {}}
                      >
                        Next: Add Kaineetam →
                      </motion.button>
                    </motion.div>
                  )}

                  {/* ── STEP 2: UPI / Kaineetam ── */}
                  {step === 'upi' && (
                    <motion.div key="upi"
                      initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.22 }}
                    >
                      <div className="text-center mb-5">
                        <p className="text-2xl mb-1">💰</p>
                        <h2 className="text-amber-400 font-bold text-lg">Receive Kaineetam</h2>
                        <p className="text-amber-700 text-xs mt-0.5">
                          Add your UPI — recipient can pay you after opening the gift
                        </p>
                      </div>

                      {/* Skip toggle */}
                      <button onClick={() => setSkipUpi(!skipUpi)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl mb-5"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(244,196,48,0.2)' }}
                      >
                        <span className="text-amber-300 text-sm">Include UPI payment QR</span>
                        <div className="w-10 h-5 rounded-full relative transition-all"
                          style={{ background: !skipUpi ? 'linear-gradient(135deg,#f4c430,#ffaa00)' : 'rgba(255,255,255,0.15)' }}
                        >
                          <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
                            style={{ left: !skipUpi ? '22px' : '2px' }} />
                        </div>
                      </button>

                      {!skipUpi && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                          {/* Your name */}
                          <div className="mb-4">
                            <label className="block text-amber-300 text-xs font-medium mb-1.5 tracking-widest uppercase">Your Name</label>
                            <input type="text" value={senderName} onChange={e => setSenderName(e.target.value)}
                              placeholder="Your name (shown to payer)"
                              className="w-full px-4 py-3 rounded-xl text-amber-100 placeholder-amber-800 outline-none text-sm"
                              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(244,196,48,0.25)', caretColor: '#f4c430' }}
                            />
                          </div>

                          {/* UPI ID */}
                          <div className="mb-4">
                            <label className="block text-amber-300 text-xs font-medium mb-1.5 tracking-widest uppercase">Your UPI ID</label>
                            <input type="text" value={upiId} onChange={e => { setUpiId(e.target.value); setUpiError('') }}
                              placeholder="yourname@gpay / @paytm / @ybl"
                              className="w-full px-4 py-3 rounded-xl text-amber-100 placeholder-amber-800 outline-none text-sm"
                              style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${upiError ? 'rgba(255,80,80,0.5)' : 'rgba(244,196,48,0.25)'}`, caretColor: '#f4c430' }}
                              autoCapitalize="none" inputMode="email"
                            />
                            {upiError && <p className="text-red-400 text-xs mt-1">{upiError}</p>}
                          </div>

                          {/* Amount */}
                          <div className="mb-5">
                            <label className="block text-amber-300 text-xs font-medium mb-2 tracking-widest uppercase">Suggested Amount (₹)</label>
                            <div className="flex gap-2 flex-wrap">
                              {PRESET_AMOUNTS.map(a => (
                                <button key={a} onClick={() => setAmount(a)}
                                  className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                                  style={{
                                    background: amount === a ? 'linear-gradient(135deg,#f4c430,#ffaa00)' : 'rgba(244,196,48,0.1)',
                                    color: amount === a ? '#3d1f00' : '#f4c430',
                                    border: '1px solid rgba(244,196,48,0.3)',
                                  }}
                                >₹{a}</button>
                              ))}
                              <button onClick={() => setAmount('')}
                                className="px-3 py-1.5 rounded-full text-xs font-semibold"
                                style={{
                                  background: amount === '' ? 'linear-gradient(135deg,#f4c430,#ffaa00)' : 'rgba(244,196,48,0.1)',
                                  color: amount === '' ? '#3d1f00' : '#f4c430',
                                  border: '1px solid rgba(244,196,48,0.3)',
                                }}
                              >Any</button>
                            </div>
                          </div>

                          {/* UPI QR preview */}
                          {upiQr && upiId.trim() && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                              className="flex flex-col items-center mb-4"
                            >
                              <p className="text-amber-600 text-xs mb-2">Preview — recipient will see this</p>
                              <div className="p-2.5 rounded-xl" style={{ background: '#fffbeb', boxShadow: '0 0 16px rgba(244,196,48,0.2)' }}>
                                <img src={upiQr} alt="UPI QR preview" width={120} height={120} />
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      )}

                      <div className="flex gap-3">
                        <button onClick={() => setStep('form')}
                          className="py-3 px-4 rounded-xl text-sm font-medium"
                          style={{ background: 'rgba(244,196,48,0.08)', border: '1px solid rgba(244,196,48,0.2)', color: '#f4c430' }}
                        >← Back</button>
                        <motion.button onClick={goToShare}
                          className="flex-1 py-3 rounded-xl font-bold text-base"
                          style={{ background: 'linear-gradient(135deg, #f4c430, #ffaa00)', color: '#3d1f00' }}
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        >
                          {skipUpi ? 'Skip & Generate →' : 'Generate Gift →'}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* ── STEP 3: Share ── */}
                  {step === 'share' && (
                    <motion.div key="share"
                      initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.22 }}
                      className="flex flex-col items-center"
                    >
                      <div className="text-center mb-4">
                        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-3xl mb-1">🎉</motion.div>
                        <h2 className="text-amber-400 font-bold text-lg">Gift Ready!</h2>
                        <p className="text-amber-700 text-xs mt-0.5">Share the link or let them scan the QR</p>
                      </div>

                      {/* Recipient card */}
                      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-4 w-full"
                        style={{ background: 'rgba(244,196,48,0.08)', border: '1px solid rgba(244,196,48,0.2)' }}
                      >
                        {photo
                          ? <img src={photo} alt={nameInput.trim()} className="w-11 h-11 rounded-full object-cover flex-shrink-0" style={{ border: '2px solid rgba(244,196,48,0.5)' }} />
                          : <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(244,196,48,0.15)', border: '2px solid rgba(244,196,48,0.3)' }}>
                              <span className="text-amber-400 text-lg font-bold">{nameInput.trim()[0]?.toUpperCase()}</span>
                            </div>
                        }
                        <div className="flex-1 min-w-0">
                          <p className="text-amber-200 font-semibold text-sm">To: {nameInput.trim()}</p>
                          {!skipUpi && upiId.trim() && (
                            <p className="text-amber-700 text-xs truncate">💰 UPI: {upiId} {amount ? `· ₹${amount}` : ''}</p>
                          )}
                        </div>
                      </div>

                      {/* Gift QR */}
                      {giftQr && (
                        <motion.div className="relative p-3 rounded-2xl mb-4"
                          style={{ background: '#fffbeb' }}
                          animate={{ boxShadow: ['0 0 15px rgba(244,196,48,0.2)', '0 0 40px rgba(244,196,48,0.5)', '0 0 15px rgba(244,196,48,0.2)'] }}
                          transition={{ duration: 2.5, repeat: Infinity }}
                        >
                          <img src={giftQr} alt="Gift QR" width={200} height={200} />
                          <p className="text-center text-xs font-semibold mt-1.5" style={{ color: '#1a4731' }}>
                            Scan to open gift 🎁
                          </p>
                        </motion.div>
                      )}

                      {/* URL strip */}
                      <div className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl mb-4"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(244,196,48,0.2)' }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f4c430" strokeWidth="2" className="flex-shrink-0">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                        </svg>
                        <p className="text-amber-600 text-xs flex-1 truncate">{shareUrl}</p>
                      </div>

                      {/* Buttons */}
                      <div className="w-full flex gap-3 mb-3">
                        <motion.button onClick={handleShare}
                          className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold"
                          style={{ background: 'linear-gradient(135deg,#f4c430,#ffaa00)', color: '#3d1f00', boxShadow: '0 0 20px rgba(244,196,48,0.3)' }}
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                          </svg>
                          {copied ? 'Copied ✓' : 'Share Gift'}
                        </motion.button>
                        <button onClick={downloadQR}
                          className="py-3 px-4 rounded-xl flex items-center gap-1.5 text-sm font-medium"
                          style={{ background: 'rgba(244,196,48,0.1)', border: '1px solid rgba(244,196,48,0.3)', color: '#f4c430' }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                          </svg>
                          QR
                        </button>
                      </div>

                      {/* WhatsApp */}
                      <a href={`https://wa.me/?text=${encodeURIComponent(`🌸 Happy Vishu ${nameInput.trim()}! Open your special gift 🎁\n${shareUrl}`)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium mb-4"
                        style={{ background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.3)', color: '#4ade80' }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.856L0 24l6.336-1.508A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.898 0-3.67-.52-5.184-1.427l-.37-.22-3.762.895.955-3.653-.241-.376A9.959 9.959 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                        </svg>
                        Share on WhatsApp
                      </a>

                      <button onClick={() => setStep('upi')} className="text-amber-700 text-xs underline">← Edit</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
