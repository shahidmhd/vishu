'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCode from 'qrcode'

interface KaineetamPayProps {
  upiId: string
  fromName: string
  amount: string
}

export default function KaineetamPay({ upiId, fromName, amount }: KaineetamPayProps) {
  const [isOpen, setIsOpen]     = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(fromName || upiId)}&cu=INR&tn=Happy+Vishu+Kaineetam+%F0%9F%92%9B${amount ? `&am=${amount}` : ''}`

  useEffect(() => {
    QRCode.toDataURL(upiUrl, {
      width: 240, margin: 2, errorCorrectionLevel: 'M',
      color: { dark: '#1a4731', light: '#fffbeb' },
    }).then(setQrDataUrl).catch(() => {})
  }, [upiUrl])

  return (
    <>
      {/* Floating pay button — appears after gift opens */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full"
        style={{
          background: 'linear-gradient(135deg, rgba(244,196,48,0.2), rgba(255,140,0,0.2))',
          border: '1px solid rgba(244,196,48,0.5)',
          color: '#f4c430',
          boxShadow: '0 0 20px rgba(244,196,48,0.2)',
          backdropFilter: 'blur(8px)',
        }}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.8, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(244,196,48,0.4)' }}
        whileTap={{ scale: 0.96 }}
      >
        <motion.span
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
        >💰</motion.span>
        <span className="text-sm font-semibold">
          Send Kaineetam to {fromName || 'them'}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-black/65 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-[70] mx-auto max-w-md rounded-t-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(170deg, #071a10 0%, #0d2b1e 100%)',
                border: '1px solid rgba(244,196,48,0.25)',
                maxHeight: '85vh', overflowY: 'auto',
                boxShadow: '0 -8px 50px rgba(0,0,0,0.7)',
              }}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            >
              <div className="h-0.5 w-full"
                style={{ background: 'linear-gradient(90deg, transparent, #f4c430 40%, #ffaa00 60%, transparent)' }}
              />
              <div className="p-6 pb-10 flex flex-col items-center">
                <div className="w-10 h-1 rounded-full bg-amber-700/40 mx-auto mb-5" />

                {/* Header */}
                <motion.div className="text-3xl mb-2"
                  animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  💛
                </motion.div>
                <h2 className="text-amber-400 font-bold text-xl mb-1 text-center">
                  Vishu Kaineetam
                </h2>
                <p className="text-amber-600 text-sm text-center mb-5">
                  Scan &amp; pay {fromName ? <strong className="text-amber-300">{fromName}</strong> : 'them'} their Kaineetam gift
                </p>

                {/* Sender info card */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-5 w-full"
                  style={{ background: 'rgba(244,196,48,0.08)', border: '1px solid rgba(244,196,48,0.2)' }}
                >
                  <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #f4c430, #ffaa00)' }}
                  >
                    <span className="text-green-950 font-bold text-lg">
                      {(fromName || upiId)[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-amber-200 font-semibold text-sm">{fromName || upiId}</p>
                    <p className="text-amber-700 text-xs">{upiId}</p>
                    {amount && <p className="text-amber-500 text-xs">Suggested: ₹{amount}</p>}
                  </div>
                </div>

                {/* QR Code */}
                {qrDataUrl && (
                  <motion.div
                    className="p-4 rounded-2xl mb-4"
                    style={{ background: '#fffbeb' }}
                    animate={{ boxShadow: [
                      '0 0 15px rgba(244,196,48,0.2)',
                      '0 0 45px rgba(244,196,48,0.55)',
                      '0 0 15px rgba(244,196,48,0.2)',
                    ]}}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    <img src={qrDataUrl} alt="UPI QR" width={210} height={210} />
                  </motion.div>
                )}

                <p className="text-amber-600 text-xs text-center mb-5">
                  Open GPay · PhonePe · Paytm · any UPI app and scan
                </p>

                {/* Direct UPI deep link (works on mobile) */}
                <a href={upiUrl}
                  className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-base mb-3"
                  style={{
                    background: 'linear-gradient(135deg, #f4c430 0%, #ffaa00 100%)',
                    color: '#3d1f00',
                    boxShadow: '0 0 24px rgba(244,196,48,0.35)',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="9"/>
                    <path d="M12 6v2m0 8v2M9.5 9.5C9.5 8.4 10.6 8 12 8s2.5.4 2.5 1.5c0 2-5 2-5 4s1.1 2.5 2.5 2.5 2.5-.5 2.5-1.5"/>
                  </svg>
                  Pay ₹{amount || ''} via UPI
                </a>

                <button onClick={() => setIsOpen(false)} className="text-amber-700 text-xs underline">
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
