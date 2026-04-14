import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Happy Vishu 💛 | ഹാപ്പി വിഷു',
  description: 'Wishing you a joyous and prosperous Vishu! Open your special Vishu gift.',
  keywords: ['Vishu', 'Kerala', 'Festival', 'Happy Vishu', 'Kani', 'Vishukkaineetam'],
  openGraph: {
    title: 'Happy Vishu 💛',
    description: 'A special Vishu greeting just for you',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0d2b1e',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
