import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'

// Replace with your actual GA4 Measurement ID from analytics.google.com
const GA_ID = 'G-3F4QXEGMML'

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
      <body className="antialiased">
        {children}

        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname + window.location.search,
            });
          `}
        </Script>
      </body>
    </html>
  )
}
