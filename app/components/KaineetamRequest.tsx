'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCode from 'qrcode'

const PRESET_AMOUNTS = [11, 51, 101, 201, 501]

function buildUpiUrl(upiId: string, name: string, amount: string, note: string) {
  const params = new URLSearchParams({
    pa: upiId.trim(),
    pn: name.trim() || 'Vishu Kaineetam',
    cu: 'INR',
    tn: note || 'Happy Vishu Kaineetam 💛',
  })
  if (amount && Number(amount) > 0) params.set('am', amount)
  return `upi://pay?${params.toString()}`
}

export default function KaineetamRequest() {
  const [isOpen, setIsOpen] = useState(false)
  const [upiId, setUpiId]   = useState('')
  const [name, setName]     = useState('')
  const [amount, setAmount] = useState('101')
  const [customAmt, setCustomAmt] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [generated, setGenerated] = useState(false)
  const [copied, setCopied]       = useState(false)
  const [error, setError]         = useState('')

  // Load saved values
  useEffect(() => {
    try {
      const saved = localStorage.getItem('vishu_kaineetam')
      if (saved) {
        const { upiId: u, name: n, amount: a } = JSON.parse(saved)
        if (u) setUpiId(u)
        if (n) setName(n)
        if (a) setAmount(a)
      }
    } catch {}
  }, [])

  const generateQR = useCallback(async () => {
    setError('')
    if (!upiId.trim()) { setError('Please enter your UPI ID'); return }
    if (!/^[\w.\-+]+@[\w]+$/.test(upiId.trim())) {
      setError('Invalid UPI ID (e.g. name@gpay, name@paytm)')
      return
    }

    const upiUrl = buildUpiUrl(upiId, name, amount, '')

    try {
      const qr = await QRCode.toDataURL(upiUrl, {
        width: 260,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: { dark: '#1a4731', light: '#fffbeb' },
      })
      setQrDataUrl(qr)
      setGenerated(true)
      // Persist
      try { localStorage.setItem('vishu_kaineetam', JSON.stringify({ upiId, name, amount })) } catch {}
    } catch {
      setError('Failed to generate QR. Check UPI ID.')
    }
  }, [upiId, name, amount])

  const handleShare = useCallback(async () => {
    const text = `💛 Vishu Kaineetam from ${name || upiId}\nScan to send: ${buildUpiUrl(upiId, name, amount, '')}`
    if (navigator.share) {
      try { await navigator.share({ title: 'Vishu Kaineetam 💛', text }) } catch {}
    } else {
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [upiId, name, amount])

  const downloadQR = useCallback(() => {
    if (!qrDataUrl) return
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = `vishu-kaineetam-${name || upiId}.png`
    a.click()
  }, [qrDataUrl, name, upiId])

  return (
    <>
      {/* Trigger button — bottom center */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-5 py-2.5 rounded-full"
        style={{
          background: 'linear-gradient(135deg, rgba(244,196,48,0.18) 0%, rgba(255,140,0,0.18) 100%)',
          border: '1px solid rgba(244,196,48,0.45)',
          color: '#f4c430',
          boxShadow: '0 0 20px rgba(244,196,48,0.15)',
          backdropFilter: 'blur(8px)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(244,196,48,0.3)' }}
        whileTap={{ scale: 0.96 }}
        aria-label="Create Kaineetam QR"
      >
        {/* Coin icon */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 6v2m0 8v2M9.5 9.5C9.5 8.4 10.6 8 12 8s2.5.4 2.5 1.5c0 2-5 2-5 4s1.1 2.5 2.5 2.5 2.5-.5 2.5-1.5" />
        </svg>
        <span className="text-xs font-semibold tracking-wide">Get Kaineetam 💛</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[60] bg-black/65 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsOpen(false); setGenerated(false) }}
            />

            {/* Bottom sheet */}
            <motion.div
              className="fixed inset-x-0 bottom-0 z-[70] mx-auto max-w-md rounded-t-3xl overflow-y-auto"
              style={{
                background: 'linear-gradient(160deg, #071a10 0%, #0d2b1e 60%, #1a3a28 100%)',
                border: '1px solid rgba(244,196,48,0.2)',
                maxHeight: '92vh',
                boxShadow: '0 -8px 50px rgba(0,0,0,0.7)',
              }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            >
              {/* Gold top bar */}
              <div
                className="h-1 w-full rounded-t-3xl"
                style={{ background: 'linear-gradient(90deg, transparent, #f4c430, transparent)' }}
              />

              <div className="p-6">
                {/* Handle */}
                <div className="w-10 h-1 rounded-full bg-amber-700/40 mx-auto mb-5" />

                {/* Header */}
                <div className="text-center mb-6">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    className="text-3xl mb-2"
                  >
                    💰
                  </motion.div>
                  <h2 className="text-amber-400 font-bold text-lg tracking-wide">
                    Vishu Kaineetam QR
                  </h2>
                  <p className="text-amber-700 text-xs mt-1">
                    Create your personal payment QR · Anyone scans &amp; pays via UPI
                  </p>
                </div>

                {!generated ? (
                  <>
                    {/* UPI ID */}
                    <div className="mb-4">
                      <label className="block text-amber-300 text-xs font-medium mb-1.5 tracking-wider uppercase">
                        Your UPI ID *
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={e => { setUpiId(e.target.value); setError('') }}
                        placeholder="yourname@gpay / @paytm / @ybl"
                        className="w-full px-4 py-3 rounded-xl text-amber-100 placeholder-amber-800 outline-none text-sm"
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: `1px solid ${error ? 'rgba(255,80,80,0.5)' : 'rgba(244,196,48,0.25)'}`,
                          caretColor: '#f4c430',
                        }}
                        autoCapitalize="none"
                        inputMode="email"
                      />
                      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
                    </div>

                    {/* Name */}
                    <div className="mb-4">
                      <label className="block text-amber-300 text-xs font-medium mb-1.5 tracking-wider uppercase">
                        Your Name (shown to payer)
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Shanu"
                        className="w-full px-4 py-3 rounded-xl text-amber-100 placeholder-amber-800 outline-none text-sm"
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(244,196,48,0.25)',
                          caretColor: '#f4c430',
                        }}
                      />
                    </div>

                    {/* Amount */}
                    <div className="mb-6">
                      <label className="block text-amber-300 text-xs font-medium mb-2 tracking-wider uppercase">
                        Suggested Amount (₹)
                      </label>
                      {/* Preset pills */}
                      <div className="flex gap-2 flex-wrap mb-2">
                        {PRESET_AMOUNTS.map(a => (
                          <button
                            key={a}
                            onClick={() => { setAmount(String(a)); setCustomAmt(false) }}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                            style={{
                              background: !customAmt && amount === String(a)
                                ? 'linear-gradient(135deg, #f4c430, #ffaa00)'
                                : 'rgba(244,196,48,0.1)',
                              color: !customAmt && amount === String(a) ? '#3d1f00' : '#f4c430',
                              border: '1px solid rgba(244,196,48,0.3)',
                            }}
                          >
                            ₹{a}
                          </button>
                        ))}
                        <button
                          onClick={() => { setCustomAmt(true); setAmount('') }}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                          style={{
                            background: customAmt ? 'linear-gradient(135deg, #f4c430, #ffaa00)' : 'rgba(244,196,48,0.1)',
                            color: customAmt ? '#3d1f00' : '#f4c430',
                            border: '1px solid rgba(244,196,48,0.3)',
                          }}
                        >
                          Custom
                        </button>
                        <button
                          onClick={() => { setAmount(''); setCustomAmt(false) }}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                          style={{
                            background: !customAmt && amount === '' ? 'linear-gradient(135deg, #f4c430, #ffaa00)' : 'rgba(244,196,48,0.1)',
                            color: !customAmt && amount === '' ? '#3d1f00' : '#f4c430',
                            border: '1px solid rgba(244,196,48,0.3)',
                          }}
                        >
                          Any
                        </button>
                      </div>

                      {customAmt && (
                        <input
                          type="number"
                          value={amount}
                          onChange={e => setAmount(e.target.value)}
                          placeholder="Enter amount"
                          className="w-full px-4 py-2.5 rounded-xl text-amber-100 placeholder-amber-800 outline-none text-sm"
                          style={{
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(244,196,48,0.25)',
                            caretColor: '#f4c430',
                          }}
                          inputMode="numeric"
                        />
                      )}
                    </div>

                    {/* Generate button */}
                    <motion.button
                      onClick={generateQR}
                      className="w-full py-3.5 rounded-xl font-bold text-base"
                      style={{
                        background: 'linear-gradient(135deg, #f4c430 0%, #ffaa00 50%, #ff8c00 100%)',
                        color: '#3d1f00',
                        boxShadow: '0 0 24px rgba(244,196,48,0.35)',
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Generate My Kaineetam QR 🎁
                    </motion.button>

                    <p className="text-amber-800 text-xs text-center mt-3">
                      Works with GPay · PhonePe · Paytm · BHIM · all UPI apps
                    </p>
                  </>
                ) : (
                  /* QR Display Screen */
                  <motion.div
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    {/* Name badge */}
                    <div className="mb-3 text-center">
                      <p className="text-amber-300 text-sm font-semibold">
                        {name || upiId}
                      </p>
                      <p className="text-amber-700 text-xs">{upiId}</p>
                      {amount && (
                        <p className="text-amber-400 text-xs mt-0.5">
                          Suggested: ₹{amount}
                        </p>
                      )}
                    </div>

                    {/* QR Code */}
                    {qrDataUrl && (
                      <motion.div
                        className="relative p-4 rounded-2xl mb-4"
                        style={{
                          background: '#fffbeb',
                          boxShadow: '0 0 30px rgba(244,196,48,0.3), 0 0 60px rgba(244,196,48,0.1)',
                        }}
                        animate={{ boxShadow: [
                          '0 0 20px rgba(244,196,48,0.2)',
                          '0 0 40px rgba(244,196,48,0.5)',
                          '0 0 20px rgba(244,196,48,0.2)',
                        ]}}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      >
                        <img src={qrDataUrl} alt="Kaineetam QR" width={220} height={220} />

                        {/* Corner decorations */}
                        {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
                          <div key={i} className={`absolute ${pos} w-5 h-5`}>
                            <svg viewBox="0 0 20 20" fill="#f4c430" opacity="0.6">
                              {i === 0 && <path d="M0 8V0h8v2H2v6z" />}
                              {i === 1 && <path d="M20 8V0h-8v2h6v6z" />}
                              {i === 2 && <path d="M0 12v8h8v-2H2v-6z" />}
                              {i === 3 && <path d="M20 12v8h-8v-2h6v-6z" />}
                            </svg>
                          </div>
                        ))}
                      </motion.div>
                    )}

                    <p className="text-amber-600 text-xs text-center mb-5">
                      Scan with GPay · PhonePe · Paytm · any UPI app
                    </p>

                    {/* Action buttons */}
                    <div className="w-full flex gap-3 mb-3">
                      <button
                        onClick={downloadQR}
                        className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium"
                        style={{
                          background: 'linear-gradient(135deg, #f4c430, #ffaa00)',
                          color: '#3d1f00',
                        }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Save QR
                      </button>

                      <button
                        onClick={handleShare}
                        className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium"
                        style={{
                          background: 'rgba(244,196,48,0.12)',
                          border: '1px solid rgba(244,196,48,0.35)',
                          color: '#f4c430',
                        }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                        </svg>
                        {copied ? 'Copied ✓' : 'Share'}
                      </button>
                    </div>

                    <button
                      onClick={() => setGenerated(false)}
                      className="text-amber-700 text-xs underline"
                    >
                      ← Edit details
                    </button>
                  </motion.div>
                )}

                <div className="h-6" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
